import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

export type ConfigurableFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'only-numbers'
  | 'phone'
  | 'cedula'
  | 'date'
  | 'select'

export interface ConfigurableFieldOption {
  label: string
  value: string
}

export interface ConfigurableFormField<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  type: ConfigurableFieldType
  placeholder?: string
  description?: string
  hint?: string
  suggestions?: string[]
  options?: ConfigurableFieldOption[]
  min?: number
  max?: number
  step?: number
  maxLength?: number
  disabled?: boolean
  autoComplete?: string
  required?: boolean
  fullWidth?: boolean
  className?: string
}

export interface ConfigurableFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  fields: ConfigurableFormField<TFieldValues>[]
  onSubmit: (values: TFieldValues) => void | Promise<void>
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  isSubmitting?: boolean
  columns?: 1 | 2
  highlightDirty?: boolean
  className?: string
}
