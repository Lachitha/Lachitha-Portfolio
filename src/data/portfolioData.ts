import type { CertificationItem, DashboardMetric, ExperienceItem, MonitorMetric, ProjectItem, SkillCategory } from '../types'

export const profile = {
  name: 'Lachitha Yapa',
  role: 'Associate Infrastructure Engineer',
  title: 'DevOps Engineer',
  subtitle: 'DevOps Engineer | Kubernetes | Cloud Infrastructure | Observability',
  experience: '2025 — Present',
  interests: ['Kubernetes platform engineering', 'Cloud infrastructure', 'GitOps automation', 'Observability'],
  mission: 'Design resilient, automated platforms that help engineering teams ship safely and quickly.',
  summary:
    'Infrastructure engineer specializing in Kubernetes platforms, cloud infrastructure, GitOps automation, CI/CD pipelines, monitoring, and production reliability.',
  organization: 'Sitecore',
  previousOrganization: 'Virtusa',
  email: 'lachitha@yapa.dev',
  github: 'https://github.com/lachitha',
  linkedin: 'https://linkedin.com/in/lachitha',
  resume: '/resume.pdf',
  location: 'Sri Lanka',
}

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Terminal', href: '#terminal' },
  { label: 'Contact', href: '#contact' },
]

export const skillCategories: SkillCategory[] = [
  {
    category: 'Container Platform',
    skills: [
      { name: 'Kubernetes', level: 95, color: 'bg-[#58A6FF]', icon: 'kubernetes' },
      { name: 'AKS', level: 92, color: 'bg-[#3FB950]', icon: 'azure' },
      { name: 'Docker', level: 90, color: 'bg-[#F2CC60]', icon: 'docker' },
      { name: 'Helm', level: 88, color: 'bg-[#8B5CF6]', icon: 'helm' },
      { name: 'Kubernetes Operators', level: 80, color: 'bg-[#58A6FF]' },
      { name: 'Container Networking', level: 82, color: 'bg-[#3FB950]' },
      { name: 'RBAC', level: 85, color: 'bg-[#F2CC60]' },
    ],
  },
  {
    category: 'GitOps',
    skills: [
      { name: 'FluxCD', level: 90, color: 'bg-[#58A6FF]', icon: 'gitops' },
      { name: 'ArgoCD', level: 88, color: 'bg-[#3FB950]', icon: 'gitops' },
      { name: 'HelmRelease', level: 84, color: 'bg-[#F2CC60]' },
      { name: 'GitHub Actions', level: 90, color: 'bg-[#8B5CF6]', icon: 'github' },
      { name: 'Azure DevOps', level: 84, color: 'bg-[#58A6FF]', icon: 'azure' },
    ],
  },
  {
    category: 'Cloud',
    skills: [
      { name: 'Azure AKS', level: 92, color: 'bg-[#58A6FF]', icon: 'azure' },
      { name: 'Azure Monitor', level: 84, color: 'bg-[#3FB950]' },
      { name: 'Storage', level: 80, color: 'bg-[#F2CC60]' },
      { name: 'Networking', level: 84, color: 'bg-[#8B5CF6]' },
      { name: 'EKS', level: 76, color: 'bg-[#58A6FF]', icon: 'aws' },
      { name: 'ECS', level: 72, color: 'bg-[#3FB950]' },
      { name: 'ECR', level: 78, color: 'bg-[#F2CC60]' },
      { name: 'IAM', level: 82, color: 'bg-[#8B5CF6]' },
    ],
  },
  {
    category: 'Observability',
    skills: [
      { name: 'Prometheus', level: 92, color: 'bg-[#58A6FF]', icon: 'prometheus' },
      { name: 'Grafana', level: 91, color: 'bg-[#3FB950]', icon: 'grafana' },
      { name: 'Alertmanager', level: 86, color: 'bg-[#F2CC60]' },
      { name: 'Loki', level: 84, color: 'bg-[#8B5CF6]' },
      { name: 'Thanos', level: 80, color: 'bg-[#58A6FF]' },
      { name: 'OpenTelemetry', level: 88, color: 'bg-[#3FB950]' },
      { name: 'Elastic APM', level: 76, color: 'bg-[#F2CC60]' },
    ],
  },
  {
    category: 'Infrastructure Automation',
    skills: [
      { name: 'Terraform', level: 92, color: 'bg-[#58A6FF]', icon: 'terraform' },
      { name: 'Bash', level: 94, color: 'bg-[#3FB950]', icon: 'linux' },
      { name: 'Python', level: 84, color: 'bg-[#F2CC60]' },
      { name: 'YAML', level: 90, color: 'bg-[#8B5CF6]' },
      { name: 'Linux', level: 95, color: 'bg-[#58A6FF]', icon: 'linux' },
    ],
  },
]

