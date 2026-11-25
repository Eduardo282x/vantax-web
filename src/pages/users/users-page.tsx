import { useState } from 'react'
import { FiArrowLeft, FiPlus } from 'react-icons/fi'
import { DataTable } from '@/components/data-table/data-table'
import type { DataTableColumn } from '@/components/data-table/data-table.interface'
import PageTransition from '@/components/transition/PageTransition'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/services/base-service'
import {
  USER_ROLE_LABELS,
  type User,
  type UserRole,
} from '@/services/users/user.interface'
import {
  useDeleteUser,
  useUsers,
} from '@/services/users/user.hook'
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

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

const columns: DataTableColumn<User>[] = [
  {
    id: 'user',
    header: 'Usuario',
    accessorKey: 'name',
    sortable: true,
    cell: (user) => (
      <div className="flex min-w-56 items-center gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary-hover">
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
    ),
  },
  {
    id: 'role',
    header: 'Rol',
    accessorKey: 'roles',
    sortable: true,
    cell: (user) => (
      <Badge variant={roleVariant[user.roles]}>
        {USER_ROLE_LABELS[user.roles]}
      </Badge>
    ),
  },
  {
    id: 'createdAt',
    header: 'Creado',
    accessorKey: 'createdAt',
    sortable: true,
    hideOnMobile: true,
    cell: (user) => (
      <span className="text-xs text-muted-foreground">
        {formatDate(user.createdAt)}
      </span>
    ),
  },
]

export function UsersPage() {
  const search = useUserStore((state) => state.search)
  const setSearch = useUserStore((state) => state.setSearch)
  const selectedUserId = useUserStore((state) => state.selectedUserId)
  const selectUser = useUserStore((state) => state.selectUser)

  const [formOpen, setFormOpen] = useState(false)

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useUsers(search)
  const deleteUser = useDeleteUser()

  const editingUser =
    users.find((user) => user.id === selectedUserId) ?? null

  function handleCreate() {
    selectUser(null)
    setFormOpen(true)
  }

  function handleEdit(user: User) {
    selectUser(user.id)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    selectUser(null)
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
    <div className="h-[calc(100svh-11rem)] min-h-140">
      <PageTransition toggle={formOpen}>
        <div className="space-y-6 p-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="border-l-2 border-primary/70 pl-3">
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                  Usuarios
                </h1>
                {isMockMode && (
                  <Badge variant="outline">Datos demo</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Administra el equipo y los roles con acceso al sistema.
              </p>
            </div>

            <Button onClick={handleCreate}>
              <FiPlus className="size-4" />
              Nuevo usuario
            </Button>
          </div>

          <DataTable
            data={users}
            columns={columns}
            getRowId={(user) => user.id}
            getRowLabel={(user) => `${user.name} ${user.lastName}`}
            initialSearch={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por nombre, apellido o usuario..."
            onEdit={handleEdit}
            onDelete={handleDelete}
            actionsDisabled={deleteUser.isPending}
            isLoading={isLoading}
            error={isError ? getApiErrorMessage(error) : null}
            onRetry={() => void refetch()}
            emptyMessage="No se encontraron usuarios con los filtros actuales."
          />
        </div>

        <div className="h-full overflow-auto p-1">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-start gap-3">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Volver al listado"
                onClick={handleCloseForm}
              >
                <FiArrowLeft className="size-5" />
              </Button>
              <div className="border-l-2 border-primary/70 pl-3">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Usuarios
                </p>
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                  {editingUser ? 'Editar usuario' : 'Nuevo usuario'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {editingUser
                    ? 'Actualiza los datos del miembro del equipo.'
                    : 'Completa los datos para dar acceso a un nuevo miembro.'}
                </p>
              </div>
            </div>

            {editingUser && (
              <div className="glass-panel flex flex-wrap items-center gap-4 rounded-xl border border-glass-border p-4 shadow-card">
                <div className="grid size-11 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary-hover">
                  {getInitials(editingUser.name, editingUser.lastName)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {editingUser.name} {editingUser.lastName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    @{editingUser.username} · creado el{' '}
                    {formatDate(editingUser.createdAt)}
                  </p>
                </div>
                <Badge
                  variant={roleVariant[editingUser.roles]}
                  className="sm:ml-auto"
                >
                  {USER_ROLE_LABELS[editingUser.roles]}
                </Badge>
              </div>
            )}

            <div className="glass-panel rounded-xl border border-glass-border p-4 shadow-card md:p-6">
              <UsersForm
                key={editingUser?.id ?? 'new'}
                user={editingUser}
                onSuccess={handleCloseForm}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  )
}
