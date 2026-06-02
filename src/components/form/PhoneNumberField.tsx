import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '../../context/LocaleContext'
import { useFormRules } from '../../hooks/useFormRules'
import type { PhoneCountryOption } from '../../types/country'
import type { ApplicationFormData } from '../../types/formTypes'
import { FormTextField } from './FormTextField'

type Props = {
  phoneCountries: PhoneCountryOption[]
  loading: boolean
  error: string | null
}

// Phone input: a dial-code select (with flags) plus the national number, sharing
// the country data loaded for the address field.
export function PhoneNumberField({ phoneCountries, loading, error }: Props) {
  const { t } = useLocale()
  const rules = useFormRules()
  const { watch, setValue } = useFormContext<ApplicationFormData>()

  const addressCountry = watch('country')
  const phoneCountryCode = watch('phoneCountryCode')

  const dialCodeOptions = phoneCountries.map((option) => ({
    value: option.value,
    label: option.dialCode,
    flagCode: option.value,
  }))

  const countriesHelperText = error ?? (loading ? t('countriesLoading') : undefined)
  const disabled = loading || Boolean(error)

  // Default the dial code to the chosen address country, but never overwrite an
  // existing choice; revalidate so a "required" error clears.
  useEffect(() => {
    if (!addressCountry || phoneCountryCode || loading) return
    const match = phoneCountries.some((option) => option.value === addressCountry)
    if (match) {
      setValue('phoneCountryCode', addressCountry, { shouldValidate: true })
    }
  }, [addressCountry, phoneCountryCode, phoneCountries, loading, setValue])

  return (
    <Box className="phone-number-row">
      <Box className="phone-number-row__code">
        <FormTextField
          className="phone-dial-code-field"
          name="phoneCountryCode"
          rules={rules.phoneCountryCode}
          label={t('fields.phoneDialCode')}
          placeholder={t('placeholders.phoneDialCode')}
          options={dialCodeOptions}
          showFlags
          compactSelectValue
          disabled={disabled}
          required
          fullWidth
        />
      </Box>
      <Box className="phone-number-row__number">
        <FormTextField
          className="phone-national-field"
          name="phoneNumber"
          rules={rules.phoneNumber}
          label={t('fields.phone')}
          placeholder={t('placeholders.phoneNumber')}
          type="tel"
          disabled={disabled}
          required
          fullWidth
          autoComplete="tel-national"
          inputMode="numeric"
          slotProps={{
            htmlInput: {
              title: t('validation.phone'),
            },
          }}
        />
      </Box>
      {countriesHelperText ? (
        <FormHelperText className="phone-number-row__api-hint" error={Boolean(error)}>
          {countriesHelperText}
        </FormHelperText>
      ) : null}
    </Box>
  )
}
