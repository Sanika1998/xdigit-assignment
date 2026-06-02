import type { Locale } from '../i18n/translations'

export const LOCALE_STORAGE_KEY = 'application-form-xdigit-locale'
export const LOCALE_COOKIE = 'app_locale'

export function documentDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

export function localeCookieValue(locale: Locale): string {
  return `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`
}
