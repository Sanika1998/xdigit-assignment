import { alpha, type SxProps, type Theme } from '@mui/material/styles'
import { portalDark } from '../../theme/portalColors'

const lightHeroBg =
  'radial-gradient(ellipse 120% 80% at 20% 0%, #dbeafe 0%, #f8fafc 45%, #ffffff 100%)'

export const appShellSx: SxProps<Theme> = (theme) => ({
  minHeight: '100svh',
  display: 'flex',
  flexDirection: 'column',
  background: theme.palette.mode === 'dark' ? portalDark.gradient : lightHeroBg,
  color: 'text.primary',
})

export const appBarSx: SxProps<Theme> = (theme) => ({
  position: 'sticky',
  backgroundColor:
    theme.palette.mode === 'dark' ? portalDark.header : 'rgba(255, 255, 255, 0.88)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: 1,
  borderColor: 'divider',
  color: 'text.primary',
  boxShadow: 'none',
})

export const toolbarSx: SxProps<Theme> = {
  width: '100%',
  justifyContent: 'space-between',
  gap: { xs: 1.5, md: 2 },
  px: { xs: 2, sm: 2, md: 5 },
  py: { xs: 1.75, md: 1.75 },
  minHeight: { xs: 56, md: 64 },
}

export const brandLinkSx: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1.25,
  textDecoration: 'none',
  color: 'inherit',
  minWidth: 0,
  flex: { xs: 1, md: 'none' },
}

export const brandLogoSx: SxProps<Theme> = {
  display: 'grid',
  placeItems: 'center',
  width: 32,
  height: 32,
  borderRadius: 1,
  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14),
  color: 'primary.main',
  flexShrink: 0,
}

export const brandTextSx: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: { xs: '0.875rem', sm: '1rem' },
  maxWidth: { xs: 'min(34vw, 8rem)', sm: 'min(42vw, 11rem)', md: 'none' },
  overflow: { xs: 'visible', sm: 'hidden' },
  textOverflow: { sm: 'ellipsis' },
  whiteSpace: { xs: 'normal', sm: 'nowrap' },
  lineHeight: { xs: 1.15, sm: 1.25 },
  overflowWrap: { xs: 'anywhere', sm: 'normal' },
}

export const navSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: { xs: 0.5, sm: 1 },
  flexShrink: 0,
  ml: 'auto',
}

export const themeIconButtonSx: SxProps<Theme> = {
  width: 40,
  height: 40,
  borderRadius: 1.25,
  color: 'text.primary',
}

export const mainSx: SxProps<Theme> = {
  flex: 1,
  width: '100%',
  maxWidth: 1120,
  mx: 'auto',
  px: { xs: 2, sm: 3, md: 5 },
  pt: { xs: 4, sm: 6, md: 9 },
  pb: 8,
  boxSizing: 'border-box',
}

export const heroSx: SxProps<Theme> = {
  width: '100%',
  maxWidth: 640,
}

export const badgeSx: SxProps<Theme> = (theme) => ({
  alignSelf: 'flex-start',
  mb: 2.5,
  height: 'auto',
  fontWeight: 500,
  borderRadius: 999,
  borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.45) : '#93c5fd',
  color: 'primary.main',
  '& .MuiChip-label': {
    px: '14px',
    py: '6px',
    fontSize: '0.8125rem',
    lineHeight: 1.25,
  },
})

export const titleSx: SxProps<Theme> = {
  mb: 2,
  fontWeight: 700,
  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' },
  lineHeight: 1.12,
  letterSpacing: '-0.03em',
  color: 'text.primary',
}

export const leadSx: SxProps<Theme> = {
  mb: 3.5,
  fontSize: { xs: '1rem', sm: '1.125rem' },
  lineHeight: 1.6,
  color: 'text.secondary',
}

export const actionsSx: SxProps<Theme> = {
  flexDirection: { xs: 'column', sm: 'row' },
  flexWrap: 'wrap',
  alignItems: { xs: 'stretch', sm: 'center' },
  rowGap: { xs: 1.5, sm: '12px' },
  columnGap: { xs: 1.5, sm: '20px' },
  mb: 2.5,
}

export const primaryCtaSx: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
  borderRadius: 999,
  px: { xs: 2.5, sm: '22px' },
  py: '14px',
  minHeight: 'unset',
  fontWeight: 600,
  fontSize: '1rem',
  lineHeight: 1.3,
  textTransform: 'none',
  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
  width: { xs: '100%', sm: 'auto' },
  whiteSpace: { xs: 'normal', sm: 'nowrap' },
  '&:hover': {
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
    bgcolor: 'primary.dark',
  },
}

export const secondaryCtaSx: SxProps<Theme> = {
  fontWeight: 600,
  fontSize: '1rem',
  lineHeight: 1.3,
  textTransform: 'none',
  minWidth: 'unset',
  minHeight: { xs: 44, sm: 'unset' },
  px: { xs: 1.5, sm: 0 },
  py: { xs: 1.25, sm: 0 },
  width: { xs: '100%', sm: 'auto' },
  '&:hover': {
    textDecoration: 'underline',
    bgcolor: 'transparent',
  },
}

export const trustSx: SxProps<Theme> = {
  fontSize: '0.8125rem',
  color: 'text.secondary',
  lineHeight: { xs: 1.5, sm: 1.43 },
}
