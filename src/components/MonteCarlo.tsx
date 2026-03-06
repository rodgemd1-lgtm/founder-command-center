import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MonteCarloChartProps {
  percentiles: {
    month: number
    p5: number
    p25: number
    p50: number
    p75: number
    p95: number
  }[]
  height?: number
}

export function MonteCarloChart({ percentiles, height = 200 }: MonteCarloChartProps) {
  const data = useMemo(() => {
    // Sample every 3 months for cleaner display
    return percentiles
      .filter((_, i) => i % 3 === 0 || i === percentiles.length - 1)
      .map(p => ({
        month: p.month,
        label: `M${p.month}`,
        p5: Math.round(p.p5 * 12), // Convert MRR to ARR
        p25: Math.round(p.p25 * 12),
        p50: Math.round(p.p50 * 12),
        p75: Math.round(p.p75 * 12),
        p95: Math.round(p.p95 * 12),
      }))
  }, [percentiles])

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
    return `$${value}`
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: '#6B7280' }}
          axisLine={{ stroke: '#E5E7EB' }}
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fontSize: 10, fill: '#6B7280' }}
          axisLine={{ stroke: '#E5E7EB' }}
          width={50}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(value as number), '']}
          contentStyle={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '12px'
          }}
        />
        {/* P5-P95 band (lightest) */}
        <Area type="monotone" dataKey="p95" stackId="band" stroke="none" fill="#FEF3C7" fillOpacity={0.6} name="P95" />
        <Area type="monotone" dataKey="p5" stackId="band" stroke="none" fill="#FFFFFF" fillOpacity={1} name="P5" />
        {/* P25-P75 band */}
        <Area type="monotone" dataKey="p75" stroke="none" fill="#FDE68A" fillOpacity={0.5} name="P75" />
        <Area type="monotone" dataKey="p25" stroke="none" fill="#FFFFFF" fillOpacity={1} name="P25" />
        {/* Median line */}
        <Area type="monotone" dataKey="p50" stroke="#F59E0B" strokeWidth={2} fill="none" name="Median" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
