export interface ExchangeRate {
  name: string
  source: string
  currency: string
  value: number
  previousValue?: number
  updatedAt: string
}
