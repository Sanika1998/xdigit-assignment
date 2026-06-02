import { redirect } from 'react-router'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Suspense, lazy } from 'react'
import type { Route } from './+types/application.$step'
import { ApplicationFormProvider } from '~/context/ApplicationFormContext'
import { DEFAULT_STEP, isValidStepSlug, stepPath } from '~/routing/steps'

const ApplicationForm = lazy(async () =>
  import('~/components/ApplicationForm').then((module) => ({ default: module.ApplicationForm })),
)

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  const step = params.step
  if (!isValidStepSlug(step)) {
    throw redirect(stepPath(DEFAULT_STEP))
  }
  return null
}

export default function ApplicationStepPage() {
  return (
    <ApplicationFormProvider>
      <Suspense
        fallback={
          <Box sx={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        }
      >
        <ApplicationForm />
      </Suspense>
    </ApplicationFormProvider>
  )
}
