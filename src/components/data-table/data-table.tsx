import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FiAlertCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiEdit2,
  FiSearch,
  FiTrash2,
  FiX,
} from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/services/utils'
import type {
  DataTableColumn,
  DataTablePagination,
  DataTableProps,
  DataTableSortDirection,
  DataTableSorting,
} from './data-table.interface'

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50]

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) {
    return 0
  }

  if (a == null) {
    return 1
  }

  if (b == null) {
    return -1
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime()
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }

  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return Number(a) - Number(b)
  }

  return String(a).localeCompare(String(b), 'es', {
    numeric: true,
    sensitivity: 'base',
  })
}

function getAlignClass(align: DataTableColumn<unknown>['align']) {
  if (align === 'center') {
    return 'text-center'
  }

  if (align === 'right') {
    return 'text-right'
  }

  return undefined
}

function getSortValue<TData>(
  row: TData,
  column: DataTableColumn<TData>,
): unknown {
  if (column.sortValue) {
    return column.sortValue(row)
  }

  if (column.accessorKey) {
    return row[column.accessorKey]
  }

  return null
}

function getRowKey<TData>(
  row: TData,
  index: number,
  getRowId?: (row: TData) => string | number,
): string | number {
  if (getRowId) {
    return getRowId(row)
  }

  const record = row as Record<string, unknown>
  const id = record.id

  return typeof id === 'string' || typeof id === 'number' ? id : index
}

function renderCell<TData>(row: TData, column: DataTableColumn<TData>) {
  if (column.cell) {
    return column.cell(row)
  }

  const value = column.accessorKey ? row[column.accessorKey] : null

  return value == null ? '—' : String(value)
}

function SortIcon({
  direction,
}: {
  direction: DataTableSortDirection | null
}) {
  if (direction === 'asc') {
    return <FiChevronUp className="size-3.5" aria-hidden="true" />
  }

  if (direction === 'desc') {
    return <FiChevronDown className="size-3.5" aria-hidden="true" />
  }

  return (
    <FiChevronDown
      className="size-3.5 opacity-30"
      aria-hidden="true"
    />
  )
}

