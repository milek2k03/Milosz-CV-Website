import type { Session, SupabaseClient } from '@supabase/supabase-js'
import type { AuthRepository } from '@/domain/auth/repositories'
import type { Database } from '@/infrastructure/supabase/database.types'

export class SupabaseAuthRepository implements AuthRepository {
  private readonly client: SupabaseClient<Database>

  constructor(client: SupabaseClient<Database>) {
    this.client = client
  }

  async getSession(): Promise<Session | null> {
    const { data, error } = await this.client.auth.getSession()

    if (error) {
      throw new Error(error.message)
    }

    return data.session
  }

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut()

    if (error) {
      throw new Error(error.message)
    }
  }

  onSessionChange(callback: (session: Session | null) => void): () => void {
    const {
      data: { subscription },
    } = this.client.auth.onAuthStateChange((_event, session) => {
      callback(session)
    })

    return () => subscription.unsubscribe()
  }
}
