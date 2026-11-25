import { useEffect, useRef } from 'react'
import { FiChevronRight, FiChevronUp } from 'react-icons/fi'
import { NavLink, useLocation } from 'react-router'

import { cn } from '@/services/utils'
import { useUiStore } from '@/services/ui/ui.store'
import { findAreaByPath, type NavigationItem } from './navigation'

const DOCK_PANEL_ID = 'app-dock-panel'

function DockItem({ item }: { item: NavigationItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.exact}
      title={`${item.label} · ${item.description}`}
      aria-label={item.label}
      className={({ isActive }) =>
        cn(
          'magnetic-target group/item flex h-10 shrink-0 items-center gap-2.5 rounded-xl px-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-[width,background-color,color,box-shadow,transform] duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:h-11 md:w-11 md:overflow-hidden md:px-3 md:group-hover/dock:w-48 md:group-focus-within/dock:w-48',
          isActive
            ? 'bg-primary text-primary-foreground shadow-glow-sm'
            : 'hover:bg-primary/10 hover:text-primary-hover',
        )
      }
    >
      <item.icon className="size-5 shrink-0" />
      <span className="hidden md:inline md:opacity-0 md:transition-opacity md:duration-150 md:group-hover/dock:opacity-100 md:group-focus-within/dock:opacity-100">
        {item.label}
      </span>
    </NavLink>
  )
}

export function FloatingDock() {
  const { pathname } = useLocation()
  const area = findAreaByPath(pathname)
  const collapsed = useUiStore((state) => state.dockCollapsed)
  const toggleDock = useUiStore((state) => state.toggleDock)

  const expandHandleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const focusTargetRef = useRef<'handle' | 'panel' | null>(null)

  useEffect(() => {
    if (collapsed && focusTargetRef.current === 'handle') {
      focusTargetRef.current = null
      expandHandleRef.current?.focus()
    }

    if (!collapsed && focusTargetRef.current === 'panel') {
      focusTargetRef.current = null
      panelRef.current?.focus()
    }
  }, [collapsed])

  if (!area || area.items.length === 0) {
    return null
  }

  function handleHoverExpand() {
    if (collapsed) {
      toggleDock()
    }
  }

  function handleExpand() {
    focusTargetRef.current = 'panel'
    toggleDock()
  }

  return (
    <>
      <button
        ref={expandHandleRef}
        type="button"
        onClick={handleExpand}
        onMouseEnter={handleHoverExpand}
        aria-expanded={false}
        aria-controls={DOCK_PANEL_ID}
        aria-hidden={!collapsed}
        inert={!collapsed}
        aria-label={`Mostrar secciones de ${area.label}`}
        title={`Mostrar secciones de ${area.label}`}
        className={cn(
          'absolute bottom-4 left-1/2 z-40 flex h-8 -translate-x-1/2 items-center justify-center rounded-full border border-primary/30 bg-primary px-3 text-primary-foreground shadow-glow-sm transition-[opacity,scale,background-color,box-shadow] duration-200 outline-none hover:bg-primary-hover focus-visible:ring-3 focus-visible:ring-primary-foreground/70 md:top-1/2 md:bottom-auto md:left-0 md:h-16 md:w-7 md:translate-x-0 md:-translate-y-1/2 md:rounded-r-xl md:rounded-l-none md:border-l-0 md:px-0',
          collapsed
            ? 'scale-100 opacity-100'
            : 'pointer-events-none scale-90 opacity-0',
        )}
      >
        <FiChevronUp className="size-4 md:hidden" />
        <FiChevronRight className="hidden size-4 md:block" />
      </button>

      <nav
        ref={panelRef}
        id={DOCK_PANEL_ID}
        aria-label={`Secciones de ${area.label}`}
        aria-hidden={collapsed}
        inert={collapsed}
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && !collapsed) {
            event.stopPropagation()
            focusTargetRef.current = 'handle'
            toggleDock()
          }
        }}
        className={cn(
          'group/dock glass-panel absolute bottom-4 left-1/2 z-40 flex max-w-[calc(100vw-1.5rem)] origin-bottom -translate-x-1/2 flex-row gap-1 overflow-x-auto rounded-2xl border border-blue-500 p-1.5 shadow-float transition-[opacity,scale] duration-200 outline-none md:top-1/2 md:bottom-auto md:left-4 md:max-w-none md:origin-left md:translate-x-0 md:-translate-y-1/2 md:flex-col md:overflow-visible md:p-2',
          collapsed
            ? 'pointer-events-none scale-90 opacity-0'
            : 'scale-100 opacity-100',
        )}
      >
        {area.items.map((item) => (
          <DockItem key={item.to} item={item} />
        ))}
      </nav>
    </>
  )
}
