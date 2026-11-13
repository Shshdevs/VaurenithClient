export const supportedLanguages = ['en', 'ru'] as const

export type SupportedLanguage = (typeof supportedLanguages)[number]

export function getLanguageFromPathname(pathname: string): SupportedLanguage {
  const language = pathname.match(/^\/(en|ru)(?=\/|$)/)?.[1]

  return language === 'ru' ? 'ru' : 'en'
}

export function getInitialLanguage(
  location: Pick<Location, 'pathname' | 'hash'>,
  isDesktop: boolean
): SupportedLanguage {
  const pathname = isDesktop && location.hash.startsWith('#/') ? location.hash.slice(1) : location.pathname

  return getLanguageFromPathname(pathname)
}
