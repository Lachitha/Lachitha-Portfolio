interface MetricCardProps {
  label: string
  value: string
  detail: string
  tone: 'success' | 'primary' | 'warning' | 'error'
}

const toneStyles = {
  success: 'border-[#3FB950]/30 bg-[#3FB950]/10 text-[#3FB950]',
  primary: 'border-[#58A6FF]/30 bg-[#58A6FF]/10 text-[#58A6FF]',
  warning: 'border-[#F2CC60]/30 bg-[#F2CC60]/10 text-[#F2CC60]',
  error: 'border-[#F85149]/30 bg-[#F85149]/10 text-[#F85149]',
}

export function MetricCard({ label, value, detail, tone }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#161B22]/70 p-5">
      <p className="text-sm text-[#8B949E]">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-[#F0F6FC]">{value}</p>
      <p className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm ${toneStyles[tone]}`}>{detail}</p>
    </div>
  )
}
