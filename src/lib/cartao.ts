import { onlyDigits } from './cpf'

/** Valida tamanho (13–19 dígitos) e dígito verificador (Luhn) de um número de cartão. */
export function isValidCardNumber(value: string): boolean {
  const digits = onlyDigits(value)
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i])
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

/** Valida mês (1–12) e ano (2 ou 4 dígitos), rejeitando cartões já vencidos. */
export function isValidExpiry(mes: string, ano: string): boolean {
  const month = Number(onlyDigits(mes))
  const yearDigits = onlyDigits(ano)
  if (!month || month < 1 || month > 12) return false
  if (yearDigits.length !== 2 && yearDigits.length !== 4) return false

  const year = Number(yearDigits.length === 2 ? `20${yearDigits}` : yearDigits)
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  return year > currentYear || (year === currentYear && month >= currentMonth)
}

export function isValidCvv(value: string): boolean {
  return /^\d{3,4}$/.test(onlyDigits(value))
}
