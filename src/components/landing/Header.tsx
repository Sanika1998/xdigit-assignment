import { Link } from 'react-router'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { useSiteTheme } from '../../hooks/useSiteTheme'
import { useLocale } from '../../context/LocaleContext'

// Site header: brand, language switcher, dark-mode toggle.
export function Header() {
  const { t } = useLocale()
  const { dark, toggleTheme } = useSiteTheme()

  return (
    <header className="landing__header">
      <Link to="/" className="landing__brand">
        <span className="landing__logo" aria-hidden="true">
          ✦
        </span>
        <span className="landing__brand-text">{t('landing.brand')}</span>
      </Link>

      <nav className="landing__nav" aria-label={t('landing.navLabel')}>
        <div className="landing__nav-lang">
          <LanguageSwitcher variant="header" />
        </div>
        <button
          type="button"
          className="landing__icon-btn"
          onClick={toggleTheme}
          aria-label={dark ? t('landing.themeLight') : t('landing.themeDark')}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  )
}
