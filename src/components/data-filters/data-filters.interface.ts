export interface FilterOption {
  label: string
  value: string
}

export type DateRangeFilterValue = {
  from: string
  to: string
}

export type FilterValue = string | string[] | DateRangeFilterValue | undefined

interface BaseDataFilter {
  id: string
  label: string
  className?: string
}

export type DataFilter =
  | (BaseDataFilter & {
      type: 'select'
      options: FilterOption[]
      placeholder?: string
    })
  | (BaseDataFilter & {
      type: 'multi-select'
      options: FilterOption[]
      placeholder?: string
    })
  | (BaseDataFilter & {
      type: 'date'
      placeholder?: string
    })
  | (BaseDataFilter & {
      type: 'date-range'
      fromLabel?: string
      toLabel?: string
    })

export interface DataFiltersProps {
  filters: DataFilter[]
  values: Record<string, FilterValue>
  onChange: (values: Record<string, FilterValue>) => void
  onReset?: () => void
  className?: string
}

export function isDateRangeValue(
  value: FilterValue,
): value is DateRangeFilterValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'from' in value &&
    'to' in value
  )
}
