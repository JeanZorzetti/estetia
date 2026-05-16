/**
 * CNPJ validation utilities.
 * Pure functions — no external deps.
 */

export function unmaskCnpj(value: string): string {
  return value.replace(/\D/g, '')
}

export function maskCnpj(value: string): string {
  const digits = unmaskCnpj(value).slice(0, 14)
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function calcCheckDigit(digits: string, weights: number[]): number {
  const sum = digits
    .split('')
    .reduce((acc, d, i) => acc + Number(d) * weights[i], 0)
  const mod = sum % 11
  return mod < 2 ? 0 : 11 - mod
}

export function validateCnpj(value: string): boolean {
  const cnpj = unmaskCnpj(value)
  if (cnpj.length !== 14) return false
  // Reject all-same digits (e.g., 00000000000000)
  if (/^(\d)\1+$/.test(cnpj)) return false

  const base = cnpj.slice(0, 12)
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const d1 = calcCheckDigit(base, w1)
  const d2 = calcCheckDigit(base + d1, w2)

  return cnpj.slice(12) === `${d1}${d2}`
}
