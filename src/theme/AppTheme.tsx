import { CacheProvider } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocale } from '../context/LocaleContext'
import { THEME_STORAGE_KEY } from '../hooks/useSiteTheme'
import { emotionCacheLtr, emotionCacheRtl } from './createEmotionCache'
import { portalColors, portalDark } from './portalColors'

// Color mode priority: <html data-theme> (set by the toggle) > saved pref > OS.
function readColorMode(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light'
  if (document.documentElement.dataset.theme === 'dark') return 'dark'
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'dark') return 'dark'
  if (stored === 'light') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Builds the MUI theme, reacting to locale (direction) and dark mode, and
// provides the matching Emotion cache for RTL.
export function AppTheme({ children }: { children: ReactNode }) {
  const { locale } = useLocale()
  const direction = locale === 'ar' ? 'rtl' : 'ltr'
  const emotionCache = direction === 'rtl' ? emotionCacheRtl : emotionCacheLtr
  const [mode, setMode] = useState<'light' | 'dark'>(readColorMode)

  useEffect(() => {
    const syncMode = () => setMode(readColorMode())
    syncMode()

    // The toggle only flips <html data-theme>, so watch it (and storage, for
    // other tabs) to keep MUI in sync.
    const observer = new MutationObserver(syncMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    window.addEventListener('storage', syncMode)
    return () => {
      observer.disconnect()
      window.removeEventListener('storage', syncMode)
    }
  }, [])

  // Background stays transparent so the page gradient (from CSS) shows through.
  const theme = useMemo(
    () =>
      createTheme({
        direction,
        palette: {
          mode,
          primary: {
            main: portalColors.primary,
            dark: portalColors.primaryDark,
          },
          ...(mode === 'dark'
            ? {
                background: {
                  default: 'transparent',
                  paper: portalDark.surface,
                },
                text: {
                  primary: portalDark.text,
                  secondary: portalDark.textMuted,
                },
                divider: portalDark.border,
                action: {
                  hover: 'rgba(148, 163, 184, 0.12)',
                },
              }
            : {
                background: {
                  default: 'transparent',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#0f172a',
                  secondary: '#64748b',
                },
              }),
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiInputBase: {
            styleOverrides: {
              root:
                mode === 'dark'
                  ? {
                      backgroundColor: portalDark.input,
                    }
                  : {},
              input: {
                '&::placeholder': {
                  opacity: 0.72,
                },
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root:
                mode === 'dark'
                  ? {
                      backgroundColor: portalDark.input,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#94a3b8',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: portalColors.primary,
                      },
                    }
                  : {},
              notchedOutline: {
                borderColor: mode === 'dark' ? portalDark.border : '#e2e8f0',
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root:
                mode === 'dark'
                  ? {
                      color: portalDark.textMuted,
                      '&.Mui-focused': {
                        color: portalColors.primary,
                      },
                    }
                  : {},
            },
          },
          MuiFormLabel: {
            styleOverrides: {
              root: mode === 'dark' ? { color: portalDark.textMuted } : {},
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiStepLabel: {
            styleOverrides: {
              label: mode === 'dark' ? { color: portalDark.textMuted } : {},
            },
          },
          MuiStepIcon: {
            styleOverrides: {
              root: {
                '&.Mui-active, &.Mui-completed': {
                  color: portalColors.primary,
                },
                '&.Mui-active .MuiStepIcon-text, &.Mui-completed .MuiStepIcon-text': {
                  fill: '#fff',
                },
                '&:not(.Mui-active):not(.Mui-completed)': {
                  color: mode === 'dark' ? '#475569' : '#cbd5e1',
                },
                '&:not(.Mui-active):not(.Mui-completed) .MuiStepIcon-text': {
                  fill: mode === 'dark' ? '#e2e8f0' : '#64748b',
                },
              },
            },
          },
        },
      }),
    [direction, mode],
  )

  // CacheProvider wraps ThemeProvider so styles use the correct LTR/RTL cache.
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </CacheProvider>
  )
}
