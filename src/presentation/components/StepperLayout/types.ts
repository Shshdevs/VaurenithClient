import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type Step = {
  label: string
  info: string
  icon?: LucideIcon
  children: ReactNode
}

export type StepperProps = {
  steps: Step[]
}
