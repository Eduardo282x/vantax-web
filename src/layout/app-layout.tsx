import { Outlet } from 'react-router'

import { AppHeader } from './app-header'
import { FloatingDock } from './floating-dock'

export function AppLayout() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <AppHeader />
      <FloatingDock />

      <div className="flex min-h-svh flex-col">
        <main className="flex-1 px-4 pt-5 pb-28 md:pr-6 md:pb-8 md:pl-24 lg:pr-8">
          <Outlet />
        </main>

        <footer className="border-t border-border/70 px-4 pt-4 pb-24 text-xs text-muted-foreground md:pr-6 md:pb-4 md:pl-24 lg:pr-8">
          <span className="font-medium text-foreground">Vantax</span> · Gestión
          comercial inteligente
        </footer>
      </div>
    </div>
  )
}
