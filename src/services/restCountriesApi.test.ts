import {
  formatDialCode,
  mapPhoneCountryOptions,
  mapRestCountriesToOptions,
} from './restCountriesApi'

describe('formatDialCode', () => {
  it('combines root and single suffix', () => {
    expect(formatDialCode({ root: '+9', suffixes: ['71'] })).toBe('+971')
    expect(formatDialCode({ root: '+4', suffixes: ['4'] })).toBe('+44')
  })

  it('uses root only for NANP', () => {
    expect(formatDialCode({ root: '+1', suffixes: ['201', '202'] })).toBe('+1')
  })

  it('returns root when there are no suffixes', () => {
    expect(formatDialCode({ root: '+7', suffixes: [] })).toBe('+7')
  })
})

describe('mapRestCountriesToOptions', () => {
  const sample = [
    {
      name: { common: 'United Arab Emirates' },
      cca2: 'AE',
      translations: { ara: { common: 'الإمارات العربية المتحدة' } },
    },
    {
      name: { common: 'United Kingdom' },
      cca2: 'GB',
      translations: { ara: { common: 'المملكة المتحدة' } },
    },
  ]

  it('maps ISO codes and English labels', () => {
    const options = mapRestCountriesToOptions(sample, 'en')
    expect(options).toEqual([
      { value: 'ae', label: 'United Arab Emirates' },
      { value: 'gb', label: 'United Kingdom' },
    ])
  })

  it('uses Arabic translations when locale is ar', () => {
    const options = mapRestCountriesToOptions(sample, 'ar')
    expect(options[0]).toEqual({ value: 'ae', label: 'الإمارات العربية المتحدة' })
    expect(options[1]).toEqual({ value: 'gb', label: 'المملكة المتحدة' })
  })
})

describe('mapPhoneCountryOptions', () => {
  it('prefers shorter label when duplicate dial codes exist', () => {
    const options = mapPhoneCountryOptions(
      [
        {
          name: { common: 'United States' },
          cca2: 'US',
          idd: { root: '+1', suffixes: ['201'] },
        },
        {
          name: { common: 'Canada' },
          cca2: 'CA',
          idd: { root: '+1', suffixes: ['204'] },
        },
      ],
      'en',
    )

    expect(options).toHaveLength(1)
    expect(options[0]?.dialCode).toBe('+1')
  })

  it('skips countries without dial code or ISO', () => {
    const options = mapPhoneCountryOptions(
      [{ name: { common: 'No Code' }, cca2: 'XX' }],
      'en',
    )
    expect(options).toHaveLength(0)
  })

  it('maps dial codes with country names', () => {
    const options = mapPhoneCountryOptions(
      [
        {
          name: { common: 'United Arab Emirates' },
          cca2: 'AE',
          idd: { root: '+9', suffixes: ['71'] },
        },
        {
          name: { common: 'United States' },
          cca2: 'US',
          idd: { root: '+1', suffixes: ['201', '202'] },
        },
      ],
      'en',
    )

    expect(options).toEqual(
      expect.arrayContaining([
        { value: 'ae', dialCode: '+971', label: '+971 United Arab Emirates' },
        { value: 'us', dialCode: '+1', label: '+1 United States' },
      ]),
    )
  })
})
