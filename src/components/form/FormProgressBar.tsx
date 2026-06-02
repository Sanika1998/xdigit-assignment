import Box from '@mui/material/Box'
import { alpha, useTheme } from '@mui/material/styles'

type Props = {
  value: number
  'aria-labelledby': string
}

/** Step progress that grows from the inline-start edge (right in RTL, left in LTR). */
export function FormProgressBar({ value, 'aria-labelledby': ariaLabelledBy }: Props) {
  const theme = useTheme()
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <Box
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-labelledby={ariaLabelledBy}
      sx={{
        height: { xs: 6, md: 8 },
        borderRadius: 4,
        bgcolor: alpha(theme.palette.primary.main, 0.2),
        overflow: 'hidden',
      }}
    >
      {/* inlineSize (not width) so the fill mirrors automatically in RTL. */}
      <Box
        sx={{
          blockSize: '100%',
          inlineSize: `${clamped}%`,
          maxInlineSize: '100%',
          borderRadius: 4,
          bgcolor: 'primary.main',
        }}
      />
    </Box>
  )
}
