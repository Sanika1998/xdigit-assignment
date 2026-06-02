import { render, screen } from '@testing-library/react'
import { LocaleProvider, useLocale } from './LocaleContext'

function LocaleReader() {
  const { locale, t } = useLocale()
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span>{t('language')}</span>
    </div>
  )
}

describe('LocaleContext', () => {
  it('provides locale and translation inside LocaleProvider', () => {
    render(
      <LocaleProvider>
        <LocaleReader />
      </LocaleProvider>,
    )

    expect(screen.getByTestId('locale')).toHaveTextContent('en')
    expect(screen.getByText(/language/i)).toBeInTheDocument()
  })

  it('throws when useLocale is used outside LocaleProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined)

    expect(() => render(<LocaleReader />)).toThrow(
      'useLocale must be used within LocaleProvider',
    )

    consoleError.mockRestore()
  })
})
