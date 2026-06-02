import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithForm } from '../../test/form-test-utils'
import { FormTextField } from './FormTextField'

describe('FormTextField', () => {
  it('shows placeholder on focus for text inputs', async () => {
    const user = userEvent.setup()
    renderWithForm(
      <FormTextField name="name" label="Name" placeholder="Your name" rules={{ required: true }} />,
    )

    const input = screen.getByLabelText('Name')
    expect(screen.queryByPlaceholderText('Your name')).not.toBeInTheDocument()

    await user.click(input)
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
  })

  it('re-validates select fields after change', async () => {
    const user = userEvent.setup()
    const { methods } = renderWithForm(
      <FormTextField
        name="gender"
        label="Gender"
        rules={{ required: true }}
        options={[
          { value: 'female', label: 'Female' },
          { value: 'male', label: 'Male' },
        ]}
      />,
    )

    await act(async () => {
      expect(await methods().trigger('gender')).toBe(false)
    })

    await user.click(screen.getByRole('combobox', { name: 'Gender' }))
    await user.click(screen.getByRole('option', { name: 'Female' }))

    await waitFor(() => {
      expect(methods().getValues('gender')).toBe('female')
      expect(methods().formState.errors.gender).toBeUndefined()
    })
  })

  it('renders flag labels for country options', async () => {
    const user = userEvent.setup()
    renderWithForm(
      <FormTextField
        name="country"
        label="Country"
        showFlags
        options={[{ value: 'ae', label: 'United Arab Emirates' }]}
      />,
    )

    await user.click(screen.getByRole('combobox', { name: 'Country' }))
    expect(screen.getByRole('option', { name: /United Arab Emirates/ })).toBeInTheDocument()
  })
})
