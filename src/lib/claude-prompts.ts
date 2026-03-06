import type { BriefingPriority } from '@/types'

/**
 * Claude Code Prompt Generator
 *
 * Generates prescriptive, context-rich prompts for each morning briefing priority
 * that can be copied and pasted into Claude Code sessions targeting specific repos.
 */

// Context shape used internally by the prompt generator
// interface PromptContext {
//   priority: BriefingPriority
//   researchInsights: string[]
//   personas: string[]
//   frameworks: string[]
//   skills: string[]
//   repoPath: string
//   acceptanceCriteria: string[]
//   bestPractices: string[]
// }

// Business-specific repo paths and context
const businessConfig: Record<string, {
  repoPath: string
  claudeMdRef: string
  techStack: string
  testCommand: string
}> = {
  transformfit: {
    repoPath: '~/adapt-evolve-progress/',
    claudeMdRef: 'CLAUDE.md in repo root',
    techStack: 'React 19, Supabase, CrewAI, Railway backend, Stripe, 307 tests',
    testCommand: 'npm run test'
  },
  'viral-architect': {
    repoPath: '~/viral-architect-hub/',
    claudeMdRef: 'CLAUDE.md in repo root',
    techStack: 'React 19, Supabase, CrewAI, Railway, Vercel, 397 tests',
    testCommand: 'npm run test'
  },
  'intelligence-engine': {
    repoPath: '~/founder-intelligence-os/',
    claudeMdRef: 'claude.md in repo root',
    techStack: 'Markdown intelligence files, Python tools',
    testCommand: ''
  },
  'automotive-os': {
    repoPath: '~/automotive-repair-os/',
    claudeMdRef: '',
    techStack: 'Research phase — no codebase yet',
    testCommand: ''
  }
}

