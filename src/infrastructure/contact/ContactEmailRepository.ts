import { appEnv } from '@/config/env'
import type { ContactMessageInput } from '@/domain/contact/entities'
import type { ContactRepository } from '@/domain/contact/repositories'
import { supabaseClient } from '@/infrastructure/supabase/client'

const buildMailtoBody = (input: ContactMessageInput) =>
  [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.company ? `Company / project: ${input.company}` : undefined,
    `Source: ${input.sourceUrl}`,
    '',
    input.message,
  ]
    .filter(Boolean)
    .join('\n')

export class ContactEmailRepository implements ContactRepository {
  async sendMessage(input: ContactMessageInput) {
    if (appEnv.contactEndpoint) {
      const response = await fetch(appEnv.contactEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error(`Contact endpoint failed with ${response.status}.`)
      }

      return { mode: 'sent' as const }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.functions.invoke(
        appEnv.contactFunctionName,
        {
          body: input,
        },
      )

      if (error) {
        throw new Error(error.message)
      }

      return { mode: 'sent' as const }
    }

    const mailto = new URL(`mailto:${appEnv.contactEmail ?? 'milosz.czech1803@gmail.com'}`)
    mailto.searchParams.set('subject', `[Miłosz Czech] ${input.subject}`)
    mailto.searchParams.set('body', buildMailtoBody(input))
    window.location.href = mailto.toString()

    return { mode: 'fallback' as const }
  }
}
