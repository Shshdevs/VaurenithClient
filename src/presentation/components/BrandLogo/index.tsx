import { Text, useComputedColorScheme } from '@mantine/core'
import css from './index.module.scss'
import combinedLogo from '@assets/branding/CombineLogo.svg'
import iconLogo from '@assets/branding/IconLogo.svg'

type BrandLogoProps = {
  compact?: boolean
  header?: boolean
  large?: boolean
  className?: string
}

export function BrandLogo({ compact = false, header = false, large = false, className }: BrandLogoProps) {
  const colorScheme = useComputedColorScheme('light')
  const classNames = [
    css.logo,
    compact ? css.compact : '',
    header ? css.header : '',
    large ? css.large : '',
    colorScheme === 'dark' ? css.dark : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames}>
      <img src={iconLogo} alt="" className={css.icon} />
      {!compact && (
        <>
          <Text className={css.name}>Vaurenith</Text>
          <img src={combinedLogo} alt="Vaurenith" className={css.combined} />
        </>
      )}
    </div>
  )
}
