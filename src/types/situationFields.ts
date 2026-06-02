import type { ApplicationFormData } from './formTypes'

// The three free-text fields the "Help Me Write" assistant can fill in.
export type SituationField =
  | 'currentFinancialSituation'
  | 'employmentCircumstances'
  | 'reasonForApplying'

export const SITUATION_FIELDS: SituationField[] = [
  'currentFinancialSituation',
  'employmentCircumstances',
  'reasonForApplying',
]

// Subset of answers fed to the prompt builder for context.
export type SituationFieldContext = Pick<
  ApplicationFormData,
  | 'name'
  | 'employmentStatus'
  | 'monthlyIncome'
  | 'housingStatus'
  | 'maritalStatus'
  | 'dependents'
  | 'currentFinancialSituation'
  | 'employmentCircumstances'
  | 'reasonForApplying'
>
