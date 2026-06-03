import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { AppShell } from '../layout/AppShell'
import { useLocale } from '../../context/LocaleContext'
import { indexToStep, stepPath } from '../../routing/steps'
import { hasSavedProgress, loadProgress } from '../../utils/storage'
import { startNewApplication } from '../../utils/startNewApplication'
import {
  actionsSx,
  badgeSx,
  heroSx,
  leadSx,
  mainSx,
  primaryCtaSx,
  secondaryCtaSx,
  titleSx,
  trustSx,
} from './landingSx'

// Entry page. Offers Resume + Start fresh when a draft exists, else just Start.
export function LandingPage() {
  const { t } = useLocale()
  const navigate = useNavigate()
  const [hasSaved, setHasSaved] = useState(hasSavedProgress)

  const saved = hasSaved ? loadProgress() : null
  const formPath = saved ? stepPath(indexToStep(saved.activeStep)) : stepPath('personal')

  const handleStartFresh = () => {
    startNewApplication(navigate)
    setHasSaved(false)
  }

  // Set the page title per locale (client-rendered SPA).
  useEffect(() => {
    document.title = t('landing.metaTitle')
  }, [t])

  return (
    <AppShell>
      <Box component="main" id="main-content" sx={mainSx}>
        <Stack
          component="section"
          spacing={0}
          aria-labelledby="landing-heading"
          sx={heroSx}
        >
          <Chip label={t('landing.badge')} variant="outlined" sx={badgeSx} />

          <Typography id="landing-heading" component="h1" sx={titleSx}>
            {t('landing.title')}
          </Typography>

          <Typography component="p" sx={leadSx}>
            {t('landing.lead')}
          </Typography>

          <Stack useFlexGap sx={actionsSx}>
            <Button
              component={Link}
              to={formPath}
              variant="contained"
              disableElevation
              sx={primaryCtaSx}
            >
              {hasSaved ? t('landing.resumeApplication') : t('landing.startApplication')}
              <Box component="span" aria-hidden>
                {t('landing.ctaArrow')}
              </Box>
            </Button>
            {hasSaved ? (
              <Button variant="text" color="primary" onClick={handleStartFresh} sx={secondaryCtaSx}>
                {t('landing.startFresh')}
              </Button>
            ) : null}
          </Stack>

          <Typography component="p" sx={trustSx}>
            {t('landing.trust')}
          </Typography>
        </Stack>
      </Box>
    </AppShell>
  )
}
