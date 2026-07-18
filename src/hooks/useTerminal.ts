import { useEffect, useMemo, useRef, useState } from 'react'
import { completeCommand, executeTerminalCommand } from '../terminal/commandRegistry'
import type { IncidentState } from '../terminal/incidentSimulator'
import { createIncident, getIncidentStatus, processIncidentCommand } from '../terminal/incidentSimulator'
import type { AchievementState } from '../terminal/achievements'

export interface TerminalEntry {
  type: 'command' | 'output'
  content: string
}

export function useTerminal() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const [entries, setEntries] = useState<TerminalEntry[]>([
    { type: 'output', content: 'Initializing DevOps Environment...' },
    { type: 'output', content: '[✓] Loading Kubernetes' },
    { type: 'output', content: '[✓] Loading Cloud Infrastructure' },
    { type: 'output', content: '[✓] Loading GitOps Pipeline' },
    { type: 'output', content: '[✓] Loading Observability Stack' },
    { type: 'output', content: '[✓] Loading Automation Framework' },
    { type: 'output', content: 'System Ready' },
    { type: 'output', content: 'lachitha@portfolio:~$ whoami' },
    { type: 'output', content: 'Lachitha Yapa' },
    { type: 'output', content: 'Infrastructure Engineer' },
    { type: 'output', content: 'DevOps Engineer' },
    { type: 'output', content: 'Cloud Infrastructure Engineer' },
    { type: 'output', content: 'Kubernetes Enthusiast' },
    { type: 'output', content: 'Type "help" to begin. Type "play" to start the Kubernetes Incident Simulator.' },
  ])
  const [cursorVisible, setCursorVisible] = useState(true)
  const [incidentMode, setIncidentMode] = useState<IncidentState | null>(null)
  const [achievements, setAchievements] = useState<AchievementState>({
    unlockedAchievements: [],
    totalPoints: 0,
    incidentsCompleted: 0,
  })
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => setCursorVisible((value) => !value), 500)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [entries])

  const prompt = useMemo(() => 'lachitha@portfolio:~$', [])

  const submitCommand = (value: string) => {
    const command = value.trim()
    if (!command) {
      return
    }

    const nextEntries: TerminalEntry[] = [...entries, { type: 'command', content: `${prompt}$ ${command}` }]

    // Handle incident mode
    if (incidentMode) {
      if (command.toLowerCase() === 'quit' || command.toLowerCase() === 'exit') {
        const finalScore = incidentMode.score
        setIncidentMode(null)
        const renderedOutput: TerminalEntry[] = [
          { type: 'output', content: `Incident mode ended. Final Score: ${finalScore}` },
          { type: 'output', content: 'Back to normal terminal.' },
        ]
        setEntries([...nextEntries, ...renderedOutput])
      } else if (command.toLowerCase() === 'status') {
        const statusLines = getIncidentStatus(incidentMode)
        const renderedOutput: TerminalEntry[] = statusLines.map((line) => ({ type: 'output', content: line }))
        setEntries([...nextEntries, ...renderedOutput])
      } else {
        const { response, updatedState } = processIncidentCommand(incidentMode, command)
        setIncidentMode(updatedState)

        if (updatedState.completed) {
          setAchievements((current) => ({
            ...current,
            incidentsCompleted: current.incidentsCompleted + 1,
            totalPoints: current.totalPoints + updatedState.score,
          }))
        }

        const renderedOutput: TerminalEntry[] = response.map((line) => ({ type: 'output', content: line }))
        setEntries([...nextEntries, ...renderedOutput])
      }
    } else {
      // Normal terminal mode
      const output = executeTerminalCommand(command)

      if (command.toLowerCase().startsWith('play ')) {
        const incidentName = command.slice(5).trim().toLowerCase()
        try {
          const newIncident = createIncident(incidentName)
          setIncidentMode(newIncident)
          const renderedOutput: TerminalEntry[] = [
            { type: 'output', content: `Starting incident: ${incidentName}` },
            { type: 'output', content: 'Use kubectl, helm, terraform, docker, and git commands to fix the issue.' },
            { type: 'output', content: 'Type "status" to check cluster health' },
            { type: 'output', content: 'Type "quit" to exit incident mode' },
            { type: 'output', content: '' },
            ...getIncidentStatus(newIncident).map((line): TerminalEntry => ({ type: 'output', content: line })),
          ]
          setEntries([...nextEntries, ...renderedOutput])
        } catch (error) {
          const renderedOutput: TerminalEntry[] = [{ type: 'output', content: error instanceof Error ? error.message : 'Invalid incident' }]
          setEntries([...nextEntries, ...renderedOutput])
        }
      } else if (output[0] === 'clear') {
        setEntries([{ type: 'output', content: 'Console cleared.' }])
      } else {
        const renderedOutput: TerminalEntry[] = output.map((line) => ({ type: 'output', content: line }))
        setEntries([...nextEntries, ...renderedOutput])
      }
    }

    setHistory((current) => (command && current[current.length - 1] !== command ? [...current, command] : current))
    setHistoryIndex(null)
    setInput('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (history.length === 0) {
        return
      }
      const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(history[nextIndex])
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (history.length === 0) {
        return
      }
      const nextIndex = historyIndex === null ? null : Math.min(history.length - 1, historyIndex + 1)
      setHistoryIndex(nextIndex)
      if (nextIndex === null) {
        setInput('')
      } else {
        setInput(history[nextIndex])
      }
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      const suggestion = completeCommand(input)
      if (suggestion) {
        setInput(suggestion)
      }
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      submitCommand(input)
    }
  }

  return {
    input,
    setInput,
    entries,
    prompt,
    cursorVisible,
    inputRef,
    handleKeyDown,
    incidentMode,
    achievements,
  }
}
