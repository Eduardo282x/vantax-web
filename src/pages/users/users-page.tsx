import { useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiUsers, FiX } from 'react-icons/fi'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getApiErrorMessage } from '@/services/base-service'
import {
  USER_ROLE_LABELS,
  type User,
  type UserRole,
} from '@/services/users/user.interface'
import { useDeleteUser, useUsers } from '@/services/users/user.hook'
import { useUserStore } from '@/services/users/user.store'
import { UsersForm } from './users-form'

const roleVariant: Record<
  UserRole,
  'default' | 'secondary' | 'outline'
> = {
  ADMIN: 'default',
  GERENTE: 'secondary',
  CAJERO: 'outline',
}

const dateFormatter = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const isMockMode = import.meta.env.VITE_USE_MOCKS === 'true'

function getInitials(name: string, lastName: string) {
  return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function UsersPage() {
  const search = useUserStore((state) => state.search)
  const setSearch = useUserStore((state) => state.setSearch)
  const selectedUserId = useUserStore((state) => state.selectedUserId)
  const selectUser = useUserStore((state) => state.selectUser)

  const [formOpen, setFormOpen] = useState(false)
  const { data: users = [], isLoading, isError, error, refetch } = useUsers(search)
  const deleteUser = useDeleteUser()

  const editingUser =
    users.find((user) => user.id === selectedUserId) ?? null

  function handleCloseForm() {
    setFormOpen(false)
    selectUser(null)
  }

  function handleCreate() {
    selectUser(null)
    setFormOpen(true)
  }

  function handleEdit(user: User) {
    selectUser(user.id)
    setFormOpen(true)
  }

  function handleDelete(user: User) {
    const confirmed = window.confirm(
      `¿Eliminar a ${user.name} ${user.lastName}? Esta acción no se puede deshacer.`,
    )

    if (!confirmed) {
      return
    }

    deleteUser.mutate(user.id, {
      onSuccess: () => {
        if (selectedUserId === user.id) {
          handleCloseForm()
        }
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Usuarios
            </h1>
            {isMockMode && <Badge variant="outline">Datos demo</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">
            Administra el equipo y los roles con acceso al sistema.
          </p>
        </div>

        <Button
          variant={formOpen ? 'outline' : 'default'}
          onClick={formOpen ? handleCloseForm : handleCreate}
        >
          {formOpen ? (
            <FiX className="size-4" />
          ) : (
            <FiPlus className="size-4" />
          )}
          {formOpen ? 'Cerrar formulario' : 'Nuevo usuario'}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Equipo</CardTitle>
            <CardDescription>
              {users.length} {users.length === 1 ? 'usuario' : 'usuarios'}{' '}
              registrados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <FiSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre, apellido o usuario..."
                aria-label="Buscar usuarios"
                className="pl-9"
              />
            </div>

            {isLoading && (
              <div className="space-y-4 py-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            )}

            {!isLoading && isError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm font-medium text-destructive">
                  No se pudo cargar el equipo
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {getApiErrorMessage(error)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => void refetch()}
                >
                  Reintentar
                </Button>
              </div>
            )}

            {!isLoading && !isError && users.length === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-center">
                <FiUsers className="size-8 text-muted-foreground/50" />
                <p className="text-sm font-medium">Sin resultados</p>
                <p className="text-xs text-muted-foreground">
                  Prueba con otra búsqueda o crea un usuario nuevo.
                </p>
              </div>
            )}

            {!isLoading && !isError && users.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Creado
                    </TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      data-state={
                        selectedUserId === user.id ? 'selected' : undefined
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">
                            {getInitials(user.name, user.lastName)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {user.name} {user.lastName}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleVariant[user.roles]}>
                          {USER_ROLE_LABELS[user.roles]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                        {dateFormatter.format(new Date(user.createdAt))}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Editar a ${user.name} ${user.lastName}`}
                            onClick={() => handleEdit(user)}
                          >
                            <FiEdit2 className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            aria-label={`Eliminar a ${user.name} ${user.lastName}`}
                            disabled={deleteUser.isPending}
                            onClick={() => handleDelete(user)}
                          >
                            <FiTrash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {formOpen && (
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>
                {editingUser ? 'Editar usuario' : 'Nuevo usuario'}
              </CardTitle>
              <CardDescription>
                {editingUser
                  ? 'Actualiza los datos del miembro del equipo.'
                  : 'Completa los datos para dar acceso a un nuevo miembro.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersForm
                key={editingUser?.id ?? 'new'}
                user={editingUser}
                onSuccess={handleCloseForm}
                onCancel={handleCloseForm}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
