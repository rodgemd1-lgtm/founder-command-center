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
 * This function is invoked only by the pg_cron job.
 * Reject any caller that does not present the service role key.
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
// Brave Search helper
// ---------------------------------------------------------------------------

interface BraveResult {
  title: string
  url: string
  snippet: string
  age?: string
}

async function braveSearch(query: string, count = 5): Promise<BraveResult[]> {
  const braveKey = Deno.env.get('BRAVE_SEARCH_API_KEY')
  if (!braveKey) {
    throw new Error('BRAVE_SEARCH_API_KEY is not set')
  }

  const params = new URLSearchParams({ q: query, count: String(count) })
  const url = `https://api.search.brave.com/res/v1/web/search?${params}`

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
// Sleep helper (rate limiting)
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ---------------------------------------------------------------------------
// Research topics
// ---------------------------------------------------------------------------

const RESEARCH_TOPICS = [
  {
    business_id: 'transformfit',
    topics: [
      // Product & Tech
      'fitness app launch strategies 2026',
      'AI fitness personalization market size',
      'Stripe subscription best practices mobile apps',
      'fitness app retention benchmarks cohort analysis',
      'React Native vs PWA for fitness apps',
      'health app data privacy HIPAA compliance',
      // Growth & Marketing
      'fitness app user acquisition cost benchmarks',
      'App Store Optimization fitness category keywords',
      'micro-influencer marketing fitness brands ROI',
      'Instagram marketing fitness apps 35K followers strategy',
      'fitness app trial-to-paid conversion optimization',
      'push notification strategy mobile fitness apps',
      // Business & Operations
      'fitness SaaS pricing strategy freemium vs premium',
      'value-based pricing health and wellness apps',
      'fitness app gamification retention mechanics',
      'customer onboarding first-week activation fitness apps',
      'fitness app competitive landscape MyFitnessPal Noom Caliber FitBod',
      'mobile app TestFlight beta testing best practices',
    ],
  },
  {
    business_id: 'viral-architect',
    topics: [
      // Product & Tech
      'Instagram API changes 2026 content publishing',
      'AI content generation platforms comparison 2026',
      'Meta App Review process requirements timeline',
      'autonomous content creation SaaS architecture',
      // Growth & Marketing
      'creator economy market size trends 2026',
      'viral coefficient K-factor optimization SaaS',
      'content automation platform pricing Buffer Later Hootsuite',
      'product-led growth B2B SaaS creator tools',
      'SEO strategy for SaaS developer tools',
      'Product Hunt launch strategy best practices',
      // Business & Operations
      'B2B SaaS pricing usage-based vs seat-based',
      'SaaS customer success onboarding activation metrics',
      'social media tool legal compliance platform ToS',
      'GDPR compliance SaaS data handling',
      'creator outreach cold email templates',
      'SaaS free trial conversion benchmarks',
    ],
  },
  {
    business_id: 'intelligence-engine',
    topics: [
      'competitive intelligence SaaS market Crayon Klue Kompyte',
      'RAG system architecture best practices 2026',
      'knowledge management SaaS pricing models',
      'enterprise SaaS sales playbook first 10 customers',
      'vector database comparison pgvector Pinecone Weaviate',
      'AI agent framework comparison 2026',
      'data pipeline architecture for intelligence platforms',
      'SOC 2 compliance for data SaaS startups',
    ],
  },
  {
    business_id: 'automotive-os',
    topics: [
      'automotive repair shop management software market',
      'AI diagnostics adoption auto repair industry',
      'shop management SaaS trends Tekmetric ShopWare Mitchell',
      'vertical SaaS go-to-market strategy',
      'field sales automotive shop owners',
      'auto repair shop pain points software adoption',
      'regulatory requirements automotive repair software',
      'independent auto shop market size demographics',
    ],
  },
  {
    business_id: 'all',
    topics: [
      'startup LLC formation banking Mercury Relay',
      'startup bookkeeping QuickBooks vs Bench',
      'value-based pricing SaaS startups',
      'product-market fit validation Sean Ellis test',
      'startup legal checklist ToS privacy policy',
      'first technical hire startup equity allocation',
      'startup metrics dashboard north star metric',
      'SAFE notes valuation pre-revenue startups',
      'Double Diamond UX design methodology startups',
      'startup growth hacking referral programs',
      'SaaS cohort analysis churn reduction strategies',
      'startup content marketing SEO fundamentals',
      'cold outbound sales startup playbook',
      'customer success NRR expansion revenue benchmarks',
    ],
  },
]

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

  // --- Parse optional params ---
  let filterBusinessId: string | null = null
  let maxTopics = 10

  try {
    const body = await req.json()
    filterBusinessId = body.business_id ?? null
    maxTopics = body.max_topics ?? 10
  } catch {
    // No body or invalid JSON — use defaults
  }

  // --- Business logic ---
  try {
    const supabaseUrl  = Deno.env.get('SUPABASE_URL')!
    const supabaseKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!
    const openaiKey    = Deno.env.get('OPENAI_API_KEY')!

    const supabase = createClient(supabaseUrl, supabaseKey)
    const results: Array<{ business_id: string; topic: string; status: string; error?: string }> = []
    let processedCount = 0

    // Filter businesses if business_id param provided
    const businesses = filterBusinessId
      ? RESEARCH_TOPICS.filter((b) => b.business_id === filterBusinessId)
      : RESEARCH_TOPICS

    if (filterBusinessId && businesses.length === 0) {
      return new Response(JSON.stringify({
        error: `No topics found for business_id: ${filterBusinessId}`,
        valid_ids: RESEARCH_TOPICS.map((b) => b.business_id),
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    for (const business of businesses) {
      if (processedCount >= maxTopics) break

      for (const topic of business.topics) {
        if (processedCount >= maxTopics) break

        try {
          // ------------------------------------------------------------------
          // 1. Check if topic was researched in the last 7 days — skip if so
          // ------------------------------------------------------------------
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

          const { data: existing } = await supabase
            .from('research_log')
            .select('id')
            .eq('title', topic)
            .eq('business_id', business.business_id)
            .gte('ingested_at', sevenDaysAgo)
            .limit(1)

          if (existing && existing.length > 0) {
            console.log(`[run-research] SKIP (recent): "${topic}" for ${business.business_id}`)
            results.push({ business_id: business.business_id, topic, status: 'skipped_recent' })
            continue
          }

          // ------------------------------------------------------------------
          // 2. Call Brave Search API for real web results
          // ------------------------------------------------------------------
          console.log(`[run-research] SCRAPING: "${topic}" for ${business.business_id}`)

          let searchResults: BraveResult[] = []
          try {
            searchResults = await braveSearch(topic, 5)
          } catch (braveErr) {
            console.error(`[run-research] Brave search failed for "${topic}":`, braveErr)
            results.push({
              business_id: business.business_id,
              topic,
              status: 'error',
              error: `Brave search failed: ${braveErr.message}`,
            })
            processedCount++
            await sleep(1000)
            continue
          }

          // Log scrape to scrape_log
          try {
            await supabase.from('scrape_log').insert({
              query: topic,
              api_source: 'brave',
              result_count: searchResults.length,
            })
          } catch (logErr) {
            console.error('[run-research] Failed to log scrape:', logErr)
          }

          console.log(`[run-research] Got ${searchResults.length} results for "${topic}"`)

          // ------------------------------------------------------------------
          // 3. Pass real search results to Claude for synthesis
          // ------------------------------------------------------------------
          const searchContext = searchResults
            .map((r, i) => `[${i + 1}] ${r.title}\n    URL: ${r.url}\n    ${r.snippet}${r.age ? ` (${r.age})` : ''}`)
            .join('\n\n')

          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': anthropicKey,
              'content-type': 'application/json',
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 1024,
              messages: [{
                role: 'user',
                content: `Based on these REAL search results for the topic "${topic}", synthesize a research summary for a startup founder.

SEARCH RESULTS:
${searchContext}

Provide:
1. Key findings (2-3 sentences) grounded in the actual search results above
2. 3 actionable insights as a JSON array of strings
3. Relevance score 1-10 for a startup building products in this space

Return ONLY valid JSON: { "summary": "string", "key_insights": ["string","string","string"], "relevance": number }`,
              }],
            }),
          })

          const aiData = await response.json()
          let rawText = aiData.content[0].text.trim()
          if (rawText.startsWith('```')) {
            rawText = rawText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
          }
          const research = JSON.parse(rawText)

          // ------------------------------------------------------------------
          // 4. Generate embedding
          // ------------------------------------------------------------------
          const embResponse = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'text-embedding-3-small', input: `${topic}: ${research.summary}` }),
          })
          const embData = await embResponse.json()
          const embedding = embData.data[0].embedding

          // ------------------------------------------------------------------
          // 5. Store in research_log with source_url from top result
          // ------------------------------------------------------------------
          const isCrossBusiness = business.business_id === 'all'
          const tags = isCrossBusiness
            ? ['all', 'cross-business', 'auto-research']
            : [business.business_id, 'auto-research']

          const sourceUrl = searchResults.length > 0 ? searchResults[0].url : null

          const { error } = await supabase.from('research_log').insert({
            business_id: business.business_id,
            source_type: 'web',
            source_url: sourceUrl,
            title: topic,
            summary: research.summary,
            key_insights: research.key_insights,
            tags,
            embedding,
          })

          if (error) throw error

          results.push({ business_id: business.business_id, topic, status: 'success' })
          processedCount++

          console.log(`[run-research] SUCCESS: "${topic}" (${processedCount}/${maxTopics})`)

          // ------------------------------------------------------------------
          // 6. Rate limit: 1 second delay between topics
          // ------------------------------------------------------------------
          await sleep(1000)
        } catch (topicError) {
          console.error(`[run-research] ERROR on "${topic}":`, topicError)
          results.push({
            business_id: business.business_id,
            topic,
            status: 'error',
            error: topicError.message,
          })
          processedCount++
          await sleep(1000)
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: processedCount,
      max_topics: maxTopics,
      business_filter: filterBusinessId,
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[run-research] FATAL ERROR:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