export const experience: ExperienceItem[] = [
  {
    company: 'Sitecore',
    role: 'Associate Infrastructure Engineer',
    period: '2025 - Present',
    summary: 'Owns production Kubernetes operations, GitOps delivery, monitoring pipelines, and incident response for critical internal services.',
    highlights: [
      'Kubernetes platform operations and production troubleshooting',
      'Azure Kubernetes Service administration and GitOps deployments',
      'Monitoring and alerting with Prometheus and Grafana',
      'Infrastructure automation and incident response',
    ],
  },
  {
    company: 'Virtusa',
    role: 'Intern DevOps Engineer',
    period: '2023 - 2024',
    summary: 'Built CI/CD pipelines and containerized workloads for enterprise applications.',
    highlights: [
      'Docker and Kubernetes workload delivery',
      'Jenkins and Azure DevOps pipeline support',
      'Terraform automation, Linux administration, and CI/CD pipelines',
    ],
  },
]

export const projects: ProjectItem[] = [
  {
    title: 'Kubernetes Observability Platform',
    summary: 'Designed monitoring and observability solutions for Kubernetes environments.',
    architecture: 'AKS + Prometheus + Grafana + Loki + Alertmanager + Thanos',
    stack: ['Kubernetes', 'Prometheus', 'Grafana', 'Loki', 'Alertmanager', 'Thanos'],
    challenges: ['Alert noise', 'Long-term storage', 'Signal correlation'],
    solutions: ['Centralized telemetry pipelines', 'Reduced alert fatigue', 'Improved cluster visibility'],
    github: 'https://github.com/lachitha/monitoring-platform',
    demo: 'https://example.com/monitoring',
    category: 'Observability',
  },
  {
    title: 'GitOps Deployment Platform',
    summary: 'Implemented declarative application delivery using GitOps principles.',
    architecture: 'FluxCD + Helm + Kubernetes',
    stack: ['FluxCD', 'Helm', 'Kubernetes'],
    challenges: ['Safe reconciliation', 'Team ownership', 'Release consistency'],
    solutions: ['Declarative app delivery', 'Git as source of truth', 'Automated sync workflows'],
    github: 'https://github.com/lachitha/gitops-platform',
    demo: 'https://example.com/gitops',
    category: 'GitOps',
  },
  {
    title: 'Thanos Storage Optimization',
    summary: 'Analyzed metrics storage usage and optimized long-term monitoring storage.',
    architecture: 'Thanos + Prometheus + Kubernetes PVC',
    stack: ['Thanos', 'Prometheus', 'Kubernetes PVC'],
    challenges: ['Retention costs', 'Query latency', 'Storage planning'],
    solutions: ['Optimized retention windows', 'Storage compaction tuning', 'Lowered query cost'],
    github: 'https://github.com/lachitha/thanos-optimization',
    demo: 'https://example.com/thanos',
    category: 'Storage',
  },
  {
    title: 'OpenTelemetry Integration',
    summary: 'Implemented distributed tracing and application observability.',
    architecture: 'OpenTelemetry + Elastic APM + Kubernetes',
    stack: ['OpenTelemetry', 'Elastic APM', 'Kubernetes'],
    challenges: ['Trace consistency', 'Service mapping', 'Instrumentation overhead'],
    solutions: ['Unified tracing setup', 'Service-level visibility', 'Better debugging workflow'],
    github: 'https://github.com/lachitha/otel-integration',
    demo: 'https://example.com/otel',
    category: 'Observability',
  },
]

export const certifications: CertificationItem[] = [
  { title: 'LFS162: Introduction to DevOps and SRE', issuer: 'Linux Foundation', provider: 'Linux Foundation', year: '2024', issued: 'Jun 2024', badge: 'LFS162', logo: 'linux' },
  { title: 'LFS169: Introduction to GitOps', issuer: 'Linux Foundation', provider: 'Linux Foundation', year: '2024', issued: 'Aug 2024', badge: 'LFS169', logo: 'linux' },
  { title: 'LFS158: Introduction to Kubernetes', issuer: 'Linux Foundation', provider: 'Linux Foundation', year: '2023', issued: 'Oct 2023', badge: 'LFS158', logo: 'linux' },
  { title: 'AWS Educate Getting Started with Cloud Operations', issuer: 'AWS', provider: 'AWS', year: '2023', issued: 'Nov 2023', badge: 'AWS', logo: 'aws' },
  { title: 'OCI Foundations Associate', issuer: 'Oracle', provider: 'Oracle Cloud', year: '2022', issued: 'May 2022', badge: 'OCI', logo: 'oracle' },
  { title: 'Terraform', issuer: 'LinkedIn Learning', provider: 'LinkedIn', year: '2022', issued: 'Jul 2022', badge: 'TF', logo: 'linkedin' },
  { title: 'Product Security', issuer: 'LinkedIn Learning', provider: 'LinkedIn', year: '2022', issued: 'Sep 2022', badge: 'SEC', logo: 'linkedin' },
]

