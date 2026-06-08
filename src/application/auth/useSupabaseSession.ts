import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAuthRepository } from '@/infrastructure/auth/authRepositoryFactory'

type SessionStatus = 'disabled' | 'loading' | 'authenticated' | 'anonymous'

interface UseSupabaseSessionResult {
  session: Session | null
  status: SessionStatus
  signIn(email: string, password: string): Promise<void>
  signOut(): Promise<void>
}

export function useSupabaseSession(): UseSupabaseSessionResult {
  const authRepository = useMemo(() => getAuthRepository(), [])
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<SessionStatus>(
    authRepository ? 'loading' : 'disabled',
  )

  useEffect(() => {
    if (!authRepository) {
      return undefined
    }

    let mounted = true

    authRepository
      .getSession()
      .then((currentSession) => {
        if (!mounted) {
          return
        }

        setSession(currentSession)
        setStatus(currentSession ? 'authenticated' : 'anonymous')
      })
      .catch(() => {
        if (mounted) {
          setStatus('anonymous')
        }
      })

    const unsubscribe = authRepository.onSessionChange((nextSession) => {
      setSession(nextSession)
      setStatus(nextSession ? 'authenticated' : 'anonymous')
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [authRepository])

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!authRepository) {
        throw new Error('Supabase nie jest skonfigurowany.')
      }

      await authRepository.signIn(email, password)
    },
    [authRepository],
  )

  const signOut = useCallback(async () => {
    if (!authRepository) {
      return
    }

    await authRepository.signOut()
  }, [authRepository])

  return { session, status, signIn, signOut }
}
