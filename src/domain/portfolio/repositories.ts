import type {
  CompanyLogo,
  CvDocument,
  Project,
  ProjectLocale,
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
  getCvDocument(locale: ProjectLocale): Promise<CvDocument | null>
  uploadCv(file: File, locale: ProjectLocale): Promise<CvDocument>
  uploadCompanyLogo(
    file: File,
  ): Promise<Pick<CompanyLogo, 'imageUrl' | 'storagePath'>>
  getPortfolioSettings(): Promise<PortfolioSettings>
  updatePortfolioSettings(settings: PortfolioSettings): Promise<PortfolioSettings>
  getSiteContent(): Promise<SiteContent>
  updateSiteContent(content: SiteContent): Promise<SiteContent>
}
