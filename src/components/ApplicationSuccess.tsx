import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useNavigate, useSearchParams } from 'react-router'
import { useLocale } from '../context/LocaleContext'
import { startNewApplication } from '../utils/startNewApplication'

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
      sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        {t('success.title')}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        {t('success.message')}
      </Typography>
      {referenceId && (
        <Typography variant="body2" color="text.secondary">
          {t('success.reference', { id: referenceId })}
        </Typography>
      )}
      <Button sx={{ mt: 3 }} variant="outlined" onClick={handleStartNew}>
        {t('actions.startNew')}
      </Button>
    </Paper>
  )
}
