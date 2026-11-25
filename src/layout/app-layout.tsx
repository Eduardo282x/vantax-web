import { Outlet } from 'react-router'

import { AppHeader } from './app-header'
import { FloatingDock } from './floating-dock'

export function AppLayout() {
  return (
    <div className="relative min-h-svh bg-background text-foreground">
      <div
        aria-hidden="true"
        className="app-aurora pointer-events-none fixed inset-0 select-none"
      />

      <AppHeader />
      <FloatingDock />

      <div className="relative flex min-h-svh flex-col">
        <main className="flex-1 px-4 py-4 md:pr-6 md:pl-24 lg:pr-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
