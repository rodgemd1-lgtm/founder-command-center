import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, AlertTriangle, DollarSign, Clock,
  ChevronRight, Target, Flame, ArrowUpRight,
  Briefcase, Activity, Terminal, Copy, Check, X
} from 'lucide-react'
import { businesses, getPortfolioSummary, getBusinessStage, getStageLabel, getStageColor, generateDefaultBriefing } from '@/lib/data'
import { runMonteCarloSimulation, getBusinessInputs, calculateHealthScore } from '@/lib/montecarlo'
import { generateClaudeCodePrompt } from '@/lib/claude-prompts'
import { supabase } from '@/lib/supabase'
import { MonteCarloChart } from '@/components/MonteCarlo'
import { ProfitabilityGauge } from '@/components/finance/ProfitabilityGauge'
import { DailyActions } from '@/components/dashboard/DailyActions'
import { JakeCheckin } from '@/components/dashboard/JakeCheckin'
import type { MonteCarloResult, BriefingPriority } from '@/types'

export function Dashboard() {
  const portfolio = getPortfolioSummary()
  const defaultBriefing = generateDefaultBriefing()
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [priorities, setPriorities] = useState<BriefingPriority[]>(defaultBriefing.priorities)

  // Fetch latest morning briefing from Supabase, fall back to hardcoded data
  useEffect(() => {
    async function fetchMorningBriefing() {
      if (!supabase) return
      try {
        const { data, error } = await supabase
          .from('morning_briefings')
          .select('priorities')
          .order('briefing_date', { ascending: false })
          .limit(1)
          .single()
        if (error) throw error
        if (data?.priorities && Array.isArray(data.priorities) && data.priorities.length > 0) {
          setPriorities(data.priorities as BriefingPriority[])
        }
      } catch (err) {
        console.warn('Morning briefing fetch failed, using hardcoded fallback:', err)
      }
    }
    fetchMorningBriefing()
  }, [])

  // Run Monte Carlo for each business (memoized -- runs once)
  const mcResults = useMemo(() => {
    const results: Record<string, MonteCarloResult> = {}
    for (const biz of businesses) {
      const inputs = getBusinessInputs(biz.slug)
      results[biz.slug] = runMonteCarloSimulation(inputs, 1000) // Use 1000 for UI perf
    }
    return results
  }, [])

  // Health scores
  const healthScores = useMemo(() => {
    const scores: Record<string, { overall: number; components: { label: string; score: number; weight: number }[] }> = {}
    for (const biz of businesses) {
      if (mcResults[biz.slug]) {
        scores[biz.slug] = calculateHealthScore(biz.slug, mcResults[biz.slug])
      }
    }
    return scores
  }, [mcResults])

  const urgencyColors = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-amber-100 text-amber-800 border-amber-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    low: 'bg-gray-100 text-gray-700 border-gray-200'
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Good morning, Mike</h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's your portfolio for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <p className="text-gray-400 text-xs">Combined MRR</p>
            <p className="font-semibold text-gray-900">${portfolio.totalMRR.toLocaleString()}</p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-right">
            <p className="text-gray-400 text-xs">Monthly Burn</p>
            <p className="font-semibold text-gray-900">${portfolio.totalBurn.toLocaleString()}</p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-right">
            <p className="text-gray-400 text-xs">Runway</p>
            <p className="font-semibold text-gray-900">Self-funded</p>
          </div>
        </div>
      </div>

      {/* Morning Briefing Panel */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-gray-900">Today's Top Priorities</h2>
          </div>
          <span className="text-xs text-gray-400">Based on domain research, Monte Carlo analysis, current blockers</span>
        </div>
        <div className="space-y-3">
          {priorities.slice(0, 6).map((priority, i) => (
            <div key={i}>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-medium flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${urgencyColors[priority.urgency]}`}>
                      {priority.urgency}
                    </span>
                    <span className="text-xs text-gray-400">[{priority.business_name}]</span>
                    {priority.estimated_hours && (
                      <span className="text-xs text-gray-400 flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {priority.estimated_hours}h
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 mt-1 font-medium">{priority.task}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{priority.reasoning}</p>
                  <button
                    onClick={() => setExpandedPrompt(expandedPrompt === i ? null : i)}
                    className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-900 hover:bg-gray-800 text-white text-[11px] font-medium rounded-md transition-colors"
                  >
                    <Terminal className="w-3 h-3" />
                    {expandedPrompt === i ? 'Hide Prompt' : 'Run in Claude Code'}
                  </button>
                </div>
              </div>
              {expandedPrompt === i && (
                <div className="mt-2 ml-9 bg-gray-900 rounded-lg p-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Claude Code Prompt</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generateClaudeCodePrompt(priority))
                          setCopiedIdx(i)
                          setTimeout(() => setCopiedIdx(null), 2000)
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-gray-300 hover:text-white bg-gray-800 rounded transition-colors"
                      >
                        {copiedIdx === i ? <><Check className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                      </button>
                      <button onClick={() => setExpandedPrompt(null)} className="p-0.5 text-gray-500 hover:text-gray-300">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <pre className="text-[11px] text-gray-300 whitespace-pre-wrap font-mono leading-relaxed max-h-80 overflow-y-auto">
                    {generateClaudeCodePrompt(priority)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Jake's Take */}
      <JakeCheckin priorities={priorities} />

      {/* Daily Actions Panel */}
      <DailyActions priorities={priorities} />

      {/* Business Investment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {businesses.map(biz => {
          const stage = getBusinessStage(biz.slug)
          const stageLabel = getStageLabel(stage)
          const stageColor = getStageColor(stage)
          const mc = mcResults[biz.slug]
          const health = healthScores[biz.slug]
          const topBlocker = biz.blockers.find(b => !b.cleared)
          const topRisk = mc?.top_risks[0]

          return (
            <Link
              key={biz.slug}
              to={`/business/${biz.slug}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-amber-300 hover:shadow-sm transition-all group"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${stageColor}`}>
                    {stageLabel}
                  </span>
                  <h3 className="font-semibold text-gray-900">{biz.name}</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
              </div>

              {/* Metrics Grid + Profitability Gauge */}
              <div className="flex items-center gap-3 mb-3">
                <div className="grid grid-cols-4 gap-3 flex-1 text-center">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">MRR</p>
                    <p className="text-sm font-semibold text-gray-900">${biz.financials.mrr.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">Customers</p>
                    <p className="text-sm font-semibold text-gray-900">0</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">Burn</p>
                    <p className="text-sm font-semibold text-gray-900">${biz.financials.burnRate}/mo</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">Runway</p>
                    <p className="text-sm font-semibold text-gray-900">{biz.financials.runway || 'Self-funded'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <p className="text-[10px] text-gray-400 uppercase mb-1">Health</p>
                  <ProfitabilityGauge score={health?.overall ?? 0} target={70} size={64} />
                </div>
              </div>

              {/* Next Milestone + Risk */}
              <div className="space-y-2 text-sm">
                {topBlocker && (
                  <div className="flex items-start gap-2">
                    <Flame className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-500">Next: </span>
                      <span className="text-gray-800">{topBlocker.description}</span>
                    </div>
                  </div>
                )}
                {topRisk && (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-500">Risk: </span>
                      <span className="text-gray-800">{topRisk.description}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Monte Carlo Summary + Chart */}
              {mc && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-xs">
                      <Activity className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-500">P(Success):</span>
                      <span className="font-bold text-gray-900">{mc.p_1m_2yr}%</span>
                      <span className="text-gray-400">[{(mc.ci_95_low / 1000).toFixed(0)}K-{(mc.ci_95_high / 1000000).toFixed(1)}M]</span>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-gray-400">
                        <DollarSign className="w-3 h-3 inline" /> 5yr: {mc.p_10m_5yr}%
                      </span>
                    </div>
                  </div>
                  <MonteCarloChart percentiles={mc.revenue_percentiles} height={120} />
                </div>
              )}

              {/* Kill Criteria Progress */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase mb-1.5">Kill Criteria (Week 0 of 12)</p>
                <div className="flex gap-3 text-xs">
                  <label className="flex items-center gap-1 text-gray-500">
                    <span className="w-3.5 h-3.5 rounded border border-gray-300 flex items-center justify-center" />
                    100 users
                  </label>
                  <label className="flex items-center gap-1 text-gray-500">
                    <span className="w-3.5 h-3.5 rounded border border-gray-300 flex items-center justify-center" />
                    $500 MRR
                  </label>
                  <label className="flex items-center gap-1 text-emerald-600">
                    <span className="w-3.5 h-3.5 rounded border border-emerald-500 bg-emerald-500 flex items-center justify-center text-white text-[8px]">&#10003;</span>
                    Core built
                  </label>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Allocation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Traction vs Momentum */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-400" />
            Portfolio Allocation
          </h3>
          <div className="grid grid-cols-2 gap-px bg-gray-200 rounded-lg overflow-hidden">
            <div className="bg-emerald-50 p-3">
              <p className="text-[10px] font-medium text-emerald-600 uppercase">High Traction / High Momentum</p>
              <p className="text-xs text-gray-600 mt-1">&mdash;</p>
            </div>
            <div className="bg-amber-50 p-3">
              <p className="text-[10px] font-medium text-amber-600 uppercase">Low Traction / High Momentum</p>
              <p className="text-xs text-gray-700 mt-1 font-medium">TransformFit</p>
              <p className="text-xs text-gray-700">Viral Architect</p>
            </div>
            <div className="bg-gray-50 p-3">
              <p className="text-[10px] font-medium text-gray-500 uppercase">High Traction / Low Momentum</p>
              <p className="text-xs text-gray-600 mt-1">&mdash;</p>
            </div>
            <div className="bg-red-50 p-3">
              <p className="text-[10px] font-medium text-red-500 uppercase">Low Traction / Low Momentum</p>
              <p className="text-xs text-gray-700 mt-1">Intelligence Engine</p>
              <p className="text-xs text-gray-700">Automotive OS</p>
            </div>
          </div>
        </div>

        {/* Weekly Focus */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            Recommended Weekly Focus
          </h3>
          <div className="space-y-3">
            {[
              { name: 'TransformFit', hours: 20, pct: 50, color: 'bg-amber-500' },
              { name: 'Viral Architect', hours: 12, pct: 30, color: 'bg-purple-500' },
              { name: 'Intelligence Engine', hours: 4, pct: 10, color: 'bg-blue-500' },
              { name: 'Automotive OS', hours: 2, pct: 5, color: 'bg-gray-400' },
              { name: 'Admin / Overhead', hours: 2, pct: 5, color: 'bg-gray-300' },
            ].map(item => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-gray-400">{item.hours}h ({item.pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="flex gap-3">
        <Link to="/experts" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-amber-300 transition-colors">
          <ArrowUpRight className="w-4 h-4" /> Domain Experts
        </Link>
        <Link to="/decisions" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-amber-300 transition-colors">
          <ArrowUpRight className="w-4 h-4" /> Decision Log
        </Link>
        <Link to="/intelligence" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-amber-300 transition-colors">
          <ArrowUpRight className="w-4 h-4" /> Intelligence Library
        </Link>
      </div>
    </div>
  )
}
