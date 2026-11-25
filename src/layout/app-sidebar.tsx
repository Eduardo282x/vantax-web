import { NavLink } from 'react-router'
import { FiChevronsLeft, FiChevronsRight, FiX } from 'react-icons/fi'

import { cn } from '@/services/utils'
import { useUiStore } from '@/services/ui/ui.store'
import { navigation } from './navigation'

export function AppSidebar() {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed)
  const mobileSidebarOpen = useUiStore((state) => state.mobileSidebarOpen)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const setMobileSidebarOpen = useUiStore(
    (state) => state.setMobileSidebarOpen,
  )

  return (
    <>
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width,transform] duration-200 md:translate-x-0',
          sidebarCollapsed ? 'md:w-16' : 'md:w-64',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary font-heading text-lg font-semibold text-primary-foreground">
            V
          </div>
          <div
            className={cn(
              'min-w-0 flex-1',
              sidebarCollapsed && 'md:hidden',
            )}
          >
            <p className="font-heading text-sm font-semibold">Vantax</p>
            <p className="truncate text-xs text-muted-foreground">
              Gestión comercial
            </p>
          </div>
          <button
            type="button"
            aria-label="Cerrar menú"
            className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-sidebar-accent md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <FiX className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  sidebarCollapsed && 'md:justify-center md:px-0',
                )
              }
            >
              <item.icon className="size-4 shrink-0" />
              <span
                className={cn(
                  'truncate',
                  sidebarCollapsed && 'md:hidden',
                )}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-sidebar-border p-2">
          <button
            type="button"
            onClick={toggleSidebar}
            className={cn(
              'hidden w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:flex',
              sidebarCollapsed && 'md:justify-center md:px-0',
            )}
          >
            {sidebarCollapsed ? (
              <FiChevronsRight className="size-4 shrink-0" />
            ) : (
              <>
                <FiChevronsLeft className="size-4 shrink-0" />
                <span>Contraer menú</span>
              </>
            )}
          </button>
          <p
            className={cn(
              'px-3 pt-2 text-[11px] text-muted-foreground/70',
              sidebarCollapsed && 'md:hidden',
            )}
          >
            Vantax v1.0.0
          </p>
        </div>
      </aside>
    </>
  )
}
