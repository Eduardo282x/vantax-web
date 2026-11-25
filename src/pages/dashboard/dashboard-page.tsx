import type { IconType } from 'react-icons'
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RevenueChart } from './revenue-chart'

interface Stat {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  hint: string
  icon: IconType
}

const stats: Stat[] = [
  {
    label: 'Ventas del mes',
    value: '$24.580',
    change: '+12,4%',
    trend: 'up',
    hint: 'vs. mes anterior',
    icon: FiDollarSign,
  },
  {
    label: 'Órdenes',
    value: '1.284',
    change: '+8,1%',
    trend: 'up',
    hint: 'vs. mes anterior',
    icon: FiShoppingCart,
  },
  {
    label: 'Ticket promedio',
    value: '$19,14',
    change: '-2,3%',
    trend: 'down',
    hint: 'vs. mes anterior',
    icon: FiTrendingUp,
  },
  {
    label: 'Clientes activos',
    value: '486',
    change: '+5,7%',
    trend: 'up',
    hint: 'vs. mes anterior',
    icon: FiUsers,
  },
]

const activity = [
  {
    title: 'Nueva venta #1042',
    detail: 'María Ramírez · $1.240',
    time: 'Hace 4 min',
    variant: 'default',
  },
  {
    title: 'Tasa BCV actualizada',
    detail: '1 USD = 36,50 VES',
    time: 'Hace 1 h',
    variant: 'secondary',
  },
  {
    title: 'Stock bajo: Café 500g',
    detail: 'Quedan 8 unidades',
    time: 'Hace 2 h',
    variant: 'destructive',
  },
  {
    title: 'Nuevo usuario creado',
    detail: 'Carlos Pérez · Cajero',
    time: 'Ayer',
    variant: 'outline',
  },
] as const

const inventory = [
  { name: 'Café 500g', stock: 8, total: 50 },
  { name: 'Harina de maíz', stock: 34, total: 60 },
  { name: 'Aceite 1L', stock: 45, total: 50 },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Buenos días, Ana
        </h1>
        <p className="text-sm text-muted-foreground">
          Este es el resumen de la operación de Vantax para hoy.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-2">
              <div className="space-y-0.5">
                <p
                  className={
                    stat.trend === 'up'
                      ? 'flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400'
                      : 'flex items-center gap-1 text-xs font-medium text-destructive'
                  }
                >
                  {stat.trend === 'up' ? (
                    <FiArrowUpRight className="size-3.5" />
                  ) : (
                    <FiArrowDownRight className="size-3.5" />
                  )}
                  {stat.change}
                </p>
                <p className="text-[11px] text-muted-foreground">{stat.hint}</p>
              </div>
              <stat.icon className="size-8 text-muted-foreground/30" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos mensuales</CardTitle>
            <CardDescription>
              Ventas reales vs. meta · últimos 8 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription>Últimos movimientos del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{item.title}</p>
                    <Badge variant={item.variant}>{item.time}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventario crítico</CardTitle>
          <CardDescription>
            Productos por debajo del 60% de su stock objetivo
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {inventory.map((product) => {
            const percentage = Math.round((product.stock / product.total) * 100)

            return (
              <div key={product.name} className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-medium">{product.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {product.stock}/{product.total}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={
                      percentage < 30
                        ? 'h-full rounded-full bg-destructive'
                        : 'h-full rounded-full bg-primary'
                    }
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
