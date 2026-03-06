import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock supabase to null so we test the localStorage path
vi.mock('../lib/supabase', () => ({ supabase: null, isSupabaseConfigured: () => false }))

// Provide localStorage mock
const store = new Map<string, string>()
vi.stubGlobal('localStorage', {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => { store.set(key, value) },
  removeItem: (key: string) => { store.delete(key) },
  clear: () => { store.clear() },
  get length() { return store.size },
  key: (i: number) => [...store.keys()][i] ?? null,
})

import { getTodayActions, createDailyAction, updateDailyAction, createActionsFromBriefing } from '../lib/daily-actions'

describe('Daily Actions (localStorage mode)', () => {
  beforeEach(() => {
    store.clear()
  })

  it('returns empty array when no actions exist', async () => {
    const actions = await getTodayActions()
    expect(actions).toEqual([])
  })

  it('creates a daily action', async () => {
    const action = await createDailyAction({
      business_id: 'transformfit',
      task: 'Test task',
    })
    expect(action.id).toBeTruthy()
    expect(action.task).toBe('Test task')
    expect(action.status).toBe('pending')
    expect(action.business_id).toBe('transformfit')
  })

  it('retrieves today actions after creation', async () => {
    await createDailyAction({ business_id: 'transformfit', task: 'Task 1' })
    await createDailyAction({ business_id: 'viral-architect', task: 'Task 2' })
    const actions = await getTodayActions()
    expect(actions).toHaveLength(2)
  })

  it('updates action status', async () => {
    const action = await createDailyAction({ business_id: 'transformfit', task: 'Task to update' })
    const updated = await updateDailyAction(action.id, { status: 'completed' })
    expect(updated.status).toBe('completed')
  })

  it('updates action outcome', async () => {
    const action = await createDailyAction({ business_id: 'transformfit', task: 'Task with outcome' })
    const updated = await updateDailyAction(action.id, { outcome: 'Shipped the feature' })
    expect(updated.outcome).toBe('Shipped the feature')
  })

  it('creates actions from briefing priorities', async () => {
    const priorities = [
      { business_id: 'transformfit', task: 'Priority 1' },
      { business_id: 'viral-architect', task: 'Priority 2' },
      { business_id: 'intelligence-engine', task: 'Priority 3' },
    ]
    const actions = await createActionsFromBriefing(priorities)
    expect(actions).toHaveLength(3)
    expect(actions[0].task).toBe('Priority 1')
    expect(actions[1].task).toBe('Priority 2')
  })

  it('limits briefing actions to 6', async () => {
    const priorities = Array.from({ length: 10 }, (_, i) => ({
      business_id: 'transformfit',
      task: `Priority ${i + 1}`,
    }))
    const actions = await createActionsFromBriefing(priorities)
    expect(actions).toHaveLength(6)
  })

  it('throws when updating nonexistent action', async () => {
    await expect(updateDailyAction('nonexistent', { status: 'completed' })).rejects.toThrow('Action not found')
  })
})
