export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
}

export interface AchievementState {
  unlockedAchievements: string[]
  totalPoints: number
  incidentsCompleted: number
}

export const achievements: Achievement[] = [
  {
    id: 'incident-commander',
    name: 'Incident Commander',
    description: 'Complete your first incident',
    icon: '🎖️',
    points: 50,
  },
  {
    id: 'kubernetes-expert',
    name: 'Kubernetes Expert',
    description: 'Successfully resolve 3 Kubernetes incidents',
    icon: '⚙️',
    points: 100,
  },
  {
    id: 'devops-master',
    name: 'DevOps Master',
    description: 'Reach 500 total points',
    icon: '🚀',
    points: 0,
  },
  {
    id: 'gitops-master',
    name: 'GitOps Master',
    description: 'Use git and helm commands in 5 incidents',
    icon: '🔄',
    points: 75,
  },
  {
    id: 'quick-responder',
    name: 'Quick Responder',
    description: 'Resolve incident with less than 10 commands',
    icon: '⚡',
    points: 60,
  },
  {
    id: 'observability-specialist',
    name: 'Observability Specialist',
    description: 'Use 15+ different diagnostic commands',
    icon: '📊',
    points: 80,
  },
  {
    id: 'infrastructure-engineer',
    name: 'Infrastructure Engineer',
    description: 'Complete all incident scenarios',
    icon: '🏗️',
    points: 120,
  },
]

export function checkAchievements(state: AchievementState, newScore: number, incidentCompleted: boolean): string[] {
  const unlocked: string[] = []

  if (
    incidentCompleted &&
    !state.unlockedAchievements.includes('incident-commander')
  ) {
    state.unlockedAchievements.push('incident-commander')
    state.totalPoints += 50
    unlocked.push('🎖️ ACHIEVEMENT UNLOCKED: Incident Commander (+50 points)')
  }

  if (
    state.incidentsCompleted >= 3 &&
    !state.unlockedAchievements.includes('kubernetes-expert')
  ) {
    state.unlockedAchievements.push('kubernetes-expert')
    state.totalPoints += 100
    unlocked.push('⚙️ ACHIEVEMENT UNLOCKED: Kubernetes Expert (+100 points)')
  }

  if (newScore >= 500 && !state.unlockedAchievements.includes('devops-master')) {
    state.unlockedAchievements.push('devops-master')
    unlocked.push('🚀 ACHIEVEMENT UNLOCKED: DevOps Master (+500 points)')
  }

  if (newScore >= 100 && !state.unlockedAchievements.includes('quick-responder')) {
    state.unlockedAchievements.push('quick-responder')
    state.totalPoints += 60
    unlocked.push('⚡ ACHIEVEMENT UNLOCKED: Quick Responder (+60 points)')
  }

  return unlocked
}

export function getAchievementStats(state: AchievementState): string[] {
  return [
    'Your Achievements:',
    ...state.unlockedAchievements.map((id) => {
      const achievement = achievements.find((a) => a.id === id)
      return achievement ? `${achievement.icon} ${achievement.name} - ${achievement.description}` : ''
    }),
    '',
    `Total Points: ${state.totalPoints}`,
    `Incidents Completed: ${state.incidentsCompleted}`,
    '',
    `Locked Achievements:`,
    ...achievements
      .filter((a) => !state.unlockedAchievements.includes(a.id))
      .map((a) => `  - ${a.name}: ${a.description}`),
  ]
}
