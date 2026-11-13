export const supportedLanguages = ['en', 'ru'] as const

export type SupportedLanguage = (typeof supportedLanguages)[number]

export function getLanguageFromPathname(pathname: string): SupportedLanguage {
  const language = pathname.match(/^\/(en|ru)(?=\/|$)/)?.[1]

  return language === 'ru' ? 'ru' : 'en'
}
