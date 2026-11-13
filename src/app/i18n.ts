import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import appEn from './locales/en.json'
import applicationEn from '@/application/locales/en.json'
import infrastructureEn from '@/infrastructure/locales/en.json'
import presentationEn from '@/presentation/locales/en.json'
import appRu from './locales/ru.json'
import applicationRu from '@/application/locales/ru.json'
import infrastructureRu from '@/infrastructure/locales/ru.json'
import presentationRu from '@/presentation/locales/ru.json'
import { getInitialLanguage, supportedLanguages } from './language'
import { isTauri } from '@tauri-apps/api/core'

export const defaultNS = 'presentation'

export const resources = {
  en: {
    app: appEn,
    application: applicationEn,
    infrastructure: infrastructureEn,
    presentation: presentationEn,
  },
  ru: {
    app: appRu,
    application: applicationRu,
    infrastructure: infrastructureRu,
    presentation: presentationRu,
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(window.location, isTauri()),
  fallbackLng: 'en',
  supportedLngs: supportedLanguages,
  defaultNS,
  ns: ['app', 'application', 'infrastructure', 'presentation'],
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
