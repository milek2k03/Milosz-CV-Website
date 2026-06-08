import type { PortfolioRepository } from '@/domain/portfolio/repositories'
import { FallbackPortfolioRepository } from '@/infrastructure/portfolio/FallbackPortfolioRepository'
import { SupabasePortfolioRepository } from '@/infrastructure/portfolio/SupabasePortfolioRepository'
import { supabaseClient } from '@/infrastructure/supabase/client'

let repository: PortfolioRepository | null = null

export const getPortfolioRepository = (): PortfolioRepository => {
  if (!repository) {
    repository = supabaseClient
      ? new SupabasePortfolioRepository(supabaseClient)
      : new FallbackPortfolioRepository()
  }

  return repository
}
