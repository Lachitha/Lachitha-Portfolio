interface TimelineItemProps {
  company: string
  role: string
  period: string
  summary: string
  highlights: string[]
}

export function TimelineItem({ company, role, period, summary, highlights }: TimelineItemProps) {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-[#161B22]/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="absolute left-6 top-6 h-3 w-3 rounded-full bg-[#3FB950]" />
      <div className="ml-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[#F0F6FC]">{role}</h3>
            <p className="text-[#58A6FF]">{company}</p>
          </div>
          <span className="rounded-full border border-[#58A6FF]/40 bg-[#58A6FF]/10 px-3 py-1 text-sm text-[#58A6FF]">{period}</span>
        </div>
        <p className="text-sm leading-7 text-[#8B949E]">{summary}</p>
        <ul className="space-y-2 text-sm text-[#C9D1D9]">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <span className="mt-1 text-[#3FB950]">▹</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
