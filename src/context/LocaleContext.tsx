import { createContext, useContext, useLayoutEffect, type ReactNode } from 'react'
import { applyDocumentLanguage } from '../i18n'
import { useAppTranslation } from '../i18n/useAppTranslation'
import type { Locale } from '../i18n/translations'

export type LocaleContextValue = ReturnType<typeof useAppTranslation>

const LocaleContext = createContext<LocaleContextValue | null>(null)

/** i18n: `t`, `locale`, and language switching. */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const value = useAppTranslation()

  // useLayoutEffect so <html dir> updates before paint (avoids an RTL flash).
  useLayoutEffect(() => {
    applyDocumentLanguage(value.locale)
  }, [value.locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return context
}

export type { Locale }
