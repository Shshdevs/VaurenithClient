import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function NotFoundPage() {
  const { t, i18n } = useTranslation('presentation')
  const language = i18n.resolvedLanguage === 'ru' ? 'ru' : 'en'

  return (
    <main>
      <h1>{t('notFound.title')}</h1>
      <Link to={`/${language}`}>{t('notFound.backToHome')}</Link>
    </main>
  )
}
