import { todayIsoDate, validateDateOfBirth } from './dateValidators'

const t = (key: string) => key

describe('todayIsoDate', () => {
  it('returns an ISO date string for today', () => {
    const iso = todayIsoDate()
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    const today = new Date()
    const expected = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-')
    expect(iso).toBe(expected)
  })
})

describe('validateDateOfBirth', () => {
  it('requires a value', () => {
    expect(validateDateOfBirth('', t)).toBe('validation.required')
    expect(validateDateOfBirth('   ', t)).toBe('validation.required')
  })

  it('rejects non-ISO formats', () => {
    expect(validateDateOfBirth('01/01/1990', t)).toBe('validation.dateInvalid')
    expect(validateDateOfBirth('1990-1-1', t)).toBe('validation.dateInvalid')
  })

  it('rejects impossible calendar dates', () => {
    expect(validateDateOfBirth('1990-02-30', t)).toBe('validation.dateInvalid')
  })

  it('rejects future dates', () => {
    expect(validateDateOfBirth('2099-12-31', t)).toBe('validation.dateNotFuture')
  })

  it('accepts a valid past date', () => {
    expect(validateDateOfBirth('1990-01-15', t)).toBe(true)
  })

  it('accepts today', () => {
    expect(validateDateOfBirth(todayIsoDate(), t)).toBe(true)
  })
})
