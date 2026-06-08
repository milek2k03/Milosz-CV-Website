import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { defaultLocale, getSupportedLocale } from '@/i18n/locales'
import { resources } from '@/i18n/resources'

const storedLanguage = window.localStorage.getItem('language')
const initialLanguage = storedLanguage
  ? getSupportedLocale(storedLanguage)
  : getSupportedLocale(navigator.language || defaultLocale)

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: defaultLocale,
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (language) => {
  const locale = getSupportedLocale(language)
  document.documentElement.lang = locale
  window.localStorage.setItem('language', locale)
})

document.documentElement.lang = initialLanguage

export { i18n }
