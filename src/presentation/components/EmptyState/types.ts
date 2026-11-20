import type { ButtonProps } from '@mantine/core'
import type { LucideIcon } from 'lucide-react'

export type EmptyStateAction = {
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: ButtonProps['variant']
}

export type EmptyStateProps = {
  fragmentName?: string
  title?: string
  description?: string
  actions?: EmptyStateAction[]
  size?: number
  className?: string
}
