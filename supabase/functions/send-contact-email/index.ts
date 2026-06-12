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
const brandName = 'Mi\u0142osz Czech'
const defaultFromEmail = `${brandName} <contact@miloszczechportfolio.pl>`

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

const buildEmailShell = ({
  preheader,
  eyebrow,
  title,
  body,
  footer,
}: {
  preheader: string
  eyebrow: string
  title: string
  body: string
  footer: string
}) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
    </head>
    <body style="margin:0;background:#0B1120;padding:28px 16px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#F8FAFC;">
      <span style="display:none;max-height:0;overflow:hidden;color:transparent;opacity:0;">${preheader}</span>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;border-collapse:collapse;">
              <tr>
                <td style="padding:22px 0 18px;">
                  <div style="font-size:12px;line-height:18px;letter-spacing:.08em;text-transform:uppercase;color:#38BDF8;font-weight:700;">${eyebrow}</div>
                  <h1 style="margin:8px 0 0;font-size:26px;line-height:34px;color:#F8FAFC;font-weight:750;">${title}</h1>
                </td>
              </tr>
              <tr>
                <td style="background:#111827;border:1px solid #253047;border-radius:12px;padding:24px;box-shadow:0 18px 44px rgba(0,0,0,.24);">
                  ${body}
                </td>
              </tr>
              <tr>
                <td style="padding:18px 4px 0;color:#94A3B8;font-size:13px;line-height:20px;">
                  ${footer}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`

const buildInfoRow = (label: string, value: string) => `
  <tr>
    <td style="padding:10px 0;color:#94A3B8;font-size:13px;line-height:19px;width:34%;vertical-align:top;">${label}</td>
    <td style="padding:10px 0;color:#F8FAFC;font-size:14px;line-height:20px;font-weight:650;vertical-align:top;">${value}</td>
  </tr>
`

const buildButton = (href: string, label: string) => `
  <a href="${href}" style="display:inline-block;background:#0EA5E9;color:#FFFFFF;text-decoration:none;border-radius:8px;padding:11px 16px;font-size:14px;line-height:18px;font-weight:750;">${label}</a>
