import type { Business, IntelligenceItem, IntelligenceType } from '@/types'

export const businesses: Business[] = [
  {
    id: 'transformfit',
    name: 'TransformFit',
    slug: 'transformfit',
    tagline: 'AI-powered fitness coaching. 6 agents. Zero guesswork.',
    tag: 'FITNESS',
    repo: '~/adapt-evolve-progress',
    status: 'active',
    overallProgress: 52,
    metrics: [
      { label: 'MRR', current: '$0', target: '$20,000', status: 'pre-launch' },
      { label: 'Users', current: '0', target: '400+', status: 'pre-launch' },
      { label: 'Tests', current: '1,399', target: '1,400+', status: 'on-track' },
      { label: 'Build', current: 'Phase 4', target: 'Launch', status: 'at-risk' },
    ],
    domains: [
      { name: 'Foundation', progress: 60, phase: 'Active', blocker: 'Legal/compliance pending', nextMilestone: 'LLC + Stripe live' },
      { name: 'Product', progress: 70, phase: 'Active', blocker: 'Onboarding polish, edge cases', nextMilestone: '1,399 tests passing' },
      { name: 'Design', progress: 90, phase: 'Active', blocker: 'Landing page visual review', nextMilestone: 'Orange luxury system complete' },
      { name: 'AI / DAI', progress: 55, phase: 'Active', blocker: 'Narrative quality, deload logic', nextMilestone: 'CrewAI crew deployed' },
      { name: 'Marketing', progress: 15, phase: 'Unblocked', blocker: 'No content calendar', nextMilestone: '35K IG followers untapped' },
      { name: 'Revenue', progress: 20, phase: 'Active', blocker: 'Stripe not tested E2E', nextMilestone: '$49/mo pricing locked' },
      { name: 'Operations', progress: 20, phase: 'Deferred', blocker: 'No SOPs, no monitoring', nextMilestone: 'CLAUDE.md protocols established' },
      { name: 'Automation', progress: 5, phase: 'Deferred', blocker: 'Premature before users', nextMilestone: 'Specs identified' },
      { name: 'Algorithm R&D', progress: 10, phase: 'Active (parallel)', blocker: 'No research briefs', nextMilestone: 'Research infra built' },
    ],
    blockers: [
      { id: 1, description: 'Trial flow not implemented (7-day + paywall)', blocking: 'Revenue, Product', owner: 'Mike', cleared: false },
      { id: 2, description: 'Instagram content calendar empty', blocking: 'Marketing', owner: 'Mike', cleared: false },
      { id: 3, description: 'DAI narrative quality needs prompt engineering', blocking: 'AI/DAI, Product', owner: 'Mike', cleared: false },
      { id: 4, description: 'No welcome email / onboarding sequence', blocking: 'Operations, Marketing', owner: 'Mike', cleared: false },
    ],
    weeklyFocus: [
      'Review landing page visually + commit/push',
      'Start Instagram pre-launch content',
      'Write DAI narrative prompt improvements',
      'Test Stripe payments end-to-end',
    ],
  },
  {
    id: 'viral-architect',
    name: 'Viral Architect Hub',
    slug: 'viral-architect',
    tagline: '24 AI agents working 24/7 to make your Instagram explode.',
    tag: 'INSTAGRAM',
    repo: '~/viral-architect-hub',
    status: 'active',
    overallProgress: 48,
    metrics: [
      { label: 'MRR', current: '$0', target: '$20,000', status: 'pre-launch' },
      { label: 'Beta Users', current: '0', target: '20', status: 'pre-launch' },
      { label: 'Tests', current: '397', target: '400+', status: 'on-track' },
      { label: 'Build', current: 'Phase 4', target: 'Beta', status: 'at-risk' },
    ],
    domains: [
      { name: 'Foundation', progress: 30, phase: 'Active', blocker: 'No Stripe, no bank, no legal', nextMilestone: 'Entity + Stripe live' },
      { name: 'Product', progress: 75, phase: 'Active', blocker: 'Onboarding wizard not built', nextMilestone: 'Core flows + multi-account done' },
      { name: 'Design', progress: 85, phase: 'Active', blocker: 'Landing page needs polish', nextMilestone: 'Ultra-luxury design complete' },
      { name: 'AI / Content', progress: 80, phase: 'Active', blocker: 'Brief quality needs tuning', nextMilestone: '4 crews, 24+ agents built' },
      { name: 'Marketing', progress: 5, phase: 'Blocked', blocker: 'No content calendar', nextMilestone: 'Meta-viral strategy' },
      { name: 'Revenue', progress: 10, phase: 'Blocked', blocker: 'No Stripe integration', nextMilestone: '4-tier pricing designed' },
      { name: 'Operations', progress: 40, phase: 'Active', blocker: 'PostHog not configured', nextMilestone: 'CI/CD live' },
      { name: 'Automation', progress: 65, phase: 'Active', blocker: 'Railway not deployed', nextMilestone: 'Auto-publish + cron live' },
      { name: 'Algorithm R&D', progress: 5, phase: 'Active (parallel)', blocker: 'No research briefs', nextMilestone: 'R&D infra built' },
    ],
    blockers: [
      { id: 1, description: 'Railway backend not deployed', blocking: 'AI/Content, Automation, Product', owner: 'Mike', cleared: false },
      { id: 2, description: 'Vercel frontend not linked', blocking: 'Marketing, Revenue', owner: 'Mike', cleared: false },
      { id: 3, description: 'Meta App Review pending', blocking: 'Product (real publishing)', owner: 'Mike', cleared: false },
      { id: 4, description: 'PostHog key not configured', blocking: 'Operations', owner: 'Mike', cleared: false },
      { id: 5, description: 'Onboarding wizard not built', blocking: 'Product', owner: 'Claude Code', cleared: false },
      { id: 6, description: 'No Stripe billing integration', blocking: 'Revenue', owner: 'Claude Code', cleared: false },
    ],
    weeklyFocus: [
      'Deploy Railway backend (Mike)',
      'Link Vercel frontend (Mike)',
      'Submit Meta App Review (Mike)',
      'Content brief quality sprint (Claude Code)',
      'Build onboarding wizard (Claude Code)',
    ],
  },
  {
    id: 'intelligence-engine',
    name: 'Intelligence Engine',
    slug: 'intelligence-engine',
    tagline: 'Cross-company intelligence platform powering all products.',
    tag: 'INTELLIGENCE',
    repo: '~/founder-intelligence-os',
    status: 'active',
    overallProgress: 35,
    metrics: [
      { label: 'Personas', current: '59', target: '100+', status: 'on-track' },
      { label: 'Frameworks', current: '64', target: '100+', status: 'on-track' },
      { label: 'Skills', current: '79', target: '100+', status: 'on-track' },
      { label: 'Products Served', current: '2/4', target: '4/4', status: 'at-risk' },
    ],
    domains: [
      { name: 'Foundation', progress: 70, phase: 'Active', blocker: 'None', nextMilestone: 'INDEX.md comprehensive' },
      { name: 'Content', progress: 60, phase: 'Active', blocker: 'Many personas need depth', nextMilestone: '210+ files catalogued' },
      { name: 'Integration', progress: 30, phase: 'Active', blocker: 'No web interface', nextMilestone: 'Command center (this app!)' },
      { name: 'AI/Research', progress: 20, phase: 'Active', blocker: 'Research skills new', nextMilestone: '/tf-research + /va-research built' },
      { name: 'Automation', progress: 10, phase: 'Planned', blocker: 'No auto-ingestion', nextMilestone: 'YouTube scraper exists' },
    ],
    blockers: [
      { id: 1, description: 'No web interface for browsing intelligence', blocking: 'Integration', owner: 'Claude Code', cleared: false },
      { id: 2, description: 'Automotive and Intelligence products not scaffolded', blocking: 'Content', owner: 'Mike', cleared: false },
    ],
    weeklyFocus: [
      'Build Founder Command Center web app (this!)',
      'Sync intelligence data to Supabase',
      'Add automotive personas and frameworks',
    ],
  },
  {
    id: 'automotive-os',
    name: 'Automotive Repair OS',
    slug: 'automotive-os',
    tagline: 'AI-powered shop management for auto repair businesses.',
    tag: 'AUTOMOTIVE',
    repo: 'TBD',
    status: 'pre-launch',
    overallProgress: 5,
    metrics: [
      { label: 'MRR', current: '$0', target: 'TBD', status: 'pre-launch' },
      { label: 'Build', current: 'Concept', target: 'MVP', status: 'pre-launch' },
    ],
    domains: [
      { name: 'Research', progress: 5, phase: 'Planned', blocker: 'No market research done', nextMilestone: 'Competitive landscape scan' },
      { name: 'Product', progress: 0, phase: 'Planned', blocker: 'No spec', nextMilestone: 'Feature spec + wireframes' },
    ],
    blockers: [
      { id: 1, description: 'Market research not started', blocking: 'Everything', owner: 'Mike', cleared: false },
    ],
    weeklyFocus: [
      'Run /tf-research Mode B for automotive repair market',
      'Identify top 5 competitors',
    ],
  },
]

