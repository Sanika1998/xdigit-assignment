import type { SxProps, Theme } from '@mui/material/styles'

export const phoneRowSx: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'minmax(5.75rem, 7rem) minmax(0, 1fr)',
  },
  gap: 1,
  alignItems: 'start',
  width: '100%',
}

export const phoneCellSx: SxProps<Theme> = {
  minWidth: 0,
  overflow: 'visible',
  '& .MuiFormControl-root': {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'visible',
  },
  '& .MuiFormHelperText-root': {
    marginInline: '14px 0',
    marginTop: 0.5,
    marginBottom: 0,
    minHeight: '1.25rem',
    lineHeight: 1.25,
  },
}

export const phoneApiHintSx: SxProps<Theme> = {
  gridColumn: '1 / -1',
  marginInline: '14px 0 !important',
  marginTop: '2px !important',
}

export const dialCodeFieldSx: SxProps<Theme> = {
  '& .MuiSelect-select': {
    display: 'flex !important',
    alignItems: 'center',
    overflow: 'hidden !important',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingInline: '8px 26px !important',
  },
}

export const dialCodeValueSx: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.35,
  minWidth: 0,
  maxWidth: '100%',
}

export const dialCodeFlagSx: SxProps<Theme> = {
  flexShrink: 0,
  fontSize: '1.1rem',
  lineHeight: 1,
}

export const dialCodeTextSx: SxProps<Theme> = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}
