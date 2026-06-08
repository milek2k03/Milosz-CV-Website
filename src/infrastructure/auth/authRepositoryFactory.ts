import type { AuthRepository } from '@/domain/auth/repositories'
import { SupabaseAuthRepository } from '@/infrastructure/auth/SupabaseAuthRepository'
import { supabaseClient } from '@/infrastructure/supabase/client'

let repository: AuthRepository | null = null

export const getAuthRepository = (): AuthRepository | null => {
  if (!supabaseClient) {
    return null
  }

  if (!repository) {
    repository = new SupabaseAuthRepository(supabaseClient)
  }

  return repository
}