// Research insights per priority topic (populated from research feed)
const researchByTopic: Record<string, string[]> = {
  'stripe': [
    'Grace periods for failed payments recover 15% of churned users',
    'Annual plan discounts: 25% of users choose annual when discount > 20%',
    'Smart retry logic recovers 8% more failed payments',
    'Annual plans reduce churn by 40% vs monthly',
    'Noom achieves 30% trial-to-paid conversion vs 8% industry average'
  ],
  'deploy': [
    'Railway supports auto-deploy from GitHub push',
    'Vercel environment variables must be set before first deploy',
    'Health check endpoints should return within 5 seconds',
    'Use preview deployments for staging before production'
  ],
  'landing': [
    'Above-fold CTA increases conversion by 25-35%',
    'Social proof (testimonial or user count) increases trust by 42%',
    'Page load under 3 seconds is critical — each second adds 7% bounce rate',
    'Mobile-first design is mandatory — 72% of fitness app traffic is mobile'
  ],
  'meta': [
    'Meta App Review takes 2-4 weeks average',
    'Business verification is now mandatory for API v19+',
    'Required: demo video, privacy policy, data handling documentation',
    'Rate limits increase significantly for verified apps'
  ],
  'railway': [
    'Railway supports auto-deploy from GitHub main branch',
    'Set health check path to /health or /api/health',
    'Environment variables needed: DATABASE_URL, SUPABASE keys, API keys',
    'Use Railway CLI for debugging: railway logs --tail'
  ],
  'testflight': [
    'Apple review takes 1-2 weeks for initial submission',
    'TestFlight allows up to 10,000 external testers',
    'Requires Apple Developer Program membership ($99/year)',
    'App Store screenshots needed: 6.7" and 5.5" iPhone sizes'
  ],
  'pricing': [
    'Value-based pricing: charge 10-20% of the value you deliver to the customer',
    'Annual plans reduce churn by 40% and improve cash flow — offer 20-30% discount over monthly',
    'Grandfather early adopters at their original price to build loyalty and reduce churn to <2%',
    'Three-tier pricing (Good/Better/Best) steers 60% of users to the middle tier (decoy effect)',
    'Free trials convert at 25% for 7-day and 15% for 14-day — shorter trials create urgency'
  ],
  'onboarding': [
    'Day-1 activation is the #1 predictor of long-term retention — users who complete core action in first 24h retain at 3x',
    'Progressive disclosure: show only 3-5 features initially, reveal complexity as user matures',
    'Push notification opt-in at contextual moments (not app launch) achieves 65% opt-in vs 40% on first open',
    'Gamification hooks (streaks, badges, progress bars) increase 7-day retention by 30-40%',
    'Personalized onboarding (quiz → tailored experience) increases trial-to-paid conversion by 20%'
  ],
  'retention': [
    'Monthly cohort analysis is essential — track Day 1, Day 7, Day 30, Day 90 retention curves',
    'NPS benchmarks: >50 is excellent, 30-50 is good, <30 needs immediate attention — survey at Day 7 and Day 30',
    'Re-engagement campaigns via push + email recover 8-12% of dormant users within 14 days',
    'Win-back emails at Day 3, Day 7, and Day 14 after last activity recover 5-10% of churning users',
    'Habit loop design (cue → routine → reward) is the foundation of sustainable retention above 40% at Day 30'
  ],
  'legal': [
    'LLC operating agreement is essential even for single-member LLCs — defines ownership, profit distribution, dissolution terms',
    'Privacy policy is legally required if you collect any user data — must disclose data types, usage, third-party sharing, deletion rights',
    'Terms of Service should include limitation of liability, dispute resolution (arbitration clause), and account termination rights',
    'HIPAA applies if your app stores/transmits Protected Health Information — requires BAA with cloud providers (Supabase, AWS)',
    'CCPA/CPRA applies if you have California users — must offer "Do Not Sell My Data" option and data deletion within 45 days'
  ],
  'banking': [
    'Separate business and personal accounts from Day 1 — commingling funds can pierce the corporate veil',
    'Mercury and Relay offer fee-free startup banking with API access, integrations, and founder-friendly features',
    'Bookkeeping cadence: categorize transactions weekly, reconcile monthly — QuickBooks Online or Bench for automation',
    'Set aside 25-30% of revenue for taxes (federal + state + self-employment) in a separate savings account',
    'Track burn rate monthly: total monthly expenses / cash in bank = months of runway remaining'
  ],
  'hiring': [
    'First hires: contractors (1099) for project work, employees (W-2) for core roles — misclassification carries $50/occurrence IRS penalty',
    'Equity allocation for first 5 employees: 0.5-2% each with 4-year vesting and 1-year cliff is standard',
    'Job posting optimization: specific title + salary range + remote/hybrid tag increases applicant quality by 30%',
    'Technical interview process: take-home project (2-4 hours) → live pair-programming → culture fit — reduces false positives by 40%',
    'Use a structured scorecard (1-5 on 4-6 criteria) for every interview to reduce bias and improve hiring consistency'
  ],
  'marketing': [
    'SEO fundamentals: target long-tail keywords (3-5 words) with <1000 monthly search volume for early traction — rank in 2-3 months',
    'Blog cadence: 2-4 high-quality posts per month outperforms daily low-quality — aim for 1500+ words with original data',
    'Social proof accelerators: "Join 500+ users" badge increases signup conversion by 15-20% even at small numbers',
    'Case studies with specific metrics ("reduced churn by 35%") convert 3x better than feature-focused content',
    'Email nurture sequences: 5-7 emails over 14 days with 30-40% open rates drive 20% of trial-to-paid conversions'
  ],
  'sales': [
    'Cold email: 3-5 sentences max, personalized first line, single CTA — achieves 15-25% open rate and 2-5% reply rate',
    'Follow-up cadence: Day 1, Day 3, Day 7, Day 14, Day 30 — 80% of deals close after the 5th+ touchpoint',
    'Demo script structure: 2 min discovery questions → 10 min tailored demo → 3 min pricing → 5 min next steps',
    'Top 3 objections to prepare for: "too expensive" (reframe as ROI), "not now" (create urgency), "competitor does X" (unique differentiator)',
    'Pipeline management: track deal stages (Lead → Qualified → Demo → Proposal → Closed) with weighted probability for forecasting'
  ],
  'design': [
    'Double Diamond methodology: Discover (research) → Define (problem) → Develop (ideate) → Deliver (solution) — prevents building the wrong thing',
    'User research interviews: 5 users uncover 85% of usability issues — recruit from existing users, offer $25-50 incentive',
    'Design sprints (5-day framework): Map → Sketch → Decide → Prototype → Test — compresses months of debate into one week',
    'Mobile-first design: design for 375px width first, then scale up — 60-75% of SaaS traffic is mobile',
    'Accessibility (WCAG 2.1 AA): 4.5:1 color contrast ratio, 44px minimum tap targets, screen reader labels on all interactive elements'
  ],
  'pmf': [
    'Sean Ellis test: survey users "How would you feel if you could no longer use this product?" — 40%+ "very disappointed" = PMF',
    'User interview framework: "Tell me about the last time you [problem]" — open-ended, never lead with your solution',
    'Pivot signals: <20% Sean Ellis score after 3 iterations, CAC > 3x LTV, or NPS < 10 consistently for 2+ months',
    'ICP definition: firmographics (size, industry, revenue) + psychographics (pain points, buying triggers, decision process)',
    'PMF indicators: organic word-of-mouth growth >40% of new users, usage frequency matches expected cadence, low churn (<5% monthly)'
  ],
  'aso': [
    'Keyword research: use App Store Connect Search Ads and Sensor Tower — target keywords with difficulty <40 and volume >20',
    'Screenshot A/B testing: first 3 screenshots get 80% of views — lead with outcome/benefit, not feature walkthrough',
    'Ratings strategy: prompt for review after a positive moment (completed workout, achieved goal) — never on first open or after errors',
    'Feature graphic design: clean, high-contrast, readable text at small size — 30% of installs come from search results where only the icon shows',
    'Localization of metadata (title, subtitle, keywords) in top 5 languages increases organic downloads by 20-30%'
  ],
  'analytics': [
    'Metrics stack: Mixpanel for event analytics (free up to 20M events/mo), Amplitude for product analytics, PostHog for self-hosted',
    'Cohort analysis: group users by signup week, track retention at D1/D7/D30/D90 — the single most important analytics practice',
    'Funnel optimization: identify the step with the highest drop-off, improve by 10-20%, then move to the next bottleneck',
    'North star metric examples: Fitness app = weekly active workouts, Content platform = pieces published/week, SaaS = weekly active users',
    'Instrument every user action from Day 1 — retroactive analytics is impossible, and you need baseline data before optimizing'
  ],
  'fundraising': [
    'Pitch deck structure (10-12 slides): Problem → Solution → Market ($1B+ TAM) → Business Model → Traction → Team → Ask',
    'Financial model: 3-year projection with monthly granularity for Year 1, quarterly for Years 2-3 — show path to profitability',
    'SAFE notes (YC standard): $1-2M cap for pre-seed, $4-8M cap for seed — no board seat, no interest, converts at next priced round',
    'Valuation benchmarks for pre-revenue: $2-5M for pre-seed with strong team/market, $5-15M for seed with early traction (100+ users)',
    'Raise 18-24 months of runway — fundraising takes 3-6 months, so start when you have 6-9 months of cash remaining'
  ],
  'customer_success': [
    'Health score metrics: product usage frequency (40% weight), support ticket volume (20%), NPS response (20%), expansion signals (20%)',
    'QBR (Quarterly Business Review) cadence: every 90 days for enterprise, semi-annual for mid-market — review goals, usage, and roadmap',
    'Expansion revenue: NRR (Net Revenue Retention) >120% is excellent — upsell, cross-sell, and seat expansion are cheaper than new logos',
    'Churn prediction: users with <2 logins/week and declining usage trend have 60% probability of churning within 30 days',
    'Customer success handoff: sales → CS within 48 hours of close, structured kickoff call with success milestones defined'
  ],
  'growth': [
    'Viral loops: user invites friend → friend gets value → friend invites more — K-factor >1 means exponential growth (viral coefficient)',
    'Referral programs: double-sided incentives (give $10, get $10) convert 3-5x better than one-sided offers',
    'Product-led growth: free tier → self-serve upgrade → expansion — reduces CAC by 50-70% vs sales-led motion',
    'Freemium conversion benchmarks: 2-5% is typical, 5-10% is good, >10% is exceptional (Slack, Dropbox, Zoom)',
    'K-factor calculation: invites sent per user × conversion rate of invites — K=0.5 means each user brings 0.5 new users'
  ],
  'infrastructure': [
    'CI/CD pipeline: GitHub Actions for builds + tests on every PR — aim for <10 minute pipeline with parallel test execution',
    'Monitoring stack: Sentry for error tracking (free tier: 5K events/mo), Datadog or Grafana Cloud for metrics and alerting',
    'Uptime SLAs: 99.9% = 8.7 hours downtime/year, 99.95% = 4.4 hours — publish a status page (Instatus, Betteruptime)',
    'Database scaling: connection pooling (PgBouncer) at 50+ concurrent users, read replicas at 1000+ queries/sec, partitioning at 100M+ rows',
    'CDN setup: Cloudflare (free tier) or Vercel Edge for static assets — reduces TTFB by 40-60% for global users'
  ],
  'compliance': [
    'SOC 2 Type I basics: takes 3-6 months to achieve — start with Vanta or Drata for automated evidence collection ($10-15K/year)',
    'GDPR for SaaS: lawful basis for processing, right to erasure within 30 days, DPA with all sub-processors, cookie consent banner',
    'Data retention policies: define retention periods per data type, automate deletion, document in privacy policy — most startups retain 2-3 years',
    'Security headers: implement HSTS, CSP, X-Frame-Options, X-Content-Type-Options — use securityheaders.com to verify (aim for A+ grade)',
    'Penetration testing: annual for SOC 2 compliance — budget $5-15K for a reputable firm, or use HackerOne for bug bounty programs'
  ],
  'content': [
    'UGC (User-Generated Content) strategy: encourage users to share results/transformations — UGC posts get 4x more engagement than branded',
    'Reels optimization: hook in first 1.5 seconds, 7-15 seconds optimal length, text overlay for silent viewing, trending audio boosts reach 30%',
    'Carousel best practices: 5-10 slides, educational/value-driven, strong CTA on last slide — carousels get 1.4x more reach than single images',
    'Posting frequency: Instagram 4-7x/week (mix of Reels, Stories, Carousels), TikTok daily, Twitter 3-5x/day — consistency > volume',
    'Engagement rate benchmarks: 1-3% is average, 3-6% is good, >6% is excellent — micro-influencers (10-100K) average 3.8% on Instagram'
  ]
}

