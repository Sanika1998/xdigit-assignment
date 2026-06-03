// Shared form field: wraps MUI TextField + react-hook-form and handles text,
// select (with optional flags), date, and tel inputs. The tricky bits are the
// label-shrink and placeholder rules, which differ per input type.
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import type { InputLabelProps } from '@mui/material/InputLabel'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useState } from 'react'
import { fieldPlaceholderSx } from '../../theme/formSx'
import { countryFlagEmoji } from '../../utils/countryFlag'
import {
  dialCodeFlagSx,
  dialCodeTextSx,
  dialCodeValueSx,
} from './phoneFieldSx'
import {
  Controller,
  useFormContext,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form'

const selectFlagLabelSx = { display: 'inline-flex', alignItems: 'center', gap: 1 } as const
const selectFlagIconSx = { fontSize: '1.15rem', lineHeight: 1 } as const

export type FormSelectOption = {
  value: string
  label: string
  /** ISO 3166-1 alpha-2 for flag; defaults to `value` when `showFlags` is true. */
  flagCode?: string
}

type Props<T extends FieldValues> = {
  name: FieldPath<T>
  rules?: RegisterOptions<T, FieldPath<T>>
  options?: FormSelectOption[]
  showFlags?: boolean
  /** Select only: compact flag + dial code inside narrow columns. */
  compactSelectValue?: boolean
  helperText?: string
} & Omit<TextFieldProps, 'name' | 'value' | 'defaultValue' | 'error' | 'helperText'>

function hasFieldValue(value: unknown): boolean {
  return value !== undefined && value !== null && String(value).trim() !== ''
}

function isOutlinedVariant(variant: TextFieldProps['variant']): boolean {
  return variant === 'outlined' || variant === undefined
}

function flagForOption(option: FormSelectOption, showFlags: boolean): string {
  if (!showFlags) return ''
  return countryFlagEmoji(option.flagCode ?? option.value)
}

// A select option's content: plain label, or flag + label. `compact` is the
// squeezed variant for the narrow dial-code column.
function SelectOptionLabel({
  option,
  showFlags,
  compact = false,
}: {
  option: FormSelectOption
  showFlags: boolean
  compact?: boolean
}) {
  const flag = flagForOption(option, showFlags)
  if (!flag) return <>{option.label}</>

  if (compact) {
    return (
      <Box component="span" sx={dialCodeValueSx}>
        <Box component="span" aria-hidden sx={dialCodeFlagSx}>
          {flag}
        </Box>
        <Box component="span" sx={dialCodeTextSx}>
          {option.label}
        </Box>
      </Box>
    )
  }

  return (
    <Box component="span" sx={selectFlagLabelSx}>
      <Box component="span" aria-hidden sx={selectFlagIconSx}>
        {flag}
      </Box>
      <span>{option.label}</span>
    </Box>
  )
}

type ControlledFieldProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, FieldPath<T>>
  fieldState: ControllerFieldState
  options?: FormSelectOption[]
  showFlags?: boolean
  compactSelectValue?: boolean
  helperText?: string
  slotProps?: TextFieldProps['slotProps']
  variant: TextFieldProps['variant']
  textFieldProps: Omit<
    TextFieldProps,
    'name' | 'value' | 'defaultValue' | 'error' | 'helperText' | 'variant' | 'slotProps'
  >
}