function PaginationBar({
  pagination,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: {
  pagination?: DataTablePagination
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const pageSizeOptions =
    pagination?.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS

  return (
    <div className="flex flex-col gap-3 border-t px-3 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p>
        Mostrando {from}-{to} de {total}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span>Filas</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger size="sm" className="h-8 w-[74px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span>
          Página {page} de {totalPages}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Página anterior"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <FiChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Página siguiente"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <FiChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DataTable<TData>({
  data,
  columns,
  getRowId,
  getRowLabel,
  initialSearch = '',
  searchPlaceholder = 'Buscar...',
  searchDebounceMs = 500,
  onSearchChange,
  onEdit,
  onDelete,
  actionsDisabled = false,
  sorting,
  onSortingChange,
  pagination,
  isLoading = false,
  error = null,
  onRetry,
  emptyMessage = 'No hay registros para mostrar.',
  className,
}: DataTableProps<TData>) {
  const [search, setSearch] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
  const [internalSorting, setInternalSorting] =
    useState<DataTableSorting | null>(null)
  const [localPage, setLocalPage] = useState(1)
  const [localPageSize, setLocalPageSize] = useState(10)
  const lastSentSearch = useRef(initialSearch)

  const isControlledSorting = sorting !== undefined
  const activeSorting = isControlledSorting ? sorting : internalSorting
  const paginationOnPageChange = pagination?.onPageChange

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search)
    }, searchDebounceMs)

    return () => window.clearTimeout(timeout)
  }, [search, searchDebounceMs])

  useEffect(() => {
    if (!onSearchChange) {
      return
    }

    if (lastSentSearch.current === debouncedSearch) {
      return
    }

    lastSentSearch.current = debouncedSearch
    onSearchChange(debouncedSearch)
    paginationOnPageChange?.(1)
  }, [debouncedSearch, onSearchChange, paginationOnPageChange])

  const processedData = useMemo(() => {
    if (onSearchChange) {
      return data
    }

    const term = debouncedSearch.trim().toLowerCase()

    if (!term) {
      return data
    }

    return data.filter((row) =>
      columns.some((column) => {
        const value = column.accessorKey ? row[column.accessorKey] : null
        return String(value ?? '').toLowerCase().includes(term)
      }),
    )
  }, [columns, data, debouncedSearch, onSearchChange])

  const sortedData = useMemo(() => {
    if (isControlledSorting || !activeSorting) {
      return processedData
    }

    const column = columns.find(
      (entry) => entry.id === activeSorting.columnId,
    )

    if (!column) {
      return processedData
    }

    const direction = activeSorting.direction === 'asc' ? 1 : -1

    return processedData.toSorted(
      (a, b) =>
        compareValues(
          getSortValue(a, column),
          getSortValue(b, column),
        ) * direction,
    )
  }, [
    activeSorting,
    columns,
    isControlledSorting,
    processedData,
  ])

  const currentPage = pagination?.page ?? localPage
  const pageSize = pagination?.pageSize ?? localPageSize
  const total = pagination?.total ?? sortedData.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const displayPage = pagination
    ? currentPage
    : Math.min(currentPage, totalPages)
  const visibleData = pagination
    ? sortedData
    : sortedData.slice(
        (displayPage - 1) * pageSize,
        displayPage * pageSize,
      )
  const hasActions = Boolean(onEdit || onDelete)
  const columnCount = columns.length + (hasActions ? 1 : 0)

  function handleSearchChange(value: string) {
    setSearch(value)

    if (!pagination) {
      setLocalPage(1)
    }
  }

  function handleSort(column: DataTableColumn<TData>) {
    if (!column.sortable) {
      return
    }

    if (isControlledSorting && !onSortingChange) {
      return
    }

    const nextDirection: DataTableSortDirection =
      activeSorting?.columnId === column.id &&
      activeSorting.direction === 'asc'
        ? 'desc'
        : 'asc'

    const nextSorting: DataTableSorting = {
      columnId: column.id,
      direction: nextDirection,
    }

    if (onSortingChange) {
      onSortingChange(nextSorting)
    } else {
      setInternalSorting(nextSorting)
    }

    if (paginationOnPageChange) {
      paginationOnPageChange(1)
    } else {
      setLocalPage(1)
    }
  }

  function handlePageChange(nextPage: number) {
    const clampedPage = Math.min(Math.max(nextPage, 1), totalPages)

    if (pagination) {
      pagination.onPageChange(clampedPage)
      return
    }

    setLocalPage(clampedPage)
  }

  function handlePageSizeChange(nextPageSize: number) {
    if (pagination?.onPageSizeChange) {
      pagination.onPageSizeChange(nextPageSize)
    } else {
      setLocalPageSize(nextPageSize)
    }

    setLocalPage(1)
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border/80 bg-card',
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <FiSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Buscar registros"
            className="h-9 pr-9 pl-9"
          />
          {search && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Limpiar búsqueda"
              className="absolute top-1/2 right-1.5 -translate-y-1/2"
              onClick={() => handleSearchChange('')}
            >
              <FiX className="size-3.5" />
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {isLoading ? 'Cargando registros...' : `${total} registros`}
        </p>
      </div>

      {error ? (
        <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
          <FiAlertCircle className="size-8 text-destructive" />
          <div>
            <p className="text-sm font-medium text-destructive">
              No se pudieron cargar los registros
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{error}</p>
          </div>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Reintentar
            </Button>
          )}
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => {
                  const isSorted = activeSorting?.columnId === column.id
                  const alignClass = getAlignClass(column.align)
                  const ariaSort = column.sortable
                    ? isSorted
                      ? activeSorting.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                    : undefined

                  return (
                    <TableHead
                      key={column.id}
                      aria-sort={ariaSort}
                      className={cn(
                        'bg-card',
                        alignClass,
                        column.hideOnMobile && 'hidden md:table-cell',
                        column.headerClassName,
                      )}
                    >
                      {column.sortable ? (
                        <button
                          type="button"
                          onClick={() => handleSort(column)}
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                            alignClass === 'text-right' && 'justify-end',
                            alignClass === 'text-center' && 'justify-center',
                          )}
                        >
                          {column.header}
                          <SortIcon
                            direction={
                              isSorted ? activeSorting.direction : null
                            }
                          />
                        </button>
                      ) : (
                        column.header
                      )}
                    </TableHead>
                  )
                })}

                {hasActions && (
                  <TableHead className="w-[1%] text-right">
                    Acciones
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <TableRow key={`loading-${rowIndex}`}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={cn(
                          column.hideOnMobile && 'hidden md:table-cell',
                        )}
                      >
                        <Skeleton className="h-4 w-full max-w-[180px]" />
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell>
                        <Skeleton className="ml-auto h-7 w-16" />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : visibleData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columnCount}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                visibleData.map((row, index) => {
                  const rowLabel = getRowLabel?.(row) ?? 'registro'

                  return (
                    <TableRow
                      key={getRowKey(row, index, getRowId)}
                      className="transition-colors hover:bg-muted/40"
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          className={cn(
                            getAlignClass(column.align),
                            column.hideOnMobile &&
                              'hidden md:table-cell',
                            column.className,
                          )}
                        >
                          {renderCell(row, column)}
                        </TableCell>
                      ))}

                      {hasActions && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {onEdit && (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Editar ${rowLabel}`}
                                disabled={actionsDisabled}
                                onClick={() => onEdit(row)}
                              >
                                <FiEdit2 className="size-4" />
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Eliminar ${rowLabel}`}
                                className="text-destructive hover:text-destructive"
                                disabled={actionsDisabled}
                                onClick={() => onDelete(row)}
                              >
                                <FiTrash2 className="size-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          {total > 0 && (
            <PaginationBar
              pagination={pagination}
              page={displayPage}
              pageSize={pageSize}
              total={total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}
    </div>
  )
}