// Persona mappings per business
const personasByBusiness: Record<string, { personas: string[], frameworks: string[], skills: string[] }> = {
  transformfit: {
    personas: [
      'tf_elite_council_persona — Strategic oversight and priority validation',
      'tf_dai_architect_persona — DAI system architecture and ML pipeline',
      'tf_revenue_operator_persona — Revenue ops, pricing, Stripe integration',
      'ux_design_director_persona — Mobile UX, onboarding, retention design',
      'algorithm_research_director_persona — Algorithm R&D and optimization'
    ],
    frameworks: [
      'tf_launch_playbook_framework — Step-by-step launch execution',
      'fitness_subscription_framework — Subscription model best practices',
      'tf_dai_capability_roadmap_framework — DAI feature roadmap',
      'tf_automation_blueprint_framework — Automation specifications'
    ],
    skills: [
      'tf-business — Strategy and pricing decisions',
      'tf-design — UI/UX design (bold + dark orange, Double Diamond)',
      'tf-marketing — Content calendar and social strategy',
      'tf-ai — DAI prompt engineering and evals',
      'tf-automation — MCP servers and automation specs'
    ]
  },
  'viral-architect': {
    personas: [
      'va_elite_council_persona — Strategic oversight',
      'va_content_algorithm_persona — Content scoring and virality prediction',
      'va_growth_architect_persona — K-factor, referrals, viral mechanics',
      'algorithm_research_director_persona — Algorithm R&D'
    ],
    frameworks: [
      'va_launch_playbook_framework — Launch execution plan',
      'va_content_engine_framework — Content pipeline architecture',
      'proprietary_algorithm_rd_framework — Algorithm research methodology'
    ],
    skills: [
      'va-content — Content pipeline management',
      'va-growth — Audience growth and referral strategy',
      'va-ai — Agent engineering and prompt design',
      'va-campaigns — Creator outreach and partnerships'
    ]
  },
  'intelligence-engine': {
    personas: [
      'competitive_intel_analyst — Market intelligence, competitor tracking, SWOT analysis, battlecards',
      'data_engineer — Data pipelines, ETL, schema design, Supabase optimization',
      'ai_architect — LLM orchestration, RAG pipelines, prompt engineering, agent design',
      'product_strategist — Roadmap prioritization, feature scoring (RICE), stakeholder alignment'
    ],
    frameworks: [
      'proprietary_algorithm_rd_framework — Algorithm research methodology and competitive moat analysis'
    ],
    skills: [
      'va-research — Algorithm R&D approach: deep dive, landscape scan, expert hunt, competitive teardown'
    ]
  },
  'automotive-os': {
    personas: [
      'automotive_shop_expert — Shop operations, workflow optimization, parts inventory, service advisor processes',
      'saas_sales — B2B sales motions, demo-to-close pipeline, vertical SaaS pricing, customer onboarding',
      'product_strategist — Roadmap prioritization, feature scoring (RICE), stakeholder alignment'
    ],
    frameworks: [
      'TBD — Automotive-specific frameworks to be developed during discovery phase'
    ],
    skills: [
      'TBD — Automotive-specific skills to be developed after initial customer interviews'
    ]
  }
}

