import Box from '@mui/material/Box'
import type { ReactNode } from 'react'
import { AppTheme } from '../../theme/AppTheme'
import { Header } from '../landing/Header'
import { appShellSx } from '../landing/landingSx'

type Props = {
  children: ReactNode
}

// Page frame: applies the theme and renders the header above the page content.
export function AppShell({ children }: Props) {
  return (
    <AppTheme>
      <Box className="app-shell" sx={appShellSx}>
        <Header />
        {children}
      </Box>
    </AppTheme>
  )
}