export const intelligenceItems: IntelligenceItem[] = [
  // Marketing & Growth Personas
  { id: 'growth_hacker', name: 'Growth Hacker', type: 'persona', description: 'Distribution-first growth; viral loops, referral, PLG', tags: ['ALL'], tier: 1, category: 'Marketing & Growth', filePath: 'intelligence/personas/growth_hacker_persona.md' },
  { id: 'content_strategist', name: 'Content Strategist', type: 'persona', description: 'Long-form to short-form repurposing; Content Triplets; editorial calendars', tags: ['ALL'], tier: 1, category: 'Marketing & Growth', filePath: 'intelligence/personas/content_strategist_persona.md' },
  { id: 'social_media', name: 'Social Media', type: 'persona', description: 'Platform-native content creation; algorithm mechanics; engagement optimization', tags: ['INSTAGRAM', 'FITNESS'], tier: 2, category: 'Marketing & Growth', filePath: 'intelligence/personas/social_media_persona.md' },
  { id: 'seo_expert', name: 'SEO Expert', type: 'persona', description: 'Technical SEO, AI SEO, topical authority', tags: ['ALL'], tier: 2, category: 'Marketing & Growth', filePath: 'intelligence/personas/seo_expert_persona.md' },
  { id: 'paid_ads', name: 'Paid Ads', type: 'persona', description: 'Meta Ads, Google Ads, TikTok Ads; ROAS optimization', tags: ['FITNESS', 'INSTAGRAM'], tier: 3, category: 'Marketing & Growth', filePath: 'intelligence/personas/paid_ads_persona.md' },
  { id: 'brand_strategist', name: 'Brand Strategist', type: 'persona', description: 'Brand positioning, naming, identity systems, voice architecture', tags: ['ALL'], tier: 3, category: 'Marketing & Growth', filePath: 'intelligence/personas/brand_strategist_persona.md' },
  { id: 'email_marketing', name: 'Email Marketing', type: 'persona', description: 'Lifecycle email flows, deliverability, segmentation', tags: ['ALL'], tier: 3, category: 'Marketing & Growth', filePath: 'intelligence/personas/email_marketing_persona.md' },
  { id: 'community_builder', name: 'Community Builder', type: 'persona', description: 'Skool/Discord community growth; moderation; member activation', tags: ['FITNESS', 'INSTAGRAM'], tier: 2, category: 'Marketing & Growth', filePath: 'intelligence/personas/community_builder_persona.md' },
  { id: 'instagram_growth', name: 'Instagram Growth', type: 'persona', description: 'Reels-first growth, hashtag strategy, collaboration tactics', tags: ['INSTAGRAM', 'FITNESS'], tier: 1, category: 'Marketing & Growth', filePath: 'intelligence/personas/instagram_growth_persona.md' },

  // Product & Design Personas
  { id: 'product_strategist', name: 'Product Strategist', type: 'persona', description: 'JTBD, PMF measurement, roadmap prioritization', tags: ['ALL'], tier: 1, category: 'Product & Design', filePath: 'intelligence/personas/product_strategist_persona.md' },
  { id: 'ux_expert', name: 'UX Expert', type: 'persona', description: 'Generative UI, steering paradigm, latency-sensitive design', tags: ['ALL'], tier: 2, category: 'Product & Design', filePath: 'intelligence/personas/ux_expert_persona.md' },
  { id: 'ux_design_director', name: 'Ted (Design Director)', type: 'persona', description: 'STYLE framework, Style Spectrum, pattern-first design consultation', tags: ['ALL'], tier: 2, category: 'Product & Design', filePath: 'intelligence/personas/ux_design_director_persona.md' },
  { id: 'mobile_ux', name: 'Mobile UX', type: 'persona', description: 'iOS/Android-native patterns, gesture design, accessibility', tags: ['FITNESS', 'INSTAGRAM'], tier: 3, category: 'Product & Design', filePath: 'intelligence/personas/mobile_ux_persona.md' },
  { id: 'gamification', name: 'Gamification', type: 'persona', description: 'Behavioral loops, streak mechanics, XP systems, leaderboards', tags: ['FITNESS', 'INSTAGRAM'], tier: 3, category: 'Product & Design', filePath: 'intelligence/personas/gamification_persona.md' },

  // Business & Strategy Personas
  { id: 'startup_ceo', name: 'Startup CEO', type: 'persona', description: 'Solo founder playbook; capital-efficient growth; decision frameworks', tags: ['ALL'], tier: 1, category: 'Business & Strategy', filePath: 'intelligence/personas/startup_ceo_persona.md' },
  { id: 'saas_pricing', name: 'SaaS Pricing', type: 'persona', description: 'Value-based pricing, tier design, willingness-to-pay research', tags: ['ALL'], tier: 1, category: 'Business & Strategy', filePath: 'intelligence/personas/saas_pricing_persona.md' },
  { id: 'startup_lawyer', name: 'Startup Lawyer', type: 'persona', description: 'Entity formation, IP protection, terms/privacy, contractor agreements', tags: ['ALL'], tier: 2, category: 'Business & Strategy', filePath: 'intelligence/personas/startup_lawyer_persona.md' },
  { id: 'finance_analyst', name: 'Finance Analyst', type: 'persona', description: 'Financial modeling, burn rate, runway calculation, unit economics', tags: ['ALL'], tier: 2, category: 'Business & Strategy', filePath: 'intelligence/personas/finance_analyst_persona.md' },
  { id: 'venture_pitch', name: 'Venture Pitch', type: 'persona', description: 'Pitch deck structure, investor psychology, fundraising strategy', tags: ['ALL'], tier: 3, category: 'Business & Strategy', filePath: 'intelligence/personas/venture_pitch_persona.md' },

  // AI & Engineering Personas
  { id: 'ai_architect', name: 'AI Architect', type: 'persona', description: 'LLM orchestration, agent design, RAG, model routing, cost optimization', tags: ['ALL'], tier: 1, category: 'AI & Engineering', filePath: 'intelligence/personas/ai_architect_persona.md' },
  { id: 'prompt_engineer', name: 'Prompt Engineer', type: 'persona', description: 'System prompts, few-shot examples, chain-of-thought, structured output', tags: ['ALL'], tier: 1, category: 'AI & Engineering', filePath: 'intelligence/personas/prompt_engineer_persona.md' },
  { id: 'agentic_systems', name: 'Agentic Systems', type: 'persona', description: 'Multi-agent orchestration, CrewAI, LangGraph, tool use', tags: ['ALL'], tier: 2, category: 'AI & Engineering', filePath: 'intelligence/personas/agentic_systems_persona.md' },
  { id: 'algorithm_research_director', name: 'Algorithm Research Director', type: 'persona', description: 'R&D team lead; research methodology, specialist recruitment, algorithm specification', tags: ['ALL'], tier: 1, category: 'AI & Engineering', filePath: 'intelligence/personas/algorithm_research_director_persona.md' },

  // Operations Personas
  { id: 'operations', name: 'Operations', type: 'persona', description: 'SOPs, automation, process design, monitoring, team handbooks', tags: ['ALL'], tier: 2, category: 'Operations', filePath: 'intelligence/personas/operations_persona.md' },

  // TransformFit Personas
  { id: 'tf_elite_council', name: 'TF Elite Council', type: 'persona', description: '7-member advisory board for TransformFit business decisions', tags: ['FITNESS'], tier: 1, category: 'TransformFit', filePath: 'intelligence/personas/tf_elite_council_persona.md' },
  { id: 'tf_dai_architect', name: 'TF DAI Architect', type: 'persona', description: 'DecisionAI pipeline architect; LangGraph, 8-node state machine', tags: ['FITNESS'], tier: 1, category: 'TransformFit', filePath: 'intelligence/personas/tf_dai_architect_persona.md' },
  { id: 'tf_revenue_operator', name: 'TF Revenue Operator', type: 'persona', description: 'TransformFit pricing, conversion funnels, LTV optimization', tags: ['FITNESS'], tier: 2, category: 'TransformFit', filePath: 'intelligence/personas/tf_revenue_operator_persona.md' },

  // Viral Architect Personas
  { id: 'va_elite_council', name: 'VA Elite Council', type: 'persona', description: '7-member advisory board for Viral Architect Hub business decisions', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'intelligence/personas/va_elite_council_persona.md' },
  { id: 'va_growth_architect', name: 'VA Growth Architect', type: 'persona', description: 'K-factor optimization, referral engine, content virality formula', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'intelligence/personas/va_growth_architect_persona.md' },
  { id: 'va_content_algorithm', name: 'VA Content Algorithm', type: 'persona', description: 'Virality engineering, STEPPS scoring, data pruner roadmap', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'intelligence/personas/va_content_algorithm_persona.md' },

  // Key Frameworks
  { id: 'tf_launch_playbook', name: 'TF Launch Playbook', type: 'framework', description: '9-domain business buildout with sequencing rules and phase gates', tags: ['FITNESS'], tier: 1, category: 'TransformFit', filePath: 'intelligence/frameworks/tf_launch_playbook_framework.md' },
  { id: 'tf_automation_blueprint', name: 'TF Automation Blueprint', type: 'framework', description: 'n8n workflows, MCP configs, automation triggers', tags: ['FITNESS'], tier: 2, category: 'TransformFit', filePath: 'intelligence/frameworks/tf_automation_blueprint_framework.md' },
  { id: 'va_launch_playbook', name: 'VA Launch Playbook', type: 'framework', description: '9-domain business buildout for Viral Architect Hub', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'intelligence/frameworks/va_launch_playbook_framework.md' },
  { id: 'va_content_engine', name: 'VA Content Engine', type: 'framework', description: '4-crew architecture, cost model, swarm protocol', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'intelligence/frameworks/va_content_engine_framework.md' },
  { id: 'proprietary_algorithm_rd', name: 'Proprietary Algorithm R&D', type: 'framework', description: '9 specialist roles, 6-phase integration pipeline, priority sequencing', tags: ['ALL'], tier: 1, category: 'R&D', filePath: 'intelligence/frameworks/proprietary_algorithm_rd_framework.md' },
  { id: 'fitness_subscription', name: 'Fitness Subscription', type: 'framework', description: 'Subscription model design for fitness apps', tags: ['FITNESS'], tier: 2, category: 'Revenue', filePath: 'intelligence/frameworks/fitness_subscription_framework.md' },
  { id: 'mcp_integration', name: 'MCP Integration', type: 'framework', description: 'Model Context Protocol server configuration and tool architecture', tags: ['ALL'], tier: 2, category: 'AI & Engineering', filePath: 'intelligence/frameworks/mcp_integration_framework.md' },

  // Key Skills
  { id: 'tf', name: '/tf Dashboard', type: 'skill', description: 'TransformFit master dashboard: status + top 3 actions', tags: ['FITNESS'], tier: 1, category: 'TransformFit', filePath: 'automation/skills/tf.md' },
  { id: 'tf_business', name: '/tf-business', type: 'skill', description: 'Strategy, pricing, roundtable', tags: ['FITNESS'], tier: 1, category: 'TransformFit', filePath: 'automation/skills/tf-business.md' },
  { id: 'tf_design', name: '/tf-design', type: 'skill', description: 'Design studio with Ted (bold+dark orange)', tags: ['FITNESS'], tier: 1, category: 'TransformFit', filePath: 'automation/skills/tf-design.md' },
  { id: 'tf_marketing', name: '/tf-marketing', type: 'skill', description: 'Content calendar, social, landing page', tags: ['FITNESS'], tier: 1, category: 'TransformFit', filePath: 'automation/skills/tf-marketing.md' },
  { id: 'tf_ai', name: '/tf-ai', type: 'skill', description: 'DAI prompt engineering, evals, agents', tags: ['FITNESS'], tier: 1, category: 'TransformFit', filePath: 'automation/skills/tf-ai.md' },
  { id: 'tf_research', name: '/tf-research', type: 'skill', description: 'Algorithm R&D: deep dive, landscape scan, expert hunt', tags: ['FITNESS'], tier: 1, category: 'TransformFit', filePath: 'automation/skills/tf-research.md' },
  { id: 'va', name: '/va Dashboard', type: 'skill', description: 'Viral Architect master dashboard: status + top 3 actions', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'automation/skills/va.md' },
  { id: 'va_content', name: '/va-content', type: 'skill', description: 'Content pipeline: generate, queue, publish, analyze', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'automation/skills/va-content.md' },
  { id: 'va_growth', name: '/va-growth', type: 'skill', description: 'Audience growth: referrals, K-factor, follower strategy', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'automation/skills/va-growth.md' },
  { id: 'va_ai', name: '/va-ai', type: 'skill', description: 'Agent engineering: crews, prompts, evals, swarm', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'automation/skills/va-ai.md' },
  { id: 'va_research', name: '/va-research', type: 'skill', description: 'Algorithm R&D for virality prediction and platform reverse engineering', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'automation/skills/va-research.md' },
]

export function getBusinessBySlug(slug: string): Business | undefined {
  return businesses.find(b => b.slug === slug)
}

export function filterIntelligence(
  items: IntelligenceItem[],
  query: string,
  typeFilter: IntelligenceType | 'all',
  tagFilter: string
): IntelligenceItem[] {
  return items.filter(item => {
    const matchesQuery = !query ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    const matchesTag = tagFilter === 'all' || item.tags.includes(tagFilter as any)
    return matchesQuery && matchesType && matchesTag
  })
}
