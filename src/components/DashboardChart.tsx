import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface Point {
  name: string
  value: number
}

interface DashboardChartProps {
  title: string
  description: string
  variant: 'area' | 'bar' | 'pie' | 'line'
  data: Point[]
}

const palette = ['#58A6FF', '#3FB950', '#F2CC60', '#8B5CF6', '#F85149']

export function DashboardChart({ title, description, variant, data }: DashboardChartProps) {
  const gradientId = `gradient-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0D1117]/70 p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#F0F6FC]">{title}</h3>
        <p className="text-sm text-[#8B949E]">{description}</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {variant === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#58A6FF" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#58A6FF" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" stroke="#8B949E" tickLine={false} axisLine={false} />
              <YAxis stroke="#8B949E" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#161B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, color: '#F0F6FC' }} />
              <Area type="monotone" dataKey="value" stroke="#58A6FF" fill={`url(#${gradientId})`} strokeWidth={3} />
            </AreaChart>
          ) : null}
          {variant === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" stroke="#8B949E" tickLine={false} axisLine={false} />
              <YAxis stroke="#8B949E" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#161B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, color: '#F0F6FC' }} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={palette[index % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : null}
          {variant === 'pie' ? (
            <PieChart>
              <Tooltip contentStyle={{ background: '#161B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, color: '#F0F6FC' }} />
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={90} paddingAngle={3}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={palette[index % palette.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : null}
          {variant === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" stroke="#8B949E" tickLine={false} axisLine={false} />
              <YAxis stroke="#8B949E" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#161B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, color: '#F0F6FC' }} />
              <Line type="monotone" dataKey="value" stroke="#3FB950" strokeWidth={3} dot={{ r: 4, fill: '#3FB950' }} />
            </LineChart>
          ) : null}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
