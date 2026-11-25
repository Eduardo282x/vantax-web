import { FiBell, FiMoon, FiSun } from 'react-icons/fi'
import { NavLink, useLocation } from 'react-router'

import { DollarRate } from '@/components/dollar-rate/dollar-rate'
import { Button } from '@/components/ui/button'
import { cn } from '@/services/utils'
import { useUiStore } from '@/services/ui/ui.store'
import { findAreaByPath, navigationAreas } from './navigation'

export function AppHeader() {
  const { pathname } = useLocation()
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)
  const activeArea = findAreaByPath(pathname)

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="flex min-h-16 flex-wrap items-center gap-3 px-4 py-2 md:h-[74px] md:flex-nowrap md:px-6">
        <NavLink
          to="/inicio"
          className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Ir al inicio"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
            V
          </span>
          <span className="min-w-0">
            <span className="block font-heading text-sm leading-tight font-semibold">
              Vantax
            </span>
            <span className="hidden text-[10px] tracking-[0.14em] text-muted-foreground uppercase sm:block">
              Gestión comercial
            </span>
          </span>
        </NavLink>

        <nav
          aria-label="Áreas principales"
          className="order-3 flex w-full items-center gap-1 overflow-x-auto md:order-none md:ml-4 md:w-auto md:flex-1"
        >
          {navigationAreas.map((area) => {
            const isActive = activeArea?.to === area.to

            return (
              <NavLink
                key={area.to}
                to={area.to}
                title={area.description}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-secondary text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <area.icon className="size-4" />
                {area.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <DollarRate variant="header" className="mr-1" />

          <Button
            variant="ghost"
            size="icon"
            aria-label="Notificaciones (próximamente)"
            title="Notificaciones (próximamente)"
          >
            <FiBell className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label={
              theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'
            }
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <FiSun className="size-4" />
            ) : (
              <FiMoon className="size-4" />
            )}
          </Button>

          <NavLink
            to="/configuracion"
            className="ml-1 flex items-center gap-2 rounded-full border border-border/80 bg-card px-1.5 py-1 pr-3 transition-colors hover:bg-muted"
            aria-label="Ir a configuración"
          >
            <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              AT
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-xs leading-tight font-medium">
                Ana Torres
              </span>
              <span className="block text-[10px] leading-tight text-muted-foreground">
                Administrador
              </span>
            </span>
          </NavLink>
        </div>
      </div>
    </header>
  )
}
