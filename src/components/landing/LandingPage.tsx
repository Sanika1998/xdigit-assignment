import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { AppShell } from '../layout/AppShell'
import { useLocale } from '../../context/LocaleContext'
import { indexToStep, stepPath } from '../../routing/steps'
import { hasSavedProgress, loadProgress } from '../../utils/storage'
import { startNewApplication } from '../../utils/startNewApplication'

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
      <main className="landing__main" id="main-content">
        <section className="landing__hero" aria-labelledby="landing-heading">
          <span className="landing__badge">{t('landing.badge')}</span>
          <h1 id="landing-heading" className="landing__title">
            {t('landing.title')}
          </h1>
          <p className="landing__lead">{t('landing.lead')}</p>

          <div className="landing__actions">
            <Link to={formPath} className="landing__cta-primary">
              {hasSaved ? t('landing.resumeApplication') : t('landing.startApplication')}
              <span aria-hidden="true">{t('landing.ctaArrow')}</span>
            </Link>
            {hasSaved ? (
              <button type="button" className="landing__cta-secondary" onClick={handleStartFresh}>
                {t('landing.startFresh')}
              </button>
            ) : null}
          </div>

          <p className="landing__trust">{t('landing.trust')}</p>
        </section>
      </main>
    </AppShell>
  )
}
