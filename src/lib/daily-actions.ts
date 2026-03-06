import { supabase } from '@/lib/supabase'
import type { DailyAction } from '@/types'

const STORAGE_KEY = 'fcc-daily-actions'

function getLocalActions(): DailyAction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalActions(actions: DailyAction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(actions))
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export async function getTodayActions(): Promise<DailyAction[]> {
  const today = todayISO()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('daily_actions')
        .select('*')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as DailyAction[]
    } catch (err) {
      console.warn('Supabase getTodayActions failed, falling back to localStorage:', err)
    }
  }
  return getLocalActions().filter(a => a.created_at.startsWith(today))
}

export async function createDailyAction(action: Pick<DailyAction, 'business_id' | 'task' | 'briefing_id'>): Promise<DailyAction> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('daily_actions').insert({
        business_id: action.business_id,
        task: action.task,
        briefing_id: action.briefing_id || null,
        status: 'pending',
      }).select().single()
      if (error) throw error
      return data as DailyAction
    } catch (err) {
      console.warn('Supabase createDailyAction failed, falling back to localStorage:', err)
    }
  }
  const newAction: DailyAction = {
    id: crypto.randomUUID(),
    business_id: action.business_id,
    briefing_id: action.briefing_id,
    task: action.task,
    status: 'pending',
    created_at: new Date().toISOString(),
  }
  const local = getLocalActions()
  local.push(newAction)
  saveLocalActions(local)
  return newAction
}

export async function updateDailyAction(id: string, updates: Partial<DailyAction>): Promise<DailyAction> {
  if (supabase) {
    try {
      const payload: Record<string, unknown> = {}
      if (updates.status !== undefined) {
        payload.status = updates.status
        if (updates.status === 'in_progress') payload.started_at = new Date().toISOString()
        if (updates.status === 'completed' || updates.status === 'skipped') payload.completed_at = new Date().toISOString()
      }
      if (updates.outcome !== undefined) payload.outcome = updates.outcome

      const { data, error } = await supabase.from('daily_actions').update(payload).eq('id', id).select().single()
      if (error) throw error
      return data as DailyAction
    } catch (err) {
      console.warn('Supabase updateDailyAction failed, falling back to localStorage:', err)
    }
  }
  const local = getLocalActions()
  const idx = local.findIndex(a => a.id === id)
  if (idx === -1) throw new Error('Action not found')
  local[idx] = { ...local[idx], ...updates }
  saveLocalActions(local)
  return local[idx]
}

export async function createActionsFromBriefing(priorities: { business_id: string; task: string }[], briefingId?: string): Promise<DailyAction[]> {
  const actions: DailyAction[] = []
  for (const p of priorities.slice(0, 6)) {
    const action = await createDailyAction({
      business_id: p.business_id,
      task: p.task,
      briefing_id: briefingId,
    })
    actions.push(action)
  }
  return actions
}
