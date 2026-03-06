import type { Business, IntelligenceItem, IntelligenceType, BusinessStage, MorningBriefing, BriefingPriority } from '@/types'

// ============================================================================
// COMPREHENSIVE BUSINESS INTELLIGENCE DATA
// Each business has: metrics, domains, departments, competitors, roadmap,
// financials, and legal status — everything needed from idea to $10M
// ============================================================================

export const businesses: Business[] = [
  // ========================================================================
  // TRANSFORMFIT — AI Fitness Coaching App
  // ========================================================================
  {
    id: 'transformfit',
    name: 'TransformFit',
    slug: 'transformfit',
    tagline: 'AI-powered fitness coaching. DAI adapts every workout in real-time.',
    tag: 'FITNESS',
    repo: '~/adapt-evolve-progress',
    status: 'active',
    overallProgress: 72,
    metrics: [
      { label: 'MRR', current: '$0', target: '$20,000', status: 'pre-launch' },
      { label: 'Users', current: '0', target: '400+', status: 'pre-launch' },
      { label: 'Tests', current: '1,514', target: '1,500+', status: 'on-track' },
      { label: 'Build', current: 'Phase 5', target: 'Launch', status: 'at-risk' },
    ],
    domains: [
      { name: 'Foundation', progress: 55, phase: 'Active', blocker: 'LLC not formed, no bank account', nextMilestone: 'LLC formed + Stripe configured' },
      { name: 'Product', progress: 85, phase: 'Active', blocker: 'Trial flow + onboarding polish', nextMilestone: '1,514 tests passing — code complete' },
      { name: 'Design', progress: 90, phase: 'Active', blocker: 'Landing page visual review', nextMilestone: 'Orange luxury system complete' },
      { name: 'AI / DAI', progress: 65, phase: 'Active', blocker: 'Narrative quality, deload logic', nextMilestone: '57 edge functions deployed' },
      { name: 'Marketing', progress: 15, phase: 'Unblocked', blocker: 'No content calendar', nextMilestone: '35K IG followers untapped' },
      { name: 'Revenue', progress: 35, phase: 'Active', blocker: 'Stripe code written but NOT configured — needs E2E test', nextMilestone: 'Stripe test mode → live payments' },
      { name: 'Operations', progress: 25, phase: 'Active', blocker: 'Railway not deployed, no monitoring', nextMilestone: 'Railway deployment live' },
      { name: 'Automation', progress: 5, phase: 'Deferred', blocker: 'Premature before users', nextMilestone: 'Specs identified' },
      { name: 'Algorithm R&D', progress: 10, phase: 'Active (parallel)', blocker: 'No research briefs', nextMilestone: 'Research infra built' },
    ],
    blockers: [
      { id: 1, description: 'Stripe code written but not configured — no test payments run yet', blocking: 'Revenue', owner: 'Mike', cleared: false },
      { id: 2, description: 'Railway not deployed — backend not live', blocking: 'Operations, Product', owner: 'Mike', cleared: false },
      { id: 3, description: 'LLC not formed via LegalZoom', blocking: 'Legal, Revenue, App Store', owner: 'Mike', cleared: false },
      { id: 4, description: 'Trial flow not implemented (7-day + paywall)', blocking: 'Revenue, Product', owner: 'Mike', cleared: false },
      { id: 5, description: 'App Store developer accounts not set up', blocking: 'Product, Revenue', owner: 'Mike', cleared: false },
      { id: 6, description: 'Instagram content calendar empty', blocking: 'Marketing', owner: 'Mike', cleared: false },
    ],
    weeklyFocus: [
      'Configure Stripe test mode — run first end-to-end payment test',
      'Deploy Railway backend — unblocks production AI pipeline',
      'Form LLC via LegalZoom — unblocks App Store + business banking',
      'Implement 7-day trial flow with paywall',
      'Set up App Store developer account + TestFlight build',
    ],
    departments: [
      {
        name: 'Product', status: 'in-progress', progress: 85, owner: 'Mika Tanaka',
        keyMetrics: [
          { label: 'Test Count', value: '1,514', trend: 'up' },
          { label: 'Core Flows', value: '9/10 complete', trend: 'up' },
          { label: 'Onboarding', value: 'Not built', trend: 'flat' },
        ],
        systems: [
          { name: 'User Authentication (Supabase)', status: 'live', priority: 'critical' },
          { name: 'Workout Engine', status: 'live', priority: 'critical' },
          { name: 'DAI Adaptation Pipeline', status: 'live', priority: 'critical' },
          { name: '7-Day Trial + Paywall', status: 'missing', priority: 'critical' },
          { name: 'Onboarding Wizard', status: 'missing', priority: 'critical' },
          { name: 'Push Notifications', status: 'missing', priority: 'important' },
          { name: 'Social Features (sharing)', status: 'planned', priority: 'nice-to-have' },
          { name: 'Apple Health / Google Fit sync', status: 'planned', priority: 'important' },
          { name: 'Offline Mode', status: 'planned', priority: 'nice-to-have' },
        ],
        nextActions: ['Build 7-day trial flow + paywall', 'Build onboarding wizard', 'Add push notification system'],
      },
      {
        name: 'Engineering', status: 'in-progress', progress: 78, owner: 'Tomas Eriksson',
        keyMetrics: [
          { label: 'Stack', value: 'React/Supabase/CrewAI' },
          { label: 'Tests', value: '1,514 passing', trend: 'up' },
          { label: 'Edge Functions', value: '57 deployed', trend: 'up' },
          { label: 'Railway', value: 'Not deployed', trend: 'flat' },
        ],
        systems: [
          { name: 'React Frontend', status: 'live', priority: 'critical' },
          { name: 'Supabase Backend', status: 'live', priority: 'critical' },
          { name: '57 Edge Functions', status: 'live', priority: 'critical' },
          { name: 'CrewAI Agent Pipeline', status: 'building', priority: 'critical' },
          { name: 'Railway Deployment', status: 'missing', priority: 'critical' },
          { name: 'CI/CD Pipeline', status: 'missing', priority: 'critical' },
          { name: 'Error Monitoring (Sentry)', status: 'missing', priority: 'important' },
          { name: 'Database Backups', status: 'missing', priority: 'critical' },
        ],
        nextActions: ['Deploy Railway backend', 'Configure Stripe test payments', 'Set up CI/CD'],
      },
      {
        name: 'Design', status: 'in-progress', progress: 90, owner: 'Soren Lindqvist',
        keyMetrics: [
          { label: 'Design System', value: 'Complete', trend: 'up' },
          { label: 'Theme', value: 'Bold + Dark Orange' },
          { label: 'Landing Page', value: 'Needs review' },
        ],
        systems: [
          { name: 'Design System (Tailwind tokens)', status: 'live', priority: 'critical' },
          { name: 'Component Library', status: 'live', priority: 'critical' },
          { name: 'Landing Page', status: 'building', priority: 'critical' },
          { name: 'App Store Screenshots', status: 'missing', priority: 'critical' },
          { name: 'Marketing Collateral', status: 'missing', priority: 'important' },
          { name: 'Email Templates', status: 'missing', priority: 'important' },
        ],
        nextActions: ['Finalize landing page', 'Create App Store screenshots', 'Design email templates'],
      },
      {
        name: 'AI / ML', status: 'in-progress', progress: 55, owner: 'Dr. Yuki Sato',
        keyMetrics: [
          { label: 'DAI Pipeline', value: '8-node state machine' },
          { label: 'Agents', value: '6 CrewAI agents' },
          { label: 'Eval Suite', value: 'Not built' },
        ],
        systems: [
          { name: 'DAI Core Algorithm', status: 'building', priority: 'critical' },
          { name: 'CrewAI Agent Orchestration', status: 'building', priority: 'critical' },
          { name: 'Workout Generation Pipeline', status: 'live', priority: 'critical' },
          { name: 'Nervous System Weather Model', status: 'planned', priority: 'important' },
          { name: 'Eval Suite', status: 'missing', priority: 'critical' },
          { name: 'Model Cost Tracking', status: 'missing', priority: 'important' },
          { name: 'Prompt Version Control', status: 'missing', priority: 'important' },
        ],
        nextActions: ['Build eval suite', 'Improve narrative prompts', 'Add deload logic'],
      },
      {
        name: 'Marketing', status: 'not-started', progress: 15, owner: 'Amara Osei',
        keyMetrics: [
          { label: 'IG Followers', value: '35K (untapped)' },
          { label: 'Content Calendar', value: 'Empty' },
          { label: 'Email List', value: '0' },
        ],
        systems: [
          { name: 'Instagram Content Calendar', status: 'missing', priority: 'critical' },
          { name: 'Landing Page (Live)', status: 'building', priority: 'critical' },
          { name: 'Email Collection (ConvertKit)', status: 'missing', priority: 'critical' },
          { name: 'SEO Strategy', status: 'missing', priority: 'important' },
          { name: 'Content Repurposing Pipeline', status: 'missing', priority: 'important' },
          { name: 'Referral Program', status: 'planned', priority: 'important' },
          { name: 'Paid Ads (Meta)', status: 'planned', priority: 'nice-to-have' },
        ],
        nextActions: ['Create 2-week content calendar', 'Set up ConvertKit', 'Post 3x/week on Instagram'],
      },
      {
        name: 'Sales & Revenue', status: 'in-progress', progress: 35, owner: 'Kenji Watanabe',
        keyMetrics: [
          { label: 'Pricing', value: '$49/mo locked' },
          { label: 'Stripe', value: 'Code written, NOT configured' },
          { label: 'Trial Flow', value: 'Not built' },
        ],
        systems: [
          { name: 'Stripe Code (written)', status: 'building', priority: 'critical', notes: 'Code exists — needs config + E2E test' },
          { name: 'Stripe Test Mode Config', status: 'missing', priority: 'critical' },
          { name: 'Subscription Tiers ($49/$99)', status: 'planned', priority: 'critical' },
          { name: '7-Day Free Trial', status: 'missing', priority: 'critical' },
          { name: 'Apple In-App Purchases', status: 'planned', priority: 'critical' },
          { name: 'Revenue Dashboard', status: 'missing', priority: 'important' },
          { name: 'Churn Prevention Emails', status: 'missing', priority: 'important' },
        ],
        nextActions: ['Configure Stripe test mode', 'Run end-to-end payment test', 'Build 7-day trial flow'],
      },
      {
        name: 'Legal & Compliance', status: 'not-started', progress: 5, owner: 'Helen Park',
        keyMetrics: [
          { label: 'LLC', value: 'Not formed' },
          { label: 'Trademark', value: 'Not filed' },
          { label: 'ToS/Privacy', value: 'Not written' },
        ],
        systems: [
          { name: 'LLC Formation (LegalZoom)', status: 'missing', priority: 'critical' },
          { name: 'EIN (Federal Tax ID)', status: 'missing', priority: 'critical' },
          { name: 'Terms of Service', status: 'missing', priority: 'critical' },
          { name: 'Privacy Policy (CCPA/GDPR)', status: 'missing', priority: 'critical' },
          { name: 'HIPAA Assessment', status: 'missing', priority: 'important', notes: 'Health data handling' },
          { name: 'Trademark Filing', status: 'missing', priority: 'important' },
          { name: 'Apple Developer Agreement', status: 'missing', priority: 'critical' },
          { name: 'Google Play Developer Agreement', status: 'missing', priority: 'critical' },
        ],
        nextActions: ['Form LLC via LegalZoom TODAY', 'Get EIN', 'Draft Terms of Service'],
      },
      {
        name: 'Finance', status: 'not-started', progress: 5, owner: 'Derek Hsu',
        keyMetrics: [
          { label: 'MRR', value: '$0' },
          { label: 'Burn Rate', value: 'Unknown' },
          { label: 'Bank', value: 'Needs setup' },
        ],
        systems: [
          { name: 'Business Bank Account', status: 'missing', priority: 'critical' },
          { name: 'Accounting Software', status: 'missing', priority: 'important' },
          { name: 'Expense Tracking', status: 'missing', priority: 'important' },
          { name: 'Revenue Forecasting Model', status: 'missing', priority: 'important' },
          { name: 'Tax Preparation', status: 'missing', priority: 'important' },
        ],
        nextActions: ['Open business bank account', 'Set up QuickBooks', 'Build financial model'],
      },
      {
        name: 'Operations', status: 'not-started', progress: 20, owner: 'Raj Malhotra',
        keyMetrics: [
          { label: 'SOPs', value: '0 documented' },
          { label: 'Monitoring', value: 'None' },
          { label: 'Support', value: 'Not set up' },
        ],
        systems: [
          { name: 'CLAUDE.md Protocols', status: 'live', priority: 'critical' },
          { name: 'SOP Documentation', status: 'missing', priority: 'important' },
          { name: 'Customer Support (Intercom)', status: 'missing', priority: 'important' },
          { name: 'Uptime Monitoring', status: 'missing', priority: 'important' },
          { name: 'Incident Response Runbook', status: 'missing', priority: 'nice-to-have' },
        ],
        nextActions: ['Document deployment SOP', 'Set up basic monitoring', 'Plan support channels'],
      },
      {
        name: 'Growth', status: 'not-started', progress: 5, owner: 'Nina Kowalski',
        keyMetrics: [
          { label: 'K-factor', value: 'N/A' },
          { label: 'Referral Program', value: 'Not built' },
          { label: 'Experiments', value: '0 running' },
        ],
        systems: [
          { name: 'Analytics (PostHog)', status: 'missing', priority: 'critical' },
          { name: 'A/B Testing Framework', status: 'missing', priority: 'important' },
          { name: 'Referral Program', status: 'planned', priority: 'important' },
          { name: 'Viral Loop Design', status: 'planned', priority: 'important' },
          { name: 'Community (Discord/Skool)', status: 'planned', priority: 'nice-to-have' },
        ],
        nextActions: ['Set up PostHog analytics', 'Design referral program', 'Plan community strategy'],
      },
      {
        name: 'Customer Success', status: 'not-started', progress: 0, owner: 'Leo Marchetti',
        keyMetrics: [
          { label: 'NPS', value: 'N/A' },
          { label: 'Churn', value: 'N/A' },
          { label: 'Health Score', value: 'Not built' },
        ],
        systems: [
          { name: 'Customer Health Scoring', status: 'planned', priority: 'important' },
          { name: 'Onboarding Emails (ConvertKit)', status: 'missing', priority: 'critical' },
          { name: 'NPS Survey', status: 'planned', priority: 'important' },
          { name: 'Churn Prevention Automation', status: 'planned', priority: 'important' },
          { name: 'FAQ / Knowledge Base', status: 'missing', priority: 'important' },
        ],
        nextActions: ['Build onboarding email sequence', 'Create FAQ page', 'Design health score model'],
      },
      {
        name: 'Research', status: 'in-progress', progress: 10, owner: 'Dr. Ezra Goldstein',
        keyMetrics: [
          { label: 'Papers Reviewed', value: '0' },
          { label: 'Algorithms', value: 'DAI v1' },
          { label: 'Patents', value: '0 filed' },
        ],
        systems: [
          { name: 'Research Brief Template', status: 'missing', priority: 'important' },
          { name: 'Algorithm Benchmarking', status: 'planned', priority: 'important' },
          { name: 'Competitive Intelligence', status: 'missing', priority: 'critical' },
          { name: 'Patent Strategy', status: 'planned', priority: 'nice-to-have' },
        ],
        nextActions: ['Complete competitive landscape scan', 'Build algorithm benchmark suite', 'Review top 10 papers'],
      },
    ],
    competitors: [
      { name: 'Fitbod', website: 'fitbod.me', pricing: '$12.99/mo or $79.99/yr', users: '5M+ downloads', rating: '4.8 (App Store)', strengths: ['Strong AI workout generation', 'Clean UI', 'Apple Watch integration', 'Large exercise database'], weaknesses: ['No real-time adaptation', 'Generic coaching', 'No nervous system model', 'Cookie-cutter feel'], threat: 'high', differentiator: 'Largest AI workout app — our DAI adaptation is the counter-position' },
      { name: 'Juggernaut AI', website: 'juggernautai.app', pricing: '$35/mo or $279/yr', users: '500K+ downloads', rating: '4.7 (App Store)', strengths: ['Periodization-based', 'Strength sport focus', 'Chad Wesley Smith credibility', 'Powerlifting/weightlifting'], weaknesses: ['Niche audience (strength sports)', 'No general fitness', 'Expensive', 'Limited cardio'], threat: 'medium', differentiator: 'Strength sport niche — we target general fitness with broader appeal' },
      { name: 'JEFIT', website: 'jefit.com', pricing: 'Free / $6.99/mo Pro', users: '10M+ downloads', rating: '4.5 (App Store)', strengths: ['Huge community', 'Exercise library', 'Workout logging', 'Free tier'], weaknesses: ['Dated UI', 'No AI', 'Manual programming', 'Cluttered experience'], threat: 'low', differentiator: 'Legacy tracker — we are AI-native from day one' },
      { name: 'Future', website: 'future.co', pricing: '$149/mo', users: '1M+ downloads', rating: '4.8 (App Store)', strengths: ['Real human coaches', 'Apple Watch', 'Personalized plans', 'Premium positioning'], weaknesses: ['Very expensive ($149/mo)', 'Human bottleneck', 'No AI adaptation', 'Coach availability'], threat: 'medium', differentiator: 'Human coaches at $149 — we deliver 80% of the value at $49 with DAI' },
      { name: 'Dr. Muscle', website: 'dr-muscle.com', pricing: '$19.99/mo or $9.99/mo (annual)', users: '200K+ downloads', rating: '4.2 (App Store)', strengths: ['Science-based', 'Auto-adjusting weights', 'Research citations', 'Progressive overload focus'], weaknesses: ['Poor UX/UI', 'Small team', 'Limited marketing', 'Niche feel'], threat: 'low', differentiator: 'Closest to our DAI concept — but poor execution and UX' },
      { name: 'Hevy', website: 'hevy.com', pricing: 'Free / $9.99/mo Pro', users: '3M+ downloads', rating: '4.8 (App Store)', strengths: ['Clean modern UI', 'Social features', 'Workout tracking', 'Free tier', 'Growing fast'], weaknesses: ['No AI programming', 'Manual entry focused', 'No adaptation', 'Tracker not coach'], threat: 'medium', differentiator: 'Great tracker but no coaching — we add the AI brain' },
      { name: 'Strong', website: 'strong.app', pricing: 'Free / $4.99/mo Pro', users: '5M+ downloads', rating: '4.8 (App Store)', strengths: ['Simple and focused', 'Great UX', 'Apple Watch', 'Workout logging'], weaknesses: ['No AI', 'No programming', 'Just a tracker', 'No coaching'], threat: 'low', differentiator: 'Pure tracker — different category from AI coaching' },
      { name: 'Caliber', website: 'caliber.app', pricing: '$75-200/mo', users: '100K+ downloads', rating: '4.6 (App Store)', strengths: ['Hybrid human + AI', 'Strength focus', 'Body composition tracking', 'Coach marketplace'], weaknesses: ['Expensive', 'Coach quality varies', 'Limited AI', 'Small user base'], threat: 'low', differentiator: 'Hybrid model — we go full AI at lower cost' },
    ],
    roadmap: [
      {
        phase: 'idea', label: 'Idea & Validation', status: 'completed',
        milestones: [
          { task: 'Problem validation (personal experience)', department: 'Product', status: 'done' },
          { task: 'Market research (AI fitness landscape)', department: 'Research', status: 'done' },
          { task: 'Core concept: DAI real-time adaptation', department: 'AI / ML', status: 'done' },
          { task: 'Tech stack selection (React/Supabase/CrewAI)', department: 'Engineering', status: 'done' },
        ],
      },
      {
        phase: 'mvp', label: 'MVP Build', status: 'current', targetDate: '2026-04-15',
        milestones: [
          { task: 'Core workout engine', department: 'Engineering', status: 'done' },
          { task: 'DAI adaptation pipeline (6 agents)', department: 'AI / ML', status: 'done' },
          { task: 'User auth + profiles', department: 'Engineering', status: 'done' },
          { task: 'Design system (bold + dark orange)', department: 'Design', status: 'done' },
          { task: '1,514 tests passing', department: 'Engineering', status: 'done' },
          { task: '57 edge functions deployed', department: 'Engineering', status: 'done' },
          { task: 'Stripe code written', department: 'Sales & Revenue', status: 'done' },
          { task: 'Configure Stripe test mode + E2E payment test', department: 'Sales & Revenue', status: 'todo' },
          { task: 'Deploy Railway backend', department: 'Engineering', status: 'todo' },
          { task: 'LLC formation via LegalZoom', department: 'Legal & Compliance', status: 'todo' },
          { task: 'Terms of Service + Privacy Policy', department: 'Legal & Compliance', status: 'todo' },
          { task: 'Landing page live', department: 'Design', status: 'in-progress' },
          { task: 'Onboarding wizard + 7-day trial flow', department: 'Product', status: 'todo' },
          { task: 'App Store developer accounts', department: 'Operations', status: 'todo' },
        ],
      },
      {
        phase: 'launch', label: 'Launch (First 100 Users)', status: 'upcoming', targetDate: '2026-06-01',
        milestones: [
          { task: 'Instagram pre-launch content (35K followers)', department: 'Marketing', status: 'todo' },
          { task: 'Beta program (20 users)', department: 'Product', status: 'todo' },
          { task: 'Email collection landing page', department: 'Marketing', status: 'todo' },
          { task: 'Product Hunt launch', department: 'Marketing', status: 'todo' },
          { task: 'ConvertKit email sequences', department: 'Marketing', status: 'todo' },
          { task: 'PostHog analytics installed', department: 'Growth', status: 'todo' },
          { task: 'Customer support channel', department: 'Operations', status: 'todo' },
          { task: 'App Store submission (iOS)', department: 'Operations', status: 'todo' },
          { task: 'DAI eval suite built', department: 'AI / ML', status: 'todo' },
        ],
      },
      {
        phase: 'growth', label: 'Growth ($1K-$10K MRR)', status: 'future', targetDate: '2026-Q3',
        milestones: [
          { task: 'Referral program (K-factor > 0.3)', department: 'Growth', status: 'todo' },
          { task: 'Content marketing (3 posts/week)', department: 'Marketing', status: 'todo' },
          { task: 'SEO strategy (target 10 keywords)', department: 'Marketing', status: 'todo' },
          { task: 'A/B testing framework', department: 'Growth', status: 'todo' },
          { task: 'Churn prevention automation', department: 'Customer Success', status: 'todo' },
          { task: 'Community launch (Discord)', department: 'Growth', status: 'todo' },
          { task: 'Apple Health integration', department: 'Engineering', status: 'todo' },
          { task: 'First paid ads test ($500 budget)', department: 'Marketing', status: 'todo' },
        ],
      },
      {
        phase: 'scale', label: 'Scale ($10K-$100K MRR)', status: 'future', targetDate: '2027-Q1',
        milestones: [
          { task: 'Hire first team member', department: 'Operations', status: 'todo' },
          { task: 'SOC 2 compliance', department: 'Legal & Compliance', status: 'todo' },
          { task: 'Annual pricing tier', department: 'Sales & Revenue', status: 'todo' },
          { task: 'Enterprise/gym partnerships', department: 'Sales & Revenue', status: 'todo' },
          { task: 'International expansion', department: 'Product', status: 'todo' },
          { task: 'Algorithm patent filing', department: 'Research', status: 'todo' },
        ],
      },
      {
        phase: 'ten-million', label: '$10M ARR', status: 'future', targetDate: '2028',
        milestones: [
          { task: 'Series A fundraise', department: 'Finance', status: 'todo' },
          { task: 'Team of 10-15', department: 'Operations', status: 'todo' },
          { task: 'Platform play (API for gyms)', department: 'Engineering', status: 'todo' },
          { task: 'Wearable integrations (Oura, Whoop)', department: 'Engineering', status: 'todo' },
          { task: 'DAI 2.0 (multi-modal)', department: 'AI / ML', status: 'todo' },
        ],
      },
    ],
    financials: {
      mrr: 0, arr: 0, burnRate: 200, runway: 'Self-funded', totalRevenue: 0, totalExpenses: 200,
      stripeConnected: false,
      monthlyExpenses: [
        { category: 'Infrastructure', amount: 25, service: 'Supabase (Free → Pro)', recurring: true },
        { category: 'Infrastructure', amount: 0, service: 'Vercel (Hobby)', recurring: true },
        { category: 'AI', amount: 50, service: 'Anthropic API (estimated)', recurring: true },
        { category: 'Tools', amount: 20, service: 'GitHub Pro', recurring: true },
        { category: 'Domain', amount: 12, service: 'Domain registration', recurring: true },
        { category: 'Design', amount: 0, service: 'Figma (Free)', recurring: true },
        { category: 'Marketing', amount: 0, service: 'Instagram (organic)', recurring: true },
      ],
    },
    legal: {
      entity: { type: 'LLC', state: 'TBD', status: 'not-formed', provider: 'LegalZoom' },
      trademarks: [
        { name: 'TransformFit', status: 'not-filed' },
        { name: 'Adapt.Evolve.Progress', status: 'not-filed' },
        { name: 'DAI (Dynamic Adaptive Intelligence)', status: 'search-needed' },
      ],
      compliance: [
        { requirement: 'Terms of Service', category: 'Legal', status: 'not-started', priority: 'critical' },
        { requirement: 'Privacy Policy', category: 'Legal', status: 'not-started', priority: 'critical' },
        { requirement: 'CCPA Compliance', category: 'Privacy', status: 'not-started', priority: 'critical' },
        { requirement: 'GDPR Compliance', category: 'Privacy', status: 'not-started', priority: 'important' },
        { requirement: 'HIPAA Assessment', category: 'Health', status: 'not-started', priority: 'important', deadline: 'Before launch' },
        { requirement: 'App Store Guidelines', category: 'Platform', status: 'not-started', priority: 'critical' },
        { requirement: 'Google Play Policies', category: 'Platform', status: 'not-started', priority: 'critical' },
        { requirement: 'ADA Accessibility (WCAG)', category: 'Accessibility', status: 'not-started', priority: 'important' },
      ],
      insurance: [
        { type: 'General Liability', status: 'needed' },
        { type: 'Professional Liability (E&O)', status: 'needed' },
        { type: 'Cyber Liability', status: 'needed' },
      ],
      documents: [
        { name: 'Terms of Service', status: 'missing' },
        { name: 'Privacy Policy', status: 'missing' },
        { name: 'Cookie Policy', status: 'missing' },
        { name: 'DMCA Policy', status: 'missing' },
        { name: 'AI Disclaimer', status: 'missing', lastUpdated: undefined },
      ],
    },
  },

  // ========================================================================
  // VIRAL ARCHITECT HUB — AI Instagram Content Platform
  // ========================================================================
  {
    id: 'viral-architect',
    name: 'Viral Architect Hub',
    slug: 'viral-architect',
    tagline: '24 AI agents working 24/7 to make your Instagram explode.',
    tag: 'INSTAGRAM',
    repo: '~/viral-architect-hub',
    status: 'active',
    overallProgress: 78,
    metrics: [
      { label: 'MRR', current: '$0', target: '$20,000', status: 'pre-launch' },
      { label: 'Beta Users', current: '0', target: '20', status: 'pre-launch' },
      { label: 'Tests', current: '486', target: '500+', status: 'on-track' },
      { label: 'Build', current: 'Phase 5', target: 'Beta', status: 'at-risk' },
    ],
    domains: [
      { name: 'Foundation', progress: 30, phase: 'Active', blocker: 'LLC not formed, Stripe not configured', nextMilestone: 'Entity formed + Stripe live' },
      { name: 'Product', progress: 85, phase: 'Active', blocker: 'Onboarding wizard not built', nextMilestone: 'Instagram OAuth + publish flow built' },
      { name: 'Design', progress: 85, phase: 'Active', blocker: 'Landing page needs polish', nextMilestone: 'Ultra-luxury design complete' },
      { name: 'AI / Content', progress: 85, phase: 'Active', blocker: 'Brief quality needs tuning', nextMilestone: '4 crews, 24+ agents built' },
      { name: 'Marketing', progress: 5, phase: 'Blocked', blocker: 'No content calendar', nextMilestone: 'Meta-viral strategy' },
      { name: 'Revenue', progress: 15, phase: 'Blocked', blocker: 'Stripe not configured, Meta App Review not submitted', nextMilestone: '4-tier pricing designed' },
      { name: 'Operations', progress: 40, phase: 'Active', blocker: 'PostHog not configured', nextMilestone: 'CI/CD live' },
      { name: 'Automation', progress: 70, phase: 'Active', blocker: 'Railway not deployed — longest remaining blocker', nextMilestone: '72 edge functions built, auto-publish built' },
      { name: 'Algorithm R&D', progress: 5, phase: 'Active (parallel)', blocker: 'No research briefs', nextMilestone: 'R&D infra built' },
    ],
    blockers: [
      { id: 1, description: 'Meta App Review NOT submitted — 2-4 week approval lead time (start immediately)', blocking: 'Product (real Instagram publishing)', owner: 'Mike', cleared: false },
      { id: 2, description: 'Railway backend not deployed', blocking: 'AI/Content, Automation, Product', owner: 'Mike', cleared: false },
      { id: 3, description: 'Stripe not configured — code may exist but no test payments run', blocking: 'Revenue', owner: 'Mike', cleared: false },
      { id: 4, description: 'LLC not formed', blocking: 'Legal, Revenue', owner: 'Mike', cleared: false },
      { id: 5, description: 'Onboarding wizard not built', blocking: 'Product', owner: 'Claude Code', cleared: false },
      { id: 6, description: 'PostHog key not configured', blocking: 'Operations', owner: 'Mike', cleared: false },
    ],
    weeklyFocus: [
      'Submit Meta App Review TODAY — 2-4 week lead time is the critical path',
      'Configure Stripe test mode — run first end-to-end payment',
      'Deploy Railway backend — unblocks AI content pipeline',
      'Form LLC via LegalZoom — unblocks business banking + contracts',
      'Build onboarding wizard',
    ],
    departments: [
      {
        name: 'Product', status: 'in-progress', progress: 85, owner: 'Mika Tanaka',
        keyMetrics: [
          { label: 'Tests', value: '486', trend: 'up' },
          { label: 'Core Flows', value: '8/9 complete', trend: 'up' },
          { label: 'Multi-account', value: 'Built' },
          { label: 'Instagram OAuth', value: 'Built' },
        ],
        systems: [
          { name: 'Multi-account management', status: 'live', priority: 'critical' },
          { name: 'Content calendar view', status: 'live', priority: 'critical' },
          { name: 'AI content generation', status: 'live', priority: 'critical' },
          { name: 'Instagram OAuth', status: 'live', priority: 'critical' },
          { name: 'Publish flow', status: 'live', priority: 'critical' },
          { name: 'Auto-scheduling', status: 'building', priority: 'critical' },
          { name: 'Onboarding wizard', status: 'missing', priority: 'critical' },
          { name: 'Analytics dashboard', status: 'building', priority: 'important' },
          { name: 'Hashtag research tool', status: 'planned', priority: 'important' },
        ],
        nextActions: ['Submit Meta App Review (unblocks real publishing)', 'Build onboarding wizard', 'Polish analytics dashboard'],
      },
      {
        name: 'Engineering', status: 'in-progress', progress: 75, owner: 'Tomas Eriksson',
        keyMetrics: [
          { label: 'Stack', value: 'React/Supabase/CrewAI/Railway' },
          { label: 'Tests', value: '486 passing', trend: 'up' },
          { label: 'Edge Functions', value: '72 built', trend: 'up' },
          { label: 'Railway', value: 'Not deployed', trend: 'flat' },
        ],
        systems: [
          { name: 'React Frontend', status: 'live', priority: 'critical' },
          { name: 'Supabase Backend', status: 'live', priority: 'critical' },
          { name: '72 Edge Functions (built)', status: 'live', priority: 'critical' },
          { name: 'Instagram OAuth', status: 'live', priority: 'critical' },
          { name: 'Publish Flow', status: 'live', priority: 'critical' },
          { name: 'Railway Worker (CrewAI)', status: 'building', priority: 'critical', notes: 'Code complete, not deployed' },
          { name: 'Meta Graph API Integration', status: 'building', priority: 'critical' },
          { name: 'Cron Job Scheduler', status: 'planned', priority: 'critical' },
          { name: 'Image Generation Pipeline', status: 'planned', priority: 'important' },
        ],
        nextActions: ['Deploy Railway backend', 'Submit Meta App Review', 'Configure PostHog'],
      },
      {
        name: 'AI / ML', status: 'in-progress', progress: 80, owner: 'Dr. Yuki Sato',
        keyMetrics: [
          { label: 'Crews', value: '4 built' },
          { label: 'Agents', value: '24+ agents' },
          { label: 'Content Quality', value: 'Needs tuning' },
        ],
        systems: [
          { name: 'Content Generation Crew', status: 'live', priority: 'critical' },
          { name: 'Caption Writing Crew', status: 'live', priority: 'critical' },
          { name: 'Hashtag Optimization Crew', status: 'live', priority: 'important' },
          { name: 'Analytics & Learning Crew', status: 'building', priority: 'important' },
          { name: 'Virality Prediction Model', status: 'planned', priority: 'important' },
          { name: 'STEPPS Scoring System', status: 'planned', priority: 'important' },
        ],
        nextActions: ['Tune content brief quality', 'Build virality prediction', 'Add STEPPS scoring'],
      },
      {
        name: 'Marketing', status: 'not-started', progress: 5, owner: 'Amara Osei',
        keyMetrics: [{ label: 'Content', value: 'Nothing published' }, { label: 'Email List', value: '0' }],
        systems: [
          { name: 'Landing Page', status: 'building', priority: 'critical' },
          { name: 'Content Calendar', status: 'missing', priority: 'critical' },
          { name: 'Email Collection', status: 'missing', priority: 'critical' },
          { name: 'Product Hunt Launch Plan', status: 'planned', priority: 'important' },
        ],
        nextActions: ['Finish landing page', 'Create content calendar', 'Set up email collection'],
      },
      {
        name: 'Sales & Revenue', status: 'not-started', progress: 10, owner: 'Kenji Watanabe',
        keyMetrics: [{ label: 'Pricing', value: '4-tier designed' }, { label: 'Stripe', value: 'Not connected' }],
        systems: [
          { name: 'Stripe Integration', status: 'missing', priority: 'critical' },
          { name: '4-Tier Pricing ($29/$49/$99/$199)', status: 'planned', priority: 'critical' },
          { name: 'Usage-based billing', status: 'planned', priority: 'important' },
        ],
        nextActions: ['Connect Stripe', 'Build subscription flow', 'Implement usage tracking'],
      },
      {
        name: 'Legal & Compliance', status: 'not-started', progress: 0, owner: 'Helen Park',
        keyMetrics: [{ label: 'LLC', value: 'Not formed' }, { label: 'Meta Compliance', value: 'Pending' }],
        systems: [
          { name: 'LLC Formation', status: 'missing', priority: 'critical' },
          { name: 'Terms of Service', status: 'missing', priority: 'critical' },
          { name: 'Privacy Policy', status: 'missing', priority: 'critical' },
          { name: 'Meta Platform Terms Compliance', status: 'missing', priority: 'critical' },
          { name: 'DMCA / Content Policy', status: 'missing', priority: 'important' },
        ],
        nextActions: ['Form LLC', 'Draft ToS + Privacy', 'Review Meta Platform terms'],
      },
      {
        name: 'Finance', status: 'not-started', progress: 0, owner: 'Derek Hsu',
        keyMetrics: [{ label: 'MRR', value: '$0' }],
        systems: [
          { name: 'Business Bank Account', status: 'missing', priority: 'critical' },
          { name: 'Financial Model', status: 'missing', priority: 'important' },
        ],
        nextActions: ['Open bank account', 'Build financial model'],
      },
      {
        name: 'Operations', status: 'in-progress', progress: 40, owner: 'Raj Malhotra',
        keyMetrics: [{ label: 'CI/CD', value: 'Needs deployment' }, { label: 'Monitoring', value: 'PostHog planned' }],
        systems: [
          { name: 'CI/CD Pipeline', status: 'building', priority: 'critical' },
          { name: 'PostHog Analytics', status: 'missing', priority: 'critical' },
          { name: 'Sentry Error Tracking', status: 'missing', priority: 'important' },
        ],
        nextActions: ['Configure PostHog', 'Add Sentry', 'Document deployment SOP'],
      },
    ],
    competitors: [
      { name: 'Later', website: 'later.com', pricing: '$25-$80/mo', users: '7M+ users', rating: '4.6', strengths: ['Visual planner', 'Link in bio', 'Large user base', 'Multi-platform'], weaknesses: ['No AI content generation', 'Manual posting', 'No autonomous mode', 'Generic'], threat: 'medium', differentiator: 'Scheduler not creator — we generate + schedule autonomously' },
      { name: 'Buffer', website: 'buffer.com', pricing: '$6-$120/mo', users: '5M+ users', rating: '4.5', strengths: ['Simple and clean', 'Affordable', 'Good analytics', 'Multi-platform'], weaknesses: ['No AI', 'Manual content', 'Basic features', 'No automation'], threat: 'low', differentiator: 'Buffer is a tool — we are an autonomous marketing team' },
      { name: 'Hootsuite', website: 'hootsuite.com', pricing: '$99-$739/mo', users: '18M+ users', rating: '4.2', strengths: ['Enterprise features', 'All platforms', 'Team collaboration', 'Social listening'], weaknesses: ['Expensive', 'Complex', 'No AI generation', 'Dated UX'], threat: 'low', differentiator: 'Enterprise bloat — we are AI-native for solopreneurs and small teams' },
      { name: 'Predis.ai', website: 'predis.ai', pricing: '$29-$139/mo', users: '100K+ users', rating: '4.3', strengths: ['AI content generation', 'Video creation', 'Multi-platform', 'Templates'], weaknesses: ['Generic AI output', 'No learning from analytics', 'No autonomous posting', 'Template-dependent'], threat: 'high', differentiator: 'Closest competitor — but no autonomous agent architecture' },
      { name: 'Opus Clip', website: 'opus.pro', pricing: '$19-$68/mo', users: '2M+ users', rating: '4.5', strengths: ['AI video repurposing', 'Virality score', 'Fast processing'], weaknesses: ['Video only', 'No posting', 'No multi-format', 'Single use case'], threat: 'low', differentiator: 'Video-only tool — we handle all content types end-to-end' },
      { name: 'Jasper', website: 'jasper.ai', pricing: '$49-$125/mo', users: '100K+ businesses', rating: '4.4', strengths: ['AI copywriting', 'Brand voice', 'Templates', 'Team features'], weaknesses: ['Text-only', 'No scheduling', 'No Instagram-specific', 'Expensive'], threat: 'low', differentiator: 'Writing tool not social manager — different category' },
    ],
    roadmap: [
      {
        phase: 'idea', label: 'Idea & Validation', status: 'completed',
        milestones: [
          { task: 'Market validation (AI social media demand)', department: 'Research', status: 'done' },
          { task: 'CrewAI agent architecture designed', department: 'AI / ML', status: 'done' },
          { task: 'Tech stack selected', department: 'Engineering', status: 'done' },
        ],
      },
      {
        phase: 'mvp', label: 'MVP Build', status: 'current', targetDate: '2026-04-30',
        milestones: [
          { task: '4 CrewAI crews built (24 agents)', department: 'AI / ML', status: 'done' },
          { task: 'Multi-account management', department: 'Product', status: 'done' },
          { task: 'Content calendar UI', department: 'Design', status: 'done' },
          { task: '486 tests passing', department: 'Engineering', status: 'done' },
          { task: '72 edge functions built', department: 'Engineering', status: 'done' },
          { task: 'Instagram OAuth built', department: 'Engineering', status: 'done' },
          { task: 'Publish flow built', department: 'Product', status: 'done' },
          { task: 'Submit Meta App Review (2-4 week lead time)', department: 'Operations', status: 'todo' },
          { task: 'Deploy Railway backend', department: 'Engineering', status: 'todo' },
          { task: 'Configure Stripe + subscription tiers', department: 'Sales & Revenue', status: 'todo' },
          { task: 'LLC formation', department: 'Legal & Compliance', status: 'todo' },
          { task: 'Onboarding wizard', department: 'Product', status: 'todo' },
        ],
      },
      {
        phase: 'launch', label: 'Beta Launch (20 Users)', status: 'upcoming', targetDate: '2026-06-15',
        milestones: [
          { task: 'Recruit 20 beta testers', department: 'Marketing', status: 'todo' },
          { task: 'Product Hunt launch', department: 'Marketing', status: 'todo' },
          { task: 'Beta feedback loop', department: 'Product', status: 'todo' },
          { task: 'Content brief quality pass', department: 'AI / ML', status: 'todo' },
        ],
      },
      {
        phase: 'growth', label: 'Growth ($1K-$10K MRR)', status: 'future',
        milestones: [
          { task: 'Influencer partnerships (micro-creators)', department: 'Growth', status: 'todo' },
          { task: 'Referral program (give 1 month, get 1 month)', department: 'Growth', status: 'todo' },
          { task: 'TikTok + Twitter expansion', department: 'Product', status: 'todo' },
          { task: 'Virality prediction model v1', department: 'AI / ML', status: 'todo' },
        ],
      },
      {
        phase: 'scale', label: 'Scale ($10K-$100K MRR)', status: 'future',
        milestones: [
          { task: 'Agency tier ($199/mo)', department: 'Sales & Revenue', status: 'todo' },
          { task: 'API for third-party integrations', department: 'Engineering', status: 'todo' },
          { task: 'White-label option', department: 'Product', status: 'todo' },
        ],
      },
      {
        phase: 'ten-million', label: '$10M ARR', status: 'future',
        milestones: [
          { task: 'All major social platforms', department: 'Product', status: 'todo' },
          { task: 'Enterprise sales team', department: 'Sales & Revenue', status: 'todo' },
          { task: 'Content marketplace', department: 'Product', status: 'todo' },
        ],
      },
    ],
    financials: {
      mrr: 0, arr: 0, burnRate: 150, runway: 'Self-funded', totalRevenue: 0, totalExpenses: 150,
      stripeConnected: false,
      monthlyExpenses: [
        { category: 'Infrastructure', amount: 25, service: 'Supabase', recurring: true },
        { category: 'Infrastructure', amount: 5, service: 'Railway', recurring: true },
        { category: 'AI', amount: 80, service: 'Anthropic + OpenAI API', recurring: true },
        { category: 'Domain', amount: 12, service: 'Domain', recurring: true },
      ],
    },
    legal: {
      entity: { type: 'LLC', state: 'TBD', status: 'not-formed', provider: 'LegalZoom' },
      trademarks: [{ name: 'Viral Architect Hub', status: 'not-filed' }],
      compliance: [
        { requirement: 'Terms of Service', category: 'Legal', status: 'not-started', priority: 'critical' },
        { requirement: 'Privacy Policy', category: 'Legal', status: 'not-started', priority: 'critical' },
        { requirement: 'Meta Platform Terms', category: 'Platform', status: 'not-started', priority: 'critical' },
        { requirement: 'DMCA Policy', category: 'Content', status: 'not-started', priority: 'important' },
        { requirement: 'CCPA Compliance', category: 'Privacy', status: 'not-started', priority: 'critical' },
      ],
      insurance: [{ type: 'General Liability', status: 'needed' }, { type: 'Cyber Liability', status: 'needed' }],
      documents: [
        { name: 'Terms of Service', status: 'missing' },
        { name: 'Privacy Policy', status: 'missing' },
        { name: 'Content Policy', status: 'missing' },
        { name: 'AI-Generated Content Disclaimer', status: 'missing' },
      ],
    },
  },

  // ========================================================================
  // INTELLIGENCE ENGINE — Cross-Company Intelligence Platform
  // ========================================================================
  {
    id: 'intelligence-engine',
    name: 'Intelligence Engine',
    slug: 'intelligence-engine',
    tagline: 'Cross-company intelligence platform powering all products.',
    tag: 'INTELLIGENCE',
    repo: '~/founder-intelligence-os',
    status: 'active',
    overallProgress: 40,
    metrics: [
      { label: 'Personas', current: '59', target: '100+', status: 'on-track' },
      { label: 'Frameworks', current: '64', target: '100+', status: 'on-track' },
      { label: 'Skills', current: '79', target: '100+', status: 'on-track' },
      { label: 'Products Served', current: '2/4', target: '4/4', status: 'at-risk' },
    ],
    domains: [
      { name: 'Foundation', progress: 70, phase: 'Active', blocker: 'None', nextMilestone: 'INDEX.md comprehensive' },
      { name: 'Content', progress: 60, phase: 'Active', blocker: 'Many personas need depth', nextMilestone: '210+ files catalogued' },
      { name: 'Integration', progress: 45, phase: 'Active', blocker: 'Command Center building', nextMilestone: 'Web interface live' },
      { name: 'AI/Research', progress: 20, phase: 'Active', blocker: 'Research skills new', nextMilestone: '/tf-research + /va-research built' },
      { name: 'Automation', progress: 10, phase: 'Planned', blocker: 'No auto-ingestion', nextMilestone: 'YouTube scraper exists' },
    ],
    blockers: [
      { id: 1, description: 'Automotive and Intelligence product personas not built', blocking: 'Content', owner: 'Claude Code', cleared: false },
      { id: 2, description: 'No competitive intelligence data', blocking: 'Research', owner: 'Claude Code', cleared: false },
    ],
    weeklyFocus: [
      'Build out Founder Command Center (this app!)',
      'Add automotive industry intelligence',
      'Complete competitive landscape for all 4 businesses',
      'Sync intelligence files to Supabase',
    ],
    departments: [
      {
        name: 'Product', status: 'in-progress', progress: 45, owner: 'Mika Tanaka',
        keyMetrics: [
          { label: 'Command Center', value: 'Building', trend: 'up' },
          { label: 'Intelligence Files', value: '210+' },
        ],
        systems: [
          { name: 'Founder Command Center (Web)', status: 'live', priority: 'critical' },
          { name: 'Intelligence Search/Filter', status: 'live', priority: 'critical' },
          { name: 'Business Dashboard', status: 'live', priority: 'critical' },
          { name: 'Supabase Data Sync', status: 'building', priority: 'important' },
          { name: 'Auto-ingestion Pipeline', status: 'planned', priority: 'important' },
        ],
        nextActions: ['Complete all Command Center pages', 'Sync data to Supabase', 'Build auto-ingestion'],
      },
    ],
    competitors: [
      { name: 'Notion AI', website: 'notion.so', pricing: '$10-$25/mo', users: '30M+ users', rating: '4.7', strengths: ['All-in-one workspace', 'AI integration', 'Huge user base', 'Flexible'], weaknesses: ['Generic AI', 'Not founder-specific', 'No advisory personas', 'No competitive intel'], threat: 'low', differentiator: 'General tool — we are founder-specific intelligence' },
      { name: 'Mem AI', website: 'mem.ai', pricing: '$14.99-$49.99/mo', users: '500K+ users', rating: '4.2', strengths: ['AI knowledge management', 'Auto-organization', 'Search'], weaknesses: ['No advisory council', 'No business tracking', 'No competitive intel', 'Individual focus'], threat: 'low', differentiator: 'Personal knowledge — we do business intelligence' },
    ],
    roadmap: [
      { phase: 'idea', label: 'Concept', status: 'completed', milestones: [{ task: 'Intelligence file structure', department: 'Product', status: 'done' }, { task: 'Persona/Framework/Skill taxonomy', department: 'Product', status: 'done' }] },
      { phase: 'mvp', label: 'MVP (Command Center)', status: 'current', targetDate: '2026-04-01', milestones: [{ task: 'Founder Command Center web app', department: 'Engineering', status: 'in-progress' }, { task: 'Business intelligence dashboards', department: 'Product', status: 'in-progress' }, { task: 'Elite Council AI chat', department: 'AI / ML', status: 'in-progress' }, { task: 'Competitive intelligence data', department: 'Research', status: 'in-progress' }] },
      { phase: 'launch', label: 'Full Integration', status: 'upcoming', milestones: [{ task: 'Supabase real-time sync', department: 'Engineering', status: 'todo' }, { task: 'Auto-ingestion (YouTube, Reddit)', department: 'Engineering', status: 'todo' }] },
      { phase: 'growth', label: 'Platform', status: 'future', milestones: [{ task: 'API for other products', department: 'Engineering', status: 'todo' }, { task: 'MCP server integration', department: 'Engineering', status: 'todo' }] },
    ],
    financials: {
      mrr: 0, arr: 0, burnRate: 50, runway: 'Self-funded', totalRevenue: 0, totalExpenses: 50,
      stripeConnected: false,
      monthlyExpenses: [
        { category: 'Infrastructure', amount: 25, service: 'Supabase', recurring: true },
        { category: 'Infrastructure', amount: 0, service: 'Vercel (Hobby)', recurring: true },
        { category: 'AI', amount: 20, service: 'Anthropic API', recurring: true },
      ],
    },
    legal: {
      entity: { type: 'N/A', state: 'N/A', status: 'not-formed', provider: 'Internal tool' },
      trademarks: [],
      compliance: [],
      insurance: [],
      documents: [],
    },
  },

  // ========================================================================
  // AUTOMOTIVE REPAIR OS — AI Shop Management
  // ========================================================================
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
      { label: 'MRR', current: '$0', target: '$50,000', status: 'pre-launch' },
      { label: 'Build', current: 'Research', target: 'MVP', status: 'pre-launch' },
      { label: 'Shops', current: '0', target: '50', status: 'pre-launch' },
      { label: 'TAM', current: '$5B+', target: 'Capture 0.1%', status: 'pre-launch' },
    ],
    domains: [
      { name: 'Research', progress: 10, phase: 'Active', blocker: 'Competitive analysis needed', nextMilestone: 'Full market research' },
      { name: 'Product', progress: 0, phase: 'Planned', blocker: 'No spec written', nextMilestone: 'Feature spec + wireframes' },
      { name: 'Engineering', progress: 0, phase: 'Planned', blocker: 'No repo', nextMilestone: 'Repository scaffolded' },
      { name: 'Design', progress: 0, phase: 'Planned', blocker: 'No wireframes', nextMilestone: 'Design system defined' },
      { name: 'AI', progress: 5, phase: 'Planned', blocker: 'No AI spec', nextMilestone: 'AI repair estimation concept' },
    ],
    blockers: [
      { id: 1, description: 'Market research not complete', blocking: 'Everything', owner: 'Claude Code', cleared: false },
      { id: 2, description: 'No product specification', blocking: 'Engineering, Design', owner: 'Mike', cleared: false },
      { id: 3, description: 'No industry connections yet', blocking: 'Customer validation', owner: 'Mike', cleared: false },
    ],
    weeklyFocus: [
      'Complete competitive landscape analysis',
      'Define core feature set (DVI, estimation, scheduling)',
      'Identify 5 shop owners for customer interviews',
      'Draft product requirements document',
    ],
    departments: [
      {
        name: 'Product', status: 'not-started', progress: 0, owner: 'Mika Tanaka',
        keyMetrics: [{ label: 'Spec', value: 'Not written' }],
        systems: [
          { name: 'Product Requirements Document', status: 'missing', priority: 'critical' },
          { name: 'Wireframes', status: 'missing', priority: 'critical' },
          { name: 'Customer Interview Findings', status: 'missing', priority: 'critical' },
        ],
        nextActions: ['Write PRD', 'Interview 5 shop owners', 'Create wireframes'],
      },
      {
        name: 'Engineering', status: 'not-started', progress: 0, owner: 'Tomas Eriksson',
        keyMetrics: [{ label: 'Stack', value: 'TBD (likely React/Supabase)' }],
        systems: [
          { name: 'Repository', status: 'missing', priority: 'critical' },
          { name: 'Tech Stack Decision', status: 'missing', priority: 'critical' },
          { name: 'Database Schema', status: 'missing', priority: 'critical' },
        ],
        nextActions: ['Choose tech stack', 'Create repository', 'Design database schema'],
      },
      {
        name: 'Research', status: 'in-progress', progress: 10, owner: 'Dr. Ezra Goldstein',
        keyMetrics: [{ label: 'Competitors', value: '10+ identified', trend: 'up' }],
        systems: [
          { name: 'Competitive Analysis', status: 'building', priority: 'critical' },
          { name: 'Market Sizing (TAM/SAM/SOM)', status: 'building', priority: 'critical' },
          { name: 'Industry Expert Interviews', status: 'planned', priority: 'important' },
        ],
        nextActions: ['Complete competitive teardowns', 'Size the market', 'Find industry contacts'],
      },
      {
        name: 'AI / ML', status: 'not-started', progress: 5, owner: 'Dr. Yuki Sato',
        keyMetrics: [{ label: 'AI Repair Estimation', value: 'Concept only' }],
        systems: [
          { name: 'AI Repair Estimation Model', status: 'planned', priority: 'critical' },
          { name: 'Digital Vehicle Inspection (DVI)', status: 'planned', priority: 'critical' },
          { name: 'Parts Database Integration', status: 'planned', priority: 'important' },
          { name: 'Diagnostic Reasoning Engine', status: 'planned', priority: 'important' },
        ],
        nextActions: ['Research repair estimation approaches', 'Design DVI workflow', 'Identify parts data sources'],
      },
      {
        name: 'Sales & Revenue', status: 'not-started', progress: 0, owner: 'Kenji Watanabe',
        keyMetrics: [{ label: 'Pricing', value: 'Not determined' }],
        systems: [
          { name: 'Pricing Model (per-shop)', status: 'planned', priority: 'critical' },
          { name: 'Sales Pipeline', status: 'missing', priority: 'important' },
        ],
        nextActions: ['Research competitor pricing', 'Design pricing tiers', 'Build sales deck'],
      },
      {
        name: 'Legal & Compliance', status: 'not-started', progress: 0, owner: 'Helen Park',
        keyMetrics: [{ label: 'Entity', value: 'Not formed' }],
        systems: [
          { name: 'LLC Formation', status: 'missing', priority: 'important' },
          { name: 'Auto Repair Industry Regulations', status: 'missing', priority: 'important' },
          { name: 'Data Handling (customer vehicle data)', status: 'missing', priority: 'important' },
        ],
        nextActions: ['Research industry regulations', 'Plan entity structure'],
      },
    ],
    competitors: [
      { name: 'Tekmetric', website: 'tekmetric.com', pricing: '$199-$449/mo per shop', users: '10,000+ shops', rating: '4.7 (G2)', strengths: ['Modern cloud-native', 'Great DVI', 'Clean UI', 'Strong integrations', 'Fast growing'], weaknesses: ['No AI estimation', 'Limited analytics', 'US-only', 'Can be slow'], threat: 'high', differentiator: 'Best modern SMS — our AI estimation is the differentiator' },
      { name: 'Shop-Ware', website: 'shop-ware.com', pricing: '$200-$500/mo', users: '5,000+ shops', rating: '4.5 (G2)', strengths: ['Workflow automation', 'Customer communication', 'Parts integration'], weaknesses: ['Complex setup', 'Expensive', 'No AI', 'Steep learning curve'], threat: 'medium', differentiator: 'Powerful but complex — we make it simple with AI' },
      { name: 'Mitchell 1', website: 'mitchell1.com', pricing: '$150-$350/mo', users: '50,000+ shops', rating: '4.0', strengths: ['Massive repair database', 'ProDemand info', 'Industry standard', 'Established brand'], weaknesses: ['Legacy software', 'Dated UX', 'Slow innovation', 'No AI'], threat: 'medium', differentiator: 'Legacy incumbent — ripe for disruption with AI-native approach' },
      { name: 'Shopmonkey', website: 'shopmonkey.io', pricing: '$99-$349/mo', users: '3,000+ shops', rating: '4.6 (G2)', strengths: ['Modern UX', 'Easy onboarding', 'Good mobile app', 'Affordable'], weaknesses: ['Smaller shop focus', 'Limited enterprise', 'No AI', 'Growing feature set'], threat: 'medium', differentiator: 'Good UX but no AI — we add the intelligence layer' },
      { name: 'AutoFluent', website: 'autofluent.com', pricing: '$99-$299/mo', users: '2,000+ shops', rating: '4.3', strengths: ['Affordable', 'Parts integration', 'Simple'], weaknesses: ['Basic features', 'Dated UI', 'No AI', 'Limited growth'], threat: 'low', differentiator: 'Budget option — different market segment' },
      { name: 'Steer (AutoVitals)', website: 'steer.com', pricing: '$199-$499/mo', users: '4,000+ shops', rating: '4.4', strengths: ['DVI pioneer', 'Customer retention', 'Good analytics'], weaknesses: ['Expensive', 'Not full SMS', 'Needs other tools', 'Niche'], threat: 'low', differentiator: 'DVI-focused — we build a complete platform' },
    ],
    roadmap: [
      {
        phase: 'idea', label: 'Research & Validation', status: 'current', targetDate: '2026-05-01',
        milestones: [
          { task: 'Complete competitive analysis', department: 'Research', status: 'in-progress' },
          { task: 'Interview 5 shop owners', department: 'Product', status: 'todo' },
          { task: 'Market sizing (TAM/SAM/SOM)', department: 'Research', status: 'in-progress' },
          { task: 'Define core feature set', department: 'Product', status: 'todo' },
          { task: 'Pricing strategy', department: 'Sales & Revenue', status: 'todo' },
        ],
      },
      {
        phase: 'mvp', label: 'MVP Build', status: 'upcoming', targetDate: '2026-08-01',
        milestones: [
          { task: 'Repository scaffold', department: 'Engineering', status: 'todo' },
          { task: 'Core SMS features (ROs, scheduling)', department: 'Product', status: 'todo' },
          { task: 'AI repair estimation v1', department: 'AI / ML', status: 'todo' },
          { task: 'Digital vehicle inspection', department: 'Product', status: 'todo' },
          { task: 'Design system', department: 'Design', status: 'todo' },
        ],
      },
      {
        phase: 'launch', label: 'Pilot (5 Shops)', status: 'future', targetDate: '2026-Q4',
        milestones: [
          { task: 'Recruit 5 pilot shops', department: 'Sales & Revenue', status: 'todo' },
          { task: 'On-site installation support', department: 'Customer Success', status: 'todo' },
          { task: 'Parts supplier integrations', department: 'Engineering', status: 'todo' },
        ],
      },
      {
        phase: 'growth', label: 'Growth (50 Shops)', status: 'future',
        milestones: [
          { task: 'Sales team hiring', department: 'Sales & Revenue', status: 'todo' },
          { task: 'AI diagnostic reasoning v1', department: 'AI / ML', status: 'todo' },
          { task: 'Multi-location support', department: 'Product', status: 'todo' },
        ],
      },
      {
        phase: 'scale', label: 'Scale (500+ Shops)', status: 'future',
        milestones: [
          { task: 'Enterprise tier', department: 'Sales & Revenue', status: 'todo' },
          { task: 'Connected car data integration', department: 'Engineering', status: 'todo' },
          { task: 'EV repair module', department: 'Product', status: 'todo' },
        ],
      },
      {
        phase: 'ten-million', label: '$10M ARR', status: 'future',
        milestones: [
          { task: 'National sales coverage', department: 'Sales & Revenue', status: 'todo' },
          { task: 'AI-powered parts marketplace', department: 'Product', status: 'todo' },
          { task: 'Industry data platform play', department: 'Product', status: 'todo' },
        ],
      },
    ],
    financials: {
      mrr: 0, arr: 0, burnRate: 0, runway: 'Pre-investment', totalRevenue: 0, totalExpenses: 0,
      stripeConnected: false,
      monthlyExpenses: [],
    },
    legal: {
      entity: { type: 'TBD', state: 'TBD', status: 'not-formed', provider: 'LegalZoom' },
      trademarks: [{ name: 'Automotive Repair OS', status: 'search-needed' }],
      compliance: [
        { requirement: 'Auto repair industry regulations', category: 'Industry', status: 'not-started', priority: 'critical' },
        { requirement: 'Customer vehicle data handling', category: 'Privacy', status: 'not-started', priority: 'critical' },
        { requirement: 'State licensing requirements', category: 'Legal', status: 'not-started', priority: 'important' },
      ],
      insurance: [{ type: 'General Liability', status: 'needed' }, { type: 'Professional Liability', status: 'needed' }],
      documents: [],
    },
  },
]

