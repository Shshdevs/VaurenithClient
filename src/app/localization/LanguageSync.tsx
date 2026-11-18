import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import i18n from '@/app/localization/i18n'
import { getLanguageFromPathname } from '@/app/localization/language'

export function LanguageSync() {
  const { pathname } = useLocation()

  useEffect(() => {
    const language = getLanguageFromPathname(pathname)

    if (i18n.resolvedLanguage !== language) {
      void i18n.changeLanguage(language)
    }
  }, [pathname])

  return null
}
