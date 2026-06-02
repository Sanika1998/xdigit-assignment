import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { loadLocale } from '../utils/storage'
import { changeAppLanguage } from './index'
import { resolveLocale, TRANSLATION_NS, type Locale } from './translations'

// useTranslation plus a typed `locale` and `setLocale`. Locale is kept in state
// (not read from i18n directly) so components re-render reliably on change.
export function useAppTranslation() {
  const { t, i18n } = useTranslation(TRANSLATION_NS)
  const [locale, setLocaleState] = useState<Locale>(() =>
    resolveLocale(loadLocale() ?? i18n.resolvedLanguage ?? i18n.language),
  )

  useEffect(() => {
    const syncLocale = (lng: string) => {
      setLocaleState(resolveLocale(lng))
    }

    // Sync once in case i18n settled before this effect ran, then listen.
    syncLocale(i18n.resolvedLanguage ?? i18n.language)
    i18n.on('languageChanged', syncLocale)
    return () => i18n.off('languageChanged', syncLocale)
  }, [i18n])

  const setLocale = useCallback(async (next: Locale) => {
    const resolved = resolveLocale(next)
    await changeAppLanguage(resolved)
    setLocaleState(resolved)
  }, [])

  return { t, i18n, locale, setLocale }
}
