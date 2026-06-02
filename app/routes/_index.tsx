import { Suspense, lazy } from 'react'

const LandingPage = lazy(async () =>
  import('~/components/landing/LandingPage').then((module) => ({ default: module.LandingPage })),
)

export default function Index() {
  return (
    <Suspense fallback={null}>
      <LandingPage />
    </Suspense>
  )
}
