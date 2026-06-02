import { initialFormData } from '../types/formTypes'
import { submitApplication } from './submitApplication'

describe('submitApplication', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('resolves with success payload when email is present', async () => {
    const promise = submitApplication({
      data: { ...initialFormData, email: 'ada@example.com' },
      locale: 'en',
    })

    await jest.advanceTimersByTimeAsync(1200)
    const result = await promise

    expect(result.success).toBe(true)
    expect(result.id).toMatch(/^APP-/)
    expect(result.submittedAt).toBeTruthy()
  })

  it('rejects when email is missing', async () => {
    const promise = submitApplication({
      data: initialFormData,
      locale: 'en',
    })
    const assertion = expect(promise).rejects.toThrow('Invalid submission payload')

    await jest.advanceTimersByTimeAsync(1200)
    await assertion
  })
})
