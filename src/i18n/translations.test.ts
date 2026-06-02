import { DEFAULT_LOCALE, resolveLocale } from './translations'

describe('resolveLocale', () => {
  it('returns ar only for Arabic', () => {
    expect(resolveLocale('ar')).toBe('ar')
    expect(resolveLocale('ar-SA')).toBe(DEFAULT_LOCALE)
    expect(resolveLocale(undefined)).toBe(DEFAULT_LOCALE)
    expect(resolveLocale('en')).toBe('en')
  })
})
