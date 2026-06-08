import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  ProjectMedia,
  ProjectMediaType,
  ProjectUpsertInput,
  PortfolioSettings,
  SiteContent,
} from '@/domain/portfolio/entities'
import { getPortfolioRepository } from '@/infrastructure/portfolio/repositoryFactory'

const repository = getPortfolioRepository()

export function useAdminProjects(enabled: boolean) {
  return useQuery({
    queryKey: ['admin', 'projects'],
    queryFn: () => repository.listAdminProjects(),
    enabled,
  })
}

export function useSaveProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ProjectUpsertInput) => repository.upsertProject(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => repository.deleteProject(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUploadProjectMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: {
      projectId: string
      file: File
      type: ProjectMediaType
      alt?: string
    }) =>
      repository.uploadProjectMedia(
        input.projectId,
        input.file,
        input.type,
        input.alt,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useRemoveProjectMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (media: ProjectMedia) => repository.removeProjectMedia(media),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUploadCv() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => repository.uploadCv(file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cv-document'] })
    },
  })
}

export function useUpdatePortfolioSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (settings: PortfolioSettings) =>
      repository.updatePortfolioSettings(settings),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['portfolio-settings'],
      })
    },
  })
}

export function useUpdateSiteContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: SiteContent) => repository.updateSiteContent(content),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['site-content'] })
    },
  })
}
