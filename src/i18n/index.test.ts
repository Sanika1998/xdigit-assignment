import i18n, { applyDocumentLanguage, changeAppLanguage } from './index'

describe('i18n index', () => {
  beforeEach(() => {
    document.documentElement.lang = 'en'
    document.documentElement.dir = 'ltr'
  })

  it('applyDocumentLanguage sets html lang and dir for Arabic', () => {
    applyDocumentLanguage('ar')

    expect(document.documentElement.lang).toBe('ar')
    expect(document.documentElement.dir).toBe('rtl')
  })

  it('applyDocumentLanguage sets LTR for English', () => {
    applyDocumentLanguage('en')

    expect(document.documentElement.lang).toBe('en')
    expect(document.documentElement.dir).toBe('ltr')
  })

  it('changeAppLanguage resolves locale before switching', async () => {
    await changeAppLanguage('ar')
    expect(i18n.language).toBe('ar')

    await changeAppLanguage('en')
    expect(i18n.language).toBe('en')
  })
})
