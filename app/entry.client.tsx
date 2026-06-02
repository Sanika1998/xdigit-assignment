import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'

import '~/i18n'

createRoot(document).render(
  <StrictMode>
    <HydratedRouter />
  </StrictMode>,
)
