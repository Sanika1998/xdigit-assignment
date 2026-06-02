export type Locale = 'en' | 'ar'

export const DEFAULT_LOCALE: Locale = 'en'

export const TRANSLATION_NS = 'translation' as const

// Narrow any incoming language string down to a supported locale.
export function resolveLocale(language: string | undefined): Locale {
  return language === 'ar' ? 'ar' : DEFAULT_LOCALE
}

export { default as enNamespace } from './namespaces/en'
export { default as arNamespace } from './namespaces/ar'
