import { countryFlagEmoji } from './countryFlag'

describe('countryFlagEmoji', () => {
  it('returns flag emoji for valid ISO codes', () => {
    expect(countryFlagEmoji('ae')).toBe('🇦🇪')
    expect(countryFlagEmoji('US')).toBe('🇺🇸')
  })

  it('returns empty string for invalid codes', () => {
    expect(countryFlagEmoji('')).toBe('')
    expect(countryFlagEmoji('uae')).toBe('')
  })
})
