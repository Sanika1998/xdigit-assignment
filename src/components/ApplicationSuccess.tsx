import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import { useNavigate, useSearchParams } from 'react-router'
import { useLocale } from '../context/LocaleContext'
import { startNewApplication } from '../utils/startNewApplication'

const cardSx: SxProps<Theme> = { p: { xs: 3, md: 4 }, textAlign: 'center' }

const messageSx: SxProps<Theme> = { mb: 1 }

const startNewButtonSx: SxProps<Theme> = { mt: 3 }

export function ApplicationSuccess() {
  const { t } = useLocale()
  const [searchParams] = useSearchParams()
  const referenceId = searchParams.get('ref') ?? ''
  const navigate = useNavigate()

  const handleStartNew = () => {
    startNewApplication(navigate)
  }

  return (
    <Paper
      elevation={0}
      className="form-card"
      role="status"
      aria-live="polite"
      sx={cardSx}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        {t('success.title')}
      </Typography>
      <Typography color="text.secondary" sx={messageSx}>
        {t('success.message')}
      </Typography>
      {referenceId && (
        <Typography variant="body2" color="text.secondary">
          {t('success.reference', { id: referenceId })}
        </Typography>
      )}
      <Button sx={startNewButtonSx} variant="outlined" onClick={handleStartNew}>
        {t('actions.startNew')}
      </Button>
    </Paper>
  )
}
