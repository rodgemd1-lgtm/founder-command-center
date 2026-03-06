import { supabase } from '@/lib/supabase'
import type { Decision } from '@/types'

// Local storage fallback when Supabase isn't configured
const STORAGE_KEY = 'fcc-decisions'

function getLocalDecisions(): Decision[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveLocalDecisions(decisions: Decision[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions))
}

export async function getDecisions(businessId?: string): Promise<Decision[]> {
  if (supabase) {
    try {
      let query = supabase.from('decisions').select('*').order('created_at', { ascending: false })
      if (businessId) query = query.eq('business_id', businessId)
      const { data, error } = await query
      if (error) throw error
      return data as Decision[]
    } catch (err) {
      console.warn('Supabase getDecisions failed, falling back to localStorage:', err)
    }
  }
  const local = getLocalDecisions()
  return businessId ? local.filter(d => d.business_id === businessId) : local
}

export async function createDecision(decision: Omit<Decision, 'id' | 'created_at' | 'updated_at'>, userId?: string): Promise<Decision> {
  const payload = userId ? { ...decision, user_id: userId } : decision
  if (supabase) {
    try {
      const { data, error } = await supabase.from('decisions').insert(payload).select().single()
      if (error) throw error
      return data as Decision
    } catch (err) {
      console.warn('Supabase createDecision failed, falling back to localStorage:', err)
    }
  }
  const newDecision: Decision = {
    ...payload,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  const local = getLocalDecisions()
  local.unshift(newDecision)
  saveLocalDecisions(local)
  return newDecision
}

export async function updateDecision(id: string, updates: Partial<Decision>, userId?: string): Promise<Decision> {
  const payload = userId ? { ...updates, user_id: userId } : updates
  if (supabase) {
    try {
      const { data, error } = await supabase.from('decisions').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().single()
      if (error) throw error
      return data as Decision
    } catch (err) {
      console.warn('Supabase updateDecision failed, falling back to localStorage:', err)
    }
  }
  const local = getLocalDecisions()
  const idx = local.findIndex(d => d.id === id)
  if (idx === -1) throw new Error('Decision not found')
  local[idx] = { ...local[idx], ...updates, updated_at: new Date().toISOString() }
  saveLocalDecisions(local)
  return local[idx]
}

export async function deleteDecision(id: string): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from('decisions').delete().eq('id', id)
      if (error) throw error
      return
    } catch (err) {
      console.warn('Supabase deleteDecision failed, falling back to localStorage:', err)
    }
  }
  const local = getLocalDecisions()
  saveLocalDecisions(local.filter(d => d.id !== id))
}
