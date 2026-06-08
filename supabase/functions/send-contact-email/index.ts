import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.107.0'

type Locale = 'pl' | 'en'

interface ContactPayload {
  name?: string
  email?: string
  company?: string
  subject?: string
  message?: string
  locale?: Locale
  sourceUrl?: string
  website?: string
}

const allowedOrigin = Deno.env.get('CONTACT_ALLOWED_ORIGIN') ?? '*'

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isValidText = (
  value: unknown,
  minLength: number,
  maxLength: number,
): value is string =>
  typeof value === 'string' &&
  value.trim().length >= minLength &&
  value.trim().length <= maxLength

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const sendEmail = async (
  resendApiKey: string,
  body: Record<string, unknown>,
) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(details || 'Email provider failed.')
  }
}

const normalizePayload = (payload: ContactPayload) => {
  if (payload.website && payload.website.trim().length > 0) {
    return null
  }

  if (!isValidText(payload.name, 2, 120)) {
    throw new Error('Invalid name.')
  }

  if (
    typeof payload.email !== 'string' ||
    !emailPattern.test(payload.email.trim()) ||
    payload.email.length > 160
  ) {
    throw new Error('Invalid email.')
  }

  if (!isValidText(payload.subject, 3, 160)) {
    throw new Error('Invalid subject.')
  }

  if (!isValidText(payload.message, 20, 4000)) {
    throw new Error('Invalid message.')
  }

  if (!isValidText(payload.sourceUrl, 1, 500)) {
    throw new Error('Invalid source URL.')
  }

  return {
    name: payload.name.trim(),
    email: payload.email.trim(),
    company: payload.company?.trim().slice(0, 160) || null,
    subject: payload.subject.trim(),
    message: payload.message.trim(),
    locale: payload.locale === 'en' ? 'en' : 'pl',
    source_url: payload.sourceUrl.trim(),
  }
}

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed.', {
      headers: corsHeaders,
      status: 405,
    })
  }

  try {
    const payload = (await request.json()) as ContactPayload
    const message = normalizePayload(payload)

    if (!message) {
      return Response.json({ ok: true }, { headers: corsHeaders })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const toEmail = Deno.env.get('CONTACT_TO_EMAIL')
    const fromEmail =
      Deno.env.get('CONTACT_FROM_EMAIL') ?? 'Portfolio <onboarding@resend.dev>'

    if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !toEmail) {
      return new Response('Contact function is not configured.', {
        headers: corsHeaders,
        status: 500,
      })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert({
        ...message,
        user_agent: request.headers.get('user-agent'),
      })

    if (insertError) {
      throw insertError
    }

    const escapedMessage = escapeHtml(message.message).replaceAll('\n', '<br />')
    const escapedName = escapeHtml(message.name)
    const escapedSubject = escapeHtml(message.subject)
    const escapedCompany = message.company ? escapeHtml(message.company) : ''

    await sendEmail(resendApiKey, {
      from: fromEmail,
      to: [toEmail],
      reply_to: message.email,
      subject: `[Portfolio] ${message.subject}`,
      text: [
        `Name: ${message.name}`,
        `Email: ${message.email}`,
        message.company ? `Company / project: ${message.company}` : null,
        `Locale: ${message.locale}`,
        `Source: ${message.source_url}`,
        '',
        message.message,
      ]
        .filter(Boolean)
        .join('\n'),
      html: `
        <h2>${escapedSubject}</h2>
        <p><strong>Name:</strong> ${escapedName}</p>
        <p><strong>Email:</strong> ${escapeHtml(message.email)}</p>
        ${
          escapedCompany
            ? `<p><strong>Company / project:</strong> ${escapedCompany}</p>`
            : ''
        }
        <p><strong>Locale:</strong> ${message.locale}</p>
        <p><strong>Source:</strong> ${escapeHtml(message.source_url)}</p>
        <hr />
        <p>${escapedMessage}</p>
      `,
    })

    const confirmation =
      message.locale === 'en'
        ? {
            subject: 'Your message has been sent',
            intro: `Hi ${message.name},`,
            body:
              'I confirm that your message from the portfolio contact form has been sent successfully. I will reply as soon as possible.',
            summaryLabel: 'Message subject',
            footer:
              'This is an automatic confirmation. You do not need to resend the form.',
          }
        : {
            subject: 'Twoja wiadomo\u015b\u0107 zosta\u0142a wys\u0142ana',
            intro: `Cze\u015b\u0107 ${message.name},`,
            body:
              'Potwierdzam, \u017ce Twoja wiadomo\u015b\u0107 z formularza kontaktowego portfolio zosta\u0142a wys\u0142ana poprawnie. Odpowiem mo\u017cliwie szybko.',
            summaryLabel: 'Temat wiadomo\u015bci',
            footer:
              'To automatyczne potwierdzenie. Nie musisz ponownie wysy\u0142a\u0107 formularza.',
          }

    await sendEmail(resendApiKey, {
      from: fromEmail,
      to: [message.email],
      reply_to: toEmail,
      subject: confirmation.subject,
      text: [
        confirmation.intro,
        '',
        confirmation.body,
        '',
        `${confirmation.summaryLabel}: ${message.subject}`,
        '',
        confirmation.footer,
      ].join('\n'),
      html: `
        <p>${escapeHtml(confirmation.intro)}</p>
        <p>${escapeHtml(confirmation.body)}</p>
        <p><strong>${escapeHtml(confirmation.summaryLabel)}:</strong> ${escapedSubject}</p>
        <hr />
        <p style="color:#64748b">${escapeHtml(confirmation.footer)}</p>
      `,
    })

    return Response.json({ ok: true }, { headers: corsHeaders })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected contact form error.'

    return Response.json(
      {
        ok: false,
        error: message,
      },
      {
        headers: corsHeaders,
        status: 400,
      },
    )
  }
})
