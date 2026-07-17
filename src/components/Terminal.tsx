import { AnimatePresence, motion } from 'framer-motion'
import { useTerminal } from '../hooks/useTerminal'

interface TerminalProps {
  mode?: 'day' | 'night'
}

const terminalTheme = {
  day: {
    shell: 'border-[#D0D7DE] bg-[#FFFFFF] shadow-[0_0_80px_rgba(31,35,40,0.08)]',
    header: 'border-[#D0D7DE] bg-[#F8FAFC]',
    body: 'bg-[#FFFFFF] text-[#24292F]',
    output: 'text-[#24292F]',
    prompt: 'text-[#1F883D]',
    input: 'text-[#111827]',
    muted: 'text-[#57606A]',
  },
  night: {
    shell: 'border-white/10 bg-[#0D1117]/90 shadow-[0_0_80px_rgba(0,0,0,0.35)]',
    header: 'border-white/10 bg-[#161B22]',
    body: 'bg-[#0D1117] text-[#C9D1D9]',
    output: 'text-[#C9D1D9]',
    prompt: 'text-[#58A6FF]',
    input: 'text-[#F0F6FC]',
    muted: 'text-[#8B949E]',
  },
}

export function Terminal({ mode = 'night' }: TerminalProps) {
  const { input, setInput, entries, prompt, cursorVisible, inputRef, handleKeyDown } = useTerminal()
  const styles = terminalTheme[mode]

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`overflow-hidden rounded-[2rem] border ${styles.shell}`}
    >
      <div className={`flex items-center gap-2 border-b px-4 py-3 ${styles.header}`}>
        <span className="h-3 w-3 rounded-full bg-[#F85149]" />
        <span className="h-3 w-3 rounded-full bg-[#F2CC60]" />
        <span className="h-3 w-3 rounded-full bg-[#3FB950]" />
        <span className={`ml-3 text-xs uppercase tracking-[0.35em] ${styles.muted}`}>devops-terminal</span>
      </div>
      <div className={`max-h-[520px] overflow-y-auto p-4 font-mono text-sm sm:p-6 ${styles.body}`}>
        <AnimatePresence mode="popLayout">
          {entries.map((entry, index) => (
            <motion.div
              key={`${entry.content}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`mb-2 whitespace-pre-wrap ${entry.type === 'command' ? styles.prompt : styles.output}`}
            >
              {entry.content}
            </motion.div>
          ))}
        </AnimatePresence>
        <div className={`mt-2 flex items-center gap-2 ${styles.prompt}`}>
          <span>{prompt}</span>
          <input
            ref={inputRef}
            aria-label="Terminal input"
            value={input}
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full bg-transparent outline-none ${styles.input}`}
          />
          <span className={`ml-1 h-4 w-2 ${styles.prompt} ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </div>
    </motion.div>
  )
}
