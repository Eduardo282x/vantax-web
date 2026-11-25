import { baseService } from '@/services/base-service'
import type { CreateUserInput, UpdateUserInput, User } from './user.interface'

const USERS_ENDPOINT = '/users'
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'
const MOCK_DELAY = 350

const seedUsers: User[] = [
  {
    id: 1,
    username: 'atorres',
    name: 'Ana',
    lastName: 'Torres',
    roles: 'ADMIN',
    createdAt: '2026-01-12T13:20:00.000Z',
  },
  {
    id: 2,
    username: 'jlopez',
    name: 'Javier',
    lastName: 'López',
    roles: 'GERENTE',
    createdAt: '2026-02-03T09:05:00.000Z',
  },
  {
    id: 3,
    username: 'mramirez',
    name: 'María',
    lastName: 'Ramírez',
    roles: 'CAJERO',
    createdAt: '2026-03-21T15:40:00.000Z',
  },
  {
    id: 4,
    username: 'cperez',
    name: 'Carlos',
    lastName: 'Pérez',
    roles: 'CAJERO',
    createdAt: '2026-04-08T11:10:00.000Z',
  },
]

let mockUsers = [...seedUsers]
let nextMockId = Math.max(...seedUsers.map((user) => user.id)) + 1

function delay(ms = MOCK_DELAY) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const userService = {
  async getAll(search = ''): Promise<User[]> {
    if (USE_MOCKS) {
      await delay()
      const term = search.trim().toLowerCase()

      if (!term) {
        return [...mockUsers]
      }

      return mockUsers.filter((user) =>
        `${user.name} ${user.lastName} ${user.username}`
          .toLowerCase()
          .includes(term),
      )
    }

    return baseService.get<User[]>(USERS_ENDPOINT, {
      params: search ? { search } : undefined,
    })
  },

  async getById(id: number): Promise<User> {
    if (USE_MOCKS) {
      await delay()
      const user = mockUsers.find((item) => item.id === id)

      if (!user) {
        throw new Error('Usuario no encontrado')
      }

      return user
    }

    return baseService.get<User>(`${USERS_ENDPOINT}/${id}`)
  },

  async create(input: CreateUserInput): Promise<User> {
    if (USE_MOCKS) {
      await delay()
      const user: User = {
        id: nextMockId,
        username: input.username,
        name: input.name,
        lastName: input.lastName,
        roles: input.roles,
        createdAt: new Date().toISOString(),
      }

      nextMockId += 1
      mockUsers = [user, ...mockUsers]
      return user
    }

    return baseService.post<User, CreateUserInput>(USERS_ENDPOINT, input)
  },

  async update(id: number, input: UpdateUserInput): Promise<User> {
    if (USE_MOCKS) {
      await delay()
      const current = mockUsers.find((user) => user.id === id)

      if (!current) {
        throw new Error('Usuario no encontrado')
      }

      const updated: User = {
        ...current,
        username: input.username ?? current.username,
        name: input.name ?? current.name,
        lastName: input.lastName ?? current.lastName,
        roles: input.roles ?? current.roles,
      }

      mockUsers = mockUsers.map((user) => (user.id === id ? updated : user))
      return updated
    }

    return baseService.put<User, UpdateUserInput>(
      `${USERS_ENDPOINT}/${id}`,
      input,
    )
  },

  async remove(id: number): Promise<void> {
    if (USE_MOCKS) {
      await delay()
      mockUsers = mockUsers.filter((user) => user.id !== id)
      return
    }

    await baseService.delete<void>(`${USERS_ENDPOINT}/${id}`)
  },
}
