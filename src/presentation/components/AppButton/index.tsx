import { Button, type ButtonProps } from '@mantine/core'
import type { ComponentPropsWithoutRef } from 'react'
import css from './index.module.scss'

type AppButtonProps = ButtonProps & ComponentPropsWithoutRef<'button'>

export function AppButton({ className, radius = 'md', ...props }: AppButtonProps) {
  return <Button {...props} radius={radius} className={[css.button, className].filter(Boolean).join(' ')} />
}
