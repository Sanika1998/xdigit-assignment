import { initialFormData } from '../types/formTypes'
import {
  clearProgress,
  hasMeaningfulFormData,
  hasSavedProgress,
  loadLocale,
  loadProgress,
  saveLocale,
  saveProgress,
} from './storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves and loads form progress', () => {
    const formData = { ...initialFormData, name: 'Ada Lovelace' }
    saveProgress(formData, 1)

    const loaded = loadProgress()
    expect(loaded).not.toBeNull()
    expect(loaded?.activeStep).toBe(1)
    expect(loaded?.formData).toEqual(formData)
    expect(loaded?.savedAt).toBeTruthy()
  })

  it('clears saved progress', () => {
    saveProgress({ ...initialFormData, name: 'Ada' }, 0)
    clearProgress()
    expect(loadProgress()).toBeNull()
  })

  it('does not persist empty form data', () => {
    saveProgress(initialFormData, 0)
    expect(loadProgress()).toBeNull()
    expect(hasSavedProgress()).toBe(false)
  })

  it('detects meaningful form data', () => {
    expect(hasMeaningfulFormData(initialFormData)).toBe(false)
    expect(hasMeaningfulFormData({ ...initialFormData, name: 'Ada' })).toBe(true)
  })

  it('returns null for corrupted localStorage JSON', () => {
    localStorage.setItem('application-form-xdigit-progress', '{not json')
    expect(loadProgress()).toBeNull()
  })

  it('saves and loads locale preference', () => {
    saveLocale('ar')
    expect(loadLocale()).toBe('ar')
    saveLocale('en')
    expect(loadLocale()).toBe('en')
  })

  it('returns null for invalid stored locale', () => {
    localStorage.setItem('application-form-xdigit-locale', 'fr')
    expect(loadLocale()).toBeNull()
  })

  it('hasSavedProgress is false when stored data is not meaningful', () => {
    saveProgress(initialFormData, 0)
    expect(hasSavedProgress()).toBe(false)
  })

  it('returns null when saved progress shape is invalid', () => {
    localStorage.setItem(
      'application-form-xdigit-progress',
      JSON.stringify({ activeStep: 1 }),
    )
    expect(loadProgress()).toBeNull()
  })

  it('ignores localStorage quota errors when saving', () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    expect(() => saveProgress({ ...initialFormData, name: 'Ada' }, 0)).not.toThrow()

    setItem.mockRestore()
  })
})