`

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
    const fromEmail = Deno.env.get('CONTACT_FROM_EMAIL') ?? defaultFromEmail

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
    const escapedEmail = escapeHtml(message.email)
    const escapedSubject = escapeHtml(message.subject)
    const escapedCompany = message.company ? escapeHtml(message.company) : ''
    const escapedSource = escapeHtml(message.source_url)
    const localeLabel = message.locale === 'en' ? 'English' : 'Polski'
    const replyHref = escapeHtml(
      `mailto:${message.email}?subject=${encodeURIComponent(
        `Re: ${message.subject}`,
      )}`,
    )

    await sendEmail(resendApiKey, {
      from: fromEmail,
      to: [toEmail],
      reply_to: message.email,
      subject: `[${brandName}] ${message.subject}`,
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
      html: buildEmailShell({
        preheader: `Nowe zapytanie ze strony ${brandName}: ${escapedSubject}`,
        eyebrow: `Kontakt - ${brandName}`,
        title: 'Nowe zapytanie z formularza',
        body: `
          <p style="margin:0 0 18px;color:#CBD5E1;font-size:15px;line-height:24px;">
            Kto\u015b wys\u0142a\u0142 wiadomo\u015b\u0107 przez formularz kontaktowy na portfolio. Poni\u017cej masz pe\u0142ny kontekst zg\u0142oszenia i tre\u015b\u0107 wiadomo\u015bci.
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-top:1px solid #253047;border-bottom:1px solid #253047;margin:18px 0;">
            ${buildInfoRow('Imie i nazwisko', escapedName)}
            ${buildInfoRow('Email', `<a href="mailto:${escapedEmail}" style="color:#38BDF8;text-decoration:none;">${escapedEmail}</a>`)}
            ${
              escapedCompany
                ? buildInfoRow('Firma / projekt', escapedCompany)
                : ''
            }
            ${buildInfoRow('Temat', escapedSubject)}
            ${buildInfoRow('Jezyk formularza', localeLabel)}
            ${buildInfoRow('Zrodlo', `<a href="${escapedSource}" style="color:#38BDF8;text-decoration:none;">${escapedSource}</a>`)}
          </table>
          <div style="margin:0 0 22px;">
            <div style="margin:0 0 8px;color:#94A3B8;font-size:12px;line-height:18px;text-transform:uppercase;letter-spacing:.08em;font-weight:750;">Wiadomosc</div>
            <div style="background:#0B1120;border:1px solid #253047;border-radius:10px;padding:16px;color:#E2E8F0;font-size:15px;line-height:25px;">${escapedMessage}</div>
          </div>
          ${buildButton(replyHref, 'Odpowiedz na zapytanie')}
        `,
        footer:
          'Wiadomo\u015b\u0107 zosta\u0142a zapisana w Supabase w tabeli contact_messages. Nadawca formularza dosta\u0142 osobne potwierdzenie automatyczne.',
      }),
    })

    const confirmation =
      message.locale === 'en'
        ? {
            subject: 'Your message has been sent',
            eyebrow: 'Message received',
            title: 'Your message is on its way',
            intro: `Hi ${message.name},`,
            body:
              'Thanks for reaching out through my portfolio. Your message was delivered successfully and is now queued for review.',
            nextStepTitle: 'What happens next',
            nextStep:
              'I will read the details and reply directly if the topic fits my current Unity, VR or software development work.',
            summaryLabel: 'Message subject',
            noReplyTitle: 'Please do not reply to this email',
            noReply:
              'This confirmation was sent automatically. If you want to add more context, please send a new message through the contact form.',
            footer:
              'Automatic confirmation from miloszczechportfolio.pl',
          }
        : {
            subject: 'Twoja wiadomo\u015b\u0107 zosta\u0142a wys\u0142ana',
            eyebrow: 'Wiadomosc odebrana',
            title: 'Twoje zapytanie jest juz w drodze',
            intro: `Cze\u015b\u0107 ${message.name},`,
            body:
              'Dzi\u0119ki za kontakt przez moje portfolio. Wiadomo\u015b\u0107 zosta\u0142a wys\u0142ana poprawnie i trafi\u0142a do kolejki do sprawdzenia.',
            nextStepTitle: 'Co dalej',
            nextStep:
              'Przeczytam szczeg\u00f3\u0142y i odpowiem bezpo\u015brednio, je\u015bli temat pasuje do mojego aktualnego zakresu prac Unity, VR albo software development.',
            summaryLabel: 'Temat wiadomo\u015bci',
            noReplyTitle: 'Nie odpowiadaj na tego maila',
            noReply:
              'To automatyczne potwierdzenie. Je\u015bli chcesz dopisa\u0107 wi\u0119cej informacji, wy\u015blij nowe zg\u0142oszenie przez formularz kontaktowy.',
            footer:
              'Automatyczne potwierdzenie z miloszczechportfolio.pl',
          }

    await sendEmail(resendApiKey, {
      from: fromEmail,
      to: [message.email],
      subject: confirmation.subject,
      text: [
        confirmation.intro,
        '',
        confirmation.body,
        '',
        confirmation.nextStepTitle,
        confirmation.nextStep,
        '',
        `${confirmation.summaryLabel}: ${message.subject}`,
        '',
        confirmation.noReplyTitle,
        confirmation.noReply,
        '',
        confirmation.footer,
      ].join('\n'),
      html: buildEmailShell({
        preheader: escapeHtml(confirmation.body),
        eyebrow: escapeHtml(confirmation.eyebrow),
        title: escapeHtml(confirmation.title),
        body: `
          <p style="margin:0 0 12px;color:#F8FAFC;font-size:16px;line-height:25px;font-weight:700;">${escapeHtml(
            confirmation.intro,
          )}</p>
          <p style="margin:0 0 20px;color:#CBD5E1;font-size:15px;line-height:24px;">${escapeHtml(
            confirmation.body,
          )}</p>
          <div style="background:#0B1120;border:1px solid #253047;border-radius:10px;padding:16px;margin:0 0 14px;">
            <div style="color:#38BDF8;font-size:13px;line-height:18px;font-weight:750;margin:0 0 6px;">${escapeHtml(
              confirmation.nextStepTitle,
            )}</div>
            <div style="color:#E2E8F0;font-size:14px;line-height:23px;">${escapeHtml(
              confirmation.nextStep,
            )}</div>
          </div>
          <div style="background:#172033;border:1px solid #253047;border-radius:10px;padding:14px 16px;margin:0 0 14px;">
            <div style="color:#94A3B8;font-size:12px;line-height:18px;text-transform:uppercase;letter-spacing:.08em;font-weight:750;">${escapeHtml(
              confirmation.summaryLabel,
            )}</div>
            <div style="color:#F8FAFC;font-size:15px;line-height:23px;font-weight:750;margin-top:4px;">${escapedSubject}</div>
          </div>
          <div style="background:#1A2233;border:1px solid #334155;border-radius:10px;padding:14px 16px;">
            <div style="color:#F8FAFC;font-size:14px;line-height:22px;font-weight:750;margin:0 0 4px;">${escapeHtml(
              confirmation.noReplyTitle,
            )}</div>
            <div style="color:#CBD5E1;font-size:14px;line-height:22px;">${escapeHtml(
              confirmation.noReply,
            )}</div>
          </div>
        `,
        footer: escapeHtml(confirmation.footer),
      }),
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
