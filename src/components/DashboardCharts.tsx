import { DashboardChart } from './DashboardChart'

interface Point {
  name: string
  value: number
}

interface DashboardChartsProps {
  clusterHealth: Point[]
  deploymentFrequency: Point[]
  monitoringStatus: Point[]
  uptime: Point[]
}

export function DashboardCharts({ clusterHealth, deploymentFrequency, monitoringStatus, uptime }: DashboardChartsProps) {
  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-2">
      <DashboardChart title="Kubernetes cluster health" description="Healthy nodes and platform stability over time." variant="area" data={clusterHealth} />
      <DashboardChart title="Deployment frequency" description="Release cadence across the week." variant="bar" data={deploymentFrequency} />
      <DashboardChart title="Monitoring status" description="Alert routing and observability state." variant="pie" data={monitoringStatus} />
      <DashboardChart title="Infrastructure uptime" description="Service availability across recent weeks." variant="line" data={uptime} />
    </div>
  )
}
