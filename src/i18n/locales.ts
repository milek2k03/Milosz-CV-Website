export const supportedLocales = ['pl', 'en'] as const

export type SupportedLocale = (typeof supportedLocales)[number]

export const defaultLocale: SupportedLocale = 'pl'

export const getSupportedLocale = (language: string): SupportedLocale =>
  language.toLowerCase().startsWith('en') ? 'en' : 'pl'
