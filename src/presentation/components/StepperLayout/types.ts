import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type Step = {
  label: string
  info: string
  icon?: LucideIcon
  children: ReactNode
  nextLabel?: string
  isLoading?: boolean
  onNext?: () => boolean | Promise<boolean>
}

export type StepperProps = {
  steps: Step[]
}
