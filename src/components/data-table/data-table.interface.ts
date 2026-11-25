import type { ReactNode } from 'react'

export type DataTableSortDirection = 'asc' | 'desc'

export interface DataTableColumn<TData> {
  id: string
  header: string
  accessorKey?: keyof TData
  cell?: (row: TData) => ReactNode
  sortValue?: (row: TData) => string | number | Date | null | undefined
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  className?: string
  headerClassName?: string
  hideOnMobile?: boolean
}

export interface DataTableSorting {
  columnId: string
  direction: DataTableSortDirection
}

export interface DataTablePagination {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
}

export interface DataTableProps<TData> {
  data: TData[]
  columns: DataTableColumn<TData>[]
  getRowId?: (row: TData) => string | number
  getRowLabel?: (row: TData) => string
  initialSearch?: string
  searchPlaceholder?: string
  searchDebounceMs?: number
  onSearchChange?: (search: string) => void
  onEdit?: (row: TData) => void
  onDelete?: (row: TData) => void
  actionsDisabled?: boolean
  sorting?: DataTableSorting | null
  onSortingChange?: (sorting: DataTableSorting) => void
  pagination?: DataTablePagination
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  emptyMessage?: string
  className?: string
}
