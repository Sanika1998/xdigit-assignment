import { initialFormData } from '../types/formTypes'
import { isStepValid } from './stepFields'

const completePersonal = {
  ...initialFormData,
  name: 'Ada Lovelace',
  nationalId: '123456789',
  dateOfBirth: '1990-01-01',
  gender: 'female',
  address: '1 Main St',
  city: 'London',
  state: 'London',
  country: 'gb',
  phoneCountryCode: 'gb',
  phoneNumber: '1234567890',
  email: 'ada@example.com',
}

describe('isStepValid', () => {
  it('returns false when required fields are empty', () => {
    expect(isStepValid(initialFormData, 0, {})).toBe(false)
  })

  it('returns true when step fields are filled and have no errors', () => {
    expect(isStepValid(completePersonal, 0, {})).toBe(true)
  })

  it('returns false when a field has a validation error', () => {
    expect(isStepValid(completePersonal, 0, { email: { message: 'Invalid' } })).toBe(false)
  })

  it('validates family step fields', () => {
    const family = {
      ...completePersonal,
      maritalStatus: 'single',
      dependents: '0',
      employmentStatus: 'employedFullTime',
      monthlyIncome: '3000',
      housingStatus: 'renting',
    }
    expect(isStepValid(family, 1, {})).toBe(true)
    expect(isStepValid({ ...family, monthlyIncome: '' }, 1, {})).toBe(false)
  })

  it('validates situation step fields', () => {
    const situation = {
      ...completePersonal,
      maritalStatus: 'single',
      dependents: '0',
      employmentStatus: 'employedFullTime',
      monthlyIncome: '3000',
      housingStatus: 'renting',
      currentFinancialSituation: 'Details',
      employmentCircumstances: 'Details',
      reasonForApplying: 'Details',
    }
    expect(isStepValid(situation, 2, {})).toBe(true)
    expect(isStepValid({ ...situation, reasonForApplying: '  ' }, 2, {})).toBe(false)
  })
})