function getRelevantResearch(task: string): string[] {
  const taskLower = task.toLowerCase()
  const insights: string[] = []

  for (const [topic, research] of Object.entries(researchByTopic)) {
    if (taskLower.includes(topic)) {
      insights.push(...research)
    }
  }

  // If no specific match, return general advice
  if (insights.length === 0) {
    insights.push(
      'Validate with real users before optimizing',
      'Focus on one metric at a time',
      'Ship fast, measure, iterate'
    )
  }

  return insights.slice(0, 5)
}

function getAcceptanceCriteria(task: string, businessId: string): string[] {
  const taskLower = task.toLowerCase()
  const config = businessConfig[businessId]
  const criteria: string[] = []

  if (taskLower.includes('stripe') || taskLower.includes('payment')) {
    criteria.push(
      'Stripe test mode payment completes successfully (use test card 4242...)',
      'Subscription creation flow works: select plan → enter card → confirm → active subscription',
      'Webhook endpoint receives payment_intent.succeeded event',
      'Trial period activates correctly (7-day or 14-day)',
      'Cancellation flow works and updates UI immediately',
      'Failed payment shows user-friendly error message'
    )
  } else if (taskLower.includes('deploy') || taskLower.includes('vercel') || taskLower.includes('landing')) {
    criteria.push(
      'Site loads at production URL without errors',
      'All environment variables are set in Vercel dashboard',
      'Mobile responsive — test on iPhone Safari viewport',
      'Page load time < 3 seconds on Lighthouse',
      'All CTA buttons link to correct signup/trial flow'
    )
  } else if (taskLower.includes('railway') || taskLower.includes('backend')) {
    criteria.push(
      'Railway deployment succeeds with green health check',
      'API endpoints respond correctly (test /health, /api/...)',
      'Database connection works from Railway to Supabase',
      'Environment variables all set: DATABASE_URL, SUPABASE_URL, SUPABASE_KEY, etc.',
      'Frontend can reach backend API without CORS errors'
    )
  } else if (taskLower.includes('meta') || taskLower.includes('app review')) {
    criteria.push(
      'Meta App Review submission completed with all required fields',
      'Demo video shows core functionality (2-5 minutes)',
      'Privacy policy URL is live and accessible',
      'Data handling documentation explains Instagram data usage',
      'Business verification completed (may require additional documents)'
    )
  } else if (taskLower.includes('testflight') || taskLower.includes('app store')) {
    criteria.push(
      'Apple Developer account is active and enrolled',
      'App builds successfully for iOS (no build errors)',
      'TestFlight build uploaded and processing',
      'App metadata filled: description, screenshots, categories',
      'Internal testing group created with at least 1 tester'
    )
  } else if (taskLower.includes('pricing') || taskLower.includes('subscription')) {
    criteria.push(
      'Pricing page renders correctly with all plan tiers visible',
      'A/B test framework is wired up (feature flag or query param variant switching)',
      'Analytics tracks pricing page views, plan selection clicks, and checkout initiations',
      'Stripe product/price IDs match the displayed plans',
      'Upgrade/downgrade flow works without requiring cancellation and re-subscribe'
    )
  } else if (taskLower.includes('onboarding') || taskLower.includes('activation')) {
    criteria.push(
      'First-run experience completes end-to-end without errors or dead ends',
      'Activation metric event fires on completion of core action (e.g., first workout, first post)',
      'Welcome email sends within 60 seconds of signup via transactional email provider',
      'Progressive disclosure hides advanced features until user completes onboarding steps',
      'Onboarding can be skipped and resumed later without data loss'
    )
  } else if (taskLower.includes('legal') || taskLower.includes('compliance') || taskLower.includes('privacy')) {
    criteria.push(
      'Terms of Service page is live and accessible from signup flow and app footer',
      'Privacy policy page is accessible and includes data collection, usage, and deletion details',
      'Cookie consent banner appears on first visit and respects user choice (stores preference)',
      'Data deletion request flow works and completes within documented timeframe',
      'All third-party data processors are listed in the privacy policy'
    )
  } else if (taskLower.includes('marketing') || taskLower.includes('content') || taskLower.includes('seo')) {
    criteria.push(
      'Meta tags (title, description, canonical) are present on all public-facing pages',
      'OG images render correctly when URL is shared on Twitter, LinkedIn, and Slack (test with opengraph.xyz)',
      'Blog/content pages load correctly with proper heading hierarchy (single H1, structured H2/H3)',
      'Structured data (JSON-LD) is present for articles, products, or organization schema',
      'Page load time < 3 seconds on mobile (test with Lighthouse or PageSpeed Insights)'
    )
  } else if (taskLower.includes('design') || taskLower.includes('ui') || taskLower.includes('ux')) {
    criteria.push(
      'Accessibility audit passes: Lighthouse accessibility score >= 90, no critical axe violations',
      'Responsive breakpoints work correctly at 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (large)',
      'Design system is consistent: colors, typography, spacing, and components match the design tokens',
      'Interactive elements have visible focus states for keyboard navigation',
      'Loading and empty states are designed and implemented for all data-driven components'
    )
  } else if (taskLower.includes('analytics') || taskLower.includes('metrics')) {
    criteria.push(
      'Event tracking fires correctly for all key user actions (verified in analytics dashboard or debug mode)',
      'Analytics dashboard loads and displays data without errors',
      'Funnel visualization works end-to-end from top-of-funnel to conversion event',
      'User identification links anonymous events to authenticated user profiles after login',
      'No PII (email, name, phone) is sent in analytics event properties unless explicitly consented'
    )
  } else if (taskLower.includes('hiring') || taskLower.includes('team')) {
    criteria.push(
      'Job posting is live on the target platform (careers page, LinkedIn, etc.) with correct formatting',
      'Application form works: submission is received, confirmation email sends, data stores correctly',
      'Evaluation rubric is documented with 4-6 scored criteria and rating scale',
      'Interview pipeline stages are defined (Screen → Technical → Culture → Offer) with assigned owners',
      'Offer letter template is prepared with compensation, equity, start date, and at-will language'
    )
  } else if (taskLower.includes('growth') || taskLower.includes('referral') || taskLower.includes('viral')) {
    criteria.push(
      'Referral link generates with unique tracking code per user',
      'Invite flow works end-to-end: share link → friend signs up → both accounts credited',
      'K-factor tracking is active: invites sent per user and conversion rate of invites are instrumented',
      'Referral rewards are applied correctly (credits, free months, or feature unlocks)',
      'Referral dashboard shows the user their invite count, successful conversions, and earned rewards'
    )
  } else if (taskLower.includes('banking') || taskLower.includes('accounting') || taskLower.includes('finance')) {
    criteria.push(
      'Bank account is connected and syncing transactions (via Plaid or manual CSV import)',
      'Expense categories are set up and auto-categorization rules are configured',
      'P&L (Profit & Loss) report generates correctly with revenue, COGS, and operating expenses',
      'Monthly recurring expenses are tracked separately from one-time costs',
      'Tax withholding reserve (25-30% of revenue) is calculated and visible in financial dashboard'
    )
  } else {
    criteria.push(
      'Feature works as expected in development environment',
      `All existing tests still pass: ${config?.testCommand || 'npm run test'}`,
      'No TypeScript errors: npx tsc --noEmit',
      'Changes committed with descriptive message'
    )
  }

  return criteria
}

