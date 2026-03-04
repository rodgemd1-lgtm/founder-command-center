import { Link } from 'react-router-dom'
import { ArrowRight, AlertTriangle, Target, TrendingUp, Brain, Users } from 'lucide-react'
import { businesses } from '@/lib/data'
import { cn, getProgressColor } from '@/lib/utils'

function BusinessCard({ business }: { business: typeof businesses[0] }) {
  const avgProgress = Math.round(
    business.domains.reduce((sum, d) => sum + d.progress, 0) / business.domains.length
  )
  const topBlocker = business.blockers.find(b => !b.cleared)

  return (
    <Link
      to={`/business/${business.slug}`}
      className="group block glass rounded-xl p-6 hover:glow-accent transition-base"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-semibold text-label group-hover:text-accent transition-fast">
            {business.name}
          </h3>
          <p className="text-[12px] text-label-tertiary mt-1 leading-relaxed max-w-[280px]">
            {business.tagline}
          </p>
        </div>
        <span className={cn(
          'w-2 h-2 rounded-full mt-1 animate-pulse-dot',
          business.status === 'active' ? 'bg-success' : 'bg-overlay'
        )} />
      </div>

      {/* Metrics — 2x2 grid, Apple-style metric tiles */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {business.metrics.slice(0, 4).map(m => (
          <div key={m.label} className="bg-canvas/60 rounded-lg px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.1em] text-label-quaternary">{m.label}</p>
            <p className="text-[15px] font-semibold text-label mt-0.5 tabular-nums">{m.current}</p>
          </div>
        ))}
      </div>

      {/* Progress bar — minimal */}
      <div className="mb-4">
        <div className="flex justify-between text-[11px] mb-1.5">
          <span className="text-label-tertiary">Overall</span>
          <span className="text-label-secondary tabular-nums">{avgProgress}%</span>
        </div>
        <div className="h-1 bg-canvas rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-base', getProgressColor(avgProgress))}
            style={{ width: `${avgProgress}%` }}
          />
        </div>
      </div>

      {/* Top blocker */}
      {topBlocker && (
        <div className="flex items-start gap-2.5 bg-destructive/5 border border-destructive/10 rounded-lg px-3 py-2.5">
          <AlertTriangle className="w-3 h-3 text-destructive shrink-0 mt-0.5" />
          <p className="text-[11px] text-destructive/80 leading-relaxed">{topBlocker.description}</p>
        </div>
      )}

      <div className="flex items-center justify-end mt-4 text-[11px] text-label-quaternary group-hover:text-accent transition-fast">
        <span>Details</span>
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
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Greeting — Large Title, Ive-style restraint */}
      <div>
        <h1 className="text-[28px] font-semibold text-label tracking-tight">
          Good morning, Mike.
        </h1>
        <p className="text-[15px] text-label-secondary mt-1">Here's your empire at a glance.</p>
      </div>

      {/* Quick Stats — glass tiles */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Target, label: 'Businesses', value: '4', color: 'text-accent' },
          { icon: TrendingUp, label: 'Total MRR', value: '$0', color: 'text-success' },
          { icon: AlertTriangle, label: 'Blockers', value: totalBlockers.toString(), color: 'text-destructive' },
          { icon: Brain, label: 'Intelligence', value: '210', color: 'text-info' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl px-4 py-4 flex items-center gap-4">
            <s.icon className={cn('w-5 h-5', s.color)} />
            <div>
              <p className="text-[20px] font-semibold text-label tabular-nums">{s.value}</p>
              <p className="text-[11px] text-label-tertiary tracking-wide">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Business Cards — 2x2 grid */}
      <div>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-4">
          Portfolio
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {businesses.map(b => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { to: '/council', label: 'Ask the Council', desc: 'AI advisory board', icon: Users },
            { to: '/intelligence', label: 'Intelligence', desc: '210 files', icon: Brain },
            { to: '/vault', label: 'Vault', desc: 'Keys & credentials', icon: Target },
          ].map(a => (
            <Link
              key={a.to}
              to={a.to}
              className="glass rounded-xl px-4 py-4 hover:glow-accent transition-base flex items-center gap-4"
            >
              <a.icon className="w-4 h-4 text-accent opacity-80" />
              <div>
                <p className="text-[13px] font-medium text-label">{a.label}</p>
                <p className="text-[11px] text-label-tertiary">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
