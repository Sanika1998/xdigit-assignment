import { useMemo } from 'react'
import { useLocale } from '../context/LocaleContext'
import { buildFormRules } from '../validation/formRules'

// Validation rules with localized messages; rebuilt on locale change.
export function useFormRules() {
  const { t, locale } = useLocale()
  return useMemo(() => buildFormRules(t), [t, locale])
}
