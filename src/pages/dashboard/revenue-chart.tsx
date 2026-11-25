import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const chartData = [
  { month: 'Ene', ventas: 4200, meta: 4800 },
  { month: 'Feb', ventas: 5100, meta: 5200 },
  { month: 'Mar', ventas: 4700, meta: 5600 },
  { month: 'Abr', ventas: 6300, meta: 6000 },
  { month: 'May', ventas: 5800, meta: 6400 },
  { month: 'Jun', ventas: 7200, meta: 6800 },
  { month: 'Jul', ventas: 8100, meta: 7200 },
  { month: 'Ago', ventas: 9200, meta: 7800 },
]

const chartConfig = {
  ventas: {
    label: 'Ventas',
    color: 'var(--chart-1)',
  },
  meta: {
    label: 'Meta',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 8, right: 4, left: 4 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          type="natural"
          dataKey="ventas"
          stroke="var(--color-ventas)"
          fill="var(--color-ventas)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Area
          type="natural"
          dataKey="meta"
          stroke="var(--color-meta)"
          fill="transparent"
          strokeDasharray="4 4"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
