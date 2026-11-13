import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import i18n from './i18n'
import { getLanguageFromPathname } from './language'

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
