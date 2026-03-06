import type { MonteCarloResult, RevenuePercentile, RiskFactor } from '@/types'

interface BusinessInputs {
  business_id: string
  stage: 'idea' | 'mvp' | 'launch' | 'growth' | 'scale'
  current_mrr: number
  monthly_growth_rate: number // e.g. 0.15 for 15%
  churn_rate: number // monthly, e.g. 0.05 for 5%
  burn_rate: number // monthly
  tam: number // total addressable market ARR
  runway_months: number // Infinity if self-funded
  progress: number // 0-100
}

// Box-Muller transform for normal distribution
function normalRandom(mean: number, stdDev: number): number {
  const u1 = Math.random()
  const u2 = Math.random()
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
  return z0 * stdDev + mean
}

// Log-normal random
function logNormalRandom(mu: number, sigma: number): number {
  return Math.exp(normalRandom(mu, sigma))
}

// Beta distribution approximation using normal
function betaRandom(alpha: number, beta: number): number {
  const mean = alpha / (alpha + beta)
  const variance = (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1))
  const result = normalRandom(mean, Math.sqrt(variance))
  return Math.max(0, Math.min(1, result))
}

// Stage-dependent growth parameters
function getStageParams(stage: string) {
  switch (stage) {
    case 'idea': return { growthMean: 0.05, growthStd: 0.08, failProb: 0.3, stageVelocity: 0.3 }
    case 'mvp': return { growthMean: 0.12, growthStd: 0.10, failProb: 0.2, stageVelocity: 0.5 }
    case 'launch': return { growthMean: 0.20, growthStd: 0.12, failProb: 0.15, stageVelocity: 0.7 }
    case 'growth': return { growthMean: 0.15, growthStd: 0.08, failProb: 0.08, stageVelocity: 0.85 }
    case 'scale': return { growthMean: 0.08, growthStd: 0.05, failProb: 0.03, stageVelocity: 0.95 }
    default: return { growthMean: 0.10, growthStd: 0.10, failProb: 0.2, stageVelocity: 0.5 }
  }
}

function simulateOnePath(inputs: BusinessInputs, months: number): number[] {
  const params = getStageParams(inputs.stage)
  const revenue: number[] = []
  let mrr = inputs.current_mrr || 1 // Start at $1 if zero to allow growth modeling
  let cash = inputs.burn_rate * Math.max(inputs.runway_months, 24)
  let failed = false

  for (let m = 0; m < months; m++) {
    if (failed) {
      revenue.push(0)
      continue
    }

    // Monthly growth with noise (log-normal)
    const growthRate = logNormalRandom(
      Math.log(1 + params.growthMean + inputs.monthly_growth_rate),
      params.growthStd
    ) - 1

    // Churn with noise (beta distribution)
    const churn = betaRandom(
      inputs.churn_rate * 20 + 1,
      (1 - inputs.churn_rate) * 20 + 1
    )

    // Apply growth and churn
    mrr = mrr * (1 + growthRate) * (1 - churn)

    // Cap at TAM fraction
    const maxCapture = inputs.tam / 12 * 0.05 // Max 5% of TAM
    mrr = Math.min(mrr, maxCapture)

    // Cash flow
    cash = cash + mrr - inputs.burn_rate

    // Failure check
    if (cash <= 0 && inputs.runway_months < Infinity) {
      failed = true
      mrr = 0
    }

    // Random catastrophic failure (product-market fit miss, etc.)
    if (Math.random() < params.failProb / 12) {
      failed = true
      mrr = 0
    }

    revenue.push(Math.max(0, mrr))
  }

  return revenue
}

