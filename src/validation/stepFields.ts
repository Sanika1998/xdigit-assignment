import type { ApplicationFormData } from '../types/formTypes'

export const STEP_FIELDS: (keyof ApplicationFormData)[][] = [
  [
    'name',
    'nationalId',
    'dateOfBirth',
    'gender',
    'address',
    'city',
    'state',
    'country',
    'phoneCountryCode',
    'phoneNumber',
    'email',
  ],
  ['maritalStatus', 'dependents', 'employmentStatus', 'monthlyIncome', 'housingStatus'],
  ['currentFinancialSituation', 'employmentCircumstances', 'reasonForApplying'],
]

// Step is valid when every field is non-empty and error-free. Checks values
// directly (not "touched") since it gates the Next/Submit buttons.
export function isStepValid(
  values: ApplicationFormData,
  step: number,
  errors: Partial<Record<keyof ApplicationFormData, unknown>>,
): boolean {
  return STEP_FIELDS[step].every(
    (field) => String(values[field] ?? '').trim() !== '' && !errors[field],
  )
}