// === Intelligence Items (unchanged) ===
export const intelligenceItems: IntelligenceItem[] = [
  { id: 'growth_hacker', name: 'Growth Hacker', type: 'persona', description: 'Distribution-first growth; viral loops, referral, PLG', tags: ['ALL'], tier: 1, category: 'Marketing & Growth', filePath: 'intelligence/personas/growth_hacker_persona.md' },
  { id: 'content_strategist', name: 'Content Strategist', type: 'persona', description: 'Long-form to short-form repurposing; Content Triplets; editorial calendars', tags: ['ALL'], tier: 1, category: 'Marketing & Growth', filePath: 'intelligence/personas/content_strategist_persona.md' },
  { id: 'social_media', name: 'Social Media', type: 'persona', description: 'Platform-native content creation; algorithm mechanics; engagement optimization', tags: ['INSTAGRAM', 'FITNESS'], tier: 2, category: 'Marketing & Growth', filePath: 'intelligence/personas/social_media_persona.md' },
  { id: 'seo_expert', name: 'SEO Expert', type: 'persona', description: 'Technical SEO, AI SEO, topical authority', tags: ['ALL'], tier: 2, category: 'Marketing & Growth', filePath: 'intelligence/personas/seo_expert_persona.md' },
  { id: 'paid_ads', name: 'Paid Ads', type: 'persona', description: 'Meta Ads, Google Ads, TikTok Ads; ROAS optimization', tags: ['FITNESS', 'INSTAGRAM'], tier: 3, category: 'Marketing & Growth', filePath: 'intelligence/personas/paid_ads_persona.md' },
  { id: 'brand_strategist', name: 'Brand Strategist', type: 'persona', description: 'Brand positioning, naming, identity systems, voice architecture', tags: ['ALL'], tier: 3, category: 'Marketing & Growth', filePath: 'intelligence/personas/brand_strategist_persona.md' },
  { id: 'email_marketing', name: 'Email Marketing', type: 'persona', description: 'Lifecycle email flows, deliverability, segmentation', tags: ['ALL'], tier: 3, category: 'Marketing & Growth', filePath: 'intelligence/personas/email_marketing_persona.md' },
  { id: 'community_builder', name: 'Community Builder', type: 'persona', description: 'Skool/Discord community growth; moderation; member activation', tags: ['FITNESS', 'INSTAGRAM'], tier: 2, category: 'Marketing & Growth', filePath: 'intelligence/personas/community_builder_persona.md' },
  { id: 'instagram_growth', name: 'Instagram Growth', type: 'persona', description: 'Reels-first growth, hashtag strategy, collaboration tactics', tags: ['INSTAGRAM', 'FITNESS'], tier: 1, category: 'Marketing & Growth', filePath: 'intelligence/personas/instagram_growth_persona.md' },
  { id: 'product_strategist', name: 'Product Strategist', type: 'persona', description: 'JTBD, PMF measurement, roadmap prioritization', tags: ['ALL'], tier: 1, category: 'Product & Design', filePath: 'intelligence/personas/product_strategist_persona.md' },
  { id: 'ux_expert', name: 'UX Expert', type: 'persona', description: 'Generative UI, steering paradigm, latency-sensitive design', tags: ['ALL'], tier: 2, category: 'Product & Design', filePath: 'intelligence/personas/ux_expert_persona.md' },
  { id: 'ux_design_director', name: 'Ted (Design Director)', type: 'persona', description: 'STYLE framework, Style Spectrum, pattern-first design consultation', tags: ['ALL'], tier: 2, category: 'Product & Design', filePath: 'intelligence/personas/ux_design_director_persona.md' },
  { id: 'mobile_ux', name: 'Mobile UX', type: 'persona', description: 'iOS/Android-native patterns, gesture design, accessibility', tags: ['FITNESS', 'INSTAGRAM'], tier: 3, category: 'Product & Design', filePath: 'intelligence/personas/mobile_ux_persona.md' },
  { id: 'gamification', name: 'Gamification', type: 'persona', description: 'Behavioral loops, streak mechanics, XP systems, leaderboards', tags: ['FITNESS', 'INSTAGRAM'], tier: 3, category: 'Product & Design', filePath: 'intelligence/personas/gamification_persona.md' },
  { id: 'startup_ceo', name: 'Startup CEO', type: 'persona', description: 'Solo founder playbook; capital-efficient growth; decision frameworks', tags: ['ALL'], tier: 1, category: 'Business & Strategy', filePath: 'intelligence/personas/startup_ceo_persona.md' },
  { id: 'saas_pricing', name: 'SaaS Pricing', type: 'persona', description: 'Value-based pricing, tier design, willingness-to-pay research', tags: ['ALL'], tier: 1, category: 'Business & Strategy', filePath: 'intelligence/personas/saas_pricing_persona.md' },
  { id: 'startup_lawyer', name: 'Startup Lawyer', type: 'persona', description: 'Entity formation, IP protection, terms/privacy, contractor agreements', tags: ['ALL'], tier: 2, category: 'Business & Strategy', filePath: 'intelligence/personas/startup_lawyer_persona.md' },
  { id: 'finance_analyst', name: 'Finance Analyst', type: 'persona', description: 'Financial modeling, burn rate, runway calculation, unit economics', tags: ['ALL'], tier: 2, category: 'Business & Strategy', filePath: 'intelligence/personas/finance_analyst_persona.md' },
  { id: 'venture_pitch', name: 'Venture Pitch', type: 'persona', description: 'Pitch deck structure, investor psychology, fundraising strategy', tags: ['ALL'], tier: 3, category: 'Business & Strategy', filePath: 'intelligence/personas/venture_pitch_persona.md' },
  { id: 'ai_architect', name: 'AI Architect', type: 'persona', description: 'LLM orchestration, agent design, RAG, model routing, cost optimization', tags: ['ALL'], tier: 1, category: 'AI & Engineering', filePath: 'intelligence/personas/ai_architect_persona.md' },
  { id: 'prompt_engineer', name: 'Prompt Engineer', type: 'persona', description: 'System prompts, few-shot examples, chain-of-thought, structured output', tags: ['ALL'], tier: 1, category: 'AI & Engineering', filePath: 'intelligence/personas/prompt_engineer_persona.md' },
  { id: 'agentic_systems', name: 'Agentic Systems', type: 'persona', description: 'Multi-agent orchestration, CrewAI, LangGraph, tool use', tags: ['ALL'], tier: 2, category: 'AI & Engineering', filePath: 'intelligence/personas/agentic_systems_persona.md' },
  { id: 'algorithm_research_director', name: 'Algorithm Research Director', type: 'persona', description: 'R&D team lead; research methodology, specialist recruitment, algorithm specification', tags: ['ALL'], tier: 1, category: 'AI & Engineering', filePath: 'intelligence/personas/algorithm_research_director_persona.md' },
  { id: 'operations', name: 'Operations', type: 'persona', description: 'SOPs, automation, process design, monitoring, team handbooks', tags: ['ALL'], tier: 2, category: 'Operations', filePath: 'intelligence/personas/operations_persona.md' },
  { id: 'tf_elite_council', name: 'TF Elite Council', type: 'persona', description: '7-member advisory board for TransformFit business decisions', tags: ['FITNESS'], tier: 1, category: 'TransformFit', filePath: 'intelligence/personas/tf_elite_council_persona.md' },
  { id: 'tf_dai_architect', name: 'TF DAI Architect', type: 'persona', description: 'DecisionAI pipeline architect; LangGraph, 8-node state machine', tags: ['FITNESS'], tier: 1, category: 'TransformFit', filePath: 'intelligence/personas/tf_dai_architect_persona.md' },
  { id: 'tf_revenue_operator', name: 'TF Revenue Operator', type: 'persona', description: 'TransformFit pricing, conversion funnels, LTV optimization', tags: ['FITNESS'], tier: 2, category: 'TransformFit', filePath: 'intelligence/personas/tf_revenue_operator_persona.md' },
  { id: 'va_elite_council', name: 'VA Elite Council', type: 'persona', description: '7-member advisory board for Viral Architect Hub business decisions', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'intelligence/personas/va_elite_council_persona.md' },
  { id: 'va_growth_architect', name: 'VA Growth Architect', type: 'persona', description: 'K-factor optimization, referral engine, content virality formula', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'intelligence/personas/va_growth_architect_persona.md' },
  { id: 'va_content_algorithm', name: 'VA Content Algorithm', type: 'persona', description: 'Virality engineering, STEPPS scoring, data pruner roadmap', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'intelligence/personas/va_content_algorithm_persona.md' },
  { id: 'tf_launch_playbook', name: 'TF Launch Playbook', type: 'framework', description: '9-domain business buildout with sequencing rules and phase gates', tags: ['FITNESS'], tier: 1, category: 'TransformFit', filePath: 'intelligence/frameworks/tf_launch_playbook_framework.md' },
  { id: 'tf_automation_blueprint', name: 'TF Automation Blueprint', type: 'framework', description: 'n8n workflows, MCP configs, automation triggers', tags: ['FITNESS'], tier: 2, category: 'TransformFit', filePath: 'intelligence/frameworks/tf_automation_blueprint_framework.md' },
  { id: 'va_launch_playbook', name: 'VA Launch Playbook', type: 'framework', description: '9-domain business buildout for Viral Architect Hub', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'intelligence/frameworks/va_launch_playbook_framework.md' },
  { id: 'va_content_engine', name: 'VA Content Engine', type: 'framework', description: '4-crew architecture, cost model, swarm protocol', tags: ['INSTAGRAM'], tier: 1, category: 'Viral Architect', filePath: 'intelligence/frameworks/va_content_engine_framework.md' },
  { id: 'proprietary_algorithm_rd', name: 'Proprietary Algorithm R&D', type: 'framework', description: '9 specialist roles, 6-phase integration pipeline, priority sequencing', tags: ['ALL'], tier: 1, category: 'R&D', filePath: 'intelligence/frameworks/proprietary_algorithm_rd_framework.md' },
  { id: 'fitness_subscription', name: 'Fitness Subscription', type: 'framework', description: 'Subscription model design for fitness apps', tags: ['FITNESS'], tier: 2, category: 'Revenue', filePath: 'intelligence/frameworks/fitness_subscription_framework.md' },
  { id: 'mcp_integration', name: 'MCP Integration', type: 'framework', description: 'Model Context Protocol server configuration and tool architecture', tags: ['ALL'], tier: 2, category: 'AI & Engineering', filePath: 'intelligence/frameworks/mcp_integration_framework.md' },
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

// === Helper Functions ===
export function getPortfolioSummary() {
  const totalMRR = businesses.reduce((sum, b) => sum + b.financials.mrr, 0)
  const totalBurn = businesses.reduce((sum, b) => sum + b.financials.burnRate, 0)
  const totalBlockers = businesses.reduce((sum, b) => sum + b.blockers.filter(bl => !bl.cleared).length, 0)
  const avgProgress = Math.round(businesses.reduce((sum, b) => sum + b.overallProgress, 0) / businesses.length)

  return { totalMRR, totalBurn, totalBlockers, avgProgress, businessCount: businesses.length }
}

export function getMissingSystems(businessSlug: string): { department: string; system: string; priority: string }[] {
  const biz = getBusinessBySlug(businessSlug)
  if (!biz) return []

  const missing: { department: string; system: string; priority: string }[] = []
  for (const dept of biz.departments) {
    for (const sys of dept.systems) {
      if (sys.status === 'missing') {
        missing.push({ department: dept.name, system: sys.name, priority: sys.priority })
      }
    }
  }
  return missing.sort((a, b) => {
    const order = { critical: 0, important: 1, 'nice-to-have': 2 }
    return (order[a.priority as keyof typeof order] ?? 2) - (order[b.priority as keyof typeof order] ?? 2)
  })
}

export function getRoadmapProgress(businessSlug: string): { phase: string; done: number; total: number }[] {
  const biz = getBusinessBySlug(businessSlug)
  if (!biz) return []

  return biz.roadmap.map(phase => ({
    phase: phase.label,
    done: phase.milestones.filter(m => m.status === 'done').length,
    total: phase.milestones.length,
  }))
}

// Business stage mapping
export function getBusinessStage(slug: string): BusinessStage {
  const business = getBusinessBySlug(slug)
  if (!business) return 'idea'
  if (business.overallProgress >= 80) return 'growth'
  if (business.overallProgress >= 60) return 'launch'
  if (business.overallProgress >= 20) return 'mvp'
  if (business.overallProgress >= 5) return 'idea'
  return 'idea'
}

export function getStageLabel(stage: BusinessStage): string {
  const labels: Record<BusinessStage, string> = {
    idea: 'IDEA',
    mvp: 'MVP',
    launch: 'LAUNCH',
    growth: 'GROWTH',
    scale: 'SCALE'
  }
  return labels[stage]
}

export function getStageColor(stage: BusinessStage): string {
  const colors: Record<BusinessStage, string> = {
    idea: 'bg-gray-500 text-white',
    mvp: 'bg-blue-600 text-white',
    launch: 'bg-amber-500 text-white',
    growth: 'bg-emerald-600 text-white',
    scale: 'bg-purple-600 text-white'
  }
  return colors[stage]
}

// Generate default morning briefing from static data
export function generateDefaultBriefing(): MorningBriefing {
  const priorities: BriefingPriority[] = [
    {
      business_id: 'viral-architect',
      business_name: 'Viral Architect Hub',
      task: 'Submit Meta App Review for Instagram API access',
      urgency: 'critical',
      reasoning: 'Meta review takes 2-4 weeks. This is the longest lead-time blocker on the entire roadmap. Every day of delay pushes launch by a day. Submit today.',
      estimated_hours: 1
    },
    {
      business_id: 'transformfit',
      business_name: 'TransformFit',
      task: 'Configure Stripe test mode and run first end-to-end payment test',
      urgency: 'critical',
      reasoning: 'Stripe code is written but not configured. No test payments have been run. This is the single step between code-complete and revenue-ready.',
      estimated_hours: 3
    },
    {
      business_id: 'transformfit',
      business_name: 'TransformFit',
      task: 'Deploy Railway backend',
      urgency: 'high',
      reasoning: 'Backend is code-complete with 1,514 tests and 57 edge functions deployed — Railway deployment is the last infra step before launch.',
      estimated_hours: 2
    },
    {
      business_id: 'viral-architect',
      business_name: 'Viral Architect Hub',
      task: 'Deploy Railway backend and link Vercel frontend',
      urgency: 'high',
      reasoning: 'Backend is code-complete with 486 tests and 72 edge functions built. Deploying Railway unblocks the full AI content pipeline.',
      estimated_hours: 2
    },
    {
      business_id: 'transformfit',
      business_name: 'TransformFit',
      task: 'Form LLC via LegalZoom',
      urgency: 'high',
      reasoning: 'LLC is required to open a business bank account, configure Stripe properly, and submit to the App Store. Blocking multiple workstreams.',
      estimated_hours: 1
    },
    {
      business_id: 'viral-architect',
      business_name: 'Viral Architect Hub',
      task: 'Configure Stripe and build subscription billing flow',
      urgency: 'medium',
      reasoning: 'Once Meta App Review is submitted and Railway is deployed, Stripe is the final revenue blocker for Viral Architect.',
      estimated_hours: 3
    }
  ]

  return {
    id: 'default-briefing',
    briefing_date: new Date().toISOString().split('T')[0],
    priorities,
    portfolio_summary: {
      total_mrr: 0,
      total_burn: 450,
      total_businesses: 4,
      top_risk: 'Both lead products are code-complete but pre-revenue — Meta App Review and Stripe config are the critical path items',
      overall_health: 75
    },
    created_at: new Date().toISOString()
  }
}
