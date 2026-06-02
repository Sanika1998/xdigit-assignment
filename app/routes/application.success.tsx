import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import type { SxProps, Theme } from '@mui/material/styles'
import { Suspense, lazy } from 'react'

const ApplicationSuccess = lazy(async () =>
  import('~/components/ApplicationSuccess').then((module) => ({
    default: module.ApplicationSuccess,
  })),
)

const loadingSx: SxProps<Theme> = { minHeight: '40vh', display: 'grid', placeItems: 'center' }

export default function ApplicationSuccessPage() {
  return (
    <Suspense
      fallback={
        <Box sx={loadingSx}>
          <CircularProgress size={28} />
        </Box>
      }
    >
      <ApplicationSuccess />
    </Suspense>
  )
}
