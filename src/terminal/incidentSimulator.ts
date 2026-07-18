export interface IncidentState {
  active: boolean
  scenario: string
  clusterHealth: number
  cpuUsage: number
  memoryUsage: number
  podsFailing: number
  servicesDown: string[]
  completed: boolean
  score: number
  commandsUsed: string[]
}

export const incidents = [
  {
    name: 'production-outage',
    title: 'Production Service Outage',
    description: 'Critical payment service is down. Multiple pods crashing with resource issues. API gateway is timing out.',
    initialState: {
      clusterHealth: 35,
      cpuUsage: 85,
      memoryUsage: 92,
      podsFailing: 4,
      servicesDown: ['payment-api', 'order-processor'],
    },
    objectives: [
      'List all pods and identify failing ones',
      'Check pod logs for errors',
      'Scale down problematic deployments',
      'Increase memory/CPU limits',
      'Monitor rollout status',
      'Verify services recovery',
    ],
    hints: [
      'Start: kubectl get pods -A',
      'Check logs: kubectl logs <pod-name>',
      'Describe pod: kubectl describe pod <pod-name>',
      'View nodes: kubectl get nodes',
      'Check events: kubectl get events -A --sort-by=.metadata.creationTimestamp',
      'Edit deployment: kubectl set resources deployment/<name> --limits=cpu=500m,memory=512Mi',
      'Watch rollout: kubectl rollout status deployment/<name>',
    ],
  },
]

export function createIncident(scenarioName: string): IncidentState {
  const incident = incidents.find((i) => i.name === scenarioName)
  if (!incident) {
    throw new Error(`Incident not found: ${scenarioName}. Try: play production-outage`)
  }

  return {
    active: true,
    scenario: scenarioName,
    clusterHealth: incident.initialState.clusterHealth,
    cpuUsage: incident.initialState.cpuUsage,
    memoryUsage: incident.initialState.memoryUsage,
    podsFailing: incident.initialState.podsFailing,
    servicesDown: incident.initialState.servicesDown,
    completed: false,
    score: 0,
    commandsUsed: [],
  }
}

