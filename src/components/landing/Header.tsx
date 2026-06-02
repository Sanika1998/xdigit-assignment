import { Link } from 'react-router'
import { Tooltip } from '@mui/material'
import { HandHeart, Moon, Sun } from 'lucide-react'
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
          <HandHeart size={18} />
        </span>
        <span className="landing__brand-text">{t('landing.brand')}</span>
      </Link>

      <nav className="landing__nav" aria-label={t('landing.navLabel')}>
        <div className="landing__nav-lang">
          <LanguageSwitcher variant="header" />
        </div>
        <Tooltip title={dark ? t('landing.themeLight') : t('landing.themeDark')}>
          <button
            type="button"
            className="landing__icon-btn"
            onClick={toggleTheme}
            aria-label={dark ? t('landing.themeLight') : t('landing.themeDark')}
          >
            {dark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
          </button>
        </Tooltip>
      </nav>
    </header>
  )
}
