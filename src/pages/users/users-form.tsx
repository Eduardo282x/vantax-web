import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FiLoader, FiSave, FiUserPlus } from 'react-icons/fi'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  USER_ROLES,
  USER_ROLE_LABELS,
  type User,
} from '@/services/users/user.interface'
import { useCreateUser, useUpdateUser } from '@/services/users/user.hook'

const baseUserFormSchema = z.object({
  username: z
    .string()
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .max(40, 'Máximo 40 caracteres'),
  name: z.string().min(2, 'Ingresa el nombre'),
  lastName: z.string().min(2, 'Ingresa el apellido'),
  roles: z.enum(USER_ROLES, { error: 'Selecciona un rol' }),
  password: z.string().max(72, 'Máximo 72 caracteres').optional(),
})

type UserFormValues = z.infer<typeof baseUserFormSchema>

function getDefaultValues(user?: User | null): UserFormValues {
  return {
    username: user?.username ?? '',
    name: user?.name ?? '',
    lastName: user?.lastName ?? '',
    roles: user?.roles ?? 'CAJERO',
    password: '',
  }
}

interface UsersFormProps {
  user?: User | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function UsersForm({ user, onSuccess, onCancel }: UsersFormProps) {
  const isEdit = Boolean(user)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()

  const schema = baseUserFormSchema.superRefine((values, context) => {
    if (!isEdit && (values.password?.length ?? 0) < 6) {
      context.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'La contraseña debe tener al menos 6 caracteres',
      })
    }
  })

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(user),
  })

  const isPending = createUser.isPending || updateUser.isPending

  function handleSubmit(values: UserFormValues) {
    const payload = {
      username: values.username.trim(),
      name: values.name.trim(),
      lastName: values.lastName.trim(),
      roles: values.roles,
    }

    if (user) {
      updateUser.mutate(
        {
          id: user.id,
          input: {
            ...payload,
            password: values.password ? values.password : undefined,
          },
        },
        { onSuccess: () => onSuccess?.() },
      )
      return
    }

    createUser.mutate(
      { ...payload, password: values.password ?? '' },
      {
        onSuccess: () => {
          form.reset(getDefaultValues())
          onSuccess?.()
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ana" autoComplete="given-name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input
                  placeholder="Torres"
                  autoComplete="family-name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Input
                  placeholder="atorres"
                  autoComplete="username"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Se usará para iniciar sesión en el sistema.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {USER_ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isEdit ? 'Nueva contraseña' : 'Contraseña'}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete={isEdit ? 'new-password' : 'new-password'}
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {isEdit
                  ? 'Déjala vacía para conservar la contraseña actual.'
                  : 'Mínimo 6 caracteres.'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? (
              <FiLoader className="size-4 animate-spin" />
            ) : isEdit ? (
              <FiSave className="size-4" />
            ) : (
              <FiUserPlus className="size-4" />
            )}
            {isEdit ? 'Guardar cambios' : 'Crear usuario'}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onCancel}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
