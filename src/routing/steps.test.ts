import {
  DEFAULT_STEP,
  indexToStep,
  isValidStepSlug,
  stepPath,
  stepToIndex,
} from './steps'

describe('routing steps', () => {
  it('maps slugs to indices and back', () => {
    expect(stepToIndex('personal')).toBe(0)
    expect(stepToIndex('family')).toBe(1)
    expect(stepToIndex('situation')).toBe(2)
    expect(indexToStep(0)).toBe('personal')
    expect(indexToStep(99)).toBe('situation')
    expect(indexToStep(-5)).toBe('personal')
  })

  it('validates step slugs', () => {
    expect(isValidStepSlug('personal')).toBe(true)
    expect(isValidStepSlug('invalid')).toBe(false)
    expect(isValidStepSlug(undefined)).toBe(false)
  })

  it('builds application paths', () => {
    expect(stepPath(DEFAULT_STEP)).toBe('/application/personal')
    expect(stepPath('family')).toBe('/application/family')
  })
})