export function runMonteCarloSimulation(inputs: BusinessInputs, numSimulations = 10000): MonteCarloResult {
  const months = 60 // 5 years
  const allPaths: number[][] = []

  for (let i = 0; i < numSimulations; i++) {
    allPaths.push(simulateOnePath(inputs, months))
  }

  // Calculate percentiles at each month
  const percentiles: RevenuePercentile[] = []
  for (let m = 0; m < months; m++) {
    const monthValues = allPaths.map(p => p[m]).sort((a, b) => a - b)
    percentiles.push({
      month: m + 1,
      p5: monthValues[Math.floor(numSimulations * 0.05)],
      p25: monthValues[Math.floor(numSimulations * 0.25)],
      p50: monthValues[Math.floor(numSimulations * 0.50)],
      p75: monthValues[Math.floor(numSimulations * 0.75)],
      p95: monthValues[Math.floor(numSimulations * 0.95)],
    })
  }

  // P(reaching $10M ARR in 5 years) -- $10M ARR = $833K MRR
  const finalMRRs = allPaths.map(p => p[months - 1])
  const p_10m_5yr = finalMRRs.filter(mrr => mrr * 12 >= 10_000_000).length / numSimulations

  // P(reaching $1M ARR in 2 years) -- $1M ARR = $83.3K MRR
  const month24MRRs = allPaths.map(p => p[23] || 0)
  const p_1m_2yr = month24MRRs.filter(mrr => mrr * 12 >= 1_000_000).length / numSimulations

  // P(failure) -- MRR = 0 at end
  const p_failure = finalMRRs.filter(mrr => mrr === 0).length / numSimulations

  // Median months to $1M ARR
  const monthsTo1M = allPaths.map(p => {
    const idx = p.findIndex(mrr => mrr * 12 >= 1_000_000)
    return idx === -1 ? Infinity : idx + 1
  }).filter(m => m < Infinity).sort((a, b) => a - b)
  const median_months_to_1m = monthsTo1M.length > 0
    ? monthsTo1M[Math.floor(monthsTo1M.length / 2)]
    : Infinity

  // 95% CI of final ARR
  const sortedFinal = [...finalMRRs].sort((a, b) => a - b)
  const ci_95_low = sortedFinal[Math.floor(numSimulations * 0.025)] * 12
  const ci_95_high = sortedFinal[Math.floor(numSimulations * 0.975)] * 12

  // Risk factors
  const risks: RiskFactor[] = identifyRisks(inputs, p_failure, percentiles)

  return {
    business_id: inputs.business_id,
    simulations: numSimulations,
    p_10m_5yr: Math.round(p_10m_5yr * 1000) / 10,
    p_1m_2yr: Math.round(p_1m_2yr * 1000) / 10,
    p_failure: Math.round(p_failure * 1000) / 10,
    median_months_to_1m: Math.round(median_months_to_1m),
    ci_95_low: Math.round(ci_95_low),
    ci_95_high: Math.round(ci_95_high),
    revenue_percentiles: percentiles,
    top_risks: risks
  }
}

function identifyRisks(inputs: BusinessInputs, pFailure: number, _percentiles: RevenuePercentile[]): RiskFactor[] {
  const risks: RiskFactor[] = []

  if (inputs.churn_rate > 0.08) {
    risks.push({
      factor: 'High Churn Rate',
      impact: 'high',
      probability: 0.7,
      description: `Monthly churn of ${(inputs.churn_rate * 100).toFixed(1)}% will erode growth. Target < 5%.`
    })
  }

  if (inputs.current_mrr === 0) {
    risks.push({
      factor: 'Pre-Revenue',
      impact: 'high',
      probability: 0.9,
      description: 'No validated willingness to pay. Revenue assumptions are theoretical.'
    })
  }

  if (inputs.burn_rate > 0 && inputs.runway_months < 12) {
    risks.push({
      factor: 'Limited Runway',
      impact: 'high',
      probability: 0.6,
      description: `Only ${inputs.runway_months} months of runway. Need revenue or funding soon.`
    })
  }

  if (inputs.stage === 'idea' || inputs.stage === 'mvp') {
    risks.push({
      factor: 'Early Stage Risk',
      impact: 'medium',
      probability: 0.5,
      description: 'Most startups fail in early stages. Focus on finding product-market fit.'
    })
  }

  if (pFailure > 0.4) {
    risks.push({
      factor: 'High Failure Probability',
      impact: 'high',
      probability: pFailure,
      description: `${(pFailure * 100).toFixed(0)}% chance of failure in simulations. Derisk immediately.`
    })
  }

  if (inputs.monthly_growth_rate < 0.05) {
    risks.push({
      factor: 'Slow Growth Rate',
      impact: 'medium',
      probability: 0.6,
      description: 'Growth rate below 5%/month makes scaling difficult. Focus on acquisition channels.'
    })
  }

  return risks.slice(0, 3)
}

