import { ThemeProvider, createTheme } from '@mui/material/styles'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { LocaleProvider } from '~/context/LocaleContext'

const theme = createTheme()

function AllProviders({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </LocaleProvider>
  )
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options })
}
