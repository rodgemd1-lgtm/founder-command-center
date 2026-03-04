import { useState, useMemo } from 'react'
import { Search, Brain, Layers, Zap, Filter } from 'lucide-react'
import { intelligenceItems, filterIntelligence } from '@/lib/data'
import { cn } from '@/lib/utils'
import type { IntelligenceType } from '@/types'

const typeFilters = [
  { value: 'all' as const, label: 'All', icon: Layers },
  { value: 'persona' as const, label: 'Personas', icon: Brain },
  { value: 'framework' as const, label: 'Frameworks', icon: Filter },
  { value: 'skill' as const, label: 'Skills', icon: Zap },
]

const tagFilters = ['all', 'ALL', 'FITNESS', 'INSTAGRAM', 'INTELLIGENCE', 'AUTOMOTIVE']

const typeColors: Record<string, string> = {
  persona: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  framework: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  skill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

const tierLabels: Record<number, string> = {
  1: 'Foundation',
  2: 'Growth',
  3: 'Comprehensive',
}

export function Intelligence() {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<IntelligenceType | 'all'>('all')
  const [tagFilter, setTagFilter] = useState('all')

  const filtered = useMemo(
    () => filterIntelligence(intelligenceItems, query, typeFilter, tagFilter),
    [query, typeFilter, tagFilter]
  )

  const counts = useMemo(() => ({
    all: intelligenceItems.length,
    persona: intelligenceItems.filter(i => i.type === 'persona').length,
    framework: intelligenceItems.filter(i => i.type === 'framework').length,
    skill: intelligenceItems.filter(i => i.type === 'skill').length,
  }), [])

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Intelligence Library</h1>
        <p className="text-slate-400 mt-1">
          {intelligenceItems.length} personas, frameworks & skills powering your portfolio.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search intelligence files..."
          className="w-full bg-surface-1 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500/50 transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-1">
          {typeFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                typeFilter === f.value
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              )}
            >
              <f.icon className="w-3 h-3" />
              {f.label}
              <span className="text-slate-600 ml-0.5">
                {counts[f.value as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {tagFilters.map(t => (
            <button
              key={t}
              onClick={() => setTagFilter(t)}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                tagFilter === t
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent'
              )}
            >
              {t === 'all' ? 'All Tags' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2">
        <p className="text-xs text-slate-500">{filtered.length} results</p>
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-surface-1 border border-slate-800 rounded-lg px-4 py-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded border', typeColors[item.type])}>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    Tier {item.tier} — {tierLabels[item.tier]}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-slate-600">{item.category}</span>
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <code className="text-[10px] text-slate-600 font-mono shrink-0 max-w-48 truncate">
                {item.filePath}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
