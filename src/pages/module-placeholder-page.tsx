import { FiGrid } from 'react-icons/fi'
import { useLocation } from 'react-router'

import { Badge } from '@/components/ui/badge'
import {
  findAreaByPath,
  findItemByPath,
} from '@/layout/navigation'

export function ModulePlaceholderPage() {
  const { pathname } = useLocation()
  const match = findItemByPath(pathname)
  const area = match?.area ?? findAreaByPath(pathname)
  const item = match?.item
  const Icon = item?.icon ?? area?.icon ?? FiGrid
  const moduleName = area?.label.toLowerCase() ?? 'gestión'

  return (
    <div className="glass-panel flex min-h-[60svh] flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-primary/25 p-8 text-center shadow-card">
      <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary shadow-glow-sm ring-1 ring-primary/20">
        <Icon className="size-7" />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          {area?.label ?? 'Vantax'}
        </p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Módulo de {moduleName}
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          {item ? `${item.label}: ` : ''}
          esta sección se está preparando y se irá habilitando por etapas.
        </p>
      </div>

      <Badge variant="secondary">Próximamente</Badge>
    </div>
  )
}
