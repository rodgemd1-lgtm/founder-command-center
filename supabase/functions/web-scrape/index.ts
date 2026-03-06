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
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (serviceRoleKey && token === serviceRoleKey) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role === 'service_role'
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Brave Search helper
// ---------------------------------------------------------------------------

interface BraveResult {
  title: string
  url: string
  snippet: string
  age?: string
}

async function braveSearch(query: string, count: number): Promise<BraveResult[]> {
  const braveKey = Deno.env.get('BRAVE_SEARCH_API_KEY')
  if (!braveKey) {
    throw new Error('BRAVE_SEARCH_API_KEY is not set')
  }

  const params = new URLSearchParams({ q: query, count: String(count) })
  const url = `https://api.search.brave.com/res/v1/web/search?${params}`

  console.log(`[web-scrape] Searching Brave for: "${query}" (count=${count})`)

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': braveKey,
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Brave API error ${response.status}: ${body}`)
  }

  const data = await response.json()
  const webResults = data.web?.results ?? []

  return webResults.map((r: any) => ({
    title: r.title ?? '',
    url: r.url ?? '',
    snippet: r.description ?? '',
    age: r.age ?? undefined,
  }))
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // --- Auth check: service_role only ---
  const token = extractBearer(req)
  if (!token || !isServiceRoleToken(token)) {
    return new Response(JSON.stringify({ error: 'Forbidden: service_role key required' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const query = body.query
    const count = body.count ?? 5

    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing required field: query (string)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const results = await braveSearch(query, count)

    // Log scrape to scrape_log table
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseKey)

      await supabase.from('scrape_log').insert({
        query,
        api_source: 'brave',
        result_count: results.length,
      })
    } catch (logErr) {
      console.error('[web-scrape] Failed to log scrape:', logErr)
      // Non-fatal: don't fail the request over logging
    }

    console.log(`[web-scrape] Returned ${results.length} results for "${query}"`)

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[web-scrape] Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
