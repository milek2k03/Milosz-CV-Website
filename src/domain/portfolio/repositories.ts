import type {
  CvDocument,
  Project,
  ProjectMedia,
  ProjectMediaType,
  ProjectUpsertInput,
  PortfolioSettings,
  SiteContent,
} from '@/domain/portfolio/entities'

export interface PortfolioRepository {
  listPublishedProjects(): Promise<Project[]>
  listAdminProjects(): Promise<Project[]>
  getProjectBySlug(slug: string): Promise<Project | null>
  upsertProject(input: ProjectUpsertInput): Promise<Project>
  deleteProject(id: string): Promise<void>
  uploadProjectMedia(
    projectId: string,
    file: File,
    type: ProjectMediaType,
    alt?: string,
  ): Promise<ProjectMedia>
  removeProjectMedia(media: ProjectMedia): Promise<void>
  getCvDocument(): Promise<CvDocument | null>
  uploadCv(file: File): Promise<CvDocument>
  getPortfolioSettings(): Promise<PortfolioSettings>
  updatePortfolioSettings(settings: PortfolioSettings): Promise<PortfolioSettings>
  getSiteContent(): Promise<SiteContent>
  updateSiteContent(content: SiteContent): Promise<SiteContent>
}
