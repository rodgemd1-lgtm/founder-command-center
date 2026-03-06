export type ProductTag = 'ALL' | 'FITNESS' | 'INSTAGRAM' | 'INTELLIGENCE' | 'AUTOMOTIVE'
export type IntelligenceType = 'persona' | 'framework' | 'skill'
export type BusinessStatus = 'active' | 'pre-launch' | 'blocked' | 'deferred'

export interface Business {
  id: string
  name: string
  slug: string
  tagline: string
  tag: ProductTag
  repo: string
  status: BusinessStatus
  overallProgress: number
  metrics: BusinessMetric[]
  domains: BusinessDomain[]
  blockers: Blocker[]
  weeklyFocus: string[]
  departments: Department[]
  competitors: Competitor[]
  roadmap: RoadmapPhase[]
  financials: BusinessFinancials
  legal: LegalStatus
}

export interface BusinessMetric {
  label: string
  current: string
  target: string
  status: 'on-track' | 'at-risk' | 'blocked' | 'pre-launch'
}

export interface BusinessDomain {
  name: string
  progress: number
  phase: string
  blocker: string
  nextMilestone: string
}

export interface Blocker {
  id: number
  description: string
  blocking: string
  owner: string
  cleared: boolean
}

// === Department Tracking ===
export interface Department {
  name: string
  status: 'not-started' | 'in-progress' | 'operational' | 'optimizing'
  progress: number
  owner: string // agent name
  keyMetrics: DepartmentMetric[]
  systems: SystemItem[]
  nextActions: string[]
}

export interface DepartmentMetric {
  label: string
  value: string
  trend?: 'up' | 'down' | 'flat'
}

export interface SystemItem {
  name: string
  status: 'missing' | 'planned' | 'building' | 'live' | 'optimizing'
  priority: 'critical' | 'important' | 'nice-to-have'
  notes?: string
}

// === Competitive Intelligence ===
export interface Competitor {
  name: string
  website: string
  pricing: string
  users: string
  rating: string
  strengths: string[]
  weaknesses: string[]
  threat: 'high' | 'medium' | 'low'
  differentiator: string
}

// === Roadmap ===
export type RoadmapPhaseType = 'idea' | 'mvp' | 'launch' | 'growth' | 'scale' | 'ten-million'
export interface RoadmapPhase {
  phase: RoadmapPhaseType
  label: string
  status: 'completed' | 'current' | 'upcoming' | 'future'
  targetDate?: string
  milestones: RoadmapMilestone[]
}

export interface RoadmapMilestone {
  task: string
  department: string
  status: 'done' | 'in-progress' | 'todo' | 'blocked'
  notes?: string
}

// === Financials ===
export interface BusinessFinancials {
  mrr: number
  arr: number
  burnRate: number
  runway: string
  totalRevenue: number
  totalExpenses: number
  bankAccount?: string
  stripeConnected: boolean
  monthlyExpenses: ExpenseItem[]
}

export interface ExpenseItem {
  category: string
  amount: number
  service: string
  recurring: boolean
}

// === Legal & Compliance ===
export interface LegalStatus {
  entity: EntityInfo
  trademarks: TrademarkItem[]
  compliance: ComplianceItem[]
  insurance: InsuranceItem[]
  documents: LegalDocument[]
}

export interface EntityInfo {
  type: string // LLC, C-Corp, etc.
  state: string
  ein?: string
  status: 'active' | 'pending' | 'not-formed'
  provider: string // LegalZoom, etc.
}

export interface TrademarkItem {
  name: string
  status: 'registered' | 'pending' | 'not-filed' | 'search-needed'
  serialNumber?: string
  filingDate?: string
}

export interface ComplianceItem {
  requirement: string
  category: string // GDPR, CCPA, HIPAA, etc.
  status: 'compliant' | 'in-progress' | 'not-started' | 'not-applicable'
  priority: 'critical' | 'important' | 'nice-to-have'
  deadline?: string
}

