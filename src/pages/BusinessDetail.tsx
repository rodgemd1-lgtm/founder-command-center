import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, AlertTriangle, CheckCircle2, ChevronRight, TrendingUp, TrendingDown,
  Building2, Map, Swords, DollarSign, Scale, LayoutGrid, CircleDot, ExternalLink,
  Minus, ArrowUpRight, ArrowDownRight, Shield, FileText, Landmark, FileCheck,
  Loader2, Plus,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getBusinessBySlug, getMissingSystems, getRoadmapProgress } from '@/lib/data'
import { getBusinessWithLiveData, updateBlocker, createBlocker } from '@/lib/business-data'
import { cn, getProgressColor } from '@/lib/utils'
import type { Business, Department, Competitor, RoadmapPhase } from '@/types'

type Tab = 'overview' | 'departments' | 'roadmap' | 'competitors' | 'financials' | 'legal'

const tabs: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'competitors', label: 'Competitors', icon: Swords },
  { id: 'financials', label: 'Financials', icon: DollarSign },
  { id: 'legal', label: 'Legal', icon: Scale },
]

// === OVERVIEW TAB ===
function OverviewTab({ business, onBlockerToggle, onBlockerAdd }: { business: Business; onBlockerToggle?: (id: number, cleared: boolean) => void; onBlockerAdd?: (desc: string) => void }) {
  const avgProgress = Math.round(
    business.domains.reduce((sum, d) => sum + d.progress, 0) / business.domains.length
  )
  const missingSystems = getMissingSystems(business.slug)
  const criticalMissing = missingSystems.filter(s => s.priority === 'critical')

  return (
    <div className="space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {business.metrics.map(m => (
          <div key={m.label} className="glass rounded-xl px-4 py-4">
            <p className="text-[10px] uppercase tracking-[0.1em] text-label-quaternary">{m.label}</p>
            <p className="text-[20px] font-semibold text-label mt-1 tabular-nums">{m.current}</p>
            <p className="text-[11px] text-label-tertiary mt-0.5">Target: {m.target}</p>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="glass rounded-xl px-5 py-4">
        <div className="flex justify-between text-[12px] mb-2">
          <span className="text-label-secondary font-medium">Overall Progress</span>
          <span className="text-label tabular-nums font-semibold">{avgProgress}%</span>
        </div>
        <div className="h-1.5 bg-canvas rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-base', getProgressColor(avgProgress))}
            style={{ width: `${avgProgress}%` }}
          />
        </div>
      </div>

      {/* Critical Missing Systems */}
      {criticalMissing.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-3">
            Critical Missing Systems ({criticalMissing.length})
          </h3>
          <div className="glass rounded-xl divide-y divide-separator-subtle/50">
            {criticalMissing.slice(0, 8).map((s, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <span className="text-[13px] text-label">{s.system}</span>
                </div>
                <span className="text-[11px] text-label-tertiary">{s.department}</span>
              </div>
            ))}
            {criticalMissing.length > 8 && (
              <div className="px-4 py-2.5 text-[11px] text-label-quaternary text-center">
                +{criticalMissing.length - 8} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Domain Grid */}
      <div>
        <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-3">
          Domain Progress
        </h3>
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-separator-subtle text-[10px] text-label-quaternary uppercase tracking-[0.1em]">
                <th className="text-left px-4 py-3 font-medium">Domain</th>
                <th className="text-left px-4 py-3 font-medium w-36">Progress</th>
                <th className="text-left px-4 py-3 font-medium">Phase</th>
                <th className="text-left px-4 py-3 font-medium">Blocker</th>
                <th className="text-left px-4 py-3 font-medium">Next Milestone</th>
              </tr>
            </thead>
            <tbody>
              {business.domains.map((d, i) => (
                <tr key={d.name} className={cn('border-b border-separator-subtle/50', i % 2 === 0 && 'bg-canvas/30')}>
                  <td className="px-4 py-3 font-medium text-label">{d.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 h-1 bg-canvas rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', getProgressColor(d.progress))} style={{ width: `${d.progress}%` }} />
                      </div>
                      <span className="text-[11px] text-label-secondary tabular-nums w-8 text-right">{d.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-[11px] px-2 py-0.5 rounded-full',
                      d.phase.includes('Active') ? 'bg-success/10 text-success' :
                      d.phase === 'Blocked' ? 'bg-destructive/10 text-destructive' :
                      d.phase === 'Planned' ? 'bg-overlay/30 text-label-tertiary' :
                      'bg-warning/10 text-warning'
                    )}>
                      {d.phase}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-label-tertiary max-w-[200px] truncate">{d.blocker || '—'}</td>
                  <td className="px-4 py-3 text-[12px] text-label-secondary">{d.nextMilestone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blockers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary">
            Active Blockers ({business.blockers.filter(b => !b.cleared).length})
          </h3>
          {onBlockerAdd && (
            <button
              onClick={() => {
                const desc = prompt('Describe the new blocker:')
                if (desc?.trim()) onBlockerAdd(desc.trim())
              }}
              className="flex items-center gap-1 text-[11px] text-accent hover:text-accent-hover transition-fast"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          )}
        </div>
        <div className="space-y-2">
          {business.blockers.map(b => (
            <div key={b.id} className={cn('flex items-start gap-3 glass rounded-lg px-4 py-3', b.cleared ? 'border-success/15' : 'border-destructive/15')}>
              <button
                onClick={() => onBlockerToggle?.(b.id, !b.cleared)}
                className="shrink-0 mt-0.5"
                title={b.cleared ? 'Reopen blocker' : 'Mark as cleared'}
              >
                {b.cleared
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  : <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                }
              </button>
              <div className="flex-1">
                <p className={cn('text-[13px]', b.cleared ? 'text-label-tertiary line-through' : 'text-label')}>{b.description}</p>
                <p className="text-[11px] text-label-quaternary mt-0.5">Blocking: {b.blocking} · Owner: {b.owner}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Focus */}
      <div>
        <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-3">Weekly Focus</h3>
        <div className="glass rounded-xl px-5 py-4">
          <ul className="space-y-2.5">
            {business.weeklyFocus.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-[13px]">
                <span className="text-accent font-mono text-[12px] mt-0.5 tabular-nums">{i + 1}.</span>
                <span className="text-label-secondary leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// === DEPARTMENTS TAB ===
function DepartmentsTab({ business }: { business: Business }) {
  const [expandedDept, setExpandedDept] = useState<string | null>(null)

  const statusColors: Record<string, string> = {
    'not-started': 'bg-overlay/40 text-label-tertiary',
    'in-progress': 'bg-accent/10 text-accent',
    'operational': 'bg-success/10 text-success',
    'optimizing': 'bg-info/10 text-info',
  }

  const systemStatusColors: Record<string, string> = {
    'missing': 'text-destructive',
    'planned': 'text-label-tertiary',
    'building': 'text-warning',
    'live': 'text-success',
    'optimizing': 'text-info',
  }

  const systemStatusDots: Record<string, string> = {
    'missing': 'bg-destructive',
    'planned': 'bg-label-quaternary',
    'building': 'bg-warning',
    'live': 'bg-success',
    'optimizing': 'bg-info',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[13px] text-label-secondary">
          {business.departments.length} departments · {business.departments.filter(d => d.status === 'operational' || d.status === 'optimizing').length} operational
        </p>
      </div>

      {business.departments.map((dept: Department) => {
        const isExpanded = expandedDept === dept.name
        return (
          <div key={dept.name} className="glass rounded-xl overflow-hidden">
            {/* Department Header */}
            <button
              onClick={() => setExpandedDept(isExpanded ? null : dept.name)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface/30 transition-fast"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-canvas/80 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-label-tertiary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-[14px] font-medium text-label">{dept.name}</h4>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', statusColors[dept.status] || statusColors['not-started'])}>
                      {dept.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-label-tertiary mt-0.5">Owner: {dept.owner}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Key Metrics Preview */}
                <div className="hidden md:flex items-center gap-4">
                  {dept.keyMetrics.slice(0, 2).map(m => (
                    <div key={m.label} className="text-right">
                      <p className="text-[10px] text-label-quaternary">{m.label}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <p className="text-[12px] font-medium text-label tabular-nums">{m.value}</p>
                        {m.trend === 'up' && <TrendingUp className="w-3 h-3 text-success" />}
                        {m.trend === 'down' && <TrendingDown className="w-3 h-3 text-destructive" />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3 w-28">
                  <div className="flex-1 h-1.5 bg-canvas rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', getProgressColor(dept.progress))} style={{ width: `${dept.progress}%` }} />
                  </div>
                  <span className="text-[11px] text-label-secondary tabular-nums w-8 text-right">{dept.progress}%</span>
                </div>

                <ChevronRight className={cn('w-4 h-4 text-label-quaternary transition-transform', isExpanded && 'rotate-90')} />
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-separator-subtle px-5 py-5 space-y-5 bg-canvas/20">
                {/* Key Metrics */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-label-quaternary mb-2">Key Metrics</p>
                  <div className="flex gap-3 flex-wrap">
                    {dept.keyMetrics.map(m => (
                      <div key={m.label} className="bg-surface/60 rounded-lg px-3 py-2 min-w-[100px]">
                        <p className="text-[10px] text-label-quaternary">{m.label}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-[14px] font-medium text-label">{m.value}</p>
                          {m.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-success" />}
                          {m.trend === 'down' && <ArrowDownRight className="w-3 h-3 text-destructive" />}
                          {m.trend === 'flat' && <Minus className="w-3 h-3 text-label-quaternary" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Systems */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-label-quaternary mb-2">
                    Systems ({dept.systems.length})
                  </p>
                  <div className="space-y-1">
                    {dept.systems.map(sys => (
                      <div key={sys.name} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-surface/40 transition-fast">
                        <div className="flex items-center gap-2.5">
                          <span className={cn('w-1.5 h-1.5 rounded-full', systemStatusDots[sys.status])} />
                          <span className="text-[12px] text-label">{sys.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn('text-[10px] capitalize', systemStatusColors[sys.status])}>{sys.status}</span>
                          <span className={cn(
                            'text-[9px] px-1.5 py-0.5 rounded-full',
                            sys.priority === 'critical' ? 'bg-destructive/10 text-destructive' :
                            sys.priority === 'important' ? 'bg-warning/10 text-warning' :
                            'bg-overlay/30 text-label-quaternary'
                          )}>
                            {sys.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Actions */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-label-quaternary mb-2">Next Actions</p>
                  <ul className="space-y-1.5">
                    {dept.nextActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px]">
                        <CircleDot className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                        <span className="text-label-secondary">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// === ROADMAP TAB ===
function RoadmapTab({ business }: { business: Business }) {
  const phaseIcons: Record<string, string> = {
    idea: '💡', mvp: '🔨', launch: '🚀', growth: '📈', scale: '⚡', 'ten-million': '💎',
  }

  const phaseColors: Record<string, { bg: string; border: string; text: string }> = {
    completed: { bg: 'bg-success/5', border: 'border-success/20', text: 'text-success' },
    current: { bg: 'bg-accent/5', border: 'border-accent/30', text: 'text-accent' },
    upcoming: { bg: 'bg-warning/5', border: 'border-warning/20', text: 'text-warning' },
    future: { bg: 'bg-surface/50', border: 'border-separator-subtle', text: 'text-label-tertiary' },
  }

  const milestoneStatusColors: Record<string, string> = {
    done: 'text-success',
    'in-progress': 'text-accent',
    todo: 'text-label-quaternary',
    blocked: 'text-destructive',
  }

  const progress = getRoadmapProgress(business.slug)

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="grid grid-cols-6 gap-2">
        {progress.map(p => (
          <div key={p.phase} className="glass rounded-lg px-3 py-2.5 text-center">
            <p className="text-[10px] text-label-quaternary truncate">{p.phase}</p>
            <p className="text-[14px] font-semibold text-label mt-0.5 tabular-nums">{p.done}/{p.total}</p>
          </div>
        ))}
      </div>

      {/* Phase Timeline */}
      <div className="space-y-4">
        {business.roadmap.map((phase: RoadmapPhase) => {
          const colors = phaseColors[phase.status] || phaseColors.future
          const doneMilestones = phase.milestones.filter(m => m.status === 'done').length
          const pct = phase.milestones.length > 0 ? Math.round((doneMilestones / phase.milestones.length) * 100) : 0

          return (
            <div key={phase.phase} className={cn('rounded-xl border overflow-hidden', colors.bg, colors.border)}>
              {/* Phase Header */}
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{phaseIcons[phase.phase] || '📋'}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[14px] font-semibold text-label">{phase.label}</h4>
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium uppercase', colors.text,
                        phase.status === 'completed' ? 'bg-success/10' :
                        phase.status === 'current' ? 'bg-accent/10' :
                        phase.status === 'upcoming' ? 'bg-warning/10' : 'bg-overlay/20'
                      )}>
                        {phase.status}
                      </span>
                    </div>
                    {phase.targetDate && (
                      <p className="text-[11px] text-label-tertiary mt-0.5">Target: {phase.targetDate}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-32">
                  <div className="flex-1 h-1.5 bg-canvas rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', getProgressColor(pct))} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] text-label-secondary tabular-nums">{pct}%</span>
                </div>
              </div>

              {/* Milestones */}
              <div className="border-t border-separator-subtle/50 divide-y divide-separator-subtle/30">
                {phase.milestones.map((m, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-2.5">
                    <div className="flex items-center gap-3">
                      {m.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                      {m.status === 'in-progress' && <CircleDot className="w-3.5 h-3.5 text-accent animate-pulse" />}
                      {m.status === 'todo' && <CircleDot className="w-3.5 h-3.5 text-label-quaternary" />}
                      {m.status === 'blocked' && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
                      <span className={cn('text-[12px]', m.status === 'done' ? 'text-label-tertiary line-through' : 'text-label')}>
                        {m.task}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-label-quaternary">{m.department}</span>
                      <span className={cn('text-[10px] capitalize', milestoneStatusColors[m.status])}>{m.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// === COMPETITORS TAB ===
function CompetitorsTab({ business }: { business: Business }) {
  const threatColors: Record<string, string> = {
    high: 'bg-destructive/10 text-destructive border-destructive/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    low: 'bg-success/10 text-success border-success/20',
  }

  if (business.competitors.length === 0) {
    return (
      <div className="text-center py-16">
        <Swords className="w-8 h-8 text-label-quaternary mx-auto mb-3" />
        <p className="text-[14px] text-label-tertiary">No competitive intelligence yet.</p>
        <p className="text-[12px] text-label-quaternary mt-1">Research in progress.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-label-secondary">
        {business.competitors.length} competitors tracked ·{' '}
        {business.competitors.filter(c => c.threat === 'high').length} high threat
      </p>

      {business.competitors.map((comp: Competitor) => (
        <div key={comp.name} className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h4 className="text-[15px] font-semibold text-label">{comp.name}</h4>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium border', threatColors[comp.threat])}>
                    {comp.threat} threat
                  </span>
                </div>
                <a href={`https://${comp.website}`} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] text-accent hover:text-accent-hover transition-fast flex items-center gap-1 mt-1">
                  {comp.website} <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-medium text-label">{comp.pricing}</p>
                <p className="text-[10px] text-label-quaternary mt-0.5">{comp.users}</p>
                <p className="text-[10px] text-label-quaternary">Rating: {comp.rating}</p>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-success mb-1.5">Strengths</p>
                <ul className="space-y-1">
                  {comp.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px] text-label-secondary">
                      <span className="text-success mt-0.5">+</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-destructive mb-1.5">Weaknesses</p>
                <ul className="space-y-1">
                  {comp.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px] text-label-secondary">
                      <span className="text-destructive mt-0.5">-</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Differentiator */}
            <div className="bg-accent/5 border border-accent/10 rounded-lg px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.1em] text-accent mb-1">Our Differentiator</p>
              <p className="text-[12px] text-label-secondary leading-relaxed">{comp.differentiator}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// === FINANCIALS TAB ===
function FinancialsTab({ business }: { business: Business }) {
  const { financials } = business

  return (
    <div className="space-y-8">
      {/* Key Financial Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'MRR', value: `$${financials.mrr.toLocaleString()}`, sub: `ARR: $${financials.arr.toLocaleString()}` },
          { label: 'Burn Rate', value: `$${financials.burnRate}/mo`, sub: `Runway: ${financials.runway}` },
          { label: 'Revenue', value: `$${financials.totalRevenue.toLocaleString()}`, sub: 'Total to date' },
          { label: 'Expenses', value: `$${financials.totalExpenses}/mo`, sub: financials.stripeConnected ? 'Stripe Connected' : 'Stripe Not Connected' },
        ].map(m => (
          <div key={m.label} className="glass rounded-xl px-4 py-4">
            <p className="text-[10px] uppercase tracking-[0.1em] text-label-quaternary">{m.label}</p>
            <p className="text-[20px] font-semibold text-label mt-1 tabular-nums">{m.value}</p>
            <p className={cn('text-[11px] mt-0.5', m.sub.includes('Not Connected') ? 'text-destructive' : 'text-label-tertiary')}>
              {m.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Stripe Status */}
      <div className={cn(
        'glass rounded-xl px-5 py-4 flex items-center gap-4',
        financials.stripeConnected ? 'border-success/20' : 'border-warning/20'
      )}>
        <DollarSign className={cn('w-5 h-5', financials.stripeConnected ? 'text-success' : 'text-warning')} />
        <div>
          <p className="text-[13px] font-medium text-label">
            {financials.stripeConnected ? 'Stripe Connected' : 'Stripe Not Connected'}
          </p>
          <p className="text-[11px] text-label-tertiary">
            {financials.stripeConnected ? 'Payment processing active' : 'Connect Stripe to start accepting payments'}
          </p>
        </div>
      </div>

      {/* Monthly Expenses Breakdown */}
      {financials.monthlyExpenses.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-3">
            Monthly Expenses (${financials.monthlyExpenses.reduce((s, e) => s + e.amount, 0)}/mo)
          </h3>
          <div className="glass rounded-xl divide-y divide-separator-subtle/50">
            {financials.monthlyExpenses.map((expense, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full',
                    expense.category === 'Infrastructure' ? 'bg-accent/10 text-accent' :
                    expense.category === 'AI' ? 'bg-info/10 text-info' :
                    'bg-overlay/30 text-label-tertiary'
                  )}>
                    {expense.category}
                  </span>
                  <span className="text-[13px] text-label">{expense.service}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-medium text-label tabular-nums">${expense.amount}/mo</span>
                  {expense.recurring && (
                    <span className="text-[9px] text-label-quaternary">recurring</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bank Account */}
      <div className="glass rounded-xl px-5 py-4">
        <div className="flex items-center gap-3">
          <Landmark className="w-4 h-4 text-label-tertiary" />
          <div>
            <p className="text-[13px] font-medium text-label">
              {financials.bankAccount || 'No Business Bank Account'}
            </p>
            <p className="text-[11px] text-label-tertiary">
              {financials.bankAccount ? 'Business banking active' : 'Open a business account (Mercury, Relay)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// === LEGAL TAB ===
function LegalTab({ business }: { business: Business }) {
  const { legal } = business

  const entityStatusColors: Record<string, string> = {
    active: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    'not-formed': 'bg-destructive/10 text-destructive',
  }

  const complianceStatusColors: Record<string, string> = {
    compliant: 'text-success',
    'in-progress': 'text-accent',
    'not-started': 'text-destructive',
    'not-applicable': 'text-label-quaternary',
  }

  const tmStatusColors: Record<string, string> = {
    registered: 'text-success',
    pending: 'text-warning',
    'not-filed': 'text-destructive',
    'search-needed': 'text-warning',
  }

  return (
    <div className="space-y-8">
      {/* Entity Info */}
      <div className="glass rounded-xl px-5 py-5">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-label-tertiary" />
          <h3 className="text-[14px] font-medium text-label">Business Entity</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Type', value: legal.entity.type },
            { label: 'State', value: legal.entity.state },
            { label: 'Status', value: legal.entity.status.replace('-', ' '), isStatus: true },
            { label: 'Provider', value: legal.entity.provider },
          ].map(item => (
            <div key={item.label}>
              <p className="text-[10px] uppercase tracking-[0.1em] text-label-quaternary">{item.label}</p>
              {item.isStatus ? (
                <span className={cn('text-[13px] font-medium px-2 py-0.5 rounded-full inline-block mt-1',
                  entityStatusColors[legal.entity.status] || 'text-label')}>
                  {item.value}
                </span>
              ) : (
                <p className="text-[13px] font-medium text-label mt-1">{item.value}</p>
              )}
            </div>
          ))}
        </div>
        {legal.entity.ein && (
          <p className="text-[11px] text-label-tertiary mt-3">EIN: {legal.entity.ein}</p>
        )}
      </div>

      {/* Trademarks */}
      {legal.trademarks.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-3">
            Trademarks ({legal.trademarks.length})
          </h3>
          <div className="glass rounded-xl divide-y divide-separator-subtle/50">
            {legal.trademarks.map((tm, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-3.5 h-3.5 text-label-quaternary" />
                  <span className="text-[13px] text-label">{tm.name}</span>
                </div>
                <span className={cn('text-[11px] capitalize', tmStatusColors[tm.status])}>
                  {tm.status.replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Items */}
      {legal.compliance.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-3">
            Compliance ({legal.compliance.filter(c => c.status === 'compliant').length}/{legal.compliance.length} compliant)
          </h3>
          <div className="glass rounded-xl divide-y divide-separator-subtle/50">
            {legal.compliance.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full shrink-0',
                    item.status === 'compliant' ? 'bg-success' :
                    item.status === 'in-progress' ? 'bg-accent' :
                    item.status === 'not-started' ? 'bg-destructive' : 'bg-label-quaternary'
                  )} />
                  <span className="text-[13px] text-label truncate">{item.requirement}</span>
                  <span className="text-[10px] text-label-quaternary shrink-0">{item.category}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded-full',
                    item.priority === 'critical' ? 'bg-destructive/10 text-destructive' :
                    item.priority === 'important' ? 'bg-warning/10 text-warning' :
                    'bg-overlay/30 text-label-quaternary'
                  )}>
                    {item.priority}
                  </span>
                  <span className={cn('text-[11px] capitalize w-20 text-right', complianceStatusColors[item.status])}>
                    {item.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insurance */}
      {legal.insurance.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-3">Insurance</h3>
          <div className="glass rounded-xl divide-y divide-separator-subtle/50">
            {legal.insurance.map((ins, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-3.5 h-3.5 text-label-quaternary" />
                  <span className="text-[13px] text-label">{ins.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('text-[11px] capitalize',
                    ins.status === 'active' ? 'text-success' :
                    ins.status === 'needed' ? 'text-warning' : 'text-label-quaternary'
                  )}>
                    {ins.status}
                  </span>
                  {ins.provider && <span className="text-[10px] text-label-quaternary">({ins.provider})</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legal Documents */}
      {legal.documents.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-3">
            Legal Documents ({legal.documents.filter(d => d.status === 'current').length}/{legal.documents.length} current)
          </h3>
          <div className="glass rounded-xl divide-y divide-separator-subtle/50">
            {legal.documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-3.5 h-3.5 text-label-quaternary" />
                  <span className="text-[13px] text-label">{doc.name}</span>
                </div>
                <span className={cn('text-[11px] capitalize',
                  doc.status === 'current' ? 'text-success' :
                  doc.status === 'draft' ? 'text-warning' :
                  doc.status === 'needs-update' ? 'text-warning' : 'text-destructive'
                )}>
                  {doc.status.replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// === MAIN COMPONENT ===
export function BusinessDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [business, setBusiness] = useState<Business | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!slug) { setIsLoading(false); return }
    let cancelled = false
    setIsLoading(true)
    getBusinessWithLiveData(slug).then(biz => {
      if (!cancelled) { setBusiness(biz); setIsLoading(false) }
    }).catch(() => {
      if (!cancelled) { setBusiness(getBusinessBySlug(slug)); setIsLoading(false) }
    })
    return () => { cancelled = true }
  }, [slug])

  const handleBlockerToggle = async (id: number, cleared: boolean) => {
    if (!business) return
    try {
      await updateBlocker(id, { cleared })
      setBusiness(prev => prev ? {
        ...prev,
        blockers: prev.blockers.map(b => b.id === id ? { ...b, cleared } : b)
      } : prev)
      toast.success(cleared ? 'Blocker cleared' : 'Blocker reopened')
    } catch {
      toast.error('Failed to update blocker')
    }
  }

  const handleBlockerAdd = async (description: string) => {
    if (!business || !slug) return
    try {
      await createBlocker(slug, { description, blocking: 'Launch', owner: 'Mike', cleared: false })
      setBusiness(prev => prev ? {
        ...prev,
        blockers: [{ id: Date.now(), description, blocking: 'Launch', owner: 'Mike', cleared: false }, ...prev.blockers]
      } : prev)
      toast.success('Blocker added')
    } catch {
      toast.error('Failed to add blocker')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="text-center py-20">
        <p className="text-label-tertiary text-[15px]">Business not found.</p>
        <Link to="/" className="text-accent text-[13px] mt-3 inline-block hover:text-accent-hover transition-fast">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link to="/" className="text-[12px] text-label-tertiary hover:text-label-secondary flex items-center gap-1.5 mb-3 transition-fast">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
          <h1 className="text-[28px] font-semibold text-label tracking-tight">{business.name}</h1>
          <p className="text-[15px] text-label-secondary mt-1">{business.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn('w-2 h-2 rounded-full animate-pulse-dot', business.status === 'active' ? 'bg-success' : 'bg-overlay')} />
          <code className="text-[11px] text-label-quaternary font-mono bg-surface/60 px-2.5 py-1 rounded-md">{business.repo}</code>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-surface/40 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-fast',
              activeTab === tab.id
                ? 'bg-accent text-white shadow-sm'
                : 'text-label-tertiary hover:text-label hover:bg-surface/60'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && <OverviewTab business={business} onBlockerToggle={handleBlockerToggle} onBlockerAdd={handleBlockerAdd} />}
        {activeTab === 'departments' && <DepartmentsTab business={business} />}
        {activeTab === 'roadmap' && <RoadmapTab business={business} />}
        {activeTab === 'competitors' && <CompetitorsTab business={business} />}
        {activeTab === 'financials' && <FinancialsTab business={business} />}
        {activeTab === 'legal' && <LegalTab business={business} />}
      </div>
    </div>
  )
}
