import type { SupportedLocale } from '@/i18n/locales'

export interface ContactMessageInput {
  name: string
  email: string
  company?: string
  subject: string
  message: string
  locale: SupportedLocale
  sourceUrl: string
  website?: string
}

export interface ContactSendResult {
  mode: 'sent' | 'fallback'
}
