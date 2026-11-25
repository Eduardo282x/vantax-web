import {
  FiColumns,
  FiDatabase,
  FiMoon,
  FiRefreshCw,
  FiSun,
} from 'react-icons/fi'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useUserStore } from '@/services/users/user.store'
import { useUiStore } from '@/services/ui/ui.store'

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
const isMockMode = import.meta.env.VITE_USE_MOCKS === 'true'

export function SettingsPage() {
  const theme = useUiStore((state) => state.theme)
  const setTheme = useUiStore((state) => state.setTheme)
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const resetUserFilters = useUserStore((state) => state.reset)

  function handleReset() {
    localStorage.removeItem('vantax-ui')
    localStorage.removeItem('vantax-users')
    resetUserFilters()
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Ajustes
        </h1>
        <p className="text-sm text-muted-foreground">
          Preferencias de la interfaz y configuración del entorno.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Apariencia</CardTitle>
            <CardDescription>
              El tema se guarda en el navegador con Zustand persist.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => setTheme('light')}
              >
                <FiSun className="size-4" />
                Tema claro
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => setTheme('dark')}
              >
                <FiMoon className="size-4" />
                Tema oscuro
              </Button>
            </div>

            <Separator />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Menú lateral</p>
                <p className="text-xs text-muted-foreground">
                  {sidebarCollapsed ? 'Contraído' : 'Expandido'} · también se
                  guarda entre sesiones.
                </p>
              </div>
              <Button variant="outline" onClick={toggleSidebar}>
                <FiColumns className="size-4" />
                {sidebarCollapsed ? 'Expandir' : 'Contraer'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entorno</CardTitle>
            <CardDescription>
              Valores leídos desde las variables de Vite.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">API</span>
              <code className="max-w-[60%] truncate rounded-md bg-muted px-2 py-1 text-xs">
                {apiUrl}
              </code>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground">
                <FiDatabase className="size-4" />
                Origen de datos
              </span>
              <Badge variant={isMockMode ? 'secondary' : 'default'}>
                {isMockMode ? 'Datos demo' : 'API real'}
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Cliente HTTP</span>
              <span className="font-medium">Axios</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Estado del servidor</span>
              <span className="font-medium">TanStack Query</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Cambia <code className="rounded bg-muted px-1">VITE_USE_MOCKS</code>{' '}
              en <code className="rounded bg-muted px-1">.env</code> para
              desactivar los datos demo.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos locales</CardTitle>
          <CardDescription>
            Restablece el tema, el menú y los filtros guardados en este
            navegador.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Esta acción no afecta a la base de datos ni a los usuarios.
          </p>
          <Button variant="outline" onClick={handleReset}>
            <FiRefreshCw className="size-4" />
            Restablecer preferencias
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
