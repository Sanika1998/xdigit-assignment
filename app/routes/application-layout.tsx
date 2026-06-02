import { Outlet } from 'react-router'
import { AppShell } from '~/components/layout/AppShell'

export default function ApplicationLayout() {
  return (
    <AppShell>
      <main className="app-main" id="main-content" aria-label="Application">
        <Outlet />
      </main>
    </AppShell>
  )
}
