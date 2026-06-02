import type { Locale } from '../i18n/translations'
import type { SituationField, SituationFieldContext } from '../types/situationFields'

/** @see https://platform.openai.com/docs/api-reference/chat/create */
export const OPENAI_CHAT_ENDPOINT = 'https://api.openai.com/v1/chat/completions'
export const OPENAI_MODEL = 'gpt-3.5-turbo'

const TIMEOUT_MS = 30_000

export type OpenAIErrorCode =
  | 'MISSING_API_KEY'
  | 'EMPTY_PROMPT'
  | 'INVALID_API_KEY'
  | 'RATE_LIMIT'
  | 'TIMEOUT'
  | 'NETWORK'
  | 'API_ERROR'
  | 'INVALID_RESPONSE'

export class OpenAIRequestError extends Error {
  code: OpenAIErrorCode

  constructor(code: OpenAIErrorCode, message?: string) {
    super(message ?? code)
    this.name = 'OpenAIRequestError'
    this.code = code
  }
}

type OpenAIErrorBody = {
  error?: { message?: string; type?: string; code?: string }
}

async function parseErrorDetail(response: Response): Promise<string | undefined> {
  try {
    const body = (await response.json()) as OpenAIErrorBody
    return body.error?.message
  } catch {
    return undefined
  }
}

// Helpers below turn the structured answers into a first-person sentence
// ("I am unemployed with no income...") used as context for the model.
const EMPLOYMENT_PHRASE: Record<Locale, Record<string, string>> = {
  en: {
    employedFullTime: 'I am employed full-time',
    employedPartTime: 'I am employed part-time',
    selfEmployed: 'I am self-employed',
    unemployed: 'I am unemployed',
    student: 'I am a student',
    retired: 'I am retired',
    other: 'I am currently not in standard employment',
  },
  ar: {
    employedFullTime: 'أنا موظف بدوام كامل',
    employedPartTime: 'أنا موظف بدوام جزئي',
    selfEmployed: 'أنا أعمل لحسابي الخاص',
    unemployed: 'أنا عاطل عن العمل',
    student: 'أنا طالب',
    retired: 'أنا متقاعد',
    other: 'أنا لست في وظيفة تقليدية حالياً',
  },
}

function formatIncomePhrase(locale: Locale, monthlyIncome: string): string {
  const amount = Number(monthlyIncome)
  const hasIncome = monthlyIncome.trim() !== '' && !Number.isNaN(amount) && amount > 0

  if (!hasIncome) {
    return locale === 'ar' ? ' وليس لدي دخل' : ' with no income'
  }

  return locale === 'ar'
    ? ` ودخلي الشهري ${amount}`
    : ` with a monthly income of ${amount}`
}

function formatHousingPhrase(locale: Locale, housingStatus: string): string {
  if (!housingStatus.trim()) return ''

  const housingEn: Record<string, string> = {
    own: 'I own my home',
    rent: 'I rent my home',
    livingWithFamily: 'I live with family',
    temporaryShelter: 'I am in temporary housing',
    other: 'My housing situation is other than own or rent',
  }
  const housingAr: Record<string, string> = {
    own: 'أنا أملك مسكني',
    rent: 'أنا أستأجر مسكني',
    livingWithFamily: 'أعيش مع العائلة',
    temporaryShelter: 'أنا في سكن مؤقت',
    other: 'وضعي السكني مختلف',
  }

  const phrase = (locale === 'ar' ? housingAr : housingEn)[housingStatus]
  if (!phrase) return ''
  return locale === 'ar' ? ` ${phrase}.` : ` ${phrase}.`
}

function formatDependentsPhrase(locale: Locale, dependents: string): string {
  const count = Number(dependents)
  if (dependents.trim() === '' || Number.isNaN(count) || count <= 0) return ''

  return locale === 'ar'
    ? ` لدي ${count} معال.`
    : ` I have ${count} dependent${count === 1 ? '' : 's'}.`
}

