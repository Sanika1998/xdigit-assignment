// Fetches and shapes country data (names + dial codes) from the REST Countries
// API, with localized labels and caching (memory + sessionStorage).
import type { Locale } from '../i18n/translations'
import type { CountryOption, PhoneCountryOption } from '../types/country'

// Only request the fields we use.
const REST_COUNTRIES_URL =
  'https://restcountries.com/v3.1/all?fields=name,cca2,translations,idd'

const SESSION_CACHE_KEY = 'restcountries-v2'

type RestCountryResponse = {
  name?: { common?: string }
  cca2?: string
  translations?: {
    ara?: { common?: string }
  }
  idd?: {
    root?: string
    suffixes?: string[]
  }
}

type RestCountriesCache = {
  countries: CountryOption[]
  phoneCountries: PhoneCountryOption[]
}

const memoryCache = new Map<string, RestCountriesCache>()

// Prefer the Arabic name in Arabic, falling back to the common name or code.
function countryLabel(country: RestCountryResponse, locale: Locale): string {
  const fallback = country.name?.common ?? country.cca2 ?? ''
  if (locale === 'ar') {
    return country.translations?.ara?.common ?? fallback
  }
  return fallback
}

// Combine the API's split dial code (root "+9" + suffix "71") into one "+971".
export function formatDialCode(idd?: RestCountryResponse['idd']): string | null {
  if (!idd?.root) return null

  const root = idd.root.replace(/\s/g, '')
  const suffixes = (idd.suffixes ?? []).map((suffix) => suffix.replace(/\s/g, '')).filter(Boolean)

  if (suffixes.length === 0) return root
  // +1 (and any country with multiple suffixes) has no single code; use the root.
  if (root === '+1' || suffixes.length > 1) return root

  return `${root}${suffixes[0]}`
}

export function mapRestCountriesToOptions(
  countries: RestCountryResponse[],
  locale: Locale,
): CountryOption[] {
  const collator = new Intl.Collator(locale === 'ar' ? 'ar' : 'en')

  return countries
    .filter((country) => country.cca2 && country.name?.common)
    .map((country) => ({
      value: country.cca2!.toLowerCase(),
      label: countryLabel(country, locale),
    }))
    .sort((a, b) => collator.compare(a.label, b.label))
}

export function mapPhoneCountryOptions(
  countries: RestCountryResponse[],
  locale: Locale,
): PhoneCountryOption[] {
  const collator = new Intl.Collator(locale === 'ar' ? 'ar' : 'en')
  // Dedupe by dial code (one entry per "+xxx"), keeping the shortest label.
  const byDialCode = new Map<string, PhoneCountryOption>()

  for (const country of countries) {
    const dialCode = formatDialCode(country.idd)
    const iso = country.cca2?.toLowerCase()
    if (!dialCode || !iso) continue

    const name = countryLabel(country, locale)
    const option: PhoneCountryOption = {
      value: iso,
      dialCode,
      label: `${dialCode} ${name}`,
    }

    const existing = byDialCode.get(dialCode)
    if (!existing || option.label.length < existing.label.length) {
      byDialCode.set(dialCode, option)
    }
  }

  return [...byDialCode.values()].sort((a, b) => collator.compare(a.label, b.label))
}

// Single fetch path: memory cache -> sessionStorage -> network.
export async function fetchRestCountriesData(locale: Locale): Promise<RestCountriesCache> {
  const cacheKey = `${SESSION_CACHE_KEY}:${locale}`
  const cached = memoryCache.get(cacheKey)
  if (cached) return cached

  if (typeof sessionStorage !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(cacheKey)
      if (stored) {
        const parsed = JSON.parse(stored) as RestCountriesCache
        memoryCache.set(cacheKey, parsed)
        return parsed
      }
    } catch {
      // Bad/old cached JSON: drop it and refetch.
      sessionStorage.removeItem(cacheKey)
    }
  }

  const response = await fetch(REST_COUNTRIES_URL)
  if (!response.ok) {
    throw new Error(`REST Countries request failed (${response.status})`)
  }

  // Derive both lists once so the UI never has to.
  const countries = (await response.json()) as RestCountryResponse[]
  const payload: RestCountriesCache = {
    countries: mapRestCountriesToOptions(countries, locale),
    phoneCountries: mapPhoneCountryOptions(countries, locale),
  }

  memoryCache.set(cacheKey, payload)
  if (typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(payload))
    } catch {
      // Storage full/unavailable; memory cache is enough.
    }
  }

  return payload
}

export async function fetchCountryOptions(locale: Locale): Promise<CountryOption[]> {
  return (await fetchRestCountriesData(locale)).countries
}

export async function fetchPhoneCountryOptions(locale: Locale): Promise<PhoneCountryOption[]> {
  return (await fetchRestCountriesData(locale)).phoneCountries
}
