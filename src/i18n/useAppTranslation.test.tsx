import { act, renderHook, waitFor } from '@testing-library/react'
import { changeAppLanguage } from './index'
import { useAppTranslation } from './useAppTranslation'

jest.mock('./index', () => {
  const actual = jest.requireActual<typeof import('./index')>('./index')
  return {
    ...actual,
    changeAppLanguage: jest.fn((locale: 'en' | 'ar') => actual.changeAppLanguage(locale)),
  }
})

const changeAppLanguageMock = changeAppLanguage as jest.MockedFunction<typeof changeAppLanguage>

describe('useAppTranslation', () => {
  beforeEach(() => {
    localStorage.clear()
    changeAppLanguageMock.mockClear()
  })

  it('changes locale via setLocale', async () => {
    const { result } = renderHook(() => useAppTranslation())

    await act(async () => {
      await result.current.setLocale('ar')
    })

    expect(changeAppLanguageMock).toHaveBeenCalledWith('ar')
    expect(result.current.locale).toBe('ar')
  })

  it('syncs when i18n languageChanged fires', async () => {
    const { result } = renderHook(() => useAppTranslation())

    await act(async () => {
      await result.current.i18n.changeLanguage('ar')
    })

    await waitFor(() => {
      expect(result.current.locale).toBe('ar')
    })
  })

  it('resolves unknown language codes to English', async () => {
    const { result } = renderHook(() => useAppTranslation())

    await act(async () => {
      await result.current.i18n.changeLanguage('fr')
    })

    await waitFor(() => {
      expect(result.current.locale).toBe('en')
    })
  })
})
