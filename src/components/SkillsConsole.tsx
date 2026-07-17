import { motion } from 'framer-motion'
import { FaMoon, FaSun, FaTerminal } from 'react-icons/fa'
import { skillCategories } from '../data/portfolioData'

interface SkillsConsoleProps {
  mode: 'day' | 'night'
}

const themeClasses = {
  day: {
    shell: 'border-[#D0D7DE] bg-[#F8FAFC] text-[#24292F] shadow-[0_20px_70px_rgba(31,35,40,0.08)]',
    header: 'border-[#D0D7DE] bg-[#FFFFFF] text-[#24292F]',
    body: 'bg-[#FFFFFF] text-[#24292F]',
    muted: 'text-[#57606A]',
    accent: 'text-[#1F883D]',
    chip: 'border-[#1F883D]/15 bg-[#1F883D]/10 text-[#1F883D]',
    card: 'border-[#D0D7DE] bg-[#FFFFFF] text-[#24292F]',
  },
  night: {
    shell: 'border-white/10 bg-[#0D1117] text-[#C9D1D9] shadow-[0_20px_70px_rgba(0,0,0,0.35)]',
    header: 'border-white/10 bg-[#161B22] text-[#C9D1D9]',
    body: 'bg-[#0D1117] text-[#C9D1D9]',
    muted: 'text-[#8B949E]',
    accent: 'text-[#3FB950]',
    chip: 'border-[#58A6FF]/20 bg-[#58A6FF]/10 text-[#58A6FF]',
    card: 'border-white/10 bg-[#161B22] text-[#C9D1D9]',
  },
}

export function SkillsConsole({ mode }: SkillsConsoleProps) {
  const styles = themeClasses[mode]

  const stackRows = skillCategories.map((group) => ({
    key: group.category.toLowerCase().replace(/\s+/g, '_'),
    label: group.category.toLowerCase().replace(/\s+/g, '_'),
    items: group.skills.map((skill) => skill.name.toLowerCase().replace(/\s+/g, '_')),
  }))

  const cards = [
    {
      label: 'Ship',
      title: 'CI/CD & Release Engineering',
      description: 'GitHub Actions, Azure DevOps, Jenkins, YAML pipelines',
    },
    {
      label: 'Run',
      title: 'Platforms & Operations',
      description: 'AKS, Kubernetes, Linux, Networking, Storage',
    },
    {
      label: 'Guard',
      title: 'Observability & Security',
      description: 'Prometheus, Grafana, Loki, Alertmanager, Vault',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[0.28fr_0.72fr]">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          className="space-y-4"
        >
          <p className={`text-xs uppercase tracking-[0.45em] ${styles.accent}`}>Focus</p>
          <p className={`max-w-xs text-lg leading-8 ${styles.muted}`}>
            Built over delivery, security, and automation challenges across enterprise environments.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          className={`overflow-hidden rounded-[2rem] border ${styles.shell}`}
        >
          <div className={`flex items-center justify-between border-b px-4 py-3 font-mono text-xs tracking-[0.3em] ${styles.header}`}>
            <span className="inline-flex items-center gap-2">
              <FaTerminal className={styles.accent} />
              infra/ stack.yaml • tracked • drift checked
            </span>
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${styles.chip}`}>
              {mode === 'day' ? <FaSun /> : <FaMoon />}
              {mode === 'day' ? 'day' : 'night'}
            </span>
          </div>

          <div className={`px-4 py-5 font-mono text-sm ${styles.body}`}>
            <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#3FB950]">
                  <span className="h-2 w-2 rounded-full bg-[#3FB950]" /> stack
                </div>
                <div className="space-y-2 text-[13px] leading-7">
                  {stackRows.map((row, index) => (
                    <div key={row.key} className="grid grid-cols-[2.5rem_1fr] gap-3">
                      <span className={styles.muted}>{index + 1}</span>
                      <span>
                        <span className={styles.accent}>{row.label}</span>: <span className={styles.muted}>[{row.items.join(', ')}]</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div className={`rounded-2xl border px-4 py-3 text-xs ${styles.chip}`}>
                  mode: automate_the_repetitive <span className={styles.muted}># release calm • automate toil • secure by default</span>
                </div>
              </div>

              <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {skillCategories.map((group) => (
                    <div key={group.category} className={`rounded-2xl border p-4 ${styles.card}`}>
                      <p className={`text-xs uppercase tracking-[0.3em] ${styles.accent}`}>{group.category}</p>
                      <p className={`mt-2 text-sm leading-6 ${styles.muted}`}>{group.skills.map((skill) => skill.name).join(', ')}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {cards.map((card) => (
                    <div key={card.title} className={`rounded-2xl border p-4 ${styles.card}`}>
                      <p className={`text-xs uppercase tracking-[0.35em] ${styles.accent}`}>• {card.label}</p>
                      <h4 className="mt-3 text-base font-semibold">{card.title}</h4>
                      <p className={`mt-2 text-sm leading-6 ${styles.muted}`}>{card.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}