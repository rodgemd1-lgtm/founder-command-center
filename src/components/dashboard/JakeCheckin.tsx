import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import type { BriefingPriority } from '@/types'

interface JakeCheckinProps {
  priorities: BriefingPriority[]
}

export function JakeCheckin({ priorities }: JakeCheckinProps) {
  const topPriorities = priorities.slice(0, 3)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 border-l-4 border-l-[#B8860B]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#B8860B] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            J
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Jake's Take</h2>
            <p className="text-[11px] text-gray-400">Co-Founder Advisor</p>
          </div>
        </div>
        <Link
          to="/experts?expert=jake-cofounder"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B8860B] hover:bg-[#9A7209] text-white text-xs font-medium rounded-lg transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          Talk to Jake
        </Link>
      </div>

      <div className="space-y-2">
        {topPriorities.map((priority, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-gray-900 font-medium">{priority.task}</p>
              <p className="text-xs text-gray-500">[{priority.business_name}] {priority.reasoning}</p>
            </div>
          </div>
        ))}
      </div>

      {topPriorities.length === 0 && (
        <p className="text-sm text-gray-500 italic">No priorities loaded yet. Check back after the morning briefing runs.</p>
      )}
    </div>
  )
}
