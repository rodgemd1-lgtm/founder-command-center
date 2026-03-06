import type { DomainExpert } from '@/types'

export const domainExperts: DomainExpert[] = [
  // Jake — Co-Founder Advisor (always first)
  {
    id: 'jake-cofounder',
    name: 'Jake',
    role: 'Co-Founder Advisor',
    expertise: ['startup strategy', 'portfolio management', 'revenue optimization', '10x thinking', 'distribution', 'AI products'],
    style: 'Direct, challenging, probing. Always asks "why not 10x?" Pushes revenue and distribution above all. Never accepts excuses.',
    color: '#B8860B',
    businesses: ['transformfit', 'viral-architect', 'intelligence-engine', 'automotive-os'],
    personaFile: 'intelligence/personas/jake_cofounder_persona.md'
  },
  // TransformFit experts
  {
    id: 'fitness-industry',
    name: 'Marcus Chen',
    role: 'Fitness Industry Analyst',
    expertise: ['fitness market trends', 'gym technology', 'health apps', 'consumer fitness behavior'],
    style: 'Data-driven, cites industry reports and market data',
    color: '#16A34A',
    businesses: ['transformfit'],
    personaFile: 'intelligence/personas/fitness_industry_persona.md'
  },
  {
    id: 'tf-dai-architect',
    name: 'Dr. Yuki Tanaka',
    role: 'DAI System Architect',
    expertise: ['adaptive algorithms', 'ML pipelines', 'personalization engines', 'fitness AI'],
    style: 'Technical and precise, thinks in systems and data flows',
    color: '#2563EB',
    businesses: ['transformfit'],
    personaFile: 'intelligence/personas/tf_dai_architect_persona.md'
  },
  {
    id: 'mobile-ux',
    name: 'Soren Erikson',
    role: 'Mobile UX Director',
    expertise: ['mobile design patterns', 'fitness app UX', 'onboarding flows', 'retention design'],
    style: 'Visual thinker, references best-in-class app designs',
    color: '#F97316',
    businesses: ['transformfit'],
    personaFile: 'intelligence/personas/ux_design_director_persona.md'
  },
  {
    id: 'growth-hacker',
    name: 'Nina Patel',
    role: 'Growth Strategist',
    expertise: ['user acquisition', 'viral loops', 'referral programs', 'conversion optimization'],
    style: 'Metrics-obsessed, always thinking about funnels and loops',
    color: '#10B981',
    businesses: ['transformfit', 'viral-architect'],
    personaFile: 'intelligence/personas/growth_hacker_persona.md'
  },
  {
    id: 'health-data',
    name: 'Dr. Sarah Kim',
    role: 'Health Data Scientist',
    expertise: ['health metrics', 'wearable data', 'exercise science', 'biometrics'],
    style: 'Evidence-based, references clinical studies and research',
    color: '#06B6D4',
    businesses: ['transformfit'],
    personaFile: 'intelligence/personas/health_data_persona.md'
  },
  {
    id: 'gamification',
    name: 'Alex Rivera',
    role: 'Gamification Designer',
    expertise: ['game mechanics', 'reward systems', 'habit loops', 'engagement design'],
    style: 'Creative, draws from gaming and behavioral psychology',
    color: '#8B5CF6',
    businesses: ['transformfit'],
    personaFile: 'intelligence/personas/gamification_persona.md'
  },
  {
    id: 'pricing-strategist',
    name: 'Derek Hoffman',
    role: 'Pricing Strategist',
    expertise: ['SaaS pricing', 'subscription models', 'value metrics', 'pricing psychology'],
    style: 'Analytical, focused on unit economics and LTV optimization',
    color: '#EF4444',
    businesses: ['transformfit', 'viral-architect', 'intelligence-engine'],
    personaFile: 'intelligence/personas/pricing_strategist_persona.md'
  },
  {
    id: 'content-strategist',
    name: 'Amara Johnson',
    role: 'Content Strategist',
    expertise: ['content marketing', 'SEO', 'brand voice', 'social media strategy'],
    style: 'Creative storyteller, thinks about narrative and audience',
    color: '#EC4899',
    businesses: ['transformfit', 'viral-architect'],
    personaFile: 'intelligence/personas/content_strategist_persona.md'
  },
  {
    id: 'tf-revenue',
    name: 'Victoria Sterling',
    role: 'Revenue Operations Lead',
    expertise: ['revenue forecasting', 'sales funnels', 'monetization', 'financial modeling'],
    style: 'Results-oriented, speaks in numbers and projections',
    color: '#F59E0B',
    businesses: ['transformfit'],
    personaFile: 'intelligence/personas/tf_revenue_operator_persona.md'
  },
  // Viral Architect experts
  {
    id: 'instagram-growth',
    name: 'Zara Williams',
    role: 'Instagram Growth Expert',
    expertise: ['Instagram algorithm', 'content virality', 'hashtag strategy', 'Reels optimization'],
    style: 'Trend-aware, always on top of platform changes',
    color: '#E11D48',
    businesses: ['viral-architect'],
    personaFile: 'intelligence/personas/instagram_growth_persona.md'
  },
  {
    id: 'va-content-algo',
    name: 'Dr. Leo Park',
    role: 'Content Algorithm Engineer',
    expertise: ['content scoring', 'virality prediction', 'NLP', 'recommendation systems'],
    style: 'Mathematical, thinks in probability distributions and signals',
    color: '#7C3AED',
    businesses: ['viral-architect'],
    personaFile: 'intelligence/personas/va_content_algorithm_persona.md'
  },
  {
    id: 'creator-economy',
    name: 'Jasmine Torres',
    role: 'Creator Economy Analyst',
    expertise: ['creator monetization', 'platform economics', 'influencer marketing', 'content commerce'],
    style: 'Market-savvy, tracks creator trends and platform shifts',
    color: '#F472B6',
    businesses: ['viral-architect'],
    personaFile: 'intelligence/personas/creator_economy_persona.md'
  },
  {
    id: 'social-media',
    name: 'Marco Silva',
    role: 'Social Media Strategist',
    expertise: ['multi-platform strategy', 'community building', 'engagement tactics', 'social listening'],
    style: 'Community-focused, thinks about conversations and relationships',
    color: '#14B8A6',
    businesses: ['viral-architect', 'transformfit'],
    personaFile: 'intelligence/personas/social_media_persona.md'
  },
  {
    id: 'va-growth-arch',
    name: 'Kai Nakamura',
    role: 'Viral Growth Architect',
    expertise: ['K-factor optimization', 'referral systems', 'network effects', 'viral mechanics'],
    style: 'Systems thinker, maps viral loops and growth flywheels',
    color: '#22C55E',
    businesses: ['viral-architect'],
    personaFile: 'intelligence/personas/va_growth_architect_persona.md'
  },
  // Intelligence Engine experts
  {
    id: 'competitive-intel',
    name: 'Diana Ross',
    role: 'Competitive Intelligence Director',
    expertise: ['competitive analysis', 'market intelligence', 'strategic positioning', 'threat assessment'],
    style: 'Strategic, sees the competitive landscape as a chess board',
    color: '#6366F1',
    businesses: ['intelligence-engine'],
    personaFile: 'intelligence/personas/competitive_intel_persona.md'
  },
  {
    id: 'data-engineer',
    name: 'Raj Patel',
    role: 'Data Infrastructure Engineer',
    expertise: ['data pipelines', 'ETL', 'vector databases', 'real-time processing'],
    style: 'Architectural, thinks about data flows and system reliability',
    color: '#0EA5E9',
    businesses: ['intelligence-engine'],
    personaFile: 'intelligence/personas/data_engineer_persona.md'
  },
  // Automotive experts
  {
    id: 'automotive-shop',
    name: 'Jim Harrison',
    role: 'Shop Operations Expert',
    expertise: ['shop workflow', 'technician management', 'parts inventory', 'customer service'],
    style: 'Practical, speaks from decades of shop floor experience',
    color: '#78716C',
    businesses: ['automotive-os'],
    personaFile: 'intelligence/personas/automotive_shop_persona.md'
  },
  {
    id: 'automotive-tech',
    name: 'Lisa Chen',
    role: 'Automotive Technology Analyst',
    expertise: ['OBD diagnostics', 'repair databases', 'shop management software', 'EV servicing'],
    style: 'Technical, bridges old-school repair and modern tech',
    color: '#A8A29E',
    businesses: ['automotive-os'],
    personaFile: 'intelligence/personas/automotive_tech_persona.md'
  },
  // Universal experts (all businesses)
  {
    id: 'startup-ceo',
    name: 'Victoria Sterling',
    role: 'Startup Strategy Advisor',
    expertise: ['startup strategy', 'fundraising', 'team building', 'market entry', 'pivoting'],
    style: 'Visionary but practical, focused on execution over theory',
    color: '#F59E0B',
    businesses: ['transformfit', 'viral-architect', 'intelligence-engine', 'automotive-os'],
    personaFile: 'intelligence/personas/startup_ceo_persona.md'
  },
  {
    id: 'startup-lawyer',
    name: 'James Mitchell',
    role: 'Startup Legal Counsel',
    expertise: ['entity formation', 'IP protection', 'contracts', 'compliance', 'terms of service'],
    style: 'Cautious but pragmatic, balances legal risk with speed',
    color: '#64748B',
    businesses: ['transformfit', 'viral-architect', 'intelligence-engine', 'automotive-os'],
    personaFile: 'intelligence/personas/startup_lawyer_persona.md'
  },
  {
    id: 'finance-analyst',
    name: 'Derek Chen',
    role: 'Financial Analyst',
    expertise: ['financial modeling', 'unit economics', 'burn rate', 'fundraising prep', 'tax strategy'],
    style: 'Numbers-driven, builds models and projections',
    color: '#EF4444',
    businesses: ['transformfit', 'viral-architect', 'intelligence-engine', 'automotive-os'],
    personaFile: 'intelligence/personas/finance_analyst_persona.md'
  },
  {
    id: 'ai-architect',
    name: 'Dr. Yuki Tanaka',
    role: 'AI Systems Architect',
    expertise: ['LLM integration', 'RAG systems', 'agent design', 'prompt engineering', 'ML ops'],
    style: 'Systematic, thinks about AI as infrastructure not magic',
    color: '#3B82F6',
    businesses: ['transformfit', 'viral-architect', 'intelligence-engine', 'automotive-os'],
    personaFile: 'intelligence/personas/ai_architect_persona.md'
  },
  {
    id: 'product-strategist',
    name: 'Maya Washington',
    role: 'Product Strategist',
    expertise: ['product-market fit', 'feature prioritization', 'user research', 'roadmap planning'],
    style: 'User-centric, always asks "what problem does this solve?"',
    color: '#A855F7',
    businesses: ['intelligence-engine', 'automotive-os'],
    personaFile: 'intelligence/personas/product_strategist_persona.md'
  },
  {
    id: 'operations',
    name: 'Sam Torres',
    role: 'Operations Manager',
    expertise: ['SOPs', 'process automation', 'vendor management', 'project management'],
    style: 'Process-oriented, loves checklists and automation',
    color: '#059669',
    businesses: ['transformfit', 'viral-architect', 'intelligence-engine', 'automotive-os'],
    personaFile: 'intelligence/personas/operations_persona.md'
  },
  {
    id: 'prompt-engineer',
    name: 'Aria Zhang',
    role: 'Prompt Engineer',
    expertise: ['prompt design', 'chain-of-thought', 'few-shot learning', 'eval design', 'agent orchestration'],
    style: 'Precise, iterates on prompts like code',
    color: '#6366F1',
    businesses: ['transformfit', 'viral-architect', 'intelligence-engine', 'automotive-os'],
    personaFile: 'intelligence/personas/prompt_engineer_persona.md'
  }
]

export function getExpertsByBusiness(businessSlug: string): DomainExpert[] {
  return domainExperts.filter(e => e.businesses.includes(businessSlug))
}

export function getExpertById(id: string): DomainExpert | undefined {
  return domainExperts.find(e => e.id === id)
}

export function getAllExperts(): DomainExpert[] {
  return domainExperts
}
