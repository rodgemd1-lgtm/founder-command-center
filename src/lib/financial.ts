import { supabase } from '@/lib/supabase'

export interface FinancialMetrics {
  mrr: number
  arr: number
  burn_rate: number
  runway_months: number
  ltv: number
  cac: number
  ltv_cac_ratio: number
  gross_margin: number
}

export interface PlaidConnection {
  connected: boolean
  institution?: string
  last_synced?: string
}

export interface StripeConnection {
  connected: boolean
  account_id?: string
  last_synced?: string
}

// Get financial metrics for a business (from Supabase or defaults)
export async function getFinancialMetrics(businessSlug: string): Promise<FinancialMetrics> {
  if (supabase) {
    const { data } = await supabase
      .from('businesses')
      .select('financials')
      .eq('slug', businessSlug)
      .single()

    if (data?.financials) {
      return data.financials as FinancialMetrics
    }
  }

  // Default metrics per business
  const defaults: Record<string, FinancialMetrics> = {
    'transformfit': { mrr: 0, arr: 0, burn_rate: 200, runway_months: Infinity, ltv: 0, cac: 0, ltv_cac_ratio: 0, gross_margin: 0 },
    'viral-architect': { mrr: 0, arr: 0, burn_rate: 150, runway_months: Infinity, ltv: 0, cac: 0, ltv_cac_ratio: 0, gross_margin: 0 },
    'intelligence-engine': { mrr: 0, arr: 0, burn_rate: 100, runway_months: Infinity, ltv: 0, cac: 0, ltv_cac_ratio: 0, gross_margin: 0 },
    'automotive-os': { mrr: 0, arr: 0, burn_rate: 0, runway_months: Infinity, ltv: 0, cac: 0, ltv_cac_ratio: 0, gross_margin: 0 },
  }

  return defaults[businessSlug] ?? defaults['automotive-os']
}

// Placeholder for Plaid integration
export async function getPlaidStatus(_businessSlug: string): Promise<PlaidConnection> {
  return { connected: false }
}

// Placeholder for Stripe integration
export async function getStripeStatus(businessSlug: string): Promise<StripeConnection> {
  if (businessSlug === 'transformfit') {
    return { connected: false }
  }
  return { connected: false }
}

// Profitability target (85%)
export function getProfitabilityTarget(): number {
  return 85
}

export function calculateProfitabilityScore(revenue: number, expenses: number): number {
  if (revenue === 0) return 0
  return Math.round(((revenue - expenses) / revenue) * 100)
}
