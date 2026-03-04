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
  emoji: string
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
