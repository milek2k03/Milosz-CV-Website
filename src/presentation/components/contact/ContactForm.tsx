import { Send } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useContactForm } from '@/application/contact/useContactForm'
import type { ContactMessageInput } from '@/domain/contact/entities'
import { getSupportedLocale } from '@/i18n/locales'
import { Button } from '@/presentation/components/Button'
import { cn } from '@/shared/utils/cn'

interface ContactFormState {
  name: string
  email: string
  company: string
  subject: string
  message: string
  website: string
}

const initialState: ContactFormState = {
  name: '',
  email: '',
  company: '',
  subject: '',
  message: '',
  website: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContactForm() {
  const { i18n, t } = useTranslation()
  const { isSubmitting, sendMessage } = useContactForm()
  const [form, setForm] = useState<ContactFormState>(initialState)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const updateField = <Field extends keyof ContactFormState>(
    field: Field,
    value: ContactFormState[Field],
  ) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const validate = () => {
    if (form.name.trim().length < 2) {
      return t('contactForm.validation.name')
    }

    if (!emailPattern.test(form.email.trim())) {
      return t('contactForm.validation.email')
    }

    if (form.subject.trim().length < 3) {
      return t('contactForm.validation.subject')
    }

    if (form.message.trim().length < 20) {
      return t('contactForm.validation.message')
    }

    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const validationError = validate()

    if (validationError) {
      setError(validationError)
      return
    }

    const input: ContactMessageInput = {
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || undefined,
      subject: form.subject.trim(),
      message: form.message.trim(),
      locale: getSupportedLocale(i18n.language),
      sourceUrl: window.location.href,
      website: form.website,
    }

    try {
      const result = await sendMessage(input)
      setSuccess(
        result.mode === 'fallback'
          ? t('contactForm.fallback')
          : t('contactForm.success'),
      )
      setForm(initialState)
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : t('contactForm.validation.message'),
      )
    }
  }

  return (
    <form
      className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm text-[color:var(--muted)]">
          {t('contactForm.name')}
          <input
            autoComplete="name"
            className="form-field"
            onChange={(event) => updateField('name', event.target.value)}
            required
            value={form.name}
          />
        </label>

        <label className="grid gap-2 text-sm text-[color:var(--muted)]">
          {t('contactForm.email')}
          <input
            autoComplete="email"
            className="form-field"
            onChange={(event) => updateField('email', event.target.value)}
            required
            type="email"
            value={form.email}
          />
        </label>

        <label className="grid gap-2 text-sm text-[color:var(--muted)]">
          {t('contactForm.company')}
          <input
            autoComplete="organization"
            className="form-field"
            onChange={(event) => updateField('company', event.target.value)}
            placeholder={t('contactForm.companyPlaceholder')}
            value={form.company}
          />
        </label>

        <label className="grid gap-2 text-sm text-[color:var(--muted)]">
          {t('contactForm.subject')}
          <input
            className="form-field"
            onChange={(event) => updateField('subject', event.target.value)}
            placeholder={t('contactForm.subjectPlaceholder')}
            required
            value={form.subject}
          />
        </label>

        <label className="grid gap-2 text-sm text-[color:var(--muted)]">
          {t('contactForm.message')}
          <textarea
            className="form-field min-h-36 resize-y"
            onChange={(event) => updateField('message', event.target.value)}
            placeholder={t('contactForm.messagePlaceholder')}
            required
            value={form.message}
          />
        </label>

        <label className="sr-only">
          Website
          <input
            autoComplete="off"
            onChange={(event) => updateField('website', event.target.value)}
            tabIndex={-1}
            value={form.website}
          />
        </label>

        {error || success ? (
          <p
            className={cn(
              'rounded-md border px-3 py-2 text-sm',
              error
                ? 'border-rose-300/30 bg-rose-400/10 text-rose-200'
                : 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200',
            )}
          >
            {error ?? success}
          </p>
        ) : null}

        <Button
          disabled={isSubmitting}
          icon={<Send className="size-4" />}
          type="submit"
          variant="primary"
        >
          {isSubmitting ? t('contactForm.sending') : t('contactForm.send')}
        </Button>
      </div>
    </form>
  )
}
