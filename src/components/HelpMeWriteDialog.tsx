import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import type { SxProps, Theme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useLocale } from '../context/LocaleContext'

export type HelpMeWritePhase = 'prompt' | 'result'

const alertSx: SxProps<Theme> = { mb: 2 }

const promptBoxSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  mt: 1,
}

const resetButtonSx: SxProps<Theme> = { alignSelf: 'flex-start' }

const loadingSpinnerSx: SxProps<Theme> = { display: 'block', mx: 'auto', my: 4 }

const suggestionFieldSx: SxProps<Theme> = { mt: 1 }

const dialogActionsSx: SxProps<Theme> = { px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }

type Props = {
  open: boolean
  title: string
  phase: HelpMeWritePhase
  userPrompt: string
  onUserPromptChange: (value: string) => void
  onResetPrompt: () => void
  suggestion: string
  loading: boolean
  error: string | null
  onClose: () => void
  onGenerate: () => void
  onBackToPrompt?: () => void
  onAccept: (text: string) => void
  onEdit: (text: string) => void
}

// Controlled presentational dialog: the parent owns prompt/phase/loading/error;
// this just renders the two phases and reports actions via callbacks.
export function HelpMeWriteDialog({
  open,
  title,
  phase,
  userPrompt,
  onUserPromptChange,
  onResetPrompt,
  suggestion,
  loading,
  error,
  onClose,
  onGenerate,
  onBackToPrompt,
  onAccept,
  onEdit,
}: Props) {
  const { t } = useLocale()
  // Local editable copy so edits don't push every keystroke up to the parent.
  const [draft, setDraft] = useState(suggestion)

  useEffect(() => {
    if (open && phase === 'result') setDraft(suggestion)
  }, [open, phase, suggestion])

  const promptEmpty = !userPrompt.trim()

  return (
    <Dialog
      open={open}
      // Block backdrop/escape close while a request is in flight.
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="help-me-write-title"
    >
      <DialogTitle id="help-me-write-title">{title}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={alertSx} role="alert">
            {error}
          </Alert>
        )}

        {phase === 'prompt' ? (
          <Box sx={promptBoxSx}>
            <TextField
              value={userPrompt}
              onChange={(e) => onUserPromptChange(e.target.value)}
              multiline
              minRows={4}
              fullWidth
              disabled={loading}
              label={t('helpMeWrite.promptLabel')}
              placeholder={t('helpMeWrite.promptPlaceholder')}
              helperText={t('helpMeWrite.promptHelper')}
            />
            <Button
              type="button"
              size="small"
              variant="text"
              onClick={onResetPrompt}
              disabled={loading}
              sx={resetButtonSx}
            >
              {t('helpMeWrite.resetPrompt')}
            </Button>
          </Box>
        ) : loading ? (
          <CircularProgress size={32} sx={loadingSpinnerSx} />
        ) : (
          <TextField
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            multiline
            minRows={6}
            fullWidth
            label={t('helpMeWrite.suggestionLabel')}
            placeholder={t('helpMeWrite.suggestionPlaceholder')}
            sx={suggestionFieldSx}
          />
        )}
      </DialogContent>
      <DialogActions sx={dialogActionsSx}>
        <Button onClick={onClose} disabled={loading}>
          {t('helpMeWrite.discard')}
        </Button>

        {phase === 'prompt' ? (
          <Button
            variant="contained"
            disabled={loading || promptEmpty}
            onClick={onGenerate}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {loading ? t('helpMeWrite.generating') : t('helpMeWrite.generate')}
          </Button>
        ) : (
          <>
            {onBackToPrompt && (
              <Button variant="outlined" disabled={loading} onClick={onBackToPrompt}>
                {t('helpMeWrite.backToPrompt')}
              </Button>
            )}
            <Button
              variant="outlined"
              disabled={loading || !draft.trim()}
              onClick={() => onEdit(draft.trim())}
            >
              {t('helpMeWrite.edit')}
            </Button>
            <Button
              variant="contained"
              disabled={loading || !draft.trim()}
              onClick={() => onAccept(draft.trim())}
            >
              {t('helpMeWrite.accept')}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
