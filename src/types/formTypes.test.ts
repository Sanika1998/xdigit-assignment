import { initialFormData, normalizeFormData } from './formTypes'

describe('normalizeFormData', () => {
  it('migrates legacy phone into phoneNumber', () => {
    expect(
      normalizeFormData({
        ...initialFormData,
        phone: '+971 50 123 4567',
      }),
    ).toMatchObject({
      phoneNumber: '971501234567',
      phoneCountryCode: '',
    })
  })

  it('does not overwrite phoneNumber when already set', () => {
    expect(
      normalizeFormData({
        ...initialFormData,
        phone: '+971 50 111 1111',
        phoneNumber: '501234567',
      }),
    ).toMatchObject({
      phoneNumber: '501234567',
    })
  })
})
