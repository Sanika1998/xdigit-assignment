import type { RegisterOptions } from 'react-hook-form'
import type { ApplicationFormData } from '../types/formTypes'
import { validateDateOfBirth } from './dateValidators'
import {
  validateIntegerInRange,
  validatePhoneNational,
  validatePositiveNumber,
} from './numberValidators'

type Translate = (key: string) => string
type FieldRules = RegisterOptions<ApplicationFormData>

// `validate` (not `required`) so whitespace-only input is rejected and the
// message is localized.
const required = (t: Translate): FieldRules => ({
  validate: (value) => String(value ?? '').trim() !== '' || t('validation.required'),
})

// Rules map keyed by field; takes `t` so messages use the active language.
export function buildFormRules(t: Translate): Record<keyof ApplicationFormData, FieldRules> {
  const req = required(t)

  return {
    name: req,
    nationalId: req,
    dateOfBirth: {
      validate: (value) => validateDateOfBirth(value, t),
    },
    gender: req,
    address: req,
    city: req,
    state: req,
    country: req,
    phoneCountryCode: req,
    phoneNumber: {
      validate: (value) => validatePhoneNational(value, t),
    },
    email: {
      validate: (value) => {
        const trimmed = String(value ?? '').trim()
        if (!trimmed) return t('validation.required')
        // Loose check to catch obvious typos, not full RFC 5322 validation.
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || t('validation.email')
      },
    },
    maritalStatus: req,
    dependents: {
      validate: (value) => validateIntegerInRange(value, t, { min: 0, max: 99 }),
    },
    employmentStatus: req,
    monthlyIncome: {
      validate: (value) => validatePositiveNumber(value, t),
    },
    housingStatus: req,
    currentFinancialSituation: req,
    employmentCircumstances: req,
    reasonForApplying: req,
  }
}
