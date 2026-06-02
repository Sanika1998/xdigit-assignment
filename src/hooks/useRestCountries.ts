import { useEffect, useState } from 'react'
import { useLocale } from '../context/LocaleContext'
import { fetchRestCountriesData } from '../services/restCountriesApi'
import type { CountryOption, PhoneCountryOption } from '../types/country'

// Loads the country + phone-code lists for the current locale (refetches on
// locale change since labels are localized; the service itself caches).
export function useRestCountries() {
  const { locale, t } = useLocale()
  const [countries, setCountries] = useState<CountryOption[]>([])
  const [phoneCountries, setPhoneCountries] = useState<PhoneCountryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Avoid setting state from a stale fetch after unmount/locale change.
    let cancelled = false

    setLoading(true)
    setError(null)

    void fetchRestCountriesData(locale)
      .then((data) => {
        if (!cancelled) {
          setCountries(data.countries)
          setPhoneCountries(data.phoneCountries)
        }
      })
      .catch(() => {
        if (!cancelled) setError(t('errors.countriesLoadFailed'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [locale])

  return { countries, phoneCountries, loading, error }
}
