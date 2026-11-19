import { Text, Title } from '@mantine/core'
import type { CSSProperties } from 'react'
import { AppButton } from '@/presentation/components/AppButton'
import { EMPTY_STATE_CELL_IMAGE, EMPTY_STATE_FRAGMENTS } from './consts'
import type { EmptyStateProps } from './types'
import css from './index.module.scss'

export function EmptyState({ fragmentName, title, description, actions = [], size = 560, className }: EmptyStateProps) {
  const fileName = fragmentName ? (fragmentName.endsWith('.png') ? fragmentName : `${fragmentName}.png`) : undefined
  const fragmentImage = fileName
    ? EMPTY_STATE_FRAGMENTS.find(({ path }) => path.endsWith(`/${fileName}`))?.src
    : undefined

  return (
    <section
      className={[css.emptyState, className].filter(Boolean).join(' ')}
      style={{ '--empty-state-size': `${size}px` } as CSSProperties}
    >
      <div className={css.illustration}>
        {EMPTY_STATE_CELL_IMAGE && <img className={css.cell} src={EMPTY_STATE_CELL_IMAGE} alt="" />}
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
            <AppButton
              key={`${label}-${index}`}
              leftSection={Icon ? <Icon size={18} /> : null}
              onClick={onClick}
              radius="lg"
              variant={variant}
            >
              {label}
            </AppButton>
          ))}
        </div>
      )}
    </section>
  )
}
