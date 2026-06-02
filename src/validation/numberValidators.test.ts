import {
  validateIntegerInRange,
  validatePhoneNational,
  validatePositiveNumber,
} from './numberValidators'

const t = (key: string) => key

describe('validatePhoneNational', () => {
  it('requires a value', () => {
    expect(validatePhoneNational('', t)).toBe('validation.required')
  })

  it('rejects non-digits and wrong length', () => {
    expect(validatePhoneNational('50-123', t)).toBe('validation.phone')
    expect(validatePhoneNational('123456', t)).toBe('validation.phone')
    expect(validatePhoneNational('1'.repeat(16), t)).toBe('validation.phone')
  })

  it('accepts 7–15 digit numbers', () => {
    expect(validatePhoneNational('5012345', t)).toBe(true)
    expect(validatePhoneNational('501234567890123', t)).toBe(true)
  })
})

describe('validateIntegerInRange', () => {
  it('requires a value', () => {
    expect(validateIntegerInRange('', t)).toBe('validation.required')
  })

  it('rejects non-integers', () => {
    expect(validateIntegerInRange('1.5', t)).toBe('validation.integer')
    expect(validateIntegerInRange('abc', t)).toBe('validation.integer')
  })

  it('enforces min and max', () => {
    expect(validateIntegerInRange('0', t, { min: 1, max: 99 })).toBe('validation.minZero')
    expect(validateIntegerInRange('100', t, { min: 0, max: 99 })).toBe('validation.maxDependents')
  })

  it('accepts values in range', () => {
    expect(validateIntegerInRange('0', t)).toBe(true)
    expect(validateIntegerInRange('99', t)).toBe(true)
  })
})

describe('validatePositiveNumber', () => {
  it('requires a value', () => {
    expect(validatePositiveNumber('', t)).toBe('validation.required')
  })

  it('rejects invalid decimal formats', () => {
    expect(validatePositiveNumber('12.345', t)).toBe('validation.decimal')
    expect(validatePositiveNumber('-5', t)).toBe('validation.decimal')
  })

  it('accepts integers and up to two decimal places', () => {
    expect(validatePositiveNumber('0', t)).toBe(true)
    expect(validatePositiveNumber('1500.50', t)).toBe(true)
  })

})
