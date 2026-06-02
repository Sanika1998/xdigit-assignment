import type { ApplicationFormData } from '../types/formTypes'
import type { Locale } from '../i18n/translations'

export type SubmitResponse = {
  success: true
  id: string
  submittedAt: string
}

export type SubmitPayload = {
  data: ApplicationFormData
  locale: Locale
}

// Mock submit endpoint (no real backend). Fakes latency and returns a reference
// id; swap the body for a real fetch() later, keeping the same signature.
export async function submitApplication(payload: SubmitPayload): Promise<SubmitResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Minimal guard to exercise the error path.
  if (!payload.data.email.trim()) {
    throw new Error('Invalid submission payload')
  }

  return {
    success: true,
    id: `APP-${Date.now().toString(36).toUpperCase()}`,
    submittedAt: new Date().toISOString(),
  }
}
