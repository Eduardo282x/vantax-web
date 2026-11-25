import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/services/base-service'
import type { CreateUserInput, UpdateUserInput } from './user.interface'
import { userService } from './user.service'

export const userKeys = {
  all: ['users'] as const,
  list: (search: string) => [...userKeys.all, 'list', search] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
}

export function useUsers(search = '') {
  return useQuery({
    queryKey: userKeys.list(search),
    queryFn: () => userService.getAll(search),
  })
}

export function useUser(id: number | null) {
  return useQuery({
    queryKey: userKeys.detail(id ?? 0),
    queryFn: () => {
      if (id === null) {
        throw new Error('Usuario no seleccionado')
      }

      return userService.getById(id)
    },
    enabled: id !== null,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateUserInput) => userService.create(input),
    onSuccess: (user) => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('Usuario creado', {
        description: `${user.name} ${user.lastName} ya forma parte del equipo.`,
      })
    },
    onError: (error) => {
      toast.error('No se pudo crear el usuario', {
        description: getApiErrorMessage(error),
      })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number
      input: UpdateUserInput
    }) => userService.update(id, input),
    onSuccess: (user) => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('Usuario actualizado', {
        description: `Los datos de ${user.name} ${user.lastName} fueron guardados.`,
      })
    },
    onError: (error) => {
      toast.error('No se pudo actualizar el usuario', {
        description: getApiErrorMessage(error),
      })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => userService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('Usuario eliminado')
    },
    onError: (error) => {
      toast.error('No se pudo eliminar el usuario', {
        description: getApiErrorMessage(error),
      })
    },
  })
}