export const dashboardMetrics: DashboardMetric[] = [
  { label: 'Kubernetes Experience', value: '2+ Years', detail: 'Production cluster operations', tone: 'primary' },
  { label: 'Cloud Platforms', value: 'Azure + AWS', detail: 'Multi-cloud infrastructure', tone: 'success' },
  { label: 'Monitoring Tools', value: '10+', detail: 'Prometheus, Grafana, Loki, Thanos', tone: 'warning' },
  { label: 'Certifications', value: '8', detail: 'Cloud and DevOps credentials', tone: 'success' },
  { label: 'Production Support', value: 'Active', detail: 'Troubleshooting and incident response', tone: 'primary' },
  { label: 'Automation Level', value: 'High', detail: 'IaC, CI/CD, and GitOps', tone: 'warning' },
]

export const monitoringMetrics: MonitorMetric[] = [
  { label: 'Kubernetes Cluster Health', value: '98%', series: [90, 92, 94, 96, 97, 98] },
  { label: 'Deployment Frequency', value: '24/wk', series: [8, 10, 12, 16, 20, 24] },
  { label: 'Monitoring Status', value: 'Healthy', series: [88, 90, 92, 94, 96, 98] },
  { label: 'Infrastructure Uptime', value: '99.99%', series: [99.7, 99.75, 99.8, 99.85, 99.9, 99.99] },
]

export const heroStats = [
  { label: 'Current Organization', value: 'Sitecore' },
  { label: 'Previous Experience', value: 'Virtusa' },
  { label: 'Location', value: 'Sri Lanka' },
]

export const skillHighlights = [
  'Cloud Infrastructure',
  'Kubernetes',
  'GitOps',
  'Observability',
  'CI/CD',
  'Terraform',
]

export const chartData = {
  clusterHealth: [
    { name: 'Mon', value: 92 },
    { name: 'Tue', value: 94 },
    { name: 'Wed', value: 96 },
    { name: 'Thu', value: 97 },
    { name: 'Fri', value: 98 },
  ],
  deploymentFrequency: [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 7 },
    { name: 'Wed', value: 9 },
    { name: 'Thu', value: 12 },
    { name: 'Fri', value: 14 },
  ],
  monitoringStatus: [
    { name: 'Healthy', value: 92 },
    { name: 'Warning', value: 6 },
    { name: 'Critical', value: 2 },
  ],
  uptime: [
    { name: 'Week 1', value: 99.85 },
    { name: 'Week 2', value: 99.9 },
    { name: 'Week 3', value: 99.95 },
    { name: 'Week 4', value: 99.99 },
  ],
}

export const kubernetesCommands = [
  {
    title: 'kubectl get pods',
    output: ['NAME                              READY   STATUS    RESTARTS   AGE', 'portfolio-7d6f8bc995-8w27h       1/1     Running   0          4m', 'monitoring-855ff7d79f-s2g2g      1/1     Running   0          6m', 'gitops-6f6c85dc98-xfvh2          1/1     Running   0          9m'],
  },
  {
    title: 'kubectl get nodes',
    output: ['NAME                   STATUS   ROLES    AGE   VERSION', 'aks-agentpool-1234     Ready    agent    77d   v1.31.0', 'aks-systempool-5678    Ready    system   77d   v1.31.0'],
  },
  {
    title: 'kubectl get services',
    output: ['NAME          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE', 'portfolio     ClusterIP   10.0.31.20      <none>        80/TCP    7m', 'grafana       ClusterIP   10.0.97.88      <none>        3000/TCP  10m'],
  },
  {
    title: 'kubectl describe portfolio',
    output: ['Name:         portfolio', 'Namespace:    platform', 'Labels:       app=portfolio', 'Annotations:  kubernetes.io/change-cause=gitops', 'Type:         ClusterIP', 'IP:           10.0.31.20'],
  },
]
