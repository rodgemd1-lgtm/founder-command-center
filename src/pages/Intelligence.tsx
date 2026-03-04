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
  persona: 'bg-info/10 text-info',
  framework: 'bg-accent/10 text-accent',
  skill: 'bg-success/10 text-success',
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
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-[28px] font-semibold text-label tracking-tight">Intelligence Library</h1>
        <p className="text-[15px] text-label-secondary mt-1">
          {intelligenceItems.length} personas, frameworks & skills powering your portfolio.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-label-quaternary" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search intelligence files..."
          className="w-full glass rounded-xl pl-10 pr-4 py-3 text-[13px] text-label placeholder:text-label-quaternary focus:outline-none focus:ring-1 focus:ring-accent/30 transition-base"
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
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-fast',
                typeFilter === f.value
                  ? 'bg-accent-muted text-accent'
                  : 'text-label-tertiary hover:text-label-secondary'
              )}
            >
              <f.icon className="w-3 h-3" />
              {f.label}
              <span className="text-label-quaternary ml-0.5 tabular-nums">
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
                'px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-fast',
                tagFilter === t
                  ? 'bg-accent-muted text-accent'
                  : 'text-label-quaternary hover:text-label-tertiary'
              )}
            >
              {t === 'all' ? 'All Tags' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2">
        <p className="text-[11px] text-label-quaternary tabular-nums">{filtered.length} results</p>
        {filtered.map(item => (
          <div
            key={item.id}
            className="glass rounded-xl px-4 py-3.5 hover:glow-accent transition-base"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h3 className="text-[13px] font-medium text-label truncate">{item.name}</h3>
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded-md', typeColors[item.type])}>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-label-quaternary">
                    Tier {item.tier} — {tierLabels[item.tier]}
                  </span>
                </div>
                <p className="text-[12px] text-label-tertiary leading-relaxed">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-label-quaternary">{item.category}</span>
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface/60 text-label-quaternary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <code className="text-[10px] text-label-quaternary font-mono shrink-0 max-w-48 truncate">
                {item.filePath}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
