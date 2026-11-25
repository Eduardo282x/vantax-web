import { FiShoppingCart } from 'react-icons/fi'

import { DollarRate } from '@/components/dollar-rate/dollar-rate'
import { Badge } from '@/components/ui/badge'

export function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Ventas
        </h1>
        <p className="text-sm text-muted-foreground">
          Punto de venta y operaciones comerciales.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-card/50 p-8 text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <FiShoppingCart className="size-7" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-xl font-semibold">
              Módulo de ventas
            </h2>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              El punto de venta se habilitará por etapas. La tasa del dólar ya
              está disponible como referencia para las operaciones.
            </p>
          </div>
          <Badge variant="secondary">Próximamente</Badge>
        </div>

        <DollarRate variant="card" />
      </div>
    </div>
  )
}
