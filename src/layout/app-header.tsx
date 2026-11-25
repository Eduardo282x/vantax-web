import { FiMenu, FiMoon, FiSun } from 'react-icons/fi'
import { useLocation } from 'react-router'

import { Button } from '@/components/ui/button'
import { useUiStore } from '@/services/ui/ui.store'
import { navigation } from './navigation'

export function AppHeader() {
  const { pathname } = useLocation()
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)
  const setMobileSidebarOpen = useUiStore(
    (state) => state.setMobileSidebarOpen,
  )

  const currentItem =
    navigation.find((item) => pathname.startsWith(item.to)) ?? navigation[0]

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Abrir menú"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <FiMenu className="size-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{currentItem.label}</p>
        <p className="hidden text-xs text-muted-foreground sm:block">
          {currentItem.description}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        aria-label={theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'}
        onClick={toggleTheme}
      >
        {theme === 'dark' ? (
          <FiSun className="size-4" />
        ) : (
          <FiMoon className="size-4" />
        )}
      </Button>

      <div className="flex items-center gap-2 rounded-full border px-2 py-1">
        <div className="grid size-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          AT
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-xs leading-tight font-medium">Ana Torres</p>
          <p className="text-[11px] leading-tight text-muted-foreground">
            Administrador
          </p>
        </div>
      </div>
    </header>
  )
}
