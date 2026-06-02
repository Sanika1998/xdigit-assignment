// Slug order is the source of truth for both the URL and the step index.
export const STEP_SLUGS = ['personal', 'family', 'situation'] as const

export type StepSlug = (typeof STEP_SLUGS)[number]

export const DEFAULT_STEP: StepSlug = 'personal'

export function isValidStepSlug(value: string | undefined): value is StepSlug {
  return STEP_SLUGS.includes(value as StepSlug)
}

export function stepToIndex(slug: StepSlug): number {
  return STEP_SLUGS.indexOf(slug)
}

// Clamp so an out-of-range index can't break navigation.
export function indexToStep(index: number): StepSlug {
  return STEP_SLUGS[Math.min(Math.max(index, 0), STEP_SLUGS.length - 1)] ?? DEFAULT_STEP
}

export function stepPath(slug: StepSlug): string {
  return `/application/${slug}`
}
