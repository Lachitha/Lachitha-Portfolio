import { certifications, experience, profile, projects, skillCategories } from '../data/portfolioData'
import { getIncidentList } from './incidentSimulator'

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
  'achievements',
  'play',
  'kubectl get nodes',
  'kubectl get pods',
  'kubectl get services',
  'kubectl describe node',
  'kubectl logs',
  'kubectl set resources',
  'kubectl rollout restart',
  'docker ps',
  'docker images',
  'helm list',
  'helm status',
  'terraform plan',
  'terraform apply',
  'terraform state',
  'git log',
  'git status',
  'git diff',
  'grep',
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
      '',
      'Portfolio Navigation:',
      '  about              - Display profile information',
      '  skills             - List all technical skills',
      '  experience         - View work experience',
      '  projects           - List all projects',
      '  project <number>   - View specific project details',
      '  certifications     - Show industry credentials',
      '  achievements       - Display unlocked achievements & points',
      '  resume             - Download resume',
      '  contact            - Display contact information',
      '  github, linkedin   - Open social profiles',
      '',
      'DevOps Commands:',
      '  kubectl get nodes|pods|services    - List cluster resources',
      '  kubectl describe node <name>       - Get node details',
      '  kubectl logs <pod-name>            - View pod logs',
      '  kubectl set resources <deployment> - Update resource limits',
      '  kubectl rollout restart <deployment> - Restart deployment',
      '',
      'Container & Infrastructure:',
      '  docker ps          - List running containers',
      '  docker images      - List available images',
      '  helm list          - List Helm releases',
      '  helm status <name> - Get release status',
      '  terraform plan     - Plan infrastructure changes',
      '  terraform apply    - Apply infrastructure changes',
      '  terraform state    - Show infrastructure state',
      '  git log|status|diff - Git repository status',
      '  grep               - Search logs and output',
      '',
      'Interactive:',
      '  play               - Start Kubernetes Incident Simulator',
      '  play <incident>    - Launch specific incident',
      '',
      'System:',
      '  clear              - Clear terminal screen',
      '',
      'Type "play" to launch the Kubernetes Incident Simulator!',
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

  if (command === 'achievements') {
    return [
      'Your Achievements:',
      '🎖️ Incident Commander - Complete your first incident',
      '⚙️ Kubernetes Expert - Successfully resolve 3 Kubernetes incidents',
      '🚀 DevOps Master - Reach 500 total points',
      '🔄 GitOps Master - Use git and helm commands in 5 incidents',
      '⚡ Quick Responder - Resolve incident with less than 10 commands',
      '📊 Observability Specialist - Use 15+ different diagnostic commands',
      '🏗️ Infrastructure Engineer - Complete all incident scenarios',
      '',
      'Run "play" to start earning achievements!',
    ]
  }

  if (command === 'play' || command === 'play incidents') {
    return getIncidentList()
  }

  if (command === 'play production-outage') {
    return [
      'Starting incident: production-outage',
      'Scenario: Critical payment service down with resource exhaustion',
      'Use kubectl, helm, docker, git commands to diagnose and fix',
      'Type "status" to check cluster health',
      'Type "quit" to exit incident mode',
    ]
  }

  if (command === 'kubectl get nodes') {
    return [
      'NAME     STATUS   ROLES                  AGE   VERSION',
      'node-1   Ready    control-plane,master   45d   v1.30.4',
      'node-2   Ready    worker                 45d   v1.30.4',
      'node-3   Ready    worker                 42d   v1.30.4',
    ]
  }

  if (command === 'kubectl get pods' || command === 'kubectl get pods -a') {
    return [
      'NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE',
      'kube-system   coredns-7b99855c9d-1a2b3                   1/1     Running   2          45d',
      'kube-system   etcd-node-1                                1/1     Running   1          45d',
      'kube-system   kube-apiserver-node-1                      1/1     Running   2          45d',
      'default       portfolio-app-5d7c8f4d9b-a1b2c            2/2     Running   0          7d',
      'default       api-gateway-8c9d3e2f1a-x9y8z              1/1     Running   0          7d',
      'monitoring    prometheus-0                               2/2     Running   0          30d',
      'monitoring    grafana-deployment-5a6b7c-d9e0f           1/1     Running   0          30d',
    ]
  }

  if (command === 'kubectl get services') {
    return [
      'NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)',
      'kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP',
      'api-gateway  ClusterIP   10.96.1.10      <none>        8080/TCP',
      'portfolio    ClusterIP   10.96.1.20      <none>        80/TCP',
      'prometheus   ClusterIP   10.96.1.30      <none>        9090/TCP',
      'grafana      ClusterIP   10.96.1.40      <none>        3000/TCP',
    ]
  }

  if (command.startsWith('kubectl describe node')) {
    return [
      'Name:               node-1',
      'Roles:              control-plane,master',
      'Status:             Ready',
      'Allocatable:        cpu: 4, memory: 16Gi, pods: 110',
      'Allocated resources:',
      '  cpu:    1.85 (46%)',
      '  memory: 7.5Gi (47%)',
      'Conditions:',
      '  Ready                   True',
      '  MemoryPressure         False',
      '  DiskPressure           False',
      '  PIDPressure            False',
    ]
  }

  if (command.startsWith('kubectl logs')) {
    return [
      '2026-07-18T10:45:23.123Z INFO Starting application',
      '2026-07-18T10:45:24.456Z INFO Connected to database',
      '2026-07-18T10:45:25.789Z INFO API listening on :8080',
      '2026-07-18T10:45:26.101Z INFO Health check passed',
      '2026-07-18T10:45:30.234Z INFO Received request from 192.168.1.100',
      '2026-07-18T10:45:30.567Z INFO Request processed successfully',
    ]
  }

  if (command.startsWith('kubectl set resources') || command.startsWith('kubectl rollout')) {
    return ['deployment.apps/portfolio scaled', 'rollout status: 3/3 updated', 'Deployment successfully updated']
  }

  if (command === 'docker ps') {
    return [
      'CONTAINER ID   IMAGE                   COMMAND                  STATUS        PORTS',
      '9f3a1c2d2b1a   portfolio:latest        "npm run start"          Up 7 days     0.0.0.0:3000->3000/tcp',
      'a1b2c3d4e5f6   prometheus:latest       "/bin/prometheus"        Up 30 days    0.0.0.0:9090->9090/tcp',
      'x9y8z7w6v5u4   grafana:latest          "/run.sh"                 Up 30 days    0.0.0.0:3000->3000/tcp',
      'd1e2f3a4b5c6   nginx:latest            "nginx -g daemon off"    Up 45 days    0.0.0.0:80->80/tcp',
    ]
  }

  if (command === 'docker images') {
    return [
      'REPOSITORY            TAG            IMAGE ID         SIZE',
      'portfolio             latest         abc123def456     512MB',
      'prometheus            latest         def456abc789     384MB',
      'grafana               latest         xyz789uvw123     256MB',
      'nginx                 latest         123abc456def     142MB',
      'kubernetes/pause      3.9            pause123456      768KB',
    ]
  }

  if (command === 'helm list') {
    return [
      'NAME           NAMESPACE   REVISION   UPDATED                  STATUS     CHART',
      'portfolio      default     5          2026-07-17 15:30:00 UTC  deployed   portfolio-1.2.3',
      'prometheus     monitoring  3          2026-06-18 10:15:00 UTC  deployed   prometheus-21.0.0',
      'grafana        monitoring  2          2026-06-18 10:20:00 UTC  deployed   grafana-7.0.0',
      'nginx-ingress  ingress     4          2026-07-10 08:00:00 UTC  deployed   nginx-ingress-4.8.0',
    ]
  }

  if (command.startsWith('helm status')) {
    return ['STATUS: deployed', 'REVISION: 5', 'RELEASED: Tue Jul 17 15:30:00 2026 UTC', 'CHART: portfolio-1.2.3', 'APP VERSION: 1.2.3']
  }

  if (command === 'terraform plan') {
    return [
      'Terraform will perform the following actions:',
      '',
      'No changes. Your infrastructure matches the configuration.',
      '',
      'Apply complete! Resources: 0 added, 0 changed, 0 destroyed.',
    ]
  }

  if (command === 'terraform apply') {
    return ['Terraform will perform the following actions:', 'Apply complete! Resources: 0 added, 0 changed, 0 destroyed.', 'Infrastructure up to date.']
  }

  if (command === 'terraform state') {
    return [
      'Outputs:',
      '',
      'cluster_name = "lachitha-k8s-prod"',
      'cluster_endpoint = "https://lachitha-k8s.eks.amazonaws.com"',
      'region = "us-east-1"',
      'node_count = 3',
    ]
  }

  if (command === 'git log') {
    return [
      'commit abc123def - Update deployment manifests (3 days ago)',
      'commit def456ghi - Add observability metrics (1 week ago)',
      'commit ghi789jkl - Fix resource limits in helm charts (2 weeks ago)',
      'commit jkl012mno - Initial kubernetes setup (1 month ago)',
    ]
  }

  if (command === 'git status') {
    return ['On branch main', 'Your branch is up to date with origin/main.', '', 'nothing to commit, working tree clean']
  }

  if (command === 'git diff') {
    return [
      'diff --git a/k8s/deployment.yaml b/k8s/deployment.yaml',
      '--- a/k8s/deployment.yaml',
      '+++ b/k8s/deployment.yaml',
      '@@ -10,7 +10,7 @@ spec:',
      '   memory: "128Mi"',
      '-  cpu: "100m"',
      '+  cpu: "200m"',
      ' requests:',
      '   memory: "64Mi"',
    ]
  }

  if (command.includes('grep')) {
    const searchTerm = command.split('grep')[1]?.trim() || ''
    if (searchTerm) {
      return [
        `Searching for: ${searchTerm}`,
        'pod-abc123: Ready 1/1',
        'pod-def456: Running',
        'pod-ghi789: Completed',
        '3 results found',
      ]
    }
    return ['grep: grep: command not recognized. Use grep <pattern>']
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

  if (command === 'clear') {
    return ['clear']
  }

  return [`Command not found: ${input}`]
}

export { commandList }
