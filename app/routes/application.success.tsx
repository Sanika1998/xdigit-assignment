import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Suspense, lazy } from 'react'

const ApplicationSuccess = lazy(async () =>
  import('~/components/ApplicationSuccess').then((module) => ({
    default: module.ApplicationSuccess,
  })),
)

export default function ApplicationSuccessPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: '40vh', display: 'grid', placeItems: 'center' }}>
          <CircularProgress size={28} />
        </Box>
      }
    >
      <ApplicationSuccess />
    </Suspense>
  )
}