export function processIncidentCommand(
  incidentState: IncidentState,
  command: string,
): { response: string[]; updatedState: IncidentState } {
  const state = { ...incidentState }
  state.commandsUsed.push(command)

  const cmd = command.toLowerCase().trim()
  let response: string[] = []

  if (cmd.includes('kubectl get pods') || cmd.includes('kubectl get pods -a')) {
    response = [
      'NAMESPACE     NAME                               READY   STATUS             RESTARTS   AGE',
      'default       payment-api-7d4c9f2-x1y2z          0/2     CrashLoopBackOff   8          15m',
      'default       payment-api-7d4c9f2-a9b8c          0/2     OOMKilled          12         20m',
      'default       order-processor-5a6b7c-d9e0f       1/3     CrashLoopBackOff   5          25m',
      'default       api-gateway-9k2m3n-p0q1r           1/1     Running            0          30m',
      'default       web-ui-4l5m6n-s2t3u                1/1     Running            0          1h',
      'kube-system   etcd-node-1                        1/1     Running            0          2d',
      'kube-system   coredns-7b99855c9d-x1y2z            1/1     Running            0          2d',
      '',
      '⚠️  ALERT: 2 failed services, 4 pods in CrashLoopBackOff state',
    ]
    state.score += 5
  } else if (cmd.includes('kubectl describe pod')) {
    response = [
      'Name:         payment-api-7d4c9f2-x1y2z',
      'Namespace:    default',
      'Status:       CrashLoopBackOff',
      'Ready:        0/2',
      'Containers:',
      '  payment-service:',
      '    State:     Waiting (CrashLoopBackOff)',
      '    Last State: Terminated',
      '    Reason: OOMKilled',
      '    Exit Code: 137',
      'Events:',
      '  Type     Reason     Age         From               Message',
      '  ----     ------     ----        ----               -------',
      '  Warning  BackOff    2m15s       kubelet            Back-off restarting failed container',
      '  Warning  Failed     2m45s       kubelet            Error: container exited with code 137 (OOM)',
    ]
    state.score += 10
  } else if (cmd.includes('kubectl logs')) {
    response = [
      'java.lang.OutOfMemoryError: Java heap space',
      '  at java.util.HashMap.resize(HashMap.java:702)',
      '  at com.payment.api.ProcessPayment.handle(ProcessPayment.java:145)',
      'FATAL ERROR: OutOfMemory Exception in thread "main"',
      '',
      '✓ Issue identified: Memory limit too low for payment-api container',
    ]
    state.score += 15
  } else if (cmd.includes('kubectl get nodes')) {
    response = [
      'NAME     STATUS   ROLES           AGE   VERSION',
      'node-1   Ready    control-plane   45d   v1.30.4',
      'node-2   Ready    worker          45d   v1.30.4',
      'node-3   Ready    worker          42d   v1.30.4',
    ]
    state.score += 5
  } else if (cmd.includes('kubectl get events')) {
    response = [
      'NAMESPACE   LAST SEEN   TYPE      REASON             OBJECT                                MESSAGE',
      'default     2m10s       Warning   Failed             pod/payment-api-7d4c9f2-x1y2z         Error: container exited with code 137',
      'default     2m5s        Warning   BackOff            pod/payment-api-7d4c9f2-x1y2z         Back-off 5m, restarting container',
      'default     3m22s       Warning   Failed             pod/order-processor-5a6b7c-d9e0f      Error: OOMKilled',
      'kube-system 25m         Normal    NodeHasSufficientMemory node/node-2      Node node-2 status is now: NodeHasSufficientMemory',
    ]
    state.score += 8
  } else if (cmd.includes('kubectl set resources') || cmd.includes('kubectl patch')) {
    response = [
      'deployment.apps/payment-api patched',
      'container "payment-service" memory limits updated: 256Mi -> 512Mi',
      'container "payment-service" cpu limits updated: 100m -> 500m',
      '',
      '✓ Resources increased. Waiting for pod restart...',
    ]
    state.podsFailing = Math.max(0, state.podsFailing - 2)
    state.memoryUsage = Math.max(0, state.memoryUsage - 20)
    state.cpuUsage = Math.max(0, state.cpuUsage - 15)
    state.score += 25
  } else if (cmd.includes('kubectl rollout status') || cmd.includes('kubectl get deployment')) {
    response = [
      'NAME               READY   UP-TO-DATE   AVAILABLE   AGE',
      'payment-api        2/2     2            2           45m',
      'order-processor    3/3     3            3           50m',
      'api-gateway        1/1     1            1           60m',
      'web-ui             1/1     1            1           120m',
      '',
      '✓ Deployments are now rolling out successfully',
    ]
    state.clusterHealth = Math.min(100, state.clusterHealth + 25)
    state.score += 20
  } else if (cmd.includes('kubectl get services')) {
    response = [
      'NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)',
      'kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP',
      'api-gateway  ClusterIP   10.96.1.10      <none>        8080/TCP (✓ Ready)',
      'payment-api  ClusterIP   10.96.1.20      <none>        5000/TCP (✓ Ready)',
      'order-proc   ClusterIP   10.96.1.30      <none>        6000/TCP (✓ Ready)',
    ]
    state.score += 5
  } else if (cmd.includes('kubectl describe node')) {
    response = [
      'Name:               node-1',
      'Status:             Ready',
      'Roles:              control-plane',
      'Allocatable:        cpu: 4000m, memory: 16Gi, pods: 110',
      'Allocated resources:',
      '  cpu:    1850m (46%)',
      '  memory: 7.5Gi (47%)',
      'Conditions:',
      '  Ready                   True',
      '  MemoryPressure         False',
      '  DiskPressure           False',
      '  PIDPressure            False',
    ]
    state.score += 5
  } else if (cmd.includes('helm list')) {
    response = [
      'NAME           NAMESPACE   REVISION   STATUS      UPDATED',
      'payment-svc    default     5          deployed    2026-07-18 11:30:00',
      'order-svc      default     3          deployed    2026-07-18 11:25:00',
      'api-gateway    default     2          deployed    2026-07-18 11:20:00',
    ]
    state.score += 4
  } else if (cmd.includes('docker ps')) {
    response = [
      'CONTAINER ID   IMAGE                 STATUS        PORTS',
      'abc123def456   payment-api:v2.1.0    Up 5 minutes   0.0.0.0:5000->5000/tcp',
      'xyz789uvw123   order-proc:v1.8.0     Up 3 minutes   0.0.0.0:6000->6000/tcp',
      'def456abc789   api-gateway:v3.0.0    Up 2 hours     0.0.0.0:8080->8080/tcp',
    ]
    state.score += 3
  } else if (cmd.includes('git log') || cmd.includes('git status')) {
    response = [
      'commit 7d4c9f2: Increased memory limits in deployment manifests',
      'commit 5a6b7c1: Fixed payment-api resource configuration',
      'commit 3e2f8k0: Updated helm values for production',
      '',
      'No uncommitted changes.',
    ]
    state.score += 3
  } else if (cmd.includes('grep')) {
    response = [
      'payment-api-7d4c9f2-x1y2z: CrashLoopBackOff',
      'payment-api-7d4c9f2-a9b8c: OOMKilled',
      'order-processor-5a6b7c-d9e0f: CrashLoopBackOff',
      '3 critical issues found',
    ]
    state.score += 2
  } else {
    response = [
      '$ command executed',
      'Continue troubleshooting to resolve the incident...',
      'Use: kubectl get pods, kubectl logs, kubectl describe pod, etc.',
    ]
  }

  // Check if incident is resolved (pods recovered, services running, health restored)
  if (state.podsFailing === 0 && state.memoryUsage < 75 && state.clusterHealth >= 85) {
    state.completed = true
    state.clusterHealth = Math.min(100, state.clusterHealth + 15)
    response = [
      ...response,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '✓ INCIDENT RESOLVED!',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `Final Score: ${state.score} points`,
      `Commands Used: ${state.commandsUsed.length}`,
      `Cluster Health: ${state.clusterHealth}%`,
      '',
      '🎖️ ACHIEVEMENT UNLOCKED: Incident Commander (+50 points)',
    ]
  }

  return { response, updatedState: state }
}

