import { useState, useEffect } from 'react'
import { Plus, Search, Scale, X, Check, Pencil, Loader2, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { businesses } from '@/lib/data'
import { getDecisions, createDecision, updateDecision, deleteDecision } from '@/lib/decisions'
import { useAuth } from '@/hooks/useAuth'
import type { Decision } from '@/types'

const CATEGORIES = ['strategy', 'product', 'marketing', 'technical', 'financial', 'hiring', 'legal'] as const

const categoryColors: Record<string, string> = {
  strategy: 'bg-purple-100 text-purple-700',
  product: 'bg-blue-100 text-blue-700',
  marketing: 'bg-pink-100 text-pink-700',
  technical: 'bg-cyan-100 text-cyan-700',
  financial: 'bg-emerald-100 text-emerald-700',
  hiring: 'bg-amber-100 text-amber-700',
  legal: 'bg-gray-100 text-gray-700',
}

export function DecisionLog() {
  const { user } = useAuth()
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterBusiness, setFilterBusiness] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [resolveId, setResolveId] = useState<string | null>(null)
  const [resolveData, setResolveData] = useState({
    outcome: '',
    outcome_rating: 5,
    what_worked: '',
    what_didnt: '',
    lessons_learned: '',
  })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'strategy' as Decision['category'],
    business_id: businesses[0].slug,
    tags: '',
  })

  useEffect(() => {
    loadDecisions()
  }, [filterBusiness])

  const loadDecisions = async () => {
    setIsLoading(true)
    try {
      const data = await getDecisions(filterBusiness === 'all' ? undefined : filterBusiness)
      setDecisions(data)
    } catch (err) {
      console.warn('Failed to load decisions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDecisions = decisions.filter(d => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
    }
    return true
  })

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) return

    try {
      if (editingId) {
        await updateDecision(editingId, {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          business_id: formData.business_id,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }, user?.id)
        toast.success('Decision updated')
      } else {
        await createDecision({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          business_id: formData.business_id,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          status: 'active',
        }, user?.id)
        toast.success('Decision logged')
      }

      setShowForm(false)
      setEditingId(null)
      setFormData({ title: '', description: '', category: 'strategy', business_id: businesses[0].slug, tags: '' })
      await loadDecisions()
    } catch (err) {
      console.warn('Failed to save decision:', err)
      toast.error('Failed to save decision')
    }
  }

  const handleEdit = (decision: Decision) => {
    setFormData({
      title: decision.title,
      description: decision.description,
      category: decision.category,
      business_id: decision.business_id,
      tags: decision.tags.join(', '),
    })
    setEditingId(decision.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this decision? This cannot be undone.')) return
    try {
      await deleteDecision(id)
      toast.success('Decision deleted')
      await loadDecisions()
    } catch (err) {
      console.warn('Failed to delete decision:', err)
      toast.error('Failed to delete decision')
    }
  }

  const openResolveModal = (id: string) => {
    setResolveId(id)
    setResolveData({ outcome: '', outcome_rating: 5, what_worked: '', what_didnt: '', lessons_learned: '' })
  }

  const handleResolve = async () => {
    if (!resolveId || !resolveData.outcome) return
    try {
      await updateDecision(resolveId, {
        status: 'resolved',
        outcome: resolveData.outcome,
        outcome_rating: resolveData.outcome_rating,
        what_worked: resolveData.what_worked || undefined,
        what_didnt: resolveData.what_didnt || undefined,
        lessons_learned: resolveData.lessons_learned || undefined,
      })
      toast.success('Decision resolved with outcome')
      setResolveId(null)
      await loadDecisions()
    } catch (err) {
      console.warn('Failed to resolve decision:', err)
      toast.error('Failed to resolve decision')
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Decision Log</h1>
          <p className="text-sm text-gray-500">Track decisions, outcomes, and learnings across your portfolio</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ title: '', description: '', category: 'strategy', business_id: businesses[0].slug, tags: '' }) }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> New Decision
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search decisions..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={filterBusiness}
          onChange={e => setFilterBusiness(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All Businesses</option>
          {businesses.map(b => (
            <option key={b.slug} value={b.slug}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">{editingId ? 'Edit Decision' : 'Log New Decision'}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                placeholder="What was decided?"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                rows={3}
                placeholder="Context, alternatives considered, reasoning..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as Decision['category'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business</label>
              <select
                value={formData.business_id}
                onChange={e => setFormData(prev => ({ ...prev, business_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
              >
                {businesses.map(b => <option key={b.slug} value={b.slug}>{b.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input
                value={formData.tags}
                onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                placeholder="pricing, launch, MVP"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
              {editingId ? 'Update' : 'Log Decision'}
            </button>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {resolveId && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Resolve Decision — Capture Outcome</h3>
            <button onClick={() => setResolveId(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Outcome (required)</label>
              <textarea
                value={resolveData.outcome}
                onChange={e => setResolveData(prev => ({ ...prev, outcome: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                rows={2}
                placeholder="What happened? What was the result?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Outcome Rating (1-10)</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={resolveData.outcome_rating}
                  onChange={e => setResolveData(prev => ({ ...prev, outcome_rating: Number(e.target.value) }))}
                  className="flex-1"
                />
                <div className="flex items-center gap-1 min-w-[3rem]">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-gray-900">{resolveData.outcome_rating}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What Worked</label>
                <textarea
                  value={resolveData.what_worked}
                  onChange={e => setResolveData(prev => ({ ...prev, what_worked: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  rows={2}
                  placeholder="What went well?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What Didn't Work</label>
                <textarea
                  value={resolveData.what_didnt}
                  onChange={e => setResolveData(prev => ({ ...prev, what_didnt: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  rows={2}
                  placeholder="What fell short?"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lessons Learned</label>
              <textarea
                value={resolveData.lessons_learned}
                onChange={e => setResolveData(prev => ({ ...prev, lessons_learned: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                rows={2}
                placeholder="What would you do differently next time?"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setResolveId(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
            <button onClick={handleResolve} disabled={!resolveData.outcome} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
              Resolve Decision
            </button>
          </div>
        </div>
      )}

      {/* Decision List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
          </div>
        ) : filteredDecisions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Scale className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No decisions logged yet</p>
            <p className="text-sm text-gray-400">Start tracking your decisions to build a learning system</p>
          </div>
        ) : (
          filteredDecisions.map(decision => (
            <div key={decision.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[decision.category]}`}>
                      {decision.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {businesses.find(b => b.slug === decision.business_id)?.name}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      decision.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                      decision.status === 'reversed' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {decision.status}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900">{decision.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{decision.description}</p>
                  {decision.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {decision.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{tag}</span>
                      ))}
                    </div>
                  )}
                  {decision.outcome && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-gray-700">Outcome: {decision.outcome}</p>
                        {decision.outcome_rating && (
                          <span className="flex items-center gap-0.5 text-xs text-amber-600">
                            <Star className="w-3 h-3" /> {decision.outcome_rating}/10
                          </span>
                        )}
                      </div>
                      {decision.what_worked && (
                        <p className="text-xs text-emerald-600">Worked: {decision.what_worked}</p>
                      )}
                      {decision.what_didnt && (
                        <p className="text-xs text-red-500">Didn't work: {decision.what_didnt}</p>
                      )}
                      {decision.lessons_learned && (
                        <p className="text-xs text-gray-500">Lesson: {decision.lessons_learned}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 ml-3">
                  {decision.status === 'active' && (
                    <button onClick={() => openResolveModal(decision.id)} className="p-1.5 text-gray-400 hover:text-emerald-600 rounded" title="Resolve with outcome">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleEdit(decision)} className="p-1.5 text-gray-400 hover:text-amber-600 rounded" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(decision.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded" title="Delete">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">{new Date(decision.created_at).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
