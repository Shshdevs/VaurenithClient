import 'i18next'
import { defaultNS, resources } from '@/app/localization/i18n'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: (typeof resources)['en']
  }
}
