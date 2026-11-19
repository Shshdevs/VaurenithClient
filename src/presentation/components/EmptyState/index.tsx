import { Button, Text, Title, type ButtonProps } from '@mantine/core'
import type { CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'
import css from './index.module.scss'

const fragments = import.meta.glob<string>('@assets/empty-states/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
})

const cellImage = Object.entries(fragments).find(([path]) => path.endsWith('/Cell.png'))?.[1]

type EmptyStateAction = {
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: ButtonProps['variant']
}

type EmptyStateProps = {
  fragmentName?: string
  title?: string
  description?: string
  actions?: EmptyStateAction[]
  size?: number
  className?: string
}

export function EmptyState({ fragmentName, title, description, actions = [], className }: EmptyStateProps) {
  const fileName = fragmentName ? (fragmentName.endsWith('.png') ? fragmentName : `${fragmentName}.png`) : undefined
  const fragmentImage = fileName
    ? Object.entries(fragments).find(([path]) => path.endsWith(`/${fileName}`))?.[1]
    : undefined

  return (
    <section
      className={[css.emptyState, className].filter(Boolean).join(' ')}
      style={{ '--empty-state-size': `560px` } as CSSProperties}
    >
      <div className={css.illustration}>
        {cellImage && <img className={css.cell} src={cellImage} alt="" />}
        {fragmentImage && <img className={css.fragment} src={fragmentImage} alt="" />}
      </div>
      {title && (
        <Title mb="xs" className={css.title} order={2}>
          {title}
        </Title>
      )}
      {description && (
        <Text mb="xl" className={css.description}>
          {description}
        </Text>
      )}
      {actions.length > 0 && (
        <div className={css.actions}>
          {actions.map(({ label, icon: Icon, onClick, variant = 'filled' }, index) => (
            <Button
              key={`${label}-${index}`}
              leftSection={Icon ? <Icon size={18} /> : null}
              onClick={onClick}
              variant={variant}
            >
              {label}
            </Button>
          ))}
        </div>
      )}
    </section>
  )
}
