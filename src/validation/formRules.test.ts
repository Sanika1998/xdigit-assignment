import type { RegisterOptions } from 'react-hook-form'
import type { ApplicationFormData } from '../types/formTypes'
import { buildFormRules } from './formRules'

const t = (key: string) => key

function runFieldValidate(
  rules: RegisterOptions<ApplicationFormData, keyof ApplicationFormData>,
  value: string,
) {
  const { validate } = rules
  if (typeof validate === 'function') {
    return validate(value, {} as never)
  }
  return true
}

describe('buildFormRules', () => {
  const rules = buildFormRules(t)

  it('requires simple text fields when empty', () => {
    expect(runFieldValidate(rules.name, '')).toBe('validation.required')
    expect(runFieldValidate(rules.name, 'Ada')).toBe(true)
  })

  it('requires phoneCountryCode when empty', () => {
    expect(runFieldValidate(rules.phoneCountryCode, '')).toBe('validation.required')
    expect(runFieldValidate(rules.phoneCountryCode, 'ae')).toBe(true)
  })

  it('validates phoneNumber format', () => {
    expect(runFieldValidate(rules.phoneNumber, '')).toBe('validation.required')
    expect(runFieldValidate(rules.phoneNumber, '123')).toBe('validation.phone')
    expect(runFieldValidate(rules.phoneNumber, '501234567')).toBe(true)
  })

  it('validates email', () => {
    expect(runFieldValidate(rules.email, '')).toBe('validation.required')
    expect(runFieldValidate(rules.email, 'not-an-email')).toBe('validation.email')
    expect(runFieldValidate(rules.email, 'ada@example.com')).toBe(true)
  })

  it('validates dateOfBirth', () => {
    expect(runFieldValidate(rules.dateOfBirth, '')).toBe('validation.required')
    expect(runFieldValidate(rules.dateOfBirth, '1990-01-15')).toBe(true)
    expect(runFieldValidate(rules.dateOfBirth, '2099-01-01')).toBe('validation.dateNotFuture')
  })

  it('validates dependents and monthlyIncome', () => {
    expect(runFieldValidate(rules.dependents, '100')).toBe('validation.maxDependents')
    expect(runFieldValidate(rules.dependents, '2')).toBe(true)
    expect(runFieldValidate(rules.monthlyIncome, '12.99')).toBe(true)
    expect(runFieldValidate(rules.monthlyIncome, 'bad')).toBe('validation.decimal')
  })
})
