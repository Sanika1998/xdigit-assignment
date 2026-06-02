import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Locale } from '../context/LocaleContext'
import { renderWithProviders } from '../test/test-utils'
import { LanguageSwitcher } from './LanguageSwitcher'

const changeAppLanguage = jest.fn((_locale: Locale) => Promise.resolve())

jest.mock('../i18n', () => {
  const actual = jest.requireActual('../i18n')
  return {
    ...actual,
    changeAppLanguage: (locale: Locale) => changeAppLanguage(locale),
  }
})

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    changeAppLanguage.mockClear()
  })

  it('renders EN and Arabic controls', () => {
    renderWithProviders(<LanguageSwitcher />)

    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'عربي' })).toBeInTheDocument()
  })

  it('switches to Arabic when Arabic is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LanguageSwitcher />)

    await user.click(screen.getByRole('button', { name: 'عربي' }))

    expect(changeAppLanguage).toHaveBeenCalledWith('ar')
  })

  it('switches to English when EN is clicked from Arabic', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LanguageSwitcher />)

    await user.click(screen.getByRole('button', { name: 'عربي' }))
    changeAppLanguage.mockClear()

    await user.click(screen.getByRole('button', { name: 'EN' }))

    expect(changeAppLanguage).toHaveBeenCalledWith('en')
  })

  it('ignores deselect (null value) from toggle group', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LanguageSwitcher />)

    await user.click(screen.getByRole('button', { name: 'EN' }))
    changeAppLanguage.mockClear()
    await user.click(screen.getByRole('button', { name: 'EN' }))

    expect(changeAppLanguage).not.toHaveBeenCalled()
  })

  it('renders header variant without full width', () => {
    renderWithProviders(<LanguageSwitcher variant="header" />)

    expect(document.querySelector('.language-switcher')).toBeInTheDocument()
  })
})
