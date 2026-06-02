import { useCallback, useEffect, useState } from 'react'

export const THEME_STORAGE_KEY = 'application-form-xdigit-theme'

// Saved preference wins; otherwise fall back to the OS color scheme.
function readDarkMode(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Dark mode is driven by <html data-theme>: CSS uses it and AppTheme observes it.
function applyThemeToDocument(dark: boolean) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
}

export function useSiteTheme() {
  const [dark, setDark] = useState(readDarkMode)

  useEffect(() => {
    applyThemeToDocument(dark)
  }, [dark])

  useEffect(() => {
    // Mirror changes made in another tab.
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        setDark(readDarkMode())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggleTheme = useCallback(() => {
    setDark((prev) => {
      const next = !prev
      localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light')
      applyThemeToDocument(next)
      return next
    })
  }, [])

  return { dark, toggleTheme }
}
