import { baseService } from '@/services/base-service'
import type { ExchangeRate } from './exchange-rate.interface'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'
const MOCK_DELAY = 250
const MOCK_PREVIOUS_RATE = 36.2

function delay(ms = MOCK_DELAY) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

function getMockRate(): ExchangeRate {
  return {
    name: 'Dólar oficial',
    source: 'BCV',
    currency: 'USD',
    value: 36.5,
    previousValue: MOCK_PREVIOUS_RATE,
    updatedAt: new Date().toISOString(),
  }
}

export const exchangeRateService = {
  async getCurrent(): Promise<ExchangeRate> {
    if (USE_MOCKS) {
      await delay()
      return getMockRate()
    }

    return baseService.get<ExchangeRate>('/exchange-rate/current')
  },
}
