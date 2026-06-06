import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type StageChartDatum = {
  stage: string
  mastery: number
  confidence: number
}

export type RadarChartDatum = {
  skill: string
  mastery: number
}

export type TrendDatum = {
  name: string
  score: number
}

export const StageMasteryChart = ({ data }: { data: StageChartDatum[] }) => (
  <ResponsiveContainer width="100%" height={248}>
    <BarChart data={data}>
      <CartesianGrid stroke="#d8e1df" strokeDasharray="3 3" vertical={false} />
      <XAxis
        axisLine={false}
        dataKey="stage"
        tick={{ fill: '#5b6461', fontSize: 12 }}
        tickLine={false}
      />
      <YAxis
        axisLine={false}
        domain={[0, 100]}
        tick={{ fill: '#5b6461', fontSize: 12 }}
        tickLine={false}
      />
      <Tooltip />
      <Bar dataKey="mastery" fill="#0f766e" radius={[6, 6, 0, 0]} />
      <Bar dataKey="confidence" fill="#f59e0b" radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
)

export const MasteryRadarChart = ({ data }: { data: RadarChartDatum[] }) => (
  <ResponsiveContainer width="100%" height={248}>
    <RadarChart data={data}>
      <PolarGrid stroke="#d8e1df" />
      <PolarAngleAxis dataKey="skill" tick={{ fill: '#5b6461', fontSize: 10 }} />
      <Radar
        dataKey="mastery"
        fill="#2563eb"
        fillOpacity={0.18}
        stroke="#2563eb"
        strokeWidth={2}
      />
      <Tooltip />
    </RadarChart>
  </ResponsiveContainer>
)

export const MiniTrendChart = ({ data }: { data: TrendDatum[] }) => (
  <ResponsiveContainer width="100%" height={112}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
          <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <XAxis dataKey="name" hide />
      <YAxis domain={[0, 100]} hide />
      <Area
        dataKey="score"
        fill="url(#trendFill)"
        stroke="#0f766e"
        strokeWidth={2}
        type="monotone"
      />
    </AreaChart>
  </ResponsiveContainer>
)
