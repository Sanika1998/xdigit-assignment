import type { SxProps, Theme } from '@mui/material/styles'

export const appMainSx: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '100%',
  boxSizing: 'border-box',
  px: { xs: 1.5, sm: 2, md: 3 },
  py: { xs: 1.5, sm: 2, md: 4 },
  pb: { xs: 3.5, md: 6 },
}

export const formCardSx: SxProps<Theme> = (theme) => ({
  position: 'relative',
  width: '100%',
  maxWidth: { xs: 720, sm: 640, lg: 800 },
  textAlign: 'start',
  p: { xs: 2, sm: 2.5, md: 4 },
  borderRadius: { xs: 1.5, sm: 2 },
  border: 1,
  borderColor: 'divider',
  bgcolor: 'background.paper',
  color: 'text.primary',
  boxSizing: 'border-box',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.28)'
      : '0 4px 24px rgba(15, 23, 42, 0.08)',
})

export const formPageTitleSx: SxProps<Theme> = {
  m: 0,
  mb: { xs: 2, sm: 3 },
  fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
  fontWeight: 700,
  color: 'text.primary',
  textAlign: 'start',
}

export const skipLinkSx: SxProps<Theme> = (theme) => ({
  position: 'fixed',
  insetInlineEnd: 16,
  bottom: 16,
  zIndex: theme.zIndex.tooltip,
  px: 2,
  py: 1,
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  textDecoration: 'none',
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 600,
  transform: 'translateY(calc(100% + 24px))',
  transition: 'transform 0.2s',
  pointerEvents: 'none',
  '&:focus': {
    transform: 'translateY(0)',
    outline: `2px solid ${theme.palette.text.primary}`,
    outlineOffset: 2,
    pointerEvents: 'auto',
  },
})

export const fieldPlaceholderSx: SxProps<Theme> = {
  color: 'text.secondary',
  opacity: 1,
}

export const successPaperSx: SxProps<Theme> = (theme) => {
  const cardStyles = typeof formCardSx === 'function' ? formCardSx(theme) : formCardSx
  return {
    ...cardStyles,
    textAlign: 'center',
  }
}
