import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import { Suspense, lazy, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { OpenAIRequestError, buildPrompt, generateWritingSuggestion } from '../api/openai'
import { useLocale } from '../context/LocaleContext'
import { useFormRules } from '../hooks/useFormRules'
import type { ApplicationFormData } from '../types/formTypes'
import type { SituationField } from '../types/situationFields'
import { FormTextField } from './form/FormTextField'
import type { HelpMeWritePhase } from './HelpMeWriteDialog'

// Step 3: three free-text fields, each with a "Help Me Write" AI dialog. Owns the
// dialog state and the OpenAI call.

// Lazy-loaded so the dialog/OpenAI code only loads when opened.
const HelpMeWriteDialog = lazy(async () =>
  import('./HelpMeWriteDialog').then((module) => ({ default: module.HelpMeWriteDialog })),
)

type DialogState = {
  field: SituationField
  phase: HelpMeWritePhase
  userPrompt: string
  suggestion: string
  loading: boolean
  error: string | null
}

const FIELD_LABEL_KEYS: Record<SituationField, string> = {
  currentFinancialSituation: 'fields.currentFinancialSituation',
  employmentCircumstances: 'fields.employmentCircumstances',
  reasonForApplying: 'fields.reasonForApplying',
}

const PLACEHOLDER_KEYS: Record<SituationField, string> = {
  currentFinancialSituation: 'placeholders.currentFinancialSituation',
  employmentCircumstances: 'placeholders.employmentCircumstances',
  reasonForApplying: 'placeholders.reasonForApplying',
}

export const SituationDescriptions = () => {
  const { t, locale } = useLocale()
  const { setValue, watch } = useFormContext<ApplicationFormData>()
  const formValues = watch()
  const rules = useFormRules()

  // Which field's assistant is open (disables the others) + the dialog state.
  const [activeHelpField, setActiveHelpField] = useState<SituationField | null>(null)
  const [dialog, setDialog] = useState<DialogState | null>(null)

  // Use the API's message if meaningful, else our translated message for the code.
  const mapErrorMessage = (error: unknown): string => {
    if (error instanceof OpenAIRequestError) {
      if (error.message && error.message !== error.code) {
        return error.message
      }
      return t(`helpMeWrite.errors.${error.code}`)
    }
    return t('helpMeWrite.errors.NETWORK')
  }

  // Seed the prompt from the current answers so the user can tweak it.
  const defaultPromptFor = (field: SituationField) => buildPrompt(field, locale, formValues)

  const closeDialog = () => {
    setDialog(null)
    setActiveHelpField(null)
  }

  const openPromptDialog = (field: SituationField) => {
    setActiveHelpField(field)
    setDialog({
      field,
      phase: 'prompt',
      userPrompt: defaultPromptFor(field),
      suggestion: '',
      loading: false,
      error: null,
    })
  }

  // Prompt -> result: show spinner, call the API, show the suggestion; on error
  // drop back to the prompt. Functional updates no-op if the dialog was closed.
  const handleGenerate = async () => {
    if (!dialog || dialog.phase !== 'prompt') return

    const { userPrompt } = dialog
    setDialog((prev) =>
      prev ? { ...prev, phase: 'result', loading: true, error: null, suggestion: '' } : null,
    )

    try {
      const suggestion = await generateWritingSuggestion(userPrompt)
      setDialog((prev) =>
        prev ? { ...prev, suggestion, loading: false, error: null } : null,
      )
    } catch (error) {
      setDialog((prev) =>
        prev
          ? {
              ...prev,
              phase: 'prompt',
              loading: false,
              error: mapErrorMessage(error),
            }
          : null,
      )
    }
  }

  // Insert the text into the field; "Edit" also focuses it (after the dialog closes).
  const applyToField = (field: SituationField, text: string, focusField: boolean) => {
    setValue(field, text, { shouldValidate: true, shouldDirty: true })
    closeDialog()
    if (focusField) {
      window.setTimeout(() => {
        document.getElementById(`field-${field}`)?.focus()
      }, 100)
    }
  }

  const renderField = (field: SituationField) => (
    <Grid size={12} key={field}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button
          type="button"
          size="small"
          variant="outlined"
          startIcon={<AutoFixHighIcon fontSize="small" />}
          disabled={activeHelpField !== null && activeHelpField !== field}
          onClick={() => openPromptDialog(field)}
          aria-label={t('helpMeWrite.buttonAria', { field: t(FIELD_LABEL_KEYS[field]) })}
        >
          {t('helpMeWrite.button')}
        </Button>
      </Box>
      <FormTextField
        name={field}
        rules={rules[field]}
        label={t(FIELD_LABEL_KEYS[field])}
        required
        fullWidth
        multiline
        minRows={4}
        placeholder={t(PLACEHOLDER_KEYS[field])}
      />
    </Grid>
  )

  return (
    <>
      <Grid container spacing={{ xs: 2, md: 2.5 }}>
        {renderField('currentFinancialSituation')}
        {renderField('employmentCircumstances')}
        {renderField('reasonForApplying')}
      </Grid>

      {dialog && (
        <Suspense fallback={<CircularProgress size={20} />}>
          <HelpMeWriteDialog
            open
            title={t('helpMeWrite.dialogTitle', { field: t(FIELD_LABEL_KEYS[dialog.field]) })}
            phase={dialog.phase}
            userPrompt={dialog.userPrompt}
            onUserPromptChange={(value) =>
              setDialog((prev) => (prev ? { ...prev, userPrompt: value, error: null } : null))
            }
            onResetPrompt={() =>
              setDialog((prev) =>
                prev ? { ...prev, userPrompt: defaultPromptFor(prev.field), error: null } : null,
              )
            }
            suggestion={dialog.suggestion}
            loading={dialog.loading}
            error={dialog.error}
            onClose={closeDialog}
            onGenerate={() => void handleGenerate()}
            onBackToPrompt={() =>
              setDialog((prev) =>
                prev ? { ...prev, phase: 'prompt', error: null, loading: false } : null,
              )
            }
            onAccept={(text) => applyToField(dialog.field, text, false)}
            onEdit={(text) => applyToField(dialog.field, text, true)}
          />
        </Suspense>
      )}
    </>
  )
}
