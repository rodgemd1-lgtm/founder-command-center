import { supabase } from '@/lib/supabase'

export interface CustomerIntelEntry {
  id: string
  business_id: string
  email?: string
  name?: string
  source?: string
  segment?: string
  notes?: string
  created_at: string
}

const STORAGE_KEY = 'fcc-customer-intel'

function getLocalIntel(): CustomerIntelEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalIntel(entries: CustomerIntelEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export async function getCustomerIntel(businessId?: string): Promise<CustomerIntelEntry[]> {
  if (supabase) {
    try {
      let query = supabase.from('customer_intel').select('*').order('created_at', { ascending: false })
      if (businessId) query = query.eq('business_id', businessId)
      const { data, error } = await query
      if (error) throw error
      return data as CustomerIntelEntry[]
    } catch (err) {
      console.warn('Supabase getCustomerIntel failed, falling back to localStorage:', err)
    }
  }
  const local = getLocalIntel()
  return businessId ? local.filter(e => e.business_id === businessId) : local
}

export async function createCustomerIntel(entry: Omit<CustomerIntelEntry, 'id' | 'created_at'>): Promise<CustomerIntelEntry> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('customer_intel').insert(entry).select().single()
      if (error) throw error
      return data as CustomerIntelEntry
    } catch (err) {
      console.warn('Supabase createCustomerIntel failed, falling back to localStorage:', err)
    }
  }
  const newEntry: CustomerIntelEntry = {
    ...entry,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  const local = getLocalIntel()
  local.unshift(newEntry)
  saveLocalIntel(local)
  return newEntry
}
