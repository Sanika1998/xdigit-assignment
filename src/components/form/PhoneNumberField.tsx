import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '../../context/LocaleContext'
import { useFormRules } from '../../hooks/useFormRules'
import type { PhoneCountryOption } from '../../types/country'
import type { ApplicationFormData } from '../../types/formTypes'
import { FormTextField } from './FormTextField'
import {
  dialCodeFieldSx,
  phoneApiHintSx,
  phoneCellSx,
  phoneRowSx,
} from './phoneFieldSx'

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
    <Box sx={phoneRowSx}>
      <Box sx={phoneCellSx}>
        <FormTextField
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
          sx={dialCodeFieldSx}
        />
      </Box>
      <Box sx={phoneCellSx}>
        <FormTextField
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
        <FormHelperText sx={phoneApiHintSx} error={Boolean(error)}>
          {countriesHelperText}
        </FormHelperText>
      ) : null}
    </Box>
  )
}
