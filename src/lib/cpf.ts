export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** Valida formato (11 dígitos) e dígitos verificadores de um CPF. */
export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

  const digits = cpf.split('').map(Number)
  const checkDigit = (length: number) => {
    let sum = 0
    for (let i = 0; i < length; i++) {
      sum += digits[i] * (length + 1 - i)
    }
    const remainder = (sum * 10) % 11
    return remainder === 10 ? 0 : remainder
  }

  return checkDigit(9) === digits[9] && checkDigit(10) === digits[10]
}

export function formatCpf(value: string): string {
  const cpf = onlyDigits(value).slice(0, 11)
  return cpf
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}