export interface InsuranceItem {
  type: string
  status: 'active' | 'needed' | 'not-needed'
  provider?: string
  cost?: string
}

export interface LegalDocument {
  name: string
  status: 'current' | 'needs-update' | 'missing' | 'draft'
  lastUpdated?: string
}

export interface IntelligenceItem {
  id: string
  name: string
  type: IntelligenceType
  description: string
  tags: ProductTag[]
  tier: number
  category: string
  filePath: string
}

export interface CouncilAgent {
  id: string
  name: string
  role: string
  expertise: string
  style: string
  color: string
}

export interface VaultEntry {
  id: string
  label: string
  category: string
  value: string
  service: string
  updatedAt: string
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  businessId?: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  agentId?: string
  timestamp: string
}

// Domain Expert (replaces CouncilAgent for the new Expert system)
export interface DomainExpert {
  id: string
  name: string
  role: string
  expertise: string[]
  style: string
  color: string
  businesses: string[] // business slugs this expert is assigned to
  personaFile?: string // path to persona MD in intelligence-os
}

// Decision Log
export interface Decision {
  id: string
  user_id?: string
  business_id: string
  title: string
  description: string
  category: 'strategy' | 'product' | 'marketing' | 'technical' | 'financial' | 'hiring' | 'legal'
  outcome?: string
  outcome_rating?: number
  what_worked?: string
  what_didnt?: string
  lessons_learned?: string
  tags: string[]
  status: 'active' | 'resolved' | 'reversed'
  created_at: string
  updated_at: string
}

// Research Entry
export interface ResearchEntry {
  id: string
  business_id?: string
  source_url?: string
  source_type: 'youtube' | 'reddit' | 'web' | 'paper' | 'manual'
  title: string
  summary: string
  key_insights: string[]
  tags: string[]
  ingested_at: string
}

// Morning Briefing
export interface MorningBriefing {
  id: string
  briefing_date: string
  priorities: BriefingPriority[]
  portfolio_summary: PortfolioSummary
  research_highlights?: ResearchHighlight[]
  monte_carlo_snapshot?: MonteCarloSnapshot[]
  created_at: string
}

export interface BriefingPriority {
  business_id: string
  business_name: string
  task: string
  urgency: 'critical' | 'high' | 'medium' | 'low'
  reasoning: string
  estimated_hours?: number
}

export interface PortfolioSummary {
  total_mrr: number
  total_burn: number
  total_businesses: number
  top_risk: string
  overall_health: number
}

export interface ResearchHighlight {
  title: string
  source: string
  insight: string
  business_id?: string
}

export interface MonteCarloSnapshot {
  business_id: string
  p_success_5yr: number
  p_success_2yr: number
  p_failure: number
  median_time_to_milestone: number
  ci_low: number
  ci_high: number
  top_risks: string[]
}

// Monte Carlo types
export interface MonteCarloResult {
  business_id: string
  simulations: number
  p_10m_5yr: number
  p_1m_2yr: number
  p_failure: number
  median_months_to_1m: number
  ci_95_low: number
  ci_95_high: number
  revenue_percentiles: RevenuePercentile[]
  top_risks: RiskFactor[]
}

export interface RevenuePercentile {
  month: number
  p5: number
  p25: number
  p50: number
  p75: number
  p95: number
}

export interface RiskFactor {
  factor: string
  impact: 'high' | 'medium' | 'low'
  probability: number
  description: string
}

// Business Health Score
export interface HealthScore {
  overall: number
  revenue_growth: number
  unit_economics: number
  retention: number
  runway: number
  engagement: number
  milestones: number
}

// Business Stage
export type BusinessStage = 'idea' | 'mvp' | 'launch' | 'growth' | 'scale'

// Daily Action
export interface DailyAction {
  id: string
  business_id: string
  briefing_id?: string
  task: string
  status: 'pending' | 'in_progress' | 'completed' | 'skipped'
  outcome?: string
  started_at?: string
  completed_at?: string
  created_at: string
}
