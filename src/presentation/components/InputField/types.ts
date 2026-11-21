import type { LucideIcon } from 'lucide-react'

export type FieldValue = {
  label: string
  description?: string
  placeholder?: string
  required?: boolean
  isLoading?: boolean
  isError?: boolean
  errorDescription?: string
  leadingIcon?: LucideIcon
  trailingIcon?: LucideIcon
  onTrailingIconClick?: () => void
}

export type TextFieldValue = {
  value: string
  onChange: (value: string) => void
} & FieldValue

export type NumberFieldValue = {
  value: number | string
  onChange: (value: number | string) => void
} & FieldValue

export type TextareaValue = {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  autosize?: boolean
} & FieldValue

export type DropdownFieldValue = {
  value: string
  options: string[]
  onChange: (option: string) => void
} & FieldValue
