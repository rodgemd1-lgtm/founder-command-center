import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

function extractBearer(req: Request): string | null {
  const authHeader = req.headers.get('Authorization') ?? req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.slice(7).trim()
  return token.length > 0 ? token : null
}

function isServiceRoleToken(token: string): boolean {
  // First try exact match with env var
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (serviceRoleKey && token === serviceRoleKey) return true
  // Fallback: decode JWT payload and check role claim
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role === 'service_role'
  } catch {
    return false
  }
}

/**
 * Verify a user JWT via Supabase Auth. Returns the user id on success.
 */
async function verifyUserJwt(token: string): Promise<string> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'apikey': serviceKey,
    },
  })

  if (!res.ok) {
    throw new Error(`Invalid or expired token (status ${res.status})`)
  }

  const user = await res.json()
  return user.id as string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function chunkText(text: string, maxChunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = []
  let start = 0
  while (start < text.length) {
    const end = Math.min(start + maxChunkSize, text.length)
    chunks.push(text.slice(start, end))
    start = end - overlap
    if (start + overlap >= text.length) break
  }
  return chunks
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // --- Auth check: accept both user JWT and service_role ---
  const token = extractBearer(req)
  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let resolvedUserId: string | null = null
  let isService = false

  if (isServiceRoleToken(token)) {
    isService = true
  } else {
    try {
      resolvedUserId = await verifyUserJwt(token)
    } catch (authErr) {
      return new Response(JSON.stringify({ error: authErr.message }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  // --- Business logic ---
  try {
    const { business_id, title, content, source_type, source_path, user_id, metadata = {} } = await req.json()

    if (!business_id || !title || !content || !source_type) {
      return new Response(JSON.stringify({ error: 'business_id, title, content, and source_type are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const openaiKey   = Deno.env.get('OPENAI_API_KEY')!

    // Always write with service key so RLS INSERT policy (user_id IS NULL) applies;
    // the user_id column is set explicitly so the SELECT policy can scope reads back.
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Determine the effective user_id to store:
    //   - service calls may pass an explicit user_id or leave it null (system row)
    //   - user calls always use their own verified id
    const effectiveUserId = isService
      ? (user_id ?? null)
      : resolvedUserId

    const chunks = chunkText(content)
    const results = []

    for (let i = 0; i < chunks.length; i++) {
      const embResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: chunks[i],
        }),
      })
      const embData = await embResponse.json()
      const embedding = embData.data[0].embedding

      const { data, error } = await supabase.from('knowledge_chunks').insert({
        user_id: effectiveUserId,
        business_id,
        source_type,
        source_path,
        title: chunks.length > 1 ? `${title} (part ${i + 1}/${chunks.length})` : title,
        content: chunks[i],
        metadata: { ...metadata, original_title: title, total_chunks: chunks.length },
        chunk_index: i,
        embedding,
      }).select()

      if (error) throw error
      results.push(data)
    }

    return new Response(JSON.stringify({
      success: true,
      chunks_created: results.length,
      message: `Ingested "${title}" as ${results.length} chunk(s)`,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
