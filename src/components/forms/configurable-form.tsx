import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form'
import { FiLoader, FiSave } from 'react-icons/fi'

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
import { cn } from '@/services/utils'
import type {
  ConfigurableFormField,
  ConfigurableFormProps,
} from './configurable-form.interface'
import {
  digitsOnly,
  formatCedula,
  formatPhone,
} from './form-field.utils'

function getSuggestionsId(name: string) {
  return `${name}-suggestions`
}

function renderFieldControl<TFieldValues extends FieldValues>(
  config: ConfigurableFormField<TFieldValues>,
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>,
  suggestionsId?: string,
) {
  const commonProps = {
    disabled: config.disabled,
    placeholder: config.placeholder,
    autoComplete: config.autoComplete,
  }

  if (config.type === 'select') {
    return (
      <Select
        value={typeof field.value === 'string' ? field.value : undefined}
        onValueChange={field.onChange}
        disabled={config.disabled}
      >
        <FormControl>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={config.placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {(config.options ?? []).map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (config.type === 'number') {
    const value = field.value as unknown

    return (
      <FormControl>
        <Input
          {...commonProps}
          type="number"
          min={config.min}
          max={config.max}
          step={config.step}
          value={
            typeof value === 'number'
              ? value
              : value == null
                ? ''
                : String(value)
          }
          onChange={(event) =>
            field.onChange(
              event.target.value === ''
                ? undefined
                : Number(event.target.value),
            )
          }
          onBlur={field.onBlur}
          ref={field.ref}
        />
      </FormControl>
    )
  }

  if (config.type === 'date') {
    return (
      <FormControl>
        <Input
          {...commonProps}
          type="date"
          value={String(field.value ?? '')}
          onChange={(event) => field.onChange(event.target.value)}
          onBlur={field.onBlur}
          ref={field.ref}
        />
      </FormControl>
    )
  }

  if (
    config.type === 'only-numbers' ||
    config.type === 'phone' ||
    config.type === 'cedula'
  ) {
    return (
      <FormControl>
        <Input
          {...commonProps}
          type="text"
          inputMode="numeric"
          value={String(field.value ?? '')}
          onChange={(event) => {
            const rawValue = event.target.value

            if (config.type === 'phone') {
              field.onChange(formatPhone(rawValue))
              return
            }

            if (config.type === 'cedula') {
              field.onChange(formatCedula(rawValue))
              return
            }

            field.onChange(digitsOnly(rawValue, config.maxLength))
          }}
          onBlur={field.onBlur}
          ref={field.ref}
        />
      </FormControl>
    )
  }

  return (
    <FormControl>
      <Input
        {...commonProps}
        type={config.type}
        list={suggestionsId}
        maxLength={config.maxLength}
        value={String(field.value ?? '')}
        onChange={(event) => field.onChange(event.target.value)}
        onBlur={field.onBlur}
        ref={field.ref}
      />
    </FormControl>
  )
}

export function ConfigurableForm<TFieldValues extends FieldValues>({
  form,
  fields,
  onSubmit,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  onCancel,
  isSubmitting = false,
  columns = 1,
  highlightDirty = false,
  className,
}: ConfigurableFormProps<TFieldValues>) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-4', className)}
        noValidate
      >
        <div
          className={cn(
            'grid gap-4',
            columns === 2 && 'sm:grid-cols-2',
          )}
        >
          {fields.map((config) => {
            const suggestionsId = config.suggestions
              ? getSuggestionsId(String(config.name))
              : undefined

            return (
              <FormField
                key={String(config.name)}
                control={form.control}
                name={config.name}
                render={({ field, fieldState }) => (
                  <FormItem
                    className={cn(
                      'content-start',
                      config.fullWidth && 'sm:col-span-2',
                      config.className,
                      highlightDirty &&
                        fieldState.isDirty &&
                        'rounded-lg border border-primary/30 bg-primary/5 p-3',
                    )}
                  >
                    <FormLabel>
                      {config.label}
                      {config.required && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>

                    {renderFieldControl(
                      config,
                      field,
                      suggestionsId,
                    )}

                    {config.suggestions && suggestionsId && (
                      <datalist id={suggestionsId}>
                        {config.suggestions.map((suggestion) => (
                          <option key={suggestion} value={suggestion} />
                        ))}
                      </datalist>
                    )}

                    {config.description && (
                      <FormDescription>
                        {config.description}
                      </FormDescription>
                    )}

                    {config.hint && (
                      <p className="text-xs text-muted-foreground">
                        {config.hint}
                      </p>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          })}
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <FiLoader className="size-4 animate-spin" />
            ) : (
              <FiSave className="size-4" />
            )}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
