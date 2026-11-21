import { Button } from '@mantine/core'
import type { AppButtonProps } from './types'
import css from './index.module.scss'

export function AppButton({ className, radius = 'md', variant = 'filled', ...props }: AppButtonProps) {
  return (
    <Button
      {...props}
      radius={radius}
      variant={variant}
      className={[css.button, variant === 'filled' ? css.primary : null, className].filter(Boolean).join(' ')}
    />
  )
}
