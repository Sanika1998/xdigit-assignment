// Every field is a string (even numbers/dates) to keep form state simple;
// parsing happens only in the validators that need it.
export interface ApplicationFormData {
  name: string
  nationalId: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  country: string
  phoneCountryCode: string
  phoneNumber: string
  email: string
  maritalStatus: string
  dependents: string
  employmentStatus: string
  monthlyIncome: string
  housingStatus: string
  currentFinancialSituation: string
  employmentCircumstances: string
  reasonForApplying: string
}

export const initialFormData: ApplicationFormData = {
  name: '',
  nationalId: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  country: '',
  phoneCountryCode: '',
  phoneNumber: '',
  email: '',
  maritalStatus: '',
  dependents: '',
  employmentStatus: '',
  monthlyIncome: '',
  housingStatus: '',
  currentFinancialSituation: '',
  employmentCircumstances: '',
  reasonForApplying: '',
}

type LegacyFormData = ApplicationFormData & { phone?: string }

/** Maps saved progress from older versions (single `phone` field). */
export function normalizeFormData(data: Partial<LegacyFormData>): ApplicationFormData {
  const merged: LegacyFormData = { ...initialFormData, ...data }

  // Migrate the old combined `phone` value into the new national-number field.
  if (merged.phone && !merged.phoneNumber) {
    const digits = String(merged.phone).replace(/\D/g, '')
    merged.phoneNumber = digits
  }

  const { phone: _removed, ...rest } = merged
  return rest
}
