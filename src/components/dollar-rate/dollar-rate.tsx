import {
  FiAlertCircle,
  FiArrowDownRight,
  FiArrowUpRight,
  FiDollarSign,
  FiMinus,
  FiRefreshCw,
} from 'react-icons/fi'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getApiErrorMessage } from '@/services/base-service'
import { useDollarRate } from '@/services/exchange-rate/exchange-rate.hook'
import { cn } from '@/services/utils'

const rateFormatter = new Intl.NumberFormat('es-VE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('es', {
  dateStyle: 'short',
  timeStyle: 'short',
})

function formatRate(value: number) {
  return `Bs. ${rateFormatter.format(value)}`
}

function formatChange(value: number) {
  return `${rateFormatter.format(Math.abs(value))}%`
}

function formatUpdatedAt(value: string) {
  return dateFormatter.format(new Date(value))
}

export interface DollarRateProps {
  variant?: 'header' | 'card'
  className?: string
}

export function DollarRate({
  variant = 'card',
  className,
}: DollarRateProps) {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useDollarRate()

  const change =
    data?.previousValue == null ? 0 : data.value - data.previousValue
  const changePercent =
    data?.previousValue && data.previousValue !== 0
      ? (change / data.previousValue) * 100
      : 0

  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat'
  const TrendIcon =
    trend === 'up'
      ? FiArrowUpRight
      : trend === 'down'
        ? FiArrowDownRight
        : FiMinus
  const trendClassName =
    trend === 'up'
      ? 'text-emerald-600 dark:text-emerald-400'
      : trend === 'down'
        ? 'text-destructive'
        : 'text-muted-foreground'

  const errorMessage = isError ? getApiErrorMessage(error) : null

  if (variant === 'header') {
    const title = errorMessage
      ? `Tasa del dólar: ${errorMessage}`
      : data
        ? `${data.name} · ${data.source} · Actualizada ${formatUpdatedAt(data.updatedAt)}`
        : 'Cargando tasa del dólar'

    return (
      <div
        className={cn(
          'inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-border/80 bg-card px-3',
          className,
        )}
        title={title}
        aria-label={title}
      >
        <FiDollarSign className="size-4 shrink-0 text-primary" />
        <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          USD
        </span>

        {isLoading ? (
          <Skeleton className="h-3 w-16" />
        ) : (
          <span
            className="text-xs font-semibold whitespace-nowrap tabular-nums"
            aria-live="polite"
          >
            {data ? formatRate(data.value) : 'No disponible'}
          </span>
        )}

        {data && (
          <span
            className={cn(
              'hidden items-center gap-0.5 text-[10px] font-medium xl:inline-flex',
              trendClassName,
            )}
          >
            <TrendIcon className="size-3" />
            {formatChange(changePercent)}
          </span>
        )}
      </div>
    )
  }

  return (
    <Card size="sm" className={cn('h-fit', className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardDescription>Tasa del dólar</CardDescription>
            <CardTitle className="mt-1 text-2xl tabular-nums">
              {isLoading ? (
                <Skeleton className="h-8 w-36" />
              ) : data ? (
                <span aria-live="polite">{formatRate(data.value)}</span>
              ) : (
                'No disponible'
              )}
            </CardTitle>
          </div>
          <Badge variant="secondary">{data?.source ?? 'BCV'}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        {errorMessage ? (
          <div className="flex flex-col items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <div className="flex items-center gap-2 text-destructive">
              <FiAlertCircle className="size-4" />
              <span className="text-xs font-medium">
                No se pudo cargar la tasa
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{errorMessage}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
            >
              Reintentar
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Referencia</span>
              <span className="font-medium">1 USD</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Variación</span>
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-medium',
                  trendClassName,
                )}
              >
                <TrendIcon className="size-3.5" />
                {formatChange(changePercent)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Actualizada</span>
              <span className="text-right text-xs">
                {data ? formatUpdatedAt(data.updatedAt) : '—'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 border-t pt-3">
              <span className="text-xs text-muted-foreground">
                {data?.name ?? 'Dólar oficial'}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Actualizar tasa del dólar"
                title="Actualizar tasa del dólar"
                disabled={isFetching}
                onClick={() => void refetch()}
              >
                <FiRefreshCw
                  className={cn(
                    'size-3.5',
                    isFetching && 'animate-spin',
                  )}
                />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
