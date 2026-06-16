import { useQuery } from '@tanstack/react-query'
import type { ProjectLocale } from '@/domain/portfolio/entities'
import { getPortfolioRepository } from '@/infrastructure/portfolio/repositoryFactory'

const repository = getPortfolioRepository()
const publicContentStaleTime = 5 * 60 * 1000
const publicDocumentStaleTime = 15 * 60 * 1000

export function usePublishedProjects() {
  return useQuery({
    queryKey: ['projects', 'published'],
    queryFn: () => repository.listPublishedProjects(),
    staleTime: publicContentStaleTime,
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
    staleTime: publicContentStaleTime,
  })
}

export function useCvDocument(locale: ProjectLocale) {
  return useQuery({
    queryKey: ['cv-document', locale],
    queryFn: () => repository.getCvDocument(locale),
    staleTime: publicDocumentStaleTime,
  })
}

export function usePortfolioSettings() {
  return useQuery({
    queryKey: ['portfolio-settings'],
    queryFn: () => repository.getPortfolioSettings(),
    staleTime: publicDocumentStaleTime,
  })
}

export function useSiteContent() {
  return useQuery({
    queryKey: ['site-content'],
    queryFn: () => repository.getSiteContent(),
    staleTime: publicContentStaleTime,
  })
}
