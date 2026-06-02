const sampleCountries = [
  {
    name: { common: 'United Arab Emirates' },
    cca2: 'AE',
    translations: { ara: { common: 'الإمارات' } },
    idd: { root: '+9', suffixes: ['71'] },
  },
]

describe('fetchRestCountriesData', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    jest.resetModules()
    sessionStorage.clear()
    globalThis.fetch = jest.fn() as typeof fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('fetches from API and caches in sessionStorage', async () => {
    ;(globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => sampleCountries,
    })

    const { fetchRestCountriesData } = await import('./restCountriesApi')
    const first = await fetchRestCountriesData('en')

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    expect(first.countries).toEqual([{ value: 'ae', label: 'United Arab Emirates' }])
    expect(first.phoneCountries[0]?.dialCode).toBe('+971')

    const second = await fetchRestCountriesData('en')
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    expect(second).toEqual(first)
  })

  it('reads from sessionStorage without calling fetch', async () => {
    const cached = {
      countries: [{ value: 'ae', label: 'Cached' }],
      phoneCountries: [{ value: 'ae', dialCode: '+971', label: '+971 Cached' }],
    }
    sessionStorage.setItem('restcountries-v2:en', JSON.stringify(cached))

    const { fetchRestCountriesData } = await import('./restCountriesApi')
    const result = await fetchRestCountriesData('en')

    expect(globalThis.fetch).not.toHaveBeenCalled()
    expect(result).toEqual(cached)
  })

  it('ignores corrupt sessionStorage cache and refetches', async () => {
    sessionStorage.setItem('restcountries-v2:en', '{bad json')
    ;(globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => sampleCountries,
    })

    const { fetchRestCountriesData } = await import('./restCountriesApi')
    const result = await fetchRestCountriesData('en')

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    expect(result.countries[0]?.value).toBe('ae')
  })

  it('exposes country and phone option helpers', async () => {
    ;(globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => sampleCountries,
    })

    const { fetchCountryOptions, fetchPhoneCountryOptions } = await import('./restCountriesApi')

    const countries = await fetchCountryOptions('en')
    const phoneCountries = await fetchPhoneCountryOptions('en')

    expect(countries[0]?.label).toBe('United Arab Emirates')
    expect(phoneCountries[0]?.dialCode).toBe('+971')
  })

  it('throws when API response is not ok', async () => {
    ;(globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    })

    const { fetchRestCountriesData } = await import('./restCountriesApi')

    await expect(fetchRestCountriesData('en')).rejects.toThrow(
      'REST Countries request failed (500)',
    )
  })
})
