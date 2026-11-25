import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ConfigurableForm } from '@/components/forms/configurable-form'
import type { ConfigurableFormField } from '@/components/forms/configurable-form.interface'
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

  const fields: ConfigurableFormField<UserFormValues>[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Ana',
      autoComplete: 'given-name',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Apellido',
      type: 'text',
      placeholder: 'Torres',
      autoComplete: 'family-name',
      required: true,
    },
    {
      name: 'username',
      label: 'Usuario',
      type: 'text',
      placeholder: 'atorres',
      autoComplete: 'username',
      description: 'Se usará para iniciar sesión en el sistema.',
      suggestions: ['atorres', 'jlopez', 'mramirez'],
      required: true,
    },
    {
      name: 'roles',
      label: 'Rol',
      type: 'select',
      placeholder: 'Selecciona un rol',
      options: USER_ROLES.map((role) => ({
        label: USER_ROLE_LABELS[role],
        value: role,
      })),
      required: true,
    },
    {
      name: 'password',
      label: isEdit ? 'Nueva contraseña' : 'Contraseña',
      type: 'password',
      placeholder: '••••••••',
      autoComplete: 'new-password',
      description: isEdit
        ? 'Déjala vacía para conservar la contraseña actual.'
        : 'Mínimo 6 caracteres.',
      required: !isEdit,
      fullWidth: true,
    },
  ]

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
    <ConfigurableForm
      form={form}
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? 'Guardar cambios' : 'Crear usuario'}
      cancelLabel="Cancelar"
      onCancel={onCancel}
      isSubmitting={isPending}
      columns={2}
      highlightDirty={isEdit}
    />
  )
}
