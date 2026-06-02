type Translate = (key: string) => string

// National number only (no dial code), 7-15 digits.
export function validatePhoneNational(value: unknown, t: Translate): true | string {
  const trimmed = String(value ?? '').trim()
  if (!trimmed) return t('validation.required')

  if (!/^\d+$/.test(trimmed)) {
    return t('validation.phone')
  }

  if (trimmed.length < 7 || trimmed.length > 15) {
    return t('validation.phone')
  }

  return true
}

// Whole number in [min, max]; defaults suit "dependents" (0-99).
export function validateIntegerInRange(
  value: unknown,
  t: Translate,
  options: { min?: number; max?: number } = {},
): true | string {
  const { min = 0, max = 99 } = options
  const trimmed = String(value ?? '').trim()

  if (!trimmed) return t('validation.required')

  if (!/^\d+$/.test(trimmed)) {
    return t('validation.integer')
  }

  const n = Number(trimmed)
  if (n < min) return t('validation.minZero')
  if (n > max) return t('validation.maxDependents')

  return true
}

// Non-negative number with up to two decimals (income).
export function validatePositiveNumber(value: unknown, t: Translate): true | string {
  const trimmed = String(value ?? '').trim()
  if (!trimmed) return t('validation.required')

  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return t('validation.decimal')
  }

  const n = Number(trimmed)
  if (Number.isNaN(n) || n < 0) return t('validation.minZero')

  return true
}
