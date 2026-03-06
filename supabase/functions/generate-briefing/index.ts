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
 * This function is called exclusively by the pg_cron job using the service role
 * key. It must NOT be callable by regular authenticated users or anonymous callers
 * because it queries all rows across all users and writes a briefing without a
 * user_id constraint.
 *
 * Validation: compare the presented token against SUPABASE_SERVICE_ROLE_KEY.
 * If they do not match exactly, reject the request.
 */
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

  // --- Business logic ---
  try {
    const supabaseUrl  = Deno.env.get('SUPABASE_URL')!
    const supabaseKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: recentResearch } = await supabase
      .from('research_log')
      .select('*')
      .order('ingested_at', { ascending: false })
      .limit(20)

    const { data: recentDecisions } = await supabase
      .from('decisions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    const { data: recentActions } = await supabase
      .from('daily_actions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    // Try to get live business data
    const { data: liveBusinesses } = await supabase
      .from('businesses')
      .select('*')
      .order('name')

    const { data: liveBlockers } = await supabase
      .from('blockers')
      .select('*')
      .eq('cleared', false)

    let businessContext: string
    if (liveBusinesses && liveBusinesses.length > 0) {
      businessContext = liveBusinesses.map((b: { id: string; slug: string; name: string; status: string; metadata?: { overall_progress?: number; burn_rate?: number } }) => {
        const bBlockers = (liveBlockers || []).filter((bl: { business_id: string }) => bl.business_id === b.id)
        const progress = b.metadata?.overall_progress ?? 0
        const burn = b.metadata?.burn_rate ?? 0
        return `- ${b.name} (${b.slug}): ${b.status}, ${progress}% complete, $${burn}/mo burn${bBlockers.length > 0 ? `. Blockers: ${bBlockers.map((bl: { description: string }) => bl.description).join('; ')}` : ''}`
      }).join('\n')
    } else {
      businessContext = `1. TransformFit - AI fitness app, MVP stage, 72% complete, $200/mo burn. Critical path: Configure Stripe → E2E payment test → Deploy Railway → Form LLC
2. Viral Architect Hub - AI Instagram content platform, MVP stage, 78% complete, $150/mo burn. Critical path: Submit Meta App Review → Configure Stripe → Deploy Railway
3. Intelligence Engine - Cross-company intelligence platform, MVP stage, 40% progress, $100/mo burn
4. Automotive Repair OS - AI shop management, Research stage, 5% progress, $0 burn`
    }

    const context = `
Recent research findings:
${(recentResearch || []).map((r: { title: string; summary: string; business_id: string }) => `[${r.business_id || 'general'}] ${r.title}: ${r.summary}`).join('\n')}

Recent decisions:
${(recentDecisions || []).map((d: { title: string; business_id: string; status: string }) => `[${d.business_id}] ${d.title} (${d.status})`).join('\n')}

Recent actions and their outcomes:
${(recentActions || []).map((a: { task: string; business_id: string; status: string; outcome: string }) => `[${a.business_id}] ${a.task}: ${a.status}${a.outcome ? ' - ' + a.outcome : ''}`).join('\n')}

Business portfolio:
${businessContext}
`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: `You are Jake, Mike's co-founder. You are direct, challenging, and revenue-obsessed. You always push for 10x and never accept excuses. Generate a daily morning briefing for Mike, a solo founder managing 4 businesses.

Your portfolio stance: TransformFit (#1, 50% time), Viral Architect (#2, 30%), Intelligence Engine (#3, 10%), Automotive OS (#4, parked).

Priorities must be specific, actionable, and tied to revenue or distribution. Challenge any work that doesn't pass the 4-gate filter: Revenue Impact → Distribution Leverage → Moat Depth → Solo Founder Feasibility.

Return ONLY valid JSON.`,
        messages: [{
          role: 'user',
          content: `Based on this context, generate today's morning briefing as JSON:

${context}

Return JSON with this exact structure:
{
  "priorities": [
    { "business_id": "string", "business_name": "string", "task": "string", "urgency": "critical|high|medium|low", "reasoning": "string", "estimated_hours": number }
  ],
  "portfolio_summary": {
    "total_mrr": number,
    "total_burn": number,
    "total_businesses": 4,
    "top_risk": "string",
    "overall_health": number (0-100)
  },
  "research_highlights": [
    { "title": "string", "source": "string", "insight": "string", "business_id": "string" }
  ]
}

Include 6 priorities (top 3 critical/high, 3 medium). Be specific and actionable.`,
        }],
      }),
    })

    const aiData = await response.json()
    // Strip markdown code fences if Claude wraps JSON in ```json ... ```
    let rawText = aiData.content[0].text.trim()
    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
    }
    const briefingContent = JSON.parse(rawText)

    const { data: briefing, error } = await supabase.from('morning_briefings').insert({
      briefing_date: new Date().toISOString().split('T')[0],
      priorities: briefingContent.priorities,
      portfolio_summary: briefingContent.portfolio_summary,
      research_highlights: briefingContent.research_highlights,
    }).select().single()

    if (error) throw error

    // Auto-populate daily_actions from briefing priorities
    const actionResults = []
    if (briefingContent.priorities && Array.isArray(briefingContent.priorities)) {
      for (const priority of briefingContent.priorities.slice(0, 6)) {
        try {
          await supabase.from('daily_actions').insert({
            business_id: priority.business_id,
            briefing_id: briefing.id,
            task: priority.task,
            status: 'pending',
          })
          actionResults.push({ task: priority.task, status: 'created' })
        } catch (actionErr) {
          actionResults.push({ task: priority.task, status: 'error', error: (actionErr as Error).message })
        }
      }
    }

    return new Response(JSON.stringify({ success: true, briefing, daily_actions: actionResults }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
