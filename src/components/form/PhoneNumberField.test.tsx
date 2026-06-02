import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { PhoneCountryOption } from '../../types/country'
import { renderWithForm } from '../../test/form-test-utils'
import { PhoneNumberField } from './PhoneNumberField'

const phoneCountries: PhoneCountryOption[] = [
  { value: 'ae', dialCode: '+971', label: '+971 United Arab Emirates' },
  { value: 'gb', dialCode: '+44', label: '+44 United Kingdom' },
]

const fieldProps = {
  phoneCountries,
  loading: false,
  error: null as string | null,
}

function codeFieldRegion() {
  return within(document.querySelector('.phone-number-row__code') as HTMLElement)
}

describe('PhoneNumberField', () => {
  it('auto-fills dial code when address country is set and code is empty', async () => {
    const { methods } = renderWithForm(<PhoneNumberField {...fieldProps} />, {
      defaultValues: { country: 'ae', phoneCountryCode: '' },
    })

    await waitFor(() => {
      expect(methods().getValues('phoneCountryCode')).toBe('ae')
    })

    expect(screen.getByRole('combobox', { name: /code/i })).toHaveTextContent('+971')
  })

  it('does not overwrite an existing dial code when address country changes', async () => {
    const { methods } = renderWithForm(<PhoneNumberField {...fieldProps} />, {
      defaultValues: { country: 'ae', phoneCountryCode: 'gb' },
    })

    await act(async () => {
      methods().setValue('country', 'ae')
    })

    expect(methods().getValues('phoneCountryCode')).toBe('gb')
  })

  it('clears a required error when country auto-fills the code after code was touched', async () => {
    const { methods } = renderWithForm(<PhoneNumberField {...fieldProps} />)

    await act(async () => {
      expect(await methods().trigger('phoneCountryCode')).toBe(false)
    })

    expect(codeFieldRegion().getByText('This field is required')).toBeInTheDocument()

    await act(async () => {
      methods().setValue('country', 'ae', { shouldValidate: true })
    })

    await waitFor(() => {
      expect(methods().getValues('phoneCountryCode')).toBe('ae')
      expect(codeFieldRegion().queryByText('This field is required')).not.toBeInTheDocument()
    })
  })

  it('clears a required error when a dial code is selected from the dropdown', async () => {
    const user = userEvent.setup()
    const { methods } = renderWithForm(<PhoneNumberField {...fieldProps} />)

    await act(async () => {
      expect(await methods().trigger('phoneCountryCode')).toBe(false)
    })

    expect(codeFieldRegion().getByText('This field is required')).toBeInTheDocument()

    const codeField = screen.getByRole('combobox', { name: /code/i })
    await user.click(codeField)
    await user.click(await screen.findByRole('option', { name: /\+971/i }))

    await waitFor(() => {
      expect(methods().getValues('phoneCountryCode')).toBe('ae')
      expect(codeFieldRegion().queryByText('This field is required')).not.toBeInTheDocument()
    })
  })
})
