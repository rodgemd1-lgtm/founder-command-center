import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface ProfitabilityGaugeProps {
  score: number  // 0-100
  target?: number // default 85
  size?: number
}

export function ProfitabilityGauge({ score, target = 85, size = 120 }: ProfitabilityGaugeProps) {
  const data = [
    { value: score },
    { value: 100 - score }
  ]

  const color = score >= target ? '#16A34A' : score >= target * 0.7 ? '#F59E0B' : '#DC2626'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius="70%"
            outerRadius="90%"
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#F3F4F6" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-gray-900">{score}%</span>
        <span className="text-[10px] text-gray-400">/ {target}%</span>
      </div>
    </div>
  )
}