function buildSituationSummary(locale: Locale, context: SituationFieldContext): string {
  const employmentKey = context.employmentStatus || 'other'
  const employment =
    EMPLOYMENT_PHRASE[locale][employmentKey] ?? EMPLOYMENT_PHRASE[locale].other

  return [
    employment,
    formatIncomePhrase(locale, context.monthlyIncome),
    formatHousingPhrase(locale, context.housingStatus),
    formatDependentsPhrase(locale, context.dependents),
  ].join('')
}

const FIELD_HELP_REQUEST: Record<Locale, Record<SituationField, string>> = {
  en: {
    currentFinancialSituation:
      'Help me describe my current financial situation and financial hardship.',
    employmentCircumstances: 'Help me describe my employment circumstances.',
    reasonForApplying: 'Help me explain my reason for applying for assistance.',
  },
  ar: {
    currentFinancialSituation: 'ساعدني في وصف وضعي المالي الحالي وضائقتي المالية.',
    employmentCircumstances: 'ساعدني في وصف ظروف توظيفي.',
    reasonForApplying: 'ساعدني في شرح سبب تقديمي للمساعدة.',
  },
}

/**
 * User prompt pattern (example):
 * "I am unemployed with no income. Help me describe my financial hardship."
 */
// Assembles the prompt for one field: summary + the ask + any existing draft +
// a formatting rule.
export function buildPrompt(
  field: SituationField,
  locale: Locale,
  context: SituationFieldContext,
): string {
  const summary = buildSituationSummary(locale, context)
  const helpRequest = FIELD_HELP_REQUEST[locale][field]
  const existing = context[field]?.trim()

  const parts = [`${summary} ${helpRequest}`]

  // Pass any partial draft so the model can build on it.
  if (existing) {
    parts.push(
      locale === 'ar'
        ? `ما كتبته حتى الآن: "${existing}"`
        : `Here is what I have written so far: "${existing}"`,
    )
  }

  parts.push(
    locale === 'ar'
      ? 'اكتب فقرة واحدة بصيغة المتكلم فقط، دون عناوين أو تنسيق.'
      : 'Write one first-person paragraph only, with no headings or markdown.',
  )

  return parts.join(' ')
}

// Sends the prompt and returns the text. Every failure is normalized to an
// OpenAIRequestError with a code the UI can translate.
export async function generateWritingSuggestion(userPrompt: string): Promise<string> {
  const prompt = userPrompt.trim()
  if (!prompt) {
    throw new OpenAIRequestError('EMPTY_PROMPT')
  }

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY?.trim()
  if (!apiKey) {
    throw new OpenAIRequestError('MISSING_API_KEY')
  }

  // Abort past the timeout so the dialog can't hang forever.
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(OPENAI_CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.7,
        max_tokens: 400,
        messages: [
          {
            role: 'system',
            content:
              'You help people complete assistance application forms. Reply with plain text only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const detail = await parseErrorDetail(response)

      // Map common statuses to specific codes; everything else is generic.
      if (response.status === 401) {
        throw new OpenAIRequestError('INVALID_API_KEY', detail)
      }
      if (response.status === 429) {
        throw new OpenAIRequestError('RATE_LIMIT', detail)
      }
      throw new OpenAIRequestError(
        'API_ERROR',
        detail ?? `Request failed (${response.status})`,
      )
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }

    const text = data.choices?.[0]?.message?.content?.trim()
    if (!text) {
      throw new OpenAIRequestError('INVALID_RESPONSE')
    }

    return text
  } catch (error) {
    // Re-throw our own errors; map aborts to TIMEOUT and the rest to NETWORK.
    if (error instanceof OpenAIRequestError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new OpenAIRequestError('TIMEOUT')
    }
    throw new OpenAIRequestError('NETWORK')
  } finally {
    window.clearTimeout(timeoutId)
  }
}