export function getIncidentStatus(state: IncidentState): string[] {
  const incident = incidents.find((i) => i.name === state.scenario)
  if (!incident) return []

  const healthBar = '█'.repeat(Math.floor(state.clusterHealth / 10)) + '░'.repeat(10 - Math.floor(state.clusterHealth / 10))

  return [
    `╔════════════════════════════════════════╗`,
    `║  ${incident.title.toUpperCase()}`,
    `╚════════════════════════════════════════╝`,
    ``,
    `Cluster Health:  [${healthBar}] ${state.clusterHealth}%`,
    `CPU Usage:       ${state.cpuUsage}%`,
    `Memory Usage:    ${state.memoryUsage}%`,
    `Pods Failing:    ${state.podsFailing}`,
    `Services Down:   ${state.servicesDown.join(', ') || 'None'}`,
    `Current Score:   ${state.score}`,
    `Commands Used:   ${state.commandsUsed.length}`,
    ``,
    `${incident.description}`,
    ``,
    `Available commands: kubectl get pods, kubectl logs, kubectl describe pod,`,
    `kubectl set resources, kubectl get events, helm list, docker ps, git log`,
  ]
}

export function getIncidentList(): string[] {
  return [
    '╔════════════════════════════════════════╗',
    '║   KUBERNETES INCIDENT SIMULATOR',
    '╚════════════════════════════════════════╝',
    '',
    'Available Scenario:',
    '  🚨 production-outage',
    '     Critical payment service down with resource exhaustion',
    '',
    'Start: play production-outage',
    '',
    'Commands: kubectl, helm, docker, git, grep',
    'Status: type "status" in incident mode',
    'Exit: type "quit" to exit',
  ]
}