// Pre-configured inputs for each business
export function getBusinessInputs(businessSlug: string): BusinessInputs {
  switch (businessSlug) {
    case 'transformfit':
      return {
        business_id: 'transformfit',
        stage: 'mvp',
        current_mrr: 0,
        monthly_growth_rate: 0.15,
        churn_rate: 0.06,
        burn_rate: 200,
        tam: 30_000_000_000, // $30B fitness app market
        runway_months: Infinity, // self-funded
        progress: 52
      }
    case 'viral-architect':
      return {
        business_id: 'viral-architect',
        stage: 'mvp',
        current_mrr: 0,
        monthly_growth_rate: 0.12,
        churn_rate: 0.08,
        burn_rate: 150,
        tam: 5_000_000_000, // $5B social media tools
        runway_months: Infinity,
        progress: 48
      }
    case 'intelligence-engine':
      return {
        business_id: 'intelligence-engine',
        stage: 'mvp',
        current_mrr: 0,
        monthly_growth_rate: 0.10,
        churn_rate: 0.04,
        burn_rate: 100,
        tam: 2_000_000_000, // $2B competitive intel
        runway_months: Infinity,
        progress: 40
      }
    case 'automotive-os':
      return {
        business_id: 'automotive-os',
        stage: 'idea',
        current_mrr: 0,
        monthly_growth_rate: 0.08,
        churn_rate: 0.03,
        burn_rate: 0,
        tam: 8_000_000_000, // $8B shop mgmt
        runway_months: Infinity,
        progress: 5
      }
    default:
      return {
        business_id: businessSlug,
        stage: 'idea',
        current_mrr: 0,
        monthly_growth_rate: 0.05,
        churn_rate: 0.05,
        burn_rate: 0,
        tam: 1_000_000_000,
        runway_months: Infinity,
        progress: 0
      }
  }
}

// Calculate health score (0-100) weighted:
// Revenue Growth 25% + Unit Economics 20% + Retention 20% + Runway 15% + Engagement 10% + Milestones 10%
export function calculateHealthScore(businessSlug: string, mcResult: MonteCarloResult): {
  overall: number
  components: { label: string; score: number; weight: number }[]
} {
  const inputs = getBusinessInputs(businessSlug)

  // Revenue Growth (25%) - based on growth rate potential
  const revenueScore = inputs.current_mrr > 0
    ? Math.min(100, inputs.monthly_growth_rate * 500)
    : Math.min(50, inputs.progress) // Pre-revenue: score based on progress

  // Unit Economics (20%) - LTV:CAC proxy
  const unitEconScore = inputs.current_mrr > 0
    ? Math.min(100, (1 - inputs.churn_rate) * 100)
    : 30 // Pre-revenue default

  // Retention (20%) - inverse of churn
  const retentionScore = Math.max(0, (1 - inputs.churn_rate * 10) * 100)

  // Runway (15%) - infinite = 100, < 6 months = 20
  const runwayScore = inputs.runway_months >= 24 ? 100
    : inputs.runway_months >= 12 ? 80
    : inputs.runway_months >= 6 ? 50
    : 20

  // Engagement (10%) - based on progress
  const engagementScore = Math.min(100, inputs.progress * 1.5)

  // Milestones (10%) - based on P(success)
  const milestoneScore = Math.min(100, mcResult.p_1m_2yr * 2)

  const components = [
    { label: 'Revenue Growth', score: Math.round(revenueScore), weight: 0.25 },
    { label: 'Unit Economics', score: Math.round(unitEconScore), weight: 0.20 },
    { label: 'Retention', score: Math.round(retentionScore), weight: 0.20 },
    { label: 'Runway', score: Math.round(runwayScore), weight: 0.15 },
    { label: 'Engagement', score: Math.round(engagementScore), weight: 0.10 },
    { label: 'Milestones', score: Math.round(milestoneScore), weight: 0.10 },
  ]

  const overall = Math.round(
    components.reduce((sum, c) => sum + c.score * c.weight, 0)
  )

  return { overall, components }
}
