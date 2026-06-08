import { useQuery } from '@tanstack/react-query'
import type { ProjectLocale } from '@/domain/portfolio/entities'
import { getPortfolioRepository } from '@/infrastructure/portfolio/repositoryFactory'

const repository = getPortfolioRepository()

export function usePublishedProjects() {
  return useQuery({
    queryKey: ['projects', 'published'],
    queryFn: () => repository.listPublishedProjects(),
  })
}

export function useProjectBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['projects', 'slug', slug],
    queryFn: () => {
      if (!slug) {
        throw new Error('Brak slug projektu.')
      }

      return repository.getProjectBySlug(slug)
    },
    enabled: Boolean(slug),
  })
}

export function useCvDocument(locale: ProjectLocale) {
  return useQuery({
    queryKey: ['cv-document', locale],
    queryFn: () => repository.getCvDocument(locale),
  })
}

export function usePortfolioSettings() {
  return useQuery({
    queryKey: ['portfolio-settings'],
    queryFn: () => repository.getPortfolioSettings(),
  })
}

export function useSiteContent() {
  return useQuery({
    queryKey: ['site-content'],
    queryFn: () => repository.getSiteContent(),
  })
}
