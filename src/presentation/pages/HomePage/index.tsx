import { useTranslation } from 'react-i18next'
import { useState } from 'react'

const NICKNAME_KEY = 'vaurenith.nickname'

export function HomePage() {
  const { t } = useTranslation('presentation')
  const [nickname] = useState(() => localStorage.getItem(NICKNAME_KEY))

  return <div>{nickname ? t('home.welcome', { nickname }) : t('home.title')}</div>
}
