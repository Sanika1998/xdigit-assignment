import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { type SxProps, type Theme, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { STEP_KEYS } from '../../context/ApplicationFormContext'

type Props = {
  activeStep: number
  labels: string[]
  shortLabels: string[]
  'aria-label': string
}

const stepperSx = (isMobile: boolean): SxProps<Theme> => ({
  mb: { xs: 2, sm: 3, md: 4 },
  width: '100%',
  alignItems: 'flex-start',
  '& .MuiStep-root': {
    flex: 1,
    minWidth: 0,
    px: { xs: 0.25, sm: 0.5 },
  },
  '& .MuiStepLabel-root': {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  '& .MuiStepLabel-iconContainer': {
    paddingRight: 0,
  },
  '& .MuiStepLabel-label': {
    typography: 'caption',
    lineHeight: 1.25,
    mt: { xs: 0.5, sm: 0.75 },
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    fontSize: { xs: '0.6875rem', sm: '0.75rem' },
    fontWeight: isMobile ? 500 : 400,
  },
  '& .MuiStepLabel-labelContainer': {
    width: '100%',
  },
  '& .MuiStep-root.Mui-active .MuiStepLabel-label': {
    fontWeight: 600,
    color: 'primary.main',
  },
  '& .MuiStep-root.Mui-completed .MuiStepLabel-label': {
    color: 'text.secondary',
  },
  '& .MuiStepIcon-root': {
    width: { xs: 28, sm: 32 },
    height: { xs: 28, sm: 32 },
    fontSize: { xs: '0.875rem', sm: '1rem' },
  },
  '& .MuiStepConnector-root': {
    pointerEvents: 'none',
    /* Center connector on icon row (alternativeLabel absolute positioning). */
    top: { xs: 14, sm: 16 },
  },
  '& .MuiStepConnector-line': {
    borderTopWidth: { xs: 2, sm: 3 },
  },
})

export function FormStepper({ activeStep, labels, shortLabels, 'aria-label': ariaLabel }: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  // Shorter labels on phones so three steps fit without wrapping.
  const displayLabels = isMobile ? shortLabels : labels

  return (
    <Stepper
      activeStep={activeStep}
      /* Labels under icons so connectors sit on the icon row, not through text. */
      alternativeLabel
      orientation="horizontal"
      aria-label={ariaLabel}
      sx={stepperSx(isMobile)}
    >
      {displayLabels.map((label, index) => (
        <Step key={STEP_KEYS[index]} completed={index < activeStep}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
