import { FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="grid min-h-svh place-items-center bg-background p-6 text-center">
      <div className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Página no encontrada
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          La ruta que buscas no existe o fue movida. Vuelve al dashboard para
          continuar.
        </p>
        <Button asChild>
          <Link to="/dashboard">
            <FiArrowLeft className="size-4" />
            Volver al dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
