import type {
  ContactMessageInput,
  ContactSendResult,
} from '@/domain/contact/entities'

export interface ContactRepository {
  sendMessage(input: ContactMessageInput): Promise<ContactSendResult>
}
