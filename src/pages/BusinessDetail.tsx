import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { getBusinessBySlug } from '@/lib/data'
import { cn, getProgressColor } from '@/lib/utils'

export function BusinessDetail() {
  const { slug } = useParams<{ slug: string }>()
  const business = slug ? getBusinessBySlug(slug) : undefined

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

  const avgProgress = Math.round(
    business.domains.reduce((sum, d) => sum + d.progress, 0) / business.domains.length
  )

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            to="/"
            className="text-[12px] text-label-tertiary hover:text-label-secondary flex items-center gap-1.5 mb-3 transition-fast"
          >
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
          <h1 className="text-[28px] font-semibold text-label tracking-tight">{business.name}</h1>
          <p className="text-[15px] text-label-secondary mt-1">{business.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn(
            'w-2 h-2 rounded-full animate-pulse-dot',
            business.status === 'active' ? 'bg-success' : 'bg-overlay'
          )} />
          <code className="text-[11px] text-label-quaternary font-mono bg-surface/60 px-2.5 py-1 rounded-md">
            {business.repo}
          </code>
        </div>
      </div>

      {/* Metrics — glass tiles */}
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

      {/* Domain Progress Grid */}
      <div>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-4">
          {business.domains.length}-Domain Progress Grid
        </h2>
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-separator-subtle text-[10px] text-label-quaternary uppercase tracking-[0.1em]">
                <th className="text-left px-4 py-3 font-medium">Domain</th>
                <th className="text-left px-4 py-3 font-medium w-40">Progress</th>
                <th className="text-left px-4 py-3 font-medium">Phase</th>
                <th className="text-left px-4 py-3 font-medium">Blocker</th>
                <th className="text-left px-4 py-3 font-medium">Next Milestone</th>
              </tr>
            </thead>
            <tbody>
              {business.domains.map((d, i) => (
                <tr
                  key={d.name}
                  className={cn(
                    'border-b border-separator-subtle/50',
                    i % 2 === 0 && 'bg-canvas/30'
                  )}
                >
                  <td className="px-4 py-3 font-medium text-label">{d.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 h-1 bg-canvas rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', getProgressColor(d.progress))}
                          style={{ width: `${d.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-label-secondary tabular-nums w-8 text-right">
                        {d.progress}%
                      </span>
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
                  <td className="px-4 py-3 text-[12px] text-label-tertiary">{d.blocker || '—'}</td>
                  <td className="px-4 py-3 text-[12px] text-label-secondary">{d.nextMilestone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blockers */}
      <div>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-4">
          Active Blockers
        </h2>
        <div className="space-y-2">
          {business.blockers.map(b => (
            <div
              key={b.id}
              className={cn(
                'flex items-start gap-3 glass rounded-lg px-4 py-3',
                b.cleared
                  ? 'border-success/15'
                  : 'border-destructive/15'
              )}
            >
              {b.cleared
                ? <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                : <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
              }
              <div className="flex-1">
                <p className={cn(
                  'text-[13px]',
                  b.cleared ? 'text-label-tertiary line-through' : 'text-label'
                )}>
                  {b.description}
                </p>
                <p className="text-[11px] text-label-quaternary mt-0.5">
                  Blocking: {b.blocking} · Owner: {b.owner}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Focus */}
      <div>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-4">
          Weekly Focus
        </h2>
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
