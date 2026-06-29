import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { defaultLocale, getSupportedLocale } from '@/i18n/locales'
import { resources } from '@/i18n/resources'

const queryLanguage = new URLSearchParams(window.location.search).get('lng')
const initialLanguage = getSupportedLocale(queryLanguage ?? defaultLocale)

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
  const url = new URL(window.location.href)

  document.documentElement.lang = locale
  window.localStorage.setItem('language', locale)

  if (locale === defaultLocale) {
    url.searchParams.delete('lng')
  } else {
    url.searchParams.set('lng', locale)
  }

  window.history.replaceState(
    window.history.state,
    '',
    `${url.pathname}${url.search}${url.hash}`,
  )
})

document.documentElement.lang = initialLanguage

export { i18n }
