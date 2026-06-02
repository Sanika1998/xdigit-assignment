import { ThemeProvider, createTheme } from '@mui/material/styles'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type UseFormReturn,
} from 'react-hook-form'
import { LocaleProvider } from '~/context/LocaleContext'
import { initialFormData, type ApplicationFormData } from '~/types/formTypes'

const theme = createTheme()

type FormRenderOptions = {
  defaultValues?: DefaultValues<ApplicationFormData>
} & Omit<RenderOptions, 'wrapper'>

export function renderWithForm(
  ui: ReactElement,
  { defaultValues, ...renderOptions }: FormRenderOptions = {},
) {
  let methodsRef!: UseFormReturn<ApplicationFormData>

  function Wrapper({ children }: { children: ReactNode }) {
    const methods = useForm<ApplicationFormData>({
      defaultValues: { ...initialFormData, ...defaultValues },
      mode: 'onTouched',
      reValidateMode: 'onChange',
    })
    methodsRef = methods

    return (
      <LocaleProvider>
        <ThemeProvider theme={theme}>
          <FormProvider {...methods}>{children}</FormProvider>
        </ThemeProvider>
      </LocaleProvider>
    )
  }

  const result = render(ui, { wrapper: Wrapper, ...renderOptions })

  return {
    ...result,
    methods: () => methodsRef,
  }
}
