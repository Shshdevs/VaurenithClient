import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { NICKNAME_STORAGE_KEY } from '@/presentation/app/identity/consts'

export function HomePage() {
  const { t } = useTranslation('presentation')
  const [nickname] = useState(() => localStorage.getItem(NICKNAME_STORAGE_KEY))

  return <div>{nickname ? t('home.welcome', { nickname }) : t('home.title')}</div>
}
