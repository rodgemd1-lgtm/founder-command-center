import { useState } from 'react'
import { fullAgentRoster, departments } from '@/lib/council'
import { cn } from '@/lib/utils'

const tierLabels: Record<number, string> = {
  1: 'Strategic',
  2: 'Tactical',
  3: 'Operational',
}

const tierColors: Record<number, string> = {
  1: 'bg-accent/10 text-accent',
  2: 'bg-info/10 text-info',
  3: 'bg-success/10 text-success',
}

export function AgentRoster() {
  const [selectedDept, setSelectedDept] = useState<string>('all')

  const filtered = selectedDept === 'all'
    ? fullAgentRoster
    : fullAgentRoster.filter(a => a.department === selectedDept)

  const grouped = filtered.reduce<Record<string, typeof fullAgentRoster>>((acc, agent) => {
    if (!acc[agent.department]) acc[agent.department] = []
    acc[agent.department].push(agent)
    return acc
  }, {})

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-[28px] font-semibold text-label tracking-tight">Agent Roster</h1>
        <p className="text-[15px] text-label-secondary mt-1">
          {fullAgentRoster.length} AI agents across {departments.length} departments powering your portfolio.
        </p>
      </div>

      {/* Department Filter */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setSelectedDept('all')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-[11px] font-medium transition-fast',
            selectedDept === 'all'
              ? 'bg-accent-muted text-accent'
              : 'text-label-quaternary hover:text-label-tertiary'
          )}
        >
          All ({fullAgentRoster.length})
        </button>
        {departments.map(dept => {
          const count = fullAgentRoster.filter(a => a.department === dept).length
          return (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[11px] font-medium transition-fast',
                selectedDept === dept
                  ? 'bg-accent-muted text-accent'
                  : 'text-label-quaternary hover:text-label-tertiary'
              )}
            >
              {dept} ({count})
            </button>
          )
        })}
      </div>

      {/* Agent Grid by Department */}
      {Object.entries(grouped).map(([dept, agents]) => (
        <div key={dept}>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-3">
            {dept}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {agents.map(agent => (
              <div
                key={agent.id}
                className="glass rounded-xl px-4 py-4 hover:glow-accent transition-base"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{agent.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[13px] font-semibold text-label truncate">{agent.name}</h3>
                      <span className={cn(
                        'text-[9px] px-1.5 py-0.5 rounded-md font-medium',
                        tierColors[agent.tier]
                      )}>
                        T{agent.tier} — {tierLabels[agent.tier]}
                      </span>
                    </div>
                    <p className="text-[11px] text-accent/80 mb-1.5">{agent.role}</p>
                    <p className="text-[11px] text-label-tertiary leading-relaxed line-clamp-2">
                      {agent.expertise}
                    </p>
                    <p className="text-[10px] text-label-quaternary mt-2 italic leading-relaxed line-clamp-2">
                      "{agent.style}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
