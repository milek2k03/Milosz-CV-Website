import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  ProjectMedia,
  ProjectMediaType,
  ProjectArea,
  ProjectLocale,
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

export function useUpdateProjectOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { area: ProjectArea; orderedProjectIds: string[] }) =>
      repository.updateProjectOrder(input.area, input.orderedProjectIds),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateProjectFeatured() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { id: string; featured: boolean }) =>
      repository.updateProjectFeatured(input.id, input.featured),
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
      posterFile?: File | null
    }) =>
      repository.uploadProjectMedia(
        input.projectId,
        input.file,
        input.type,
        input.alt,
        input.posterFile,
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

export function useUpdateProjectMediaOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { projectId: string; orderedMediaIds: string[] }) =>
      repository.updateProjectMediaOrder(
        input.projectId,
        input.orderedMediaIds,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUploadCv() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { file: File; locale: ProjectLocale }) =>
      repository.uploadCv(input.file, input.locale),
    onSuccess: async (document) => {
      await queryClient.invalidateQueries({
        queryKey: ['cv-document', document.locale],
      })
    },
  })
}

export function useUploadCompanyLogo() {
  return useMutation({
    mutationFn: (file: File) => repository.uploadCompanyLogo(file),
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
