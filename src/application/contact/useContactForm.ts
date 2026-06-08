import { useMemo, useState } from 'react'
import type {
  ContactMessageInput,
  ContactSendResult,
} from '@/domain/contact/entities'
import { getContactRepository } from '@/infrastructure/contact/contactRepositoryFactory'

export function useContactForm() {
  const repository = useMemo(() => getContactRepository(), [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sendMessage = async (
    input: ContactMessageInput,
  ): Promise<ContactSendResult> => {
    setIsSubmitting(true)

    try {
      return await repository.sendMessage(input)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    sendMessage,
  }
}
