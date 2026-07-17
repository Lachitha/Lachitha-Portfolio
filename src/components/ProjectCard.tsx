interface ProjectCardProps {
  title: string
  summary: string
  architecture: string
  stack: string[]
  challenges: string[]
  solutions: string[]
  github: string
  demo: string
}

export function ProjectCard({ title, summary, architecture, stack, challenges, solutions, github, demo }: ProjectCardProps) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-[#161B22]/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition duration-300 hover:-translate-y-1 hover:border-[#58A6FF]/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-xl font-semibold text-[#F0F6FC]">{title}</h3>
        <span className="rounded-full border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-[#8B5CF6]">
          Platform
        </span>
      </div>
      <p className="mb-4 text-sm leading-7 text-[#8B949E]">{summary}</p>
      <div className="space-y-3 text-sm text-[#C9D1D9]">
        <div>
          <p className="text-[#58A6FF]">Architecture</p>
          <p>{architecture}</p>
        </div>
        <div>
          <p className="text-[#58A6FF]">Tech Stack</p>
          <p>{stack.join(' • ')}</p>
        </div>
        <div>
          <p className="text-[#58A6FF]">Challenges</p>
          <p>{challenges.join(' • ')}</p>
        </div>
        <div>
          <p className="text-[#58A6FF]">Solutions</p>
          <p>{solutions.join(' • ')}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <a className="rounded-full border border-[#58A6FF]/40 px-4 py-2 text-sm text-[#58A6FF] transition hover:border-[#58A6FF] hover:bg-[#58A6FF]/10" href={github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className="rounded-full border border-[#3FB950]/40 px-4 py-2 text-sm text-[#3FB950] transition hover:border-[#3FB950] hover:bg-[#3FB950]/10" href={demo} target="_blank" rel="noreferrer">
          Demo
        </a>
      </div>
    </div>
  )
}
