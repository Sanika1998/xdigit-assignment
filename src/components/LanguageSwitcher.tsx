import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { alpha, type SxProps, type Theme, useTheme } from '@mui/material/styles'
import type { MouseEvent } from 'react'
import { useLocale } from '../context/LocaleContext'
import type { Locale } from '../context/LocaleContext'
import { portalColors } from '../theme/portalColors'

type Props = {
  /** Compact width for the site header; default stretches on small screens in forms. */
  variant?: 'default' | 'header'
}

const containerSx = (isHeader: boolean): SxProps<Theme> => ({
  width: isHeader ? 'auto' : { xs: '100%', sm: 'auto' },
  maxWidth: isHeader ? 108 : { xs: '100%', sm: 108 },
  flexShrink: 0,
  /* Keep EN | عربي LTR even when the page is RTL (avoids flipped borders). */
  direction: 'ltr',
})

type GroupSxOptions = {
  groupBorder: string
  unselectedColor: string
  unselectedBg: string
  isHeader: boolean
  isDark: boolean
}

const groupSx = ({
  groupBorder,
  unselectedColor,
  unselectedBg,
  isHeader,
  isDark,
}: GroupSxOptions): SxProps<Theme> => {
  const primary = portalColors.primary
  return {
    width: '100%',
    border: `1px solid ${groupBorder}`,
    borderRadius: 0.75,
    overflow: 'hidden',
    bgcolor: isHeader ? 'transparent' : 'transparent',
    '& .MuiToggleButtonGroup-grouped': {
      margin: 0,
      border: 0,
      borderRadius: 0,
      '&:not(:first-of-type)': {
        borderLeft: `1px solid ${groupBorder}`,
      },
    },
    '& .MuiToggleButton-root': {
      flex: 1,
      minWidth: 0,
      minHeight: 28,
      fontSize: '0.75rem',
      lineHeight: 1.25,
      textTransform: 'none',
      px: 1,
      py: 0.25,
      color: unselectedColor,
      bgcolor: unselectedBg,
      '&:hover': {
        bgcolor: isHeader ? alpha(primary, isDark ? 0.2 : 0.1) : alpha(primary, 0.12),
      },
      '&.Mui-selected': {
        color: '#fff',
        bgcolor: primary,
        '&:hover': {
          bgcolor: portalColors.primaryDark,
        },
      },
      '&.Mui-selected.Mui-focusVisible': {
        outline: `2px solid ${alpha(primary, 0.5)}`,
        outlineOffset: -2,
      },
    },
  }
}

export function LanguageSwitcher({ variant = 'default' }: Props) {
  const { locale, setLocale, t } = useLocale()
  const theme = useTheme()
  const primary = portalColors.primary
  const isHeader = variant === 'header'
  const isDark = theme.palette.mode === 'dark'

  const handleChange = (_: MouseEvent<HTMLElement>, next: Locale | null) => {
    if (next) void setLocale(next)
  }

  const unselectedColor = theme.palette.text.primary
  const unselectedBg = isHeader
    ? 'transparent'
    : isDark
      ? alpha(theme.palette.common.white, 0.06)
      : theme.palette.background.paper
  const groupBorder = isHeader ? theme.palette.divider : primary

  return (
    <Box
      className="language-switcher"
      dir="ltr"
      sx={containerSx(isHeader)}
    >
      <ToggleButtonGroup
        exclusive
        size="small"
        value={locale}
        onChange={handleChange}
        aria-label={t('language')}
        sx={groupSx({ groupBorder, unselectedColor, unselectedBg, isHeader, isDark })}
      >
        <ToggleButton value="en">EN</ToggleButton>
        <ToggleButton value="ar">عربي</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}
