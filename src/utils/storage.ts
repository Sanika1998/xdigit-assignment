// localStorage wrapper for saved form progress and locale. Access is guarded so
// it's safe without `window` (tests/SSR) and when writes throw (private mode).
import type { ApplicationFormData } from '../types/formTypes'
import type { Locale } from '../i18n/translations'
import { LOCALE_STORAGE_KEY, localeCookieValue } from './locale.shared'

const FORM_STORAGE_KEY = 'application-form-xdigit-progress'
export { LOCALE_STORAGE_KEY }

export type SavedProgress = {
  formData: ApplicationFormData
  activeStep: number
  savedAt: string
}

// True once the user has actually entered something (used to skip empty saves).
export function hasMeaningfulFormData(formData: ApplicationFormData): boolean {
  return Object.values(formData).some((value) => String(value ?? '').trim() !== '')
}

export function hasSavedProgress(): boolean {
  const saved = loadProgress()
  if (!saved) return false
  return hasMeaningfulFormData(saved.formData)
}

export function loadProgress(): SavedProgress | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = localStorage.getItem(FORM_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SavedProgress
    // Stored JSON could be stale or hand-edited, so sanity-check the shape.
    if (!parsed.formData || typeof parsed.activeStep !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

export function saveProgress(formData: ApplicationFormData, activeStep: number): void {
  if (typeof window === 'undefined') return

  // Clear rather than store an empty form, so "resume" stays accurate.
  if (!hasMeaningfulFormData(formData)) {
    clearProgress()
    return
  }

  try {
    const payload: SavedProgress = {
      formData,
      activeStep,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Quota exceeded or private browsing, ignore silently
  }
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(FORM_STORAGE_KEY)
}

export function loadLocale(): Locale | null {
  if (typeof window === 'undefined') return null

  const value = localStorage.getItem(LOCALE_STORAGE_KEY)
  return value === 'en' || value === 'ar' ? value : null
}

export function saveLocale(locale: Locale): void {
  if (typeof window === 'undefined') return

  // Cookie too, so the server could read the preference first paint if we add SSR.
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  document.cookie = localeCookieValue(locale)
}
