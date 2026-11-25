import { NavLink, useLocation } from 'react-router'

import { cn } from '@/services/utils'
import { findAreaByPath } from './navigation'

export function FloatingDock() {
  const { pathname } = useLocation()
  const area = findAreaByPath(pathname)

  if (!area || area.items.length === 0) {
    return null
  }

  return (
    <nav
      aria-label={`Secciones de ${area.label}`}
      className="group/dock fixed bottom-4 left-1/2 z-40 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 flex-row gap-1 overflow-x-auto rounded-2xl border border-border/70 bg-background/80 p-1.5 shadow-lg shadow-foreground/5 backdrop-blur-xl md:top-1/2 md:bottom-auto md:left-4 md:max-w-none md:-translate-x-0 md:-translate-y-1/2 md:flex-col md:overflow-visible md:p-2"
    >
      {area.items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.exact}
          title={`${item.label} · ${item.description}`}
          aria-label={item.label}
          className={({ isActive }) =>
            cn(
              'group/item flex h-10 shrink-0 items-center gap-2.5 rounded-xl px-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-[width,background-color,color] duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:h-11 md:w-11 md:overflow-hidden md:px-3 md:group-hover/dock:w-48 md:group-focus-within/dock:w-48',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-muted hover:text-foreground',
            )
          }
        >
          <item.icon className="size-5 shrink-0" />
          <span className="hidden md:inline md:opacity-0 md:transition-opacity md:duration-150 md:group-hover/dock:opacity-100 md:group-focus-within/dock:opacity-100">
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  )
}
