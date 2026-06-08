import type { Session } from '@supabase/supabase-js'

export interface AuthRepository {
  getSession(): Promise<Session | null>
  signIn(email: string, password: string): Promise<void>
  signOut(): Promise<void>
  onSessionChange(callback: (session: Session | null) => void): () => void
}
