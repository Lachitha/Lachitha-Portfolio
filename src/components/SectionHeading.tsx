interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-8 space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#58A6FF]">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-[#F0F6FC] sm:text-4xl">{title}</h2>
      <p className="max-w-2xl text-sm leading-7 text-[#8B949E] sm:text-base">{description}</p>
    </div>
  )
}
