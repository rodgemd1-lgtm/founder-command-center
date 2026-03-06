import { supabase } from '@/lib/supabase'
import { getBusinessBySlug } from '@/lib/data'
import type { Business, Blocker } from '@/types'

/** Look up the UUID for a business slug from the businesses table */
async function getBusinessUUID(slug: string): Promise<string | null> {
  if (!supabase) return null
  const { data } = await supabase
    .from('businesses')
    .select('id')
    .eq('slug', slug)
    .single()
  return data?.id ?? null
}

export async function getBusinessWithLiveData(slug: string): Promise<Business | undefined> {
  const staticBiz = getBusinessBySlug(slug)
  if (!staticBiz) return undefined

  if (!supabase) return staticBiz

  try {
    const bizUUID = await getBusinessUUID(slug)
    if (!bizUUID) return staticBiz

    // Fetch live metrics
    const { data: metrics } = await supabase
      .from('business_metrics')
      .select('*')
      .eq('business_id', bizUUID)
      .order('recorded_at', { ascending: false })
      .limit(4)

    // Fetch live blockers
    const { data: blockers } = await supabase
      .from('blockers')
      .select('*')
      .eq('business_id', bizUUID)
      .order('created_at', { ascending: false })

    const result = { ...staticBiz }

    if (metrics && metrics.length > 0) {
      result.metrics = metrics.map(m => ({
        label: m.metric_name,
        current: String(m.current_value ?? ''),
        target: m.target_value ? String(m.target_value) : 'TBD',
        status: m.status || 'pre-launch',
      }))
    }

    if (blockers && blockers.length > 0) {
      result.blockers = blockers.map(b => ({
        id: b.id,
        description: b.description,
        blocking: b.blocking || 'Launch',
        owner: b.owner || 'Mike',
        cleared: b.cleared || false,
      }))
    }

    return result
  } catch (err) {
    console.warn('Failed to fetch live business data, using static:', err)
    return staticBiz
  }
}

export async function updateBlocker(id: string | number, updates: Partial<Blocker>): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('blockers').update(updates).eq('id', id)
  if (error) throw error
}

export async function createBlocker(businessId: string, blocker: Omit<Blocker, 'id'>): Promise<void> {
  if (!supabase) return
  const bizUUID = await getBusinessUUID(businessId)
  if (!bizUUID) return
  const { error } = await supabase.from('blockers').insert({
    business_id: bizUUID,
    description: blocker.description,
    blocking: blocker.blocking,
    owner: blocker.owner,
    cleared: false,
  })
  if (error) throw error
}