function ControlledFormTextField<T extends FieldValues>({
  field,
  fieldState,
  options,
  showFlags = false,
  compactSelectValue = false,
  helperText,
  slotProps,
  variant,
  textFieldProps,
}: ControlledFieldProps<T>) {
  const { trigger } = useFormContext<T>()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [focused, setFocused] = useState(false)
  const value = field.value ?? ''
  const outlined = isOutlinedVariant(variant)
  const hasValue = hasFieldValue(value)
  const isDateField = textFieldProps.type === 'date'
  const isTelField = textFieldProps.type === 'tel'
  const isSelectField = Boolean(options)
  const labelSlot = slotProps?.inputLabel
  /** Legend label for date/select/tel; on mobile all fields use legend for consistency. */
  // These types always render something, so the label must stay shrunk or it overlaps.
  const alwaysLegendLabel =
    isDateField || isSelectField || isTelField || isMobile
  // Float the label up when active/filled/errored, or when it would overlap.
  const labelShrink =
    !outlined ||
    alwaysLegendLabel ||
    focused ||
    hasValue ||
    Boolean(fieldState.error)

  const inputLabelProps: InputLabelProps = {
    ...(typeof labelSlot === 'object' && labelSlot !== null && !Array.isArray(labelSlot)
      ? (labelSlot as InputLabelProps)
      : {}),
    shrink: labelShrink,
  }
  const { onBlur, onChange, ...fieldHandlers } = field
  const placeholder = textFieldProps.placeholder
  // Selects show the placeholder when empty; text inputs only while focused; date
  // inputs never (the browser provides its own).
  const showPlaceholder = isSelectField
    ? !hasValue && Boolean(placeholder)
    : !isDateField && focused && Boolean(placeholder)

  // Render the select's chosen value: placeholder when empty, else the matching
  // option (with flag) instead of the raw value.
  const selectSlot = options
    ? {
        displayEmpty: true,
        renderValue: (selected: unknown) => {
          if (!hasFieldValue(selected)) {
            return showPlaceholder ? (
              <Box component="span" sx={fieldPlaceholderSx}>
                {placeholder}
              </Box>
            ) : (
              ''
            )
          }
          const match = options.find((option) => option.value === selected)
          if (!match) return String(selected)
          return (
            <SelectOptionLabel
              option={match}
              showFlags={showFlags}
              compact={compactSelectValue}
            />
          )
        },
      }
    : undefined

  const { sx: textFieldSx, ...restTextFieldProps } = textFieldProps

  return (
    <TextField
      {...restTextFieldProps}
      {...fieldHandlers}
      placeholder={showPlaceholder ? placeholder : undefined}
      variant={variant}
      sx={textFieldSx}
      error={!!fieldState.error}
      helperText={fieldState.error?.message ?? helperText}
      value={value}
      select={Boolean(options)}
      onChange={(event) => {
        // Normalize to a string: inputs give an event, some select paths give the
        // value directly. Keeps RHF state uniform.
        const next =
          'target' in event && event.target && 'value' in event.target
            ? String(event.target.value)
            : String(event)
        onChange(next)
        // Selects don't blur like inputs, so validate on change to keep canProceed fresh.
        if (isSelectField) {
          void trigger(field.name)
        }
        restTextFieldProps.onChange?.(event)
      }}
      onFocus={(event) => {
        setFocused(true)
        textFieldProps.onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur()
        textFieldProps.onBlur?.(event)
      }}
      slotProps={{
        ...slotProps,
        inputLabel: inputLabelProps,
        ...(selectSlot
          ? {
              select: {
                ...(typeof slotProps?.select === 'object' && slotProps.select !== null
                  ? slotProps.select
                  : {}),
                ...selectSlot,
              },
            }
          : {}),
      }}
    >
      {options?.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <SelectOptionLabel option={option} showFlags={showFlags} />
        </MenuItem>
      ))}
    </TextField>
  )
}

// Wires the field into react-hook-form via Controller. The generated id
// (field-<name>) lets other code focus a field, e.g. after the AI fills it.
export function FormTextField<T extends FieldValues>({
  name,
  rules,
  options,
  showFlags,
  compactSelectValue,
  helperText,
  slotProps,
  variant = 'outlined',
  ...textFieldProps
}: Props<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <ControlledFormTextField
          field={field}
          fieldState={fieldState}
          options={options}
          showFlags={showFlags}
          compactSelectValue={compactSelectValue}
          helperText={helperText}
          slotProps={slotProps}
          variant={variant}
          textFieldProps={{ ...textFieldProps, id: `field-${String(name)}` }}
        />
      )}
    />
  )
}
