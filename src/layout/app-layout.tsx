import { Outlet } from 'react-router'

import { useUiStore } from '@/services/ui/ui.store'
import { cn } from '@/services/utils'
import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

export function AppLayout() {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed)

  return (
    <div className="min-h-svh bg-background text-foreground">
      <AppSidebar />

      <div
        className={cn(
          'flex min-h-svh flex-col transition-[padding] duration-200',
          sidebarCollapsed ? 'md:pl-16' : 'md:pl-64',
        )}
      >
        <AppHeader />

        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <Outlet />
        </main>

        <footer className="border-t px-4 py-4 text-xs text-muted-foreground md:px-6">
          Vantax · React + Vite + shadcn/ui
        </footer>
      </div>
    </div>
  )
}
