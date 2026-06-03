import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import { Link } from 'react-router'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { useSiteTheme } from '../../hooks/useSiteTheme'
import { useLocale } from '../../context/LocaleContext'
import {
  appBarSx,
  brandLinkSx,
  brandLogoSx,
  brandTextSx,
  navSx,
  themeIconButtonSx,
  toolbarSx,
} from './landingSx'

// Site header: brand, language switcher, dark-mode toggle.
export function Header() {
  const { t } = useLocale()
  const { dark, toggleTheme } = useSiteTheme()

  return (
    <AppBar component="header" position="sticky" sx={appBarSx}>
      <Toolbar disableGutters sx={toolbarSx}>
        <Box component={Link} to="/" sx={brandLinkSx}>
          <Box aria-hidden="true" sx={brandLogoSx}>
            <VolunteerActivismIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography component="span" sx={brandTextSx}>
            {t('landing.brand')}
          </Typography>
        </Box>

        <Box component="nav" aria-label={t('landing.navLabel')} sx={navSx}>
          <LanguageSwitcher variant="header" />
          <Tooltip title={dark ? t('landing.themeLight') : t('landing.themeDark')}>
            <IconButton
              onClick={toggleTheme}
              aria-label={dark ? t('landing.themeLight') : t('landing.themeDark')}
              sx={themeIconButtonSx}
            >
              {dark ? (
                <LightModeOutlinedIcon sx={{ fontSize: 20 }} />
              ) : (
                <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
