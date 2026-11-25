export const USER_ROLES = ['ADMIN', 'GERENTE', 'CAJERO'] as const

export type UserRole = (typeof USER_ROLES)[number]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  GERENTE: 'Gerente',
  CAJERO: 'Cajero',
}

export interface User {
  id: number
  username: string
  name: string
  lastName: string
  roles: UserRole
  createdAt: string
}

export interface CreateUserInput {
  username: string
  name: string
  lastName: string
  roles: UserRole
  password: string
}

export interface UpdateUserInput {
  username?: string
  name?: string
  lastName?: string
  roles?: UserRole
  password?: string
}
