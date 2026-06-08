import type { ContactRepository } from '@/domain/contact/repositories'
import { ContactEmailRepository } from '@/infrastructure/contact/ContactEmailRepository'

let repository: ContactRepository | null = null

export const getContactRepository = (): ContactRepository => {
  repository ??= new ContactEmailRepository()
  return repository
}