export function generateClaudeCodePrompt(priority: BriefingPriority): string {
  const config = businessConfig[priority.business_id] || businessConfig['intelligence-engine']
  const research = getRelevantResearch(priority.task)
  const criteria = getAcceptanceCriteria(priority.task, priority.business_id)
  const bizContext = personasByBusiness[priority.business_id]

  const prompt = `# Task: ${priority.task}

## Context
Business: ${priority.business_name}
Repo: ${config.repoPath}
Tech Stack: ${config.techStack}
Urgency: ${priority.urgency.toUpperCase()}
Reasoning: ${priority.reasoning}

## Instructions
${config.claudeMdRef ? `First read ${config.claudeMdRef} for project-specific instructions.\n` : ''}
Execute this task step-by-step. Be thorough but efficient. Test your work.

## Research & Best Practices
These insights come from domain research — apply them:
${research.map(r => `- ${r}`).join('\n')}

## Acceptance Criteria
${criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}
${bizContext ? `
## Available Intelligence (from ~/founder-intelligence-os/)
Load ONLY the specific persona needed for the current step.

### Personas
${bizContext.personas.map(p => `- ${p}`).join('\n')}

### Frameworks
${bizContext.frameworks.map(f => `- ${f}`).join('\n')}

### Skills (executable checklists)
${bizContext.skills.map(s => `- ${s}`).join('\n')}
` : ''}
## Execution Protocol
1. Read the repo's CLAUDE.md first
2. Understand the current state (run tests, check git status)
3. Implement the task following the acceptance criteria above
4. Run tests to verify nothing is broken
5. Commit with a descriptive message

Estimated time: ${priority.estimated_hours || 2} hours`

  return prompt
}

export function generateAllPrompts(priorities: BriefingPriority[]): { priority: BriefingPriority; prompt: string }[] {
  return priorities.map(p => ({
    priority: p,
    prompt: generateClaudeCodePrompt(p)
  }))
}

// Quick-copy format for clipboard
export function formatPromptForClipboard(prompt: string): string {
  return prompt.trim()
}
