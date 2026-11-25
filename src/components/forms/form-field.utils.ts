export function digitsOnly(value: string, maxLength?: number): string {
  const digits = value.replace(/\D/g, '')

  return maxLength ? digits.slice(0, maxLength) : digits
}

export function formatPhone(value: string): string {
  const digits = digitsOnly(value, 11)

  if (digits.length <= 4) {
    return digits
  }

  return `${digits.slice(0, 4)}-${digits.slice(4)}`
}

export function formatCedula(value: string): string {
  const digits = digitsOnly(value, 9)

  if (!digits) {
    return ''
  }

  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `V-${grouped}`
}
