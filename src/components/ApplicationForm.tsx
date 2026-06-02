import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useTheme, type SxProps, type Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Suspense, lazy } from 'react'
import { STEP_KEYS, useApplicationForm } from '../context/ApplicationFormContext'
import { useLocale } from '../context/LocaleContext'
import { FormProgressBar } from './form/FormProgressBar'
import { FormStepper } from './form/FormStepper'

const PersonalInfo = lazy(async () =>
  import('./PersonalInfo').then((module) => ({ default: module.PersonalInfo })),
)
const FamilyFinancialInfo = lazy(async () =>
  import('./FamilyFinancialInfo').then((module) => ({ default: module.FamilyFinancialInfo })),
)
const SituationDescriptions = lazy(async () =>
  import('./SituationDescriptions').then((module) => ({ default: module.SituationDescriptions })),
)

const progressSectionSx: SxProps<Theme> = { mb: { xs: 2, sm: 3 } }

const progressMetaSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
  mb: 1,
}

const progressLeftSx: SxProps<Theme> = { textAlign: 'start', flexShrink: 0 }

const progressRightSx: SxProps<Theme> = {
  textAlign: 'end',
  flexShrink: 0,
  whiteSpace: 'nowrap',
}

const savedLocallySx: SxProps<Theme> = {
  mt: 1,
  display: { xs: 'none', sm: 'block' },
  textAlign: 'start',
}

const stepHeadingSx: SxProps<Theme> = {
  mb: 2,
  textAlign: 'start',
  outline: 'none',
  fontSize: { xs: '1.0625rem', sm: '1.25rem' },
  lineHeight: 1.3,
}

const stepContentSx: SxProps<Theme> = { mb: 3, textAlign: 'start' }

const stepLoadingSx: SxProps<Theme> = { minHeight: 180, display: 'grid', placeItems: 'center' }

const formActionsSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column-reverse', sm: 'row' },
  justifyContent: 'space-between',
  alignItems: { xs: 'stretch', sm: 'center' },
  gap: 2,
}

const secondaryActionsSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 1.5,
  width: { xs: '100%', sm: 'auto' },
}

export const ApplicationForm = () => {
  const { t } = useLocale()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const stepShortLabels = [
    t('steps.personalShort'),
    t('steps.familyShort'),
    t('steps.situationShort'),
  ]

  const {
    activeStep,
    stepLabels,
    progress,
    canProceed,
    isLastStep,
    isSubmitting,
    submitError,
    stepHeadingRef,
    handleNext,
    handleBack,
    handleClearSaved,
    onSubmit,
    handleFormKeyDown,
  } = useApplicationForm()

  return (
    <>
      <a href="#application-form" className="skip-link">
        {t('nav.skipToForm')}
      </a>

      <Paper
        id="application-form"
        elevation={0}
        className="form-card"
        sx={{ position: 'relative' }}
      >
        <Typography id="form-title" component="h1" className="form-page-title">
          {t('appTitle')}
        </Typography>

        <Box
          component="form"
          onSubmit={onSubmit}
          onKeyDown={handleFormKeyDown}
          aria-labelledby="form-title"
          noValidate
        >
          <Box
            component="section"
            className="form-progress-section"
            aria-label={t('progressLabel')}
            sx={progressSectionSx}
          >
            <Box className="form-progress-meta" sx={progressMetaSx}>
              <Typography
                variant="body2"
                color="text.secondary"
                id="step-indicator"
                sx={progressLeftSx}
              >
                {t('stepOf', { current: activeStep + 1, total: STEP_KEYS.length })}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                aria-hidden="true"
                sx={progressRightSx}
              >
                {t('progressComplete', { percent: Math.round(progress) })}
              </Typography>
            </Box>
            <FormProgressBar value={progress} aria-labelledby="step-indicator" />
            <Typography variant="caption" color="text.secondary" sx={savedLocallySx}>
              {t('savedLocally')}
            </Typography>
          </Box>

          {submitError && (
            <Box sx={{ mb: 2 }} aria-live="polite">
              <Alert severity="error" role="alert">
                {submitError}
              </Alert>
            </Box>
          )}

          <FormStepper
            activeStep={activeStep}
            labels={stepLabels}
            shortLabels={stepShortLabels}
            aria-label={t('progressLabel')}
          />

          <Typography ref={stepHeadingRef} variant="h6" component="h2" tabIndex={-1} sx={stepHeadingSx}>
            {stepLabels[activeStep]}
          </Typography>

          <Box role="group" aria-labelledby="form-title" sx={stepContentSx}>
            <Suspense
              fallback={
                <Box sx={stepLoadingSx}>
                  <CircularProgress size={24} />
                </Box>
              }
            >
              {activeStep === 0 && <PersonalInfo />}
              {activeStep === 1 && <FamilyFinancialInfo />}
              {activeStep === 2 && <SituationDescriptions />}
            </Suspense>
          </Box>

          <Box className="form-actions" sx={formActionsSx}>
            <Box sx={secondaryActionsSx}>
            <Button
              type="button"
              variant="outlined"
              disabled={activeStep === 0 || isSubmitting}
              onClick={handleBack}
              fullWidth={isMobile}
            >
              {t('actions.back')}
            </Button>
            <Button
              type="button"
              variant="text"
              color="inherit"
              onClick={handleClearSaved}
              disabled={isSubmitting}
              fullWidth={isMobile}
            >
              {t('actions.clearSaved')}
            </Button>
          </Box>

            {isLastStep ? (
              <Button
                type="submit"
                variant="contained"
                disabled={!canProceed || isSubmitting}
                fullWidth={isMobile}
                aria-busy={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
              >
                {isSubmitting ? t('actions.submitting') : t('actions.submit')}
              </Button>
            ) : (
              <Button
                type="button"
                variant="contained"
                disabled={!canProceed || isSubmitting}
                onClick={() => void handleNext()}
                fullWidth={isMobile}
              >
                {t('actions.next')}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </>
  )
}
