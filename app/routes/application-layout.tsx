import Box from '@mui/material/Box'
import { Outlet } from 'react-router'
import { AppShell } from '~/components/layout/AppShell'
import { appMainSx } from '~/theme/formSx'

export default function ApplicationLayout() {
  return (
    <AppShell>
      <Box component="main" id="main-content" aria-label="Application" sx={appMainSx}>
        <Outlet />
      </Box>
    </AppShell>
  )
}
