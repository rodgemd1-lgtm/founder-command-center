import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, SkipForward, Loader2, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { getTodayActions, updateDailyAction, createActionsFromBriefing } from '@/lib/daily-actions'
import { businesses } from '@/lib/data'
import type { DailyAction, BriefingPriority } from '@/types'

interface DailyActionsProps {
  priorities: BriefingPriority[]
}

export function DailyActions({ priorities }: DailyActionsProps) {
  const [actions, setActions] = useState<DailyAction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [outcomeId, setOutcomeId] = useState<string | null>(null)
  const [outcomeText, setOutcomeText] = useState('')

  useEffect(() => {
    loadActions()
  }, [])

  const loadActions = async () => {
    setIsLoading(true)
    try {
      let data = await getTodayActions()
      if (data.length === 0 && priorities.length > 0) {
        data = await createActionsFromBriefing(priorities)
      }
      setActions(data)
    } catch (err) {
      console.warn('Failed to load daily actions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const cycleStatus = async (action: DailyAction) => {
    const nextStatus: Record<string, DailyAction['status']> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'pending',
      skipped: 'pending',
    }
    const newStatus = nextStatus[action.status] || 'pending'
    try {
      await updateDailyAction(action.id, { status: newStatus })
      setActions(prev => prev.map(a => a.id === action.id ? { ...a, status: newStatus } : a))
      if (newStatus === 'completed') toast.success('Action completed')
    } catch (err) {
      console.warn('Failed to update action:', err)
      toast.error('Failed to update action')
    }
  }

  const skipAction = async (id: string) => {
    try {
      await updateDailyAction(id, { status: 'skipped' })
      setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'skipped' } : a))
    } catch (err) {
      console.warn('Failed to skip action:', err)
    }
  }

  const saveOutcome = async () => {
    if (!outcomeId || !outcomeText) return
    try {
      await updateDailyAction(outcomeId, { outcome: outcomeText })
      setActions(prev => prev.map(a => a.id === outcomeId ? { ...a, outcome: outcomeText } : a))
      toast.success('Outcome saved')
      setOutcomeId(null)
      setOutcomeText('')
    } catch (err) {
      console.warn('Failed to save outcome:', err)
    }
  }

  const statusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    if (status === 'in_progress') return <Circle className="w-4 h-4 text-amber-500 fill-amber-100" />
    if (status === 'skipped') return <SkipForward className="w-4 h-4 text-gray-400" />
    return <Circle className="w-4 h-4 text-gray-300" />
  }

  const completed = actions.filter(a => a.status === 'completed').length
  const total = actions.length

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
        </div>
      </div>
    )
  }

  if (actions.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <h2 className="font-semibold text-gray-900">Today's Actions</h2>
        </div>
        <span className="text-xs text-gray-400">{completed}/{total} completed</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all"
          style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
        />
      </div>

      <div className="space-y-2">
        {actions.map(action => (
          <div key={action.id} className="group">
            <div className="flex items-start gap-3">
              <button onClick={() => cycleStatus(action)} className="mt-0.5 shrink-0">
                {statusIcon(action.status)}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${action.status === 'completed' ? 'text-gray-400 line-through' : action.status === 'skipped' ? 'text-gray-400' : 'text-gray-900'}`}>
                  {action.task}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-400">
                    {businesses.find(b => b.slug === action.business_id)?.name || action.business_id}
                  </span>
                  {action.outcome && (
                    <span className="text-[10px] text-emerald-600">- {action.outcome}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {action.status !== 'skipped' && action.status !== 'completed' && (
                  <button onClick={() => skipAction(action.id)} className="p-1 text-gray-400 hover:text-gray-600" title="Skip">
                    <SkipForward className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => { setOutcomeId(action.id); setOutcomeText(action.outcome || '') }}
                  className="p-1 text-gray-400 hover:text-amber-600"
                  title="Add outcome note"
                >
                  <MessageSquare className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Outcome input */}
      {outcomeId && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={outcomeText}
            onChange={e => setOutcomeText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveOutcome()}
            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="What was the outcome?"
            autoFocus
          />
          <button onClick={saveOutcome} className="px-3 py-1.5 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600">Save</button>
          <button onClick={() => setOutcomeId(null)} className="px-2 py-1.5 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
        </div>
      )}
    </div>
  )
}
