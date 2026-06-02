import Grid from '@mui/material/Grid'
import {
  EMPLOYMENT_STATUS_OPTIONS,
  HOUSING_STATUS_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from '../constants/formOptions'
import { useLocale } from '../context/LocaleContext'
import { useFormRules } from '../hooks/useFormRules'
import { FormTextField } from './form/FormTextField'

// Step 2: household and financial details.
export const FamilyFinancialInfo = () => {
  const { t } = useLocale()
  const rules = useFormRules()

  const maritalOptions = MARITAL_STATUS_OPTIONS.map((option) => ({
    value: option,
    label: t(`options.maritalStatus.${option}`),
  }))
  const employmentOptions = EMPLOYMENT_STATUS_OPTIONS.map((option) => ({
    value: option,
    label: t(`options.employmentStatus.${option}`),
  }))
  const housingOptions = HOUSING_STATUS_OPTIONS.map((option) => ({
    value: option,
    label: t(`options.housingStatus.${option}`),
  }))

  return (
    <Grid container spacing={{ xs: 2, md: 2.5 }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormTextField
          name="maritalStatus"
          rules={rules.maritalStatus}
          label={t('fields.maritalStatus')}
          placeholder={t('placeholders.maritalStatus')}
          options={maritalOptions}
          required
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormTextField
          name="dependents"
          rules={rules.dependents}
          label={t('fields.dependents')}
          placeholder={t('placeholders.dependents')}
          type="number"
          required
          fullWidth
          inputMode="numeric"
          slotProps={{ htmlInput: { min: 0, max: 99, step: 1 } }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormTextField
          name="employmentStatus"
          rules={rules.employmentStatus}
          label={t('fields.employmentStatus')}
          placeholder={t('placeholders.employmentStatus')}
          options={employmentOptions}
          required
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormTextField
          name="monthlyIncome"
          rules={rules.monthlyIncome}
          label={t('fields.monthlyIncome')}
          placeholder={t('placeholders.monthlyIncome')}
          type="number"
          required
          fullWidth
          inputMode="decimal"
          slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          helperText={t('helpers.monthlyIncome')}
        />
      </Grid>
      <Grid size={12}>
        <FormTextField
          name="housingStatus"
          rules={rules.housingStatus}
          label={t('fields.housingStatus')}
          placeholder={t('placeholders.housingStatus')}
          options={housingOptions}
          required
          fullWidth
        />
      </Grid>
    </Grid>
  )
}
