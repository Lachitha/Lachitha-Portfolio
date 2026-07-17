import { certifications, experience, kubernetesCommands, profile, projects, skillCategories } from '../data/portfolioData'

const commandList = [
  'help',
  'about',
  'skills',
  'experience',
  'projects',
  'project',
  'resume',
  'contact',
  'github',
  'linkedin',
  'certifications',
  'kubectl get skills',
  'kubectl get projects',
  'kubectl get pods',
  'docker ps',
  'helm list',
  'terraform version',
  'clear',
]

export function completeCommand(input: string) {
  const trimmed = input.trim()
  if (!trimmed) {
    return input
  }
  const matches = commandList.filter((command) => command.startsWith(trimmed))
  return matches.length === 1 ? matches[0] : input
}

export function executeTerminalCommand(input: string) {
  const command = input.trim().toLowerCase()

  if (!command) {
    return []
  }

  if (command === 'help') {
    return [
      'Available commands:',
      '  help, about, skills, experience, projects, project <number>, certifications',
      '  resume, contact, github, linkedin, kubectl get skills, kubectl get projects',
      '  kubectl get pods, docker ps, helm list, terraform version, clear',
    ]
  }

  if (command === 'about') {
    return [
      `Name: ${profile.name}`,
      `Role: ${profile.role}`,
      `Title: ${profile.title}`,
      `Summary: ${profile.summary}`,
      `Location: ${profile.location}`,
    ]
  }

  if (command === 'skills') {
    return [
      'Skill matrix:',
      ...skillCategories.flatMap((group) => [`${group.category}:`, ...group.skills.map((item) => `  - ${item.name} ${item.level}%`)]),
    ]
  }

  if (command === 'experience') {
    return [
      'Experience timeline:',
      ...experience.flatMap((item) => [`${item.company} — ${item.role} (${item.period})`, ...item.highlights.map((highlight) => `  • ${highlight}`)]),
    ]
  }

  if (command === 'projects') {
    return ['Projects:', ...projects.map((project, index) => `${index + 1}. ${project.title} — ${project.category}`)]
  }

  if (command.startsWith('project ')) {
    const index = Number.parseInt(command.split(' ')[1], 10)
    if (Number.isNaN(index) || index < 1 || index > projects.length) {
      return ['Project not found. Try: project 1']
    }
    const project = projects[index - 1]
    return [
      `Project ${index}: ${project.title}`,
      `Description: ${project.summary}`,
      `Architecture: ${project.architecture}`,
      `Technologies: ${project.stack.join(', ')}`,
      `Challenges: ${project.challenges.join(', ')}`,
      `Solutions: ${project.solutions.join(', ')}`,
      `GitHub: ${project.github}`,
      `Demo: ${project.demo}`,
    ]
  }

  if (command === 'resume') {
    return ['Resume loaded.', `Download: ${profile.resume}`]
  }

  if (command === 'contact') {
    return [
      `Email: ${profile.email}`,
      `GitHub: ${profile.github}`,
      `LinkedIn: ${profile.linkedin}`,
      `Location: ${profile.location}`,
    ]
  }

  if (command === 'github') {
    return [`Opening ${profile.github} ...`]
  }

  if (command === 'linkedin') {
    return [`Opening ${profile.linkedin} ...`]
  }

  if (command === 'certifications') {
    return ['Certifications:', ...certifications.map((item) => `${item.badge} — ${item.title} (${item.provider}, ${item.issued})`)]
  }

  if (command === 'kubectl get skills') {
    return ['NAME             STATUS', 'kubernetes       Ready', 'docker           Ready', 'terraform        Ready', 'prometheus       Ready', 'grafana          Ready', 'gitops           Ready']
  }

  if (command === 'kubectl get projects') {
    return [
      'NAME                           READY   STATUS',
      'kubernetes-observability       1/1     Running',
      'gitops-deployment-platform     1/1     Running',
      'thanos-storage-optimization    1/1     Running',
      'otel-integration               1/1     Running',
    ]
  }

  if (command === 'kubectl get pods') {
    return kubernetesCommands[0]?.output ?? ['No pods found']
  }

  if (command === 'docker ps') {
    return ['CONTAINER ID   IMAGE                   COMMAND                  STATUS        PORTS', '9f3a1c2d2b      portfolio:latest        "npm run start"          Up 2h         0.0.0.0:80->80/tcp']
  }

  if (command === 'helm list') {
    return ['NAME                NAMESPACE   REVISION   UPDATED', 'portfolio-platform   infra       18         2026-07-17 09:42:13']
  }

  if (command === 'terraform version') {
    return ['Terraform v1.9.8 on darwin_arm64']
  }

  if (command === 'clear') {
    return ['clear']
  }

  return [`Command not found: ${input}`]
}

export { commandList }
