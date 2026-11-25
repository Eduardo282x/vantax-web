import { Outlet, useLocation } from 'react-router'

import { useUiStore } from '@/services/ui/ui.store'
import { AppHeader } from './app-header'
import { FloatingDock } from './floating-dock'
import { findAreaByPath } from './navigation'

export function AppLayout() {
  const { pathname } = useLocation()
  const dockCollapsed = useUiStore((state) => state.dockCollapsed)
  const setDockCollapsed = useUiStore((state) => state.setDockCollapsed)
  const hasDock = (findAreaByPath(pathname)?.items.length ?? 0) > 0

  function handleContentClick() {
    if (hasDock && !dockCollapsed) {
      setDockCollapsed(true)
    }
  }

  return (
    <div className="relative flex h-svh flex-col overflow-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="app-aurora pointer-events-none fixed inset-0 select-none"
      />

      <AppHeader />

      <main
        onClick={handleContentClick}
        className="relative min-h-0 flex-1 overflow-y-auto px-4 py-4 md:pr-6 lg:pr-8"
      >
        <Outlet />
      </main>

      <FloatingDock />
    </div>
  )
}
