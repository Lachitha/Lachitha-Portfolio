interface MonitorChartProps {
  label: string
  value: string
  series: number[]
}

export function MonitorChart({ label, value, series }: MonitorChartProps) {
  const max = Math.max(...series)
  const min = Math.min(...series)
  const points = series
    .map((point, index) => {
      const x = (index / (series.length - 1)) * 100
      const y = 100 - ((point - min) / (max - min || 1)) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="rounded-2xl border border-white/10 bg-[#161B22]/70 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-[#8B949E]">{label}</p>
          <p className="text-xl font-semibold text-[#F0F6FC]">{value}</p>
        </div>
        <div className="h-3 w-3 rounded-full bg-[#3FB950]" />
      </div>
      <svg viewBox="0 0 100 100" className="h-28 w-full">
        <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <polyline fill="none" stroke="#58A6FF" strokeWidth="2" points={points} />
      </svg>
    </div>
  )
}
