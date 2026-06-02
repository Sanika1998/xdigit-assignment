type Translate = (key: string) => string

// Local "today" as YYYY-MM-DD (local parts, not UTC, so it's right per timezone).
export function todayIsoDate(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Validators return `true` or a localized message (the shape RHF's `validate` wants).
export function validateDateOfBirth(value: unknown, t: Translate): true | string {
  const trimmed = String(value ?? '').trim()
  if (!trimmed) return t('validation.required')

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return t('validation.dateInvalid')
  }

  // Round-trip through Date to reject impossible dates (e.g. 2024-02-31 rolls over).
  const [year, month, day] = trimmed.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return t('validation.dateInvalid')
  }

  // Safe string compare: both are zero-padded ISO dates.
  if (trimmed > todayIsoDate()) {
    return t('validation.dateNotFuture')
  }

  return true
}
