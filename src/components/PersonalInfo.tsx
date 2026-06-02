import Grid from '@mui/material/Grid'
import { GENDER_OPTIONS } from '../constants/formOptions'
import { useLocale } from '../context/LocaleContext'
import { useRestCountries } from '../hooks/useRestCountries'
import { PhoneNumberField } from './form/PhoneNumberField'
import { useFormRules } from '../hooks/useFormRules'
import { todayIsoDate } from '../validation/dateValidators'
import { FormTextField } from './form/FormTextField'

// Step 1: personal + contact + address. Country/phone data is fetched here and
// shared with PhoneNumberField.
export const PersonalInfo = () => {
  const { t } = useLocale()
  const rules = useFormRules()
  const {
    countries: countryOptions,
    phoneCountries,
    loading: countriesLoading,
    error: countriesError,
  } = useRestCountries()

  const genderOptions = GENDER_OPTIONS.map((option) => ({
    value: option,
    label: t(`options.gender.${option}`),
  }))

  const countryHelperText =
    countriesError ?? (countriesLoading ? t('countriesLoading') : undefined)

  return (
    <Grid container spacing={{ xs: 2, md: 2.5 }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormTextField
          name="name"
          rules={rules.name}
          label={t('fields.name')}
          placeholder={t('placeholders.name')}
          required
          fullWidth
          autoComplete="name"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormTextField
          name="nationalId"
          rules={rules.nationalId}
          label={t('fields.nationalId')}
          placeholder={t('placeholders.nationalId')}
          required
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormTextField
          name="dateOfBirth"
          rules={rules.dateOfBirth}
          label={t('fields.dateOfBirth')}
          type="date"
          required
          fullWidth
          slotProps={{
            // Stop the native date picker from offering future dates.
            htmlInput: { max: todayIsoDate() },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormTextField
          name="gender"
          rules={rules.gender}
          label={t('fields.gender')}
          placeholder={t('placeholders.gender')}
          options={genderOptions}
          required
          fullWidth
        />
      </Grid>
      <Grid size={12}>
        <FormTextField
          name="address"
          rules={rules.address}
          label={t('fields.address')}
          placeholder={t('placeholders.address')}
          required
          fullWidth
          autoComplete="street-address"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormTextField
          name="city"
          rules={rules.city}
          label={t('fields.city')}
          placeholder={t('placeholders.city')}
          required
          fullWidth
          autoComplete="address-level2"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormTextField
          name="state"
          rules={rules.state}
          label={t('fields.state')}
          placeholder={t('placeholders.state')}
          required
          fullWidth
          autoComplete="address-level1"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <FormTextField
          name="country"
          rules={rules.country}
          label={t('fields.country')}
          placeholder={t('placeholders.country')}
          options={countryOptions}
          helperText={countryHelperText}
          disabled={countriesLoading || Boolean(countriesError)}
          required
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <PhoneNumberField
          phoneCountries={phoneCountries}
          loading={countriesLoading}
          error={countriesError}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormTextField
          name="email"
          rules={rules.email}
          label={t('fields.email')}
          placeholder={t('placeholders.email')}
          type="email"
          required
          fullWidth
          autoComplete="email"
        />
      </Grid>
    </Grid>
  )
}
