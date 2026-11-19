import { Button } from '@mantine/core'
import type { AppButtonProps } from './types'
import css from './index.module.scss'

export function AppButton({ className, radius = 'md', ...props }: AppButtonProps) {
  return <Button {...props} radius={radius} className={[css.button, className].filter(Boolean).join(' ')} />
}
