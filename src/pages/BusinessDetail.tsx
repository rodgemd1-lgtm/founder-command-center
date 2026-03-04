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
        <p className="text-slate-400">Business not found.</p>
        <Link to="/" className="text-brand-400 text-sm mt-2 inline-block">Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
          <h1 className="text-2xl font-bold text-white">{business.name}</h1>
          <p className="text-slate-400 mt-1">{business.tagline}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <code className="bg-surface-2 px-2 py-1 rounded font-mono">{business.repo}</code>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {business.metrics.map(m => (
          <div key={m.label} className="bg-surface-1 border border-slate-800 rounded-xl px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">{m.label}</p>
            <p className="text-lg font-bold text-white mt-1">{m.current}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Target: {m.target}</p>
          </div>
        ))}
      </div>

      {/* Domain Progress Grid */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
          {business.domains.length}-Domain Progress Grid
        </h2>
        <div className="bg-surface-1 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Domain</th>
                <th className="text-left px-4 py-3 font-medium w-40">Progress</th>
                <th className="text-left px-4 py-3 font-medium">Phase</th>
                <th className="text-left px-4 py-3 font-medium">Current Blocker</th>
                <th className="text-left px-4 py-3 font-medium">Next Milestone</th>
              </tr>
            </thead>
            <tbody>
              {business.domains.map((d, i) => (
                <tr key={d.name} className={cn('border-b border-slate-800/50', i % 2 === 0 && 'bg-surface-0/30')}>
                  <td className="px-4 py-3 font-medium text-white">{d.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-surface-0 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', getProgressColor(d.progress))}
                          style={{ width: `${d.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8 text-right">{d.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      d.phase.includes('Active') ? 'bg-emerald-500/10 text-emerald-400' :
                      d.phase === 'Blocked' ? 'bg-red-500/10 text-red-400' :
                      d.phase === 'Planned' ? 'bg-slate-500/10 text-slate-400' :
                      'bg-amber-500/10 text-amber-400'
                    )}>
                      {d.phase}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{d.blocker || '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-300">{d.nextMilestone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blockers */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Active Blockers</h2>
        <div className="space-y-2">
          {business.blockers.map(b => (
            <div
              key={b.id}
              className={cn(
                'flex items-start gap-3 bg-surface-1 border rounded-lg px-4 py-3',
                b.cleared ? 'border-emerald-500/20' : 'border-red-500/20'
              )}
            >
              {b.cleared
                ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                : <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              }
              <div className="flex-1">
                <p className={cn('text-sm', b.cleared ? 'text-slate-500 line-through' : 'text-white')}>
                  {b.description}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Blocking: {b.blocking} · Owner: {b.owner}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Focus */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Weekly Focus</h2>
        <div className="bg-surface-1 border border-slate-800 rounded-xl px-5 py-4">
          <ul className="space-y-2">
            {business.weeklyFocus.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-brand-500 font-mono text-xs mt-0.5">{i + 1}.</span>
                <span className="text-slate-300">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
