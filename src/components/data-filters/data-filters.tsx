import { useEffect, useId, useRef, useState } from 'react'
import { FiChevronDown, FiRotateCcw } from 'react-icons/fi'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
  DataFilter,
  DataFiltersProps,
  DateRangeFilterValue,
  FilterOption,
  FilterValue,
} from './data-filters.interface'
import { isDateRangeValue } from './data-filters.interface'

function hasActiveValue(value: FilterValue): boolean {
  if (value === undefined) {
    return false
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  if (typeof value === 'string') {
    return value.length > 0
  }

  return Boolean(value.from || value.to)
}

function getSelectedLabels(
  selected: string[],
  options: FilterOption[],
): string | null {
  if (selected.length === 0) {
    return null
  }

  if (selected.length === 1) {
    return (
      options.find((option) => option.value === selected[0])?.label ??
      selected[0]
    )
  }

  return `${selected.length} seleccionados`
}

function MultiSelectFilter({
  filter,
  value,
  onChange,
}: {
  filter: Extract<DataFilter, { type: 'multi-select' }>
  value: string[]
  onChange: (value: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const selectedLabel = getSelectedLabels(value, filter.options)

  function toggleOption(optionValue: string, checked: boolean) {
    if (checked) {
      onChange([...value, optionValue])
      return
    }

    onChange(value.filter((entry) => entry !== optionValue))
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setOpen(false)
        }
      }}
    >
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        className="h-9 w-full min-w-44 justify-between font-normal"
        onClick={() => setOpen((current) => !current)}
      >
        <span
          className={cn(
            'truncate',
            !selectedLabel && 'text-muted-foreground',
          )}
        >
          {selectedLabel ?? filter.placeholder ?? 'Seleccionar'}
        </span>
        <FiChevronDown className="size-4 shrink-0 opacity-60" />
      </Button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          aria-label={filter.label}
          className="absolute z-50 mt-1 max-h-64 w-full min-w-56 overflow-y-auto rounded-xl border border-border bg-popover p-1.5 shadow-lg"
        >
          {filter.options.map((option) => {
            const checked = value.includes(option.value)

            return (
              <div
                key={option.value}
                role="option"
                aria-selected={checked}
                tabIndex={0}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                onClick={() => toggleOption(option.value, !checked)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    toggleOption(option.value, !checked)
                  }
                }}
              >
                <span
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(nextChecked) =>
                      toggleOption(option.value, nextChecked === true)
                    }
                    tabIndex={-1}
                    aria-label={option.label}
                  />
                </span>
                <span className="truncate">{option.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DateRangeInputs({
  filter,
  value,
  onChange,
}: {
  filter: Extract<DataFilter, { type: 'date-range' }>
  value: DateRangeFilterValue
  onChange: (value: DateRangeFilterValue) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="space-y-1">
        <span className="block text-[10px] text-muted-foreground">
          {filter.fromLabel ?? 'Desde'}
        </span>
        <Input
          type="date"
          value={value.from}
          onChange={(event) =>
            onChange({ ...value, from: event.target.value })
          }
          className="h-9 w-36"
          aria-label={`${filter.label}: desde`}
        />
      </div>
      <div className="space-y-1">
        <span className="block text-[10px] text-muted-foreground">
          {filter.toLabel ?? 'Hasta'}
        </span>
        <Input
          type="date"
          value={value.to}
          onChange={(event) =>
            onChange({ ...value, to: event.target.value })
          }
          className="h-9 w-36"
          aria-label={`${filter.label}: hasta`}
        />
      </div>
    </div>
  )
}

export function DataFilters({
  filters,
  values,
  onChange,
  onReset,
  className,
}: DataFiltersProps) {
  const activeCount = Object.values(values).filter(hasActiveValue).length

  function setFilterValue(id: string, value: FilterValue) {
    const nextValues = { ...values }
    const shouldRemove =
      value === undefined ||
      (Array.isArray(value) && value.length === 0) ||
      (isDateRangeValue(value) && !value.from && !value.to)

    if (shouldRemove) {
      delete nextValues[id]
    } else {
      nextValues[id] = value
    }

    onChange(nextValues)
  }

  function handleReset() {
    if (onReset) {
      onReset()
      return
    }

    onChange({})
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-end gap-3 rounded-xl border border-border/80 bg-card p-3',
        className,
      )}
    >
      {filters.map((filter) => {
        const value = values[filter.id]

        return (
          <div
            key={filter.id}
            className={cn('min-w-40 space-y-1.5', filter.className)}
          >
            <span className="block text-xs font-medium text-muted-foreground">
              {filter.label}
            </span>

            {filter.type === 'select' && (
              <Select
                value={typeof value === 'string' ? value : 'all'}
                onValueChange={(nextValue) =>
                  setFilterValue(
                    filter.id,
                    nextValue === 'all' ? undefined : nextValue,
                  )
                }
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {filter.type === 'multi-select' && (
              <MultiSelectFilter
                filter={filter}
                value={Array.isArray(value) ? value : []}
                onChange={(nextValue) =>
                  setFilterValue(filter.id, nextValue)
                }
              />
            )}

            {filter.type === 'date' && (
              <Input
                type="date"
                value={typeof value === 'string' ? value : ''}
                onChange={(event) =>
                  setFilterValue(filter.id, event.target.value)
                }
                className="h-9"
                aria-label={filter.label}
              />
            )}

            {filter.type === 'date-range' && (
              <DateRangeInputs
                filter={filter}
                value={
                  isDateRangeValue(value)
                    ? value
                    : { from: '', to: '' }
                }
                onChange={(nextValue) =>
                  setFilterValue(filter.id, nextValue)
                }
              />
            )}
          </div>
        )
      })}

      <div className="ml-auto flex items-center gap-2">
        {activeCount > 0 && (
          <Badge variant="secondary">{activeCount} activos</Badge>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={activeCount === 0}
        >
          <FiRotateCcw className="size-3.5" />
          Limpiar filtros
        </Button>
      </div>
    </div>
  )
}
