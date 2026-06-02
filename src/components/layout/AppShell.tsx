import type { ReactNode } from 'react'
import '../../landing.css'
import { AppTheme } from '../../theme/AppTheme'
import { Header } from '../landing/Header'

type Props = {
  children: ReactNode
}

// Page frame: applies the theme and renders the header above the page content.
export function AppShell({ children }: Props) {
  return (
    <AppTheme>
      <div className="app-shell">
        <Header />
        {children}
      </div>
    </AppTheme>
  )
}
