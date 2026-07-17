export interface SkillCategory {
  category: string
  skills: Array<{
    name: string
    level: number
    color: string
    icon?: string
  }>
}

export interface ExperienceItem {
  company: string
  role: string
  period: string
  summary: string
  highlights: string[]
}

export interface ProjectItem {
  title: string
  summary: string
  architecture: string
  stack: string[]
  challenges: string[]
  solutions: string[]
  github: string
  demo: string
  category: string
}

export interface CertificationItem {
  title: string
  issuer: string
  provider: string
  year: string
  issued: string
  badge: string
  logo: string
}

export interface DashboardMetric {
  label: string
  value: string
  detail: string
  tone: 'success' | 'primary' | 'warning' | 'error'
}

export interface MonitorMetric {
  label: string
  value: string
  series: number[]
}

export interface ChartSeriesPoint {
  name: string
  value: number
}
