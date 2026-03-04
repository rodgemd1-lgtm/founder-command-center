import { Link } from 'react-router-dom'
import { ArrowRight, AlertTriangle, Target, TrendingUp, Users, Brain } from 'lucide-react'
import { businesses } from '@/lib/data'
import { cn, getProgressColor, getStatusDot } from '@/lib/utils'

function BusinessCard({ business }: { business: typeof businesses[0] }) {
  const avgProgress = Math.round(
    business.domains.reduce((sum, d) => sum + d.progress, 0) / business.domains.length
  )
  const topBlocker = business.blockers.find(b => !b.cleared)

  return (
    <Link
      to={`/business/${business.slug}`}
      className="block bg-surface-1 border border-slate-800 rounded-xl p-5 hover:border-slate-700 hover:glow-brand transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold group-hover:text-brand-400 transition-colors">
            {business.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{business.tagline}</p>
        </div>
        <span className={cn('w-2.5 h-2.5 rounded-full mt-1.5 animate-pulse-dot', getStatusDot(business.status))}>
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {business.metrics.slice(0, 4).map(m => (
          <div key={m.label} className="bg-surface-0 rounded-lg px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">{m.label}</p>
            <p className="text-sm font-semibold text-white mt-0.5">{m.current}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Overall Progress</span>
          <span className="text-slate-300 font-medium">{avgProgress}%</span>
        </div>
        <div className="h-1.5 bg-surface-0 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', getProgressColor(avgProgress))}
            style={{ width: `${avgProgress}%` }}
          />
        </div>
      </div>

      {/* Top Blocker */}
      {topBlocker && (
        <div className="flex items-start gap-2 bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-300 leading-relaxed">{topBlocker.description}</p>
        </div>
      )}

      <div className="flex items-center justify-end mt-3 text-xs text-slate-500 group-hover:text-brand-400 transition-colors">
        <span>View details</span>
        <ArrowRight className="w-3 h-3 ml-1" />
      </div>
    </Link>
  )
}

export function Dashboard() {
  const totalBlockers = businesses.reduce(
    (sum, b) => sum + b.blockers.filter(bl => !bl.cleared).length, 0
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Good morning, Mike.
        </h1>
        <p className="text-slate-400 mt-1">Here's your empire at a glance.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'Businesses', value: businesses.length.toString(), color: 'text-brand-500' },
          { icon: TrendingUp, label: 'Total MRR', value: '$0', color: 'text-emerald-400' },
          { icon: AlertTriangle, label: 'Blockers', value: totalBlockers.toString(), color: 'text-red-400' },
          { icon: Brain, label: 'Intelligence Files', value: '210', color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="bg-surface-1 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
            <s.icon className={cn('w-5 h-5', s.color)} />
            <div>
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Business Cards */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Portfolio</h2>
        <div className="grid grid-cols-2 gap-4">
          {businesses.map(b => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { to: '/council', label: 'Ask the Council', desc: 'Get AI advisory board advice', icon: Users },
            { to: '/intelligence', label: 'Browse Intelligence', desc: '210 personas, frameworks & skills', icon: Brain },
            { to: '/vault', label: 'Open Vault', desc: 'API keys & credentials', icon: Target },
          ].map(a => (
            <Link
              key={a.to}
              to={a.to}
              className="bg-surface-1 border border-slate-800 rounded-xl px-4 py-3 hover:border-brand-500/30 transition-all flex items-center gap-3"
            >
              <a.icon className="w-5 h-5 text-brand-500" />
              <div>
                <p className="text-sm font-medium text-white">{a.label}</p>
                <p className="text-xs text-slate-500">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
