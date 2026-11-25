import { useQuery } from '@tanstack/react-query'

import { exchangeRateService } from './exchange-rate.service'

export const exchangeRateKeys = {
  all: ['exchange-rate'] as const,
  current: () => [...exchangeRateKeys.all, 'current'] as const,
}

export function useDollarRate() {
  return useQuery({
    queryKey: exchangeRateKeys.current(),
    queryFn: () => exchangeRateService.getCurrent(),
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  })
}
