import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { loadLocale, saveLocale } from '../utils/storage'
import {
  arNamespace,
  DEFAULT_LOCALE,
  enNamespace,
  resolveLocale,
  TRANSLATION_NS,
  type Locale,
} from './translations'

// Sync <html lang/dir> with the language (dir flips for Arabic) and persist it.
export function applyDocumentLanguage(lng: string) {
  const locale = resolveLocale(lng)
  if (typeof document === 'undefined') return

  document.documentElement.lang = locale
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  saveLocale(locale)
}

const initialLocale = resolveLocale(
  typeof window !== 'undefined' ? (loadLocale() ?? DEFAULT_LOCALE) : DEFAULT_LOCALE,
)

void i18n.use(initReactI18next).init({
  resources: {
    en: { [TRANSLATION_NS]: enNamespace },
    ar: { [TRANSLATION_NS]: arNamespace },
  },
  lng: initialLocale,
  fallbackLng: DEFAULT_LOCALE,
  ns: [TRANSLATION_NS],
  defaultNS: TRANSLATION_NS,
  interpolation: {
    escapeValue: false, // React already escapes
  },
  react: {
    useSuspense: false,
    bindI18n: 'languageChanged loaded',
  },
})

// Apply once on load (before React mounts) to avoid a wrong-direction flash...
if (typeof document !== 'undefined') {
  applyDocumentLanguage(initialLocale)
}

// ...and on every later change.
i18n.on('languageChanged', applyDocumentLanguage)

export async function changeAppLanguage(locale: Locale): Promise<void> {
  await i18n.changeLanguage(resolveLocale(locale))
}

export default i18n
export type { Locale }
