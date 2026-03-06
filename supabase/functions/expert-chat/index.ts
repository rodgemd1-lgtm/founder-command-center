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

/**
 * Verify JWT via Supabase Auth endpoint.
 * Returns the user object on success, throws on failure.
 */
async function verifyJwt(token: string): Promise<{ id: string }> {
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
  return { id: user.id }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // --- Auth check ---
  const token = extractBearer(req)
  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    await verifyJwt(token)
  } catch (authErr) {
    return new Response(JSON.stringify({ error: authErr.message }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // --- Business logic ---
  try {
    const {
      expert_id, expert_name, expert_role, expert_style, expert_persona_file,
      business_id, business_name, message, conversation_history = [],
    } = await req.json()

    const supabaseUrl   = Deno.env.get('SUPABASE_URL')!
    const supabaseKey   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anthropicKey  = Deno.env.get('ANTHROPIC_API_KEY')!
    const openaiKey     = Deno.env.get('OPENAI_API_KEY')!

    // Use service key for knowledge queries (persona files may not have user_id)
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Step 1: Load the persona file content from knowledge_chunks
    let personaContext = ''
    if (expert_persona_file) {
      const personaName = expert_persona_file.replace('.md', '')
      const { data: personaChunks } = await supabase
        .from('knowledge_chunks')
        .select('content, chunk_index')
        .or(`title.eq.${personaName},title.like.${personaName} (part%`)
        .order('chunk_index', { ascending: true })
        .limit(10)

      if (personaChunks?.length) {
        personaContext = '\n\n## YOUR OPERATIONAL RULES AND FRAMEWORKS\n' +
          personaChunks.map((c: { content: string }) => c.content).join('\n')
      }
    }

    // Step 2: Get relevant knowledge chunks via RAG (semantic search on the question)
    let ragContext = ''
    try {
      const embResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'text-embedding-3-small', input: message }),
      })
      const embData = await embResponse.json()
      const embedding = embData.data[0].embedding

      const { data: chunks } = await supabase.rpc('match_knowledge', {
        query_embedding: embedding,
        match_business_id: isJake ? 'all' : business_id,
        match_threshold: 0.5,
        match_count: isJake ? 8 : 5,
      })

      if (chunks?.length) {
        ragContext = '\n\n## RELEVANT KNOWLEDGE\n' +
          chunks.map((c: { title: string; content: string; source_type: string }) =>
            `[${c.source_type}] ${c.title}: ${c.content}`
          ).join('\n\n')
      }

      const { data: decisions } = await supabase.rpc('match_decisions', {
        query_embedding: embedding,
        match_business_id: business_id,
        match_threshold: 0.5,
        match_count: 3,
      })

      if (decisions?.length) {
        ragContext += '\n\n## RELEVANT PAST DECISIONS\n' +
          decisions.map((d: { title: string; description: string; outcome: string; lessons_learned: string }) =>
            `Decision: ${d.title}\nContext: ${d.description}\nOutcome: ${d.outcome || 'Pending'}\nLessons: ${d.lessons_learned || 'N/A'}`
          ).join('\n\n')
      }
    } catch (ragError) {
      console.error('RAG query failed:', ragError)
    }

    // Jake-specific behavioral overrides
    const isJake = expert_id === 'jake-cofounder'
    const jakeOverride = isJake ? `
## JAKE CO-FOUNDER PROTOCOL
You are Jake, Mike's built-in co-founder. You are NOT a consultant. You have skin in the game.

### Opening
Always open with: "Revenue this week? What shipped? What's blocked?"

### During Conversation
- Challenge every assumption with "Why?" and "Why not 10x?"
- Apply the 4-gate filter to every proposed action: Revenue Impact → Distribution Leverage → Moat Depth → Solo Founder Feasibility
- If Mike is working on a lower-priority business, call it out immediately
- Push revenue and distribution above all else

### Portfolio Stance
- TransformFit (#1, 50%): LAUNCH NOW. Stripe + Railway + first payment.
- Viral Architect (#2, 30%): Meta App Review + manual beta users.
- Intelligence Engine (#3, 10%): Fold into Command Center.
- Automotive OS (#4, 0%): Parked until $10K combined MRR.

### Closing
ALWAYS end with exactly 3 specific next actions + deadlines tied to revenue or distribution.

### Voice
- Direct, challenging, no bullshit
- "What's the 10x play?" "Stop building. Start selling." "Show me the Stripe dashboard."
- Never accept "I need one more feature before launching"
` : ''

    const systemPrompt = `You are ${expert_name}, a ${expert_role}.

## IDENTITY AND STYLE
Communication style: ${expert_style}
You are advising Mike, a solo founder, on ${business_name || 'his portfolio of businesses'}.
${jakeOverride}${personaContext}

## BEHAVIORAL RULES
1. Be direct and opinionated — Mike needs clear recommendations, not "it depends" answers.
2. When you make a claim about a metric, market size, or best practice, state your confidence level and reasoning.
3. Start every response with your single most important recommendation, then support it.
4. If the question is outside your expertise, say so explicitly and suggest which expert to consult.
5. When recommending an action, include: what to do, why it matters now, and the expected outcome.
6. Never give generic advice. Reference ${business_name ? business_name + "'s" : "the portfolio's"} specific stage, metrics, and context.

## OUTPUT FORMAT
- Lead with the recommendation or answer (no preamble)
- Use bullet points for action items
- Bold the single most critical point
- If relevant, include a "Next Step" at the end that Mike can execute today
${ragContext}`

    const messages = [
      ...conversation_history.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: isJake ? 4096 : 2048,
        system: systemPrompt,
        messages,
      }),
    })

    const data = await response.json()
    const content = data.content?.[0]?.text || 'I apologize, I was unable to generate a response. Please try again.'

    return new Response(JSON.stringify({ response: content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
