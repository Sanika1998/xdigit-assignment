import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { submitApplication } from '../api/submitApplication'
import { initialFormData, normalizeFormData, type ApplicationFormData } from '../types/formTypes'
import {
  indexToStep,
  isValidStepSlug,
  stepPath,
  stepToIndex,
  type StepSlug,
} from '../routing/steps'
import {
  clearProgress,
  hasMeaningfulFormData,
  loadProgress,
  saveProgress,
} from '../utils/storage'
import { isStepValid, STEP_FIELDS } from '../validation/stepFields'
import { useLocale } from './LocaleContext'

// Step title keys, in the same order as the route slugs.
export const STEP_KEYS = ['steps.personal', 'steps.family', 'steps.situation'] as const

type ApplicationFormContextValue = {
  activeStep: number
  stepLabels: string[]
  progress: number
  canProceed: boolean
  isLastStep: boolean
  isSubmitting: boolean
  submitError: string | null
  stepHeadingRef: RefObject<HTMLHeadingElement | null>
  handleNext: () => Promise<void>
  handleBack: () => void
  handleClearSaved: () => void
  onSubmit: ComponentProps<'form'>['onSubmit']
  handleFormKeyDown: (e: KeyboardEvent<HTMLFormElement>) => void
}

const ApplicationFormContext = createContext<ApplicationFormContextValue | null>(null)

/** Multi-step wizard, submit flow, and react-hook-form `FormProvider`. */
export function ApplicationFormProvider({ children }: { children: ReactNode }) {
  const { t, locale } = useLocale()
  const navigate = useNavigate()
  const { step: stepParam } = useParams<{ step: string }>()

  // Active step is derived from the URL so deep links and back/forward work.
  const activeStep = isValidStepSlug(stepParam) ? stepToIndex(stepParam) : 0
  const currentSlug: StepSlug = isValidStepSlug(stepParam) ? stepParam : indexToStep(0)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
  const readyRef = useRef(false) // gates the one-time restore on mount
  // Latest step + getValues for the exit handlers (bound once, avoids stale closures).
  const persistRef = useRef({ activeStep, getValues: () => initialFormData })

  // onTouched: don't error while first typing; revalidate live once touched.
  const methods = useForm<ApplicationFormData>({
    defaultValues: initialFormData,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  const {
    handleSubmit,
    watch,
    reset,
    trigger,
    clearErrors,
    getValues,
    formState: { errors, touchedFields },
  } = methods

  persistRef.current = { activeStep, getValues }

  const formValues = watch()

  const persistProgress = () => {
    saveProgress(getValues(), activeStep)
  }
  // Touched + invalid fields, i.e. ones currently showing an error.
  const touchedErrorFields = (Object.keys(errors) as (keyof ApplicationFormData)[]).filter(
    (field) => touchedFields[field],
  )

  const stepLabels = STEP_KEYS.map((key) => t(key))
  const progress = ((activeStep + 1) / STEP_KEYS.length) * 100
  const canProceed = isStepValid(formValues, activeStep, errors)
  const isLastStep = activeStep === STEP_KEYS.length - 1

  // Restore a saved draft once on mount and jump to the step the user left off on.
  useLayoutEffect(() => {
    if (readyRef.current) return
    readyRef.current = true

    const saved = loadProgress()
    if (saved?.formData && hasMeaningfulFormData(saved.formData)) {
      reset(normalizeFormData(saved.formData))
      const savedSlug = indexToStep(saved.activeStep)
      if (savedSlug !== currentSlug) {
        navigate(stepPath(savedSlug), { replace: true })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore saved progress once on mount
  }, [])

  // Autosave on change, but only after the initial restore (else we'd overwrite
  // the saved draft with empty defaults).
  useEffect(() => {
    if (!readyRef.current) return
    persistProgress()
  }, [formValues, activeStep])

  // Last-chance save when the tab is closed/hidden.
  useEffect(() => {
    const flushOnExit = () => {
      const { getValues: readValues, activeStep: step } = persistRef.current
      saveProgress(readValues(), step)
    }

    window.addEventListener('pagehide', flushOnExit)
    window.addEventListener('beforeunload', flushOnExit)

    return () => {
      window.removeEventListener('pagehide', flushOnExit)
      window.removeEventListener('beforeunload', flushOnExit)
    }
  }, [])

  // Focus the step heading on each step change (accessibility).
  useEffect(() => {
    if (!readyRef.current) return
    stepHeadingRef.current?.focus()
  }, [activeStep])

  // Re-validate touched/invalid fields on locale change so messages re-translate.
  useEffect(() => {
    if (!readyRef.current || touchedErrorFields.length === 0) return
    void trigger(touchedErrorFields)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh messages for touched invalid fields on locale change
  }, [locale, trigger])

  // Validate this step before advancing.
  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[activeStep])
    if (!valid) return
    persistProgress()
    navigate(stepPath(indexToStep(activeStep + 1)))
  }

  const handleBack = () => {
    persistProgress()
    navigate(stepPath(indexToStep(activeStep - 1)))
  }

  const handleClearSaved = () => {
    clearProgress()
    reset(initialFormData)
    clearErrors()
    setSubmitError(null)
    navigate(stepPath(indexToStep(0)), { replace: true })
  }

  // Runs only after the whole form validates. Clears the draft and routes to the
  // success page on success; shows a translated error on failure.
  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await submitApplication({ data, locale })
      clearProgress()
      const ref = result.id ? `?ref=${encodeURIComponent(result.id)}` : ''
      navigate(`/application/success${ref}`, { replace: true })
    } catch {
      setSubmitError(t('errors.submitFailed'))
    } finally {
      setIsSubmitting(false)
    }
  })

  // Enter advances to the next step instead of submitting early (except in
  // textareas, on buttons, with Shift, or on the last step).
  const handleFormKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return
    const target = e.target as HTMLElement
    if (target.tagName === 'TEXTAREA') return

    if (!isLastStep && target.tagName !== 'BUTTON') {
      e.preventDefault()
      void handleNext()
    }
  }

  const value: ApplicationFormContextValue = {
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
  }

  return (
    <FormProvider {...methods}>
      <ApplicationFormContext.Provider value={value}>{children}</ApplicationFormContext.Provider>
    </FormProvider>
  )
}

export function useApplicationForm() {
  const context = useContext(ApplicationFormContext)
  if (!context) {
    throw new Error('useApplicationForm must be used within ApplicationFormProvider')
  }
  return context
}
