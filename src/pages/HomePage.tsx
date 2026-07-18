import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { FaGithub, FaLinkedin, FaMoon, FaSun, FaTerminal } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { SkillsConsole } from '../components/SkillsConsole'
import { Terminal } from '../components/Terminal'
import {
  certifications,
  experience,
  heroStats,
  navItems,
  profile,
  skillHighlights,
} from '../data/portfolioData'

function StartupSequence() {
  const lines = [
    'Initializing DevOps Environment...',
    '[✓] Loading Kubernetes',
    '[✓] Loading Cloud Infrastructure',
    '[✓] Loading GitOps Pipeline',
    '[✓] Loading Observability Stack',
    '[✓] Loading Automation Framework',
    'System Ready',
  ]
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    if (visible >= lines.length) {
      return
    }
    const timer = window.setTimeout(() => setVisible((current) => current + 1), visible === 0 ? 450 : 380)
    return () => window.clearTimeout(timer)
  }, [visible, lines.length])

  return (
    <div className="rounded-3xl border border-white/10 bg-[#161B22]/80 p-5 font-mono text-sm text-[#C9D1D9] shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="mb-3 flex items-center gap-2 text-[#8B949E]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#F85149]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#F2CC60]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3FB950]" />
        <span className="ml-2 text-xs uppercase tracking-[0.3em]">boot</span>
      </div>
      <div className="space-y-1">
        {lines.slice(0, visible).map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  )
}

function HeroBackdrop() {
  const nodes = [
    { top: '10%', left: '8%', delay: 0 },
    { top: '22%', left: '78%', delay: 0.5 },
    { top: '68%', left: '12%', delay: 1 },
    { top: '74%', left: '74%', delay: 1.4 },
    { top: '44%', left: '48%', delay: 0.8 },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,166,255,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(63,185,80,0.1),transparent_25%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px]" />
      {nodes.map((node) => (
        <motion.div
          key={`${node.top}-${node.left}`}
          className="absolute h-3 w-3 rounded-full bg-[#58A6FF]/70 shadow-[0_0_20px_rgba(88,166,255,0.8)]"
          style={{ top: node.top, left: node.left }}
          animate={{ y: [0, -10, 0], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, delay: node.delay }}
        />
      ))}
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <path d="M120 140 C 280 80, 420 210, 600 150 S 960 160, 1100 120" stroke="rgba(88,166,255,0.35)" strokeWidth="1.5" fill="none" />
        <path d="M120 140 C 240 280, 360 340, 520 250 S 860 240, 1050 360" stroke="rgba(63,185,80,0.22)" strokeWidth="1.5" fill="none" />
        <path d="M180 640 C 320 520, 500 560, 660 470 S 940 420, 1080 520" stroke="rgba(139,92,246,0.22)" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}

function CertificationCard({
  title,
  issuer,
  provider,
  year,
  issued,
  badge,
  logo,
  mode,
}: (typeof certifications)[number] & { mode: 'day' | 'night' }) {
  const isNight = mode !== 'day'
  const logoNode =
    logo === 'aws' ? (
      <span className="font-bold">A</span>
    ) : logo === 'linkedin' ? (
      <FaLinkedin />
    ) : logo === 'oracle' ? (
      <span className="font-bold">O</span>
    ) : (
      <span className="font-bold">K</span>
    )

  return (
      <div className={`group rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 hover:border-[#58A6FF]/30 ${isNight ? 'border-white/10 bg-[#0D1117]/70' : 'border-[#D0D7DE] bg-[#FFFFFF]'}`}>
      <div className="mb-5 flex items-center justify-between gap-3">
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border text-[#58A6FF] transition group-hover:bg-[#58A6FF]/10 ${isNight ? 'border-white/10 bg-white/5' : 'border-[#D0D7DE] bg-[#F8FAFC]'}`}>
          {logoNode}
        </div>
        <span className="rounded-full border border-[#58A6FF]/30 bg-[#58A6FF]/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-[#58A6FF]">
          {badge}
        </span>
      </div>
        <h3 className={`text-lg font-semibold ${isNight ? 'text-[#F0F6FC]' : 'text-[#111827]'}`}>{title}</h3>
        <p className={`mt-2 text-sm ${isNight ? 'text-[#8B949E]' : 'text-[#57606A]'}`}>{issuer} • {provider}</p>
        <div className={`mt-4 flex items-center justify-between text-sm ${isNight ? 'text-[#C9D1D9]' : 'text-[#24292F]'}`}>
        <span>Issued</span>
        <span className="text-[#3FB950]">{issued}</span>
      </div>
        <div className={`mt-3 flex items-center justify-between text-sm ${isNight ? 'text-[#C9D1D9]' : 'text-[#24292F]'}`}>
        <span>Year</span>
        <span className="text-[#58A6FF]">{year}</span>
      </div>
    </div>
  )
}

function MiniWorkCard({
  title,
  description,
  meta,
  mode,
}: {
  title: string
  description: string
  meta: string
  mode: 'day' | 'night'
}) {
  return (
    <div className={`rounded-3xl border p-6 transition hover:-translate-y-1 hover:border-[#58A6FF]/30 ${mode === 'night' ? 'border-white/10 bg-[#0D1117]/70' : 'border-[#D0D7DE] bg-[#FFFFFF]'}`}>
      <p className="text-xs uppercase tracking-[0.35em] text-[#58A6FF]">Work</p>
      <h3 className={`mt-3 text-xl font-semibold ${mode === 'night' ? 'text-[#F0F6FC]' : 'text-[#111827]'}`}>{title}</h3>
      <p className={`mt-3 text-sm leading-7 ${mode === 'night' ? 'text-[#8B949E]' : 'text-[#57606A]'}`}>{description}</p>
      <p className="mt-5 font-mono text-xs uppercase tracking-[0.25em] text-[#3FB950]">{meta}</p>
    </div>
  )
}

const pageTheme = {
  day: {
    root: 'bg-[#F6F8FA] text-[#24292F]',
    header: 'border-[#D0D7DE] bg-[#FFFFFF]/90',
    section: 'border-[#D0D7DE] bg-[#FFFFFF]/90',
    shell: 'border-[#D0D7DE] bg-[#FFFFFF] text-[#24292F]',
    panel: 'border-[#D0D7DE] bg-[#F8FAFC] text-[#24292F]',
    heading: 'text-[#111827]',
    muted: 'text-[#57606A]',
    footer: 'border-[#D0D7DE] bg-[#FFFFFF]',
    chip: 'border-[#D0D7DE] bg-[#FFFFFF] text-[#24292F]',
  },
  night: {
    root: 'bg-[#0D1117] text-[#C9D1D9]',
    header: 'border-white/10 bg-[#0D1117]/90',
    section: 'border-white/10 bg-[#161B22]/70',
    shell: 'border-white/10 bg-[#161B22]/80 text-[#C9D1D9]',
    panel: 'border-white/10 bg-[#0D1117]/70 text-[#C9D1D9]',
    heading: 'text-[#F0F6FC]',
    muted: 'text-[#8B949E]',
    footer: 'border-white/10 bg-[#0D1117]',
    chip: 'border-[#58A6FF]/30 bg-[#58A6FF]/10 text-[#58A6FF]',
  },
}

export function HomePage() {
  const [themeMode, setThemeMode] = useState<'day' | 'night'>('night')
  const theme = pageTheme[themeMode]
  const toolchainLines = useMemo(
    () => [
      { label: 'Container Platform', items: 'Kubernetes, AKS, Docker, Helm' },
      { label: 'GitOps', items: 'FluxCD, ArgoCD, GitHub Actions, Azure DevOps' },
      { label: 'Cloud', items: 'Azure, AWS, Networking, Storage' },
      { label: 'Observability', items: 'Prometheus, Grafana, Loki, Thanos, OpenTelemetry' },
      { label: 'Automation', items: 'Terraform, Bash, Python, YAML' },
    ],
    [],
  )

  return (
    <div className={`min-h-screen ${theme.root}`}>
      <header id="home" className={`sticky top-0 z-40 border-b backdrop-blur-xl ${theme.header}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#home" className="font-mono text-sm font-semibold tracking-[0.35em] text-[#58A6FF]">
            lachitha@portfolio:~$
          </a>
          <nav className="hidden items-center gap-2 overflow-x-auto md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full border border-white/10 px-3 py-2 text-sm text-[#C9D1D9] transition hover:border-[#58A6FF]/40 hover:bg-white/5 hover:text-[#58A6FF]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/blog" className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${theme.chip}`}>Blog</Link>
            <button
              type="button"
              onClick={() => setThemeMode((current) => (current === 'night' ? 'day' : 'night'))}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                themeMode === 'night'
                  ? 'border-[#F2CC60]/30 bg-[#F2CC60]/10 text-[#F2CC60] hover:bg-[#F2CC60]/20'
                  : 'border-[#1F883D]/30 bg-[#1F883D]/10 text-[#1F883D] hover:bg-[#1F883D]/20'
              }`}
            >
              {themeMode === 'night' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className={`relative overflow-hidden rounded-[2.2rem] border p-6 sm:p-8 lg:p-10 ${theme.section}`}>
          <HeroBackdrop />
          <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#58A6FF]/30 bg-[#58A6FF]/10 px-4 py-2 text-sm text-[#58A6FF]">
                <FaTerminal />
                <span>DevOps Engineer • Cloud Infrastructure • Observability</span>
              </div>
              <div className="space-y-4">
                <StartupSequence />
                <div className="space-y-2 pt-3">
                  <p className="font-mono text-sm uppercase tracking-[0.35em] text-[#8B949E]">Hello, I&apos;m</p>
                  <h1 className={`max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl ${theme.heading}`}>
                    {profile.name}
                  </h1>
                  <p className="text-xl font-semibold text-[#58A6FF] sm:text-2xl">{profile.role}</p>
                  <p className={`max-w-2xl text-lg leading-8 sm:text-xl ${theme.muted}`}>{profile.subtitle}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href={profile.resume} className="rounded-full border border-[#3FB950]/40 bg-[#3FB950]/10 px-5 py-3 text-sm font-semibold text-[#3FB950] transition hover:bg-[#3FB950]/20">
                    View Resume
                  </a>
                  <a href={profile.github} target="_blank" rel="noreferrer" className="rounded-full border border-[#58A6FF]/40 bg-[#58A6FF]/10 px-5 py-3 text-sm font-semibold text-[#58A6FF] transition hover:bg-[#58A6FF]/20">
                    GitHub
                  </a>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 px-5 py-3 text-sm font-semibold text-[#8B5CF6] transition hover:bg-[#8B5CF6]/20">
                    LinkedIn
                  </a>
                  <a href="#contact" className="rounded-full border border-[#F2CC60]/40 bg-[#F2CC60]/10 px-5 py-3 text-sm font-semibold text-[#F2CC60] transition hover:bg-[#F2CC60]/20">
                    Contact
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="space-y-4"
            >
              <div className={`rounded-3xl border p-5 ${theme.panel}`}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className={`text-sm uppercase tracking-[0.3em] ${theme.muted}`}>Startup</p>
                    <h2 className={`text-xl font-semibold ${theme.heading}`}>Boot Sequence</h2>
                  </div>
                  <div className="rounded-full border border-[#58A6FF]/30 bg-[#58A6FF]/10 p-3 text-[#58A6FF]">
                    <FaTerminal />
                  </div>
                </div>
                <div className={`font-mono text-sm ${themeMode === 'night' ? 'text-[#C9D1D9]' : 'text-[#24292F]'}`}>
                  <div className="space-y-2">
                    <div className="text-[#3FB950]">System Ready</div>
                    <div className="text-[#58A6FF]">lachitha@portfolio:~$ whoami</div>
                    <div>Lachitha Yapa</div>
                    <div>Infrastructure Engineer</div>
                    <div>DevOps Engineer</div>
                    <div>Cloud Infrastructure Engineer</div>
                    <div>Kubernetes Enthusiast</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-white/10 bg-[#0D1117]/70 p-5">
                    <p className="text-sm text-[#8B949E]">{stat.label}</p>
                    <p className="mt-2 text-lg font-semibold text-[#F0F6FC]">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className={`rounded-3xl border p-5 ${theme.panel}`}>
                <p className={`text-xs uppercase tracking-[0.35em] ${theme.muted}`}>Toolchain</p>
                <div className="mt-4 space-y-3 font-mono text-sm">
                  {toolchainLines.map((line, index) => (
                    <div key={line.label} className={`grid gap-3 rounded-2xl border px-4 py-3 sm:grid-cols-[160px_1fr] ${themeMode === 'night' ? 'border-white/10 bg-[#161B22]' : 'border-[#D0D7DE] bg-[#FFFFFF]'}`}>
                      <span className="text-[#58A6FF]">0{index + 1}</span>
                      <span>
                        <span className="text-[#3FB950]">{line.label}</span> <span className="text-[#8B949E]">[{line.items}]</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className={`rounded-[2rem] border p-6 sm:p-8 ${theme.section}`}>
          <div className="mb-8 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#58A6FF]">About Me</p>
            <h2 className={`text-3xl font-semibold sm:text-4xl ${theme.heading}`}>Reliable cloud-native infrastructure</h2>
            <p className={`max-w-2xl text-sm leading-7 sm:text-base ${theme.muted}`}>
              I build and maintain reliable cloud-native infrastructure with a focus on platform engineering,
              automation, and production reliability.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className={`rounded-3xl border p-6 ${theme.panel}`}>
              <p className={`whitespace-pre-line text-sm leading-8 ${themeMode === 'night' ? 'text-[#C9D1D9]' : 'text-[#24292F]'}`}>
                I build and maintain reliable cloud-native infrastructure.
                {'\n\n'}My focus areas include:
                {'\n\n'}• Kubernetes platform engineering
                {'\n'}• Cloud infrastructure
                {'\n'}• GitOps automation
                {'\n'}• CI/CD
                {'\n'}• Observability
                {'\n'}• Production reliability
                {'\n\n'}I enjoy solving infrastructure challenges and improving automation, scalability, and system reliability.
              </p>
            </div>
            <div className={`rounded-3xl border p-6 ${theme.panel}`}>
              <h3 className={`text-2xl font-semibold ${theme.heading}`}>Professional Identity</h3>
              <p className={`mt-4 text-sm leading-8 ${theme.muted}`}>{profile.summary}</p>
              <div className="mt-6 space-y-3">
                {skillHighlights.map((item) => (
                  <div key={item} className="rounded-2xl border border-[#58A6FF]/20 bg-[#58A6FF]/10 px-4 py-3 text-sm text-[#58A6FF]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className={`rounded-[2rem] border p-6 sm:p-8 ${theme.section}`}>
          <SkillsConsole mode={themeMode} />
        </section>

        <section id="experience" className={`rounded-[2rem] border p-6 sm:p-8 ${theme.section}`}>
          <div className="mb-8 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#58A6FF]">Deployment history</p>
            <h2 className={`text-3xl font-semibold sm:text-4xl ${theme.heading}`}>The work, declared.</h2>
            <p className={`max-w-2xl text-sm leading-7 sm:text-base ${theme.muted}`}>
              Experience spanning Sitecore and Virtusa with production Kubernetes, GitOps, observability, and CI/CD delivery.
            </p>
          </div>
          <div className="space-y-5">
            {experience.map((item) => (
              <div key={`${item.company}-${item.role}`} className={`rounded-3xl border p-6 transition hover:border-[#58A6FF]/30 ${theme.panel}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className={`text-sm uppercase tracking-[0.3em] ${theme.muted}`}>{item.company}</p>
                    <h3 className={`mt-2 text-xl font-semibold ${theme.heading}`}>{item.role}</h3>
                  </div>
                  <span className="rounded-full border border-[#58A6FF]/30 bg-[#58A6FF]/10 px-3 py-1 text-sm text-[#58A6FF]">{item.period}</span>
                </div>
                <p className={`mt-4 text-sm leading-8 ${theme.muted}`}>{item.summary}</p>
                <ul className={`mt-5 space-y-2 text-sm ${themeMode === 'night' ? 'text-[#C9D1D9]' : 'text-[#24292F]'}`}>
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span className="mt-1 text-[#3FB950]">▹</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className={`rounded-[2rem] border p-6 sm:p-8 ${theme.section}`}>
          <div className="mb-8 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#58A6FF]">Work</p>
            <h2 className={`text-3xl font-semibold sm:text-4xl ${theme.heading}`}>The toolchain, declared.</h2>
            <p className={`max-w-2xl text-sm leading-7 sm:text-base ${theme.muted}`}>
              Selected work around Kubernetes observability, GitOps delivery, storage optimization, and distributed tracing.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <MiniWorkCard mode={themeMode} title="Kubernetes Observability Platform" description="AKS cluster monitoring with Prometheus, Grafana, Loki, Thanos, and alert routing for production reliability." meta="observability / production" />
            <MiniWorkCard mode={themeMode} title="GitOps Deployment Platform" description="Declarative application delivery with FluxCD, Helm, and Git as the source of truth." meta="gitops / automation" />
            <MiniWorkCard mode={themeMode} title="Thanos Storage Optimization" description="Reduced metrics retention cost and improved query behavior for monitoring workloads." meta="storage / optimization" />
            <MiniWorkCard mode={themeMode} title="OpenTelemetry Integration" description="Distributed tracing integration to improve service visibility and debugging across environments." meta="tracing / insights" />
          </div>
        </section>

        <section id="certifications" className={`rounded-[2rem] border p-6 sm:p-8 ${theme.section}`}>
          <div className="mb-8 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#58A6FF]">Proof</p>
            <h2 className={`text-3xl font-semibold sm:text-4xl ${theme.heading}`}>Industry credentials</h2>
            <p className={`max-w-2xl text-sm leading-7 sm:text-base ${theme.muted}`}>
              A timeline of cloud, Kubernetes, GitOps, DevOps, and security learning milestones.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {certifications.map((certification) => (
              <CertificationCard key={certification.title} {...certification} mode={themeMode} />
            ))}
          </div>
        </section>

        <section id="terminal" className={`rounded-[2rem] border p-6 sm:p-8 ${theme.section}`}>
          <div className="mb-8 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#58A6FF]">Terminal</p>
            <h2 className={`text-3xl font-semibold sm:text-4xl ${theme.heading}`}>Interactive command center</h2>
            <p className={`max-w-2xl text-sm leading-7 sm:text-base ${theme.muted}`}>
              Open the terminal and explore commands for skills, projects, certifications, and infrastructure details.
            </p>
          </div>
          <div className="mb-6 font-mono text-sm text-[#8B949E]">lachitha@portfolio:~$</div>
          <Terminal mode={themeMode} />
        </section>

        <section id="contact" className={`rounded-[2rem] border p-6 sm:p-8 ${theme.section}`}>
          <div className="mb-8 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#58A6FF]">Contact</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className={`rounded-3xl border p-6 ${theme.panel}`}>
              <div className="space-y-4 text-sm text-[#C9D1D9]">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#161B22]/70 p-4">
                  <span className="text-[#58A6FF]">Email</span>
                  <a href={`mailto:${profile.email}`} className="text-[#F0F6FC]">{profile.email}</a>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#161B22]/70 p-4">
                  <span className="text-[#58A6FF]">GitHub</span>
                  <a href={profile.github} target="_blank" rel="noreferrer" className="text-[#F0F6FC]">github.com/lachitha</a>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#161B22]/70 p-4">
                  <span className="text-[#58A6FF]">LinkedIn</span>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-[#F0F6FC]">https://www.linkedin.com/in/lachitha-senarathyapa/</a>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#161B22]/70 p-4">
                  <span className="text-[#58A6FF]">Resume Download</span>
                  <a href={profile.resume} className="text-[#F0F6FC]">Resume.pdf</a>
                </div>
              </div>
            </div>
            <div className={`rounded-3xl border p-6 ${theme.panel}`}>
              <div className="mb-5 flex items-center gap-3 text-[#58A6FF]">
                <FaTerminal />
                <span className="font-mono text-sm uppercase tracking-[0.3em]">contact@portfolio</span>
              </div>
              <p className="text-sm leading-8 text-[#8B949E]">Available for DevOps, SRE, and infrastructure engineering opportunities in cloud-native environments.</p>
              <div className="mt-6 flex flex-wrap gap-3 text-2xl text-[#58A6FF]">
                <a href={profile.github} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-3 transition hover:bg-white/5"><FaGithub /></a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-3 transition hover:bg-white/5"><FaLinkedin /></a>
                <a href={`mailto:${profile.email}`} className="rounded-full border border-white/10 p-3 transition hover:bg-white/5"><FaTerminal /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={`border-t ${theme.footer}`}>
        <div className={`mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 ${theme.muted}`}>
          <p>© {new Date().getFullYear()} Lachitha Yapa. Built as a DevOps command center.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#home" className="transition hover:text-[#58A6FF]">Home</a>
            <a href="#projects" className="transition hover:text-[#58A6FF]">Projects</a>
            <a href="#contact" className="transition hover:text-[#58A6FF]">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
