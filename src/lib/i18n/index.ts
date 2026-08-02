import { es } from './es'
import { en } from './en'

export type Locale = 'es' | 'en'
export const locales: Locale[] = ['es', 'en']
export const defaultLocale: Locale = 'es'

const translations = { es, en }

export function getTranslations(locale: Locale) {
  return translations[locale]
}

export type Translations = typeof es
