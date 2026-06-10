import type {
  AnalyticsSummary,
  CompanyLogo,
  CvDocument,
  PageViewInput,
  Project,
  ProjectLocale,
  ProjectMedia,
  ProjectMediaType,
  ProjectUpsertInput,
  PortfolioSettings,
  SiteContent,
} from '@/domain/portfolio/entities'

export interface PortfolioRepository {
  trackPageView(input: PageViewInput): Promise<void>
  getAnalyticsSummary(): Promise<AnalyticsSummary>
  listPublishedProjects(): Promise<Project[]>
  listAdminProjects(): Promise<Project[]>
  getProjectBySlug(slug: string): Promise<Project | null>
  upsertProject(input: ProjectUpsertInput): Promise<Project>
  deleteProject(id: string): Promise<void>
  updateProjectOrder(area: Project['area'], orderedProjectIds: string[]): Promise<void>
  updateProjectFeatured(id: string, featured: boolean): Promise<void>
  uploadProjectMedia(
    projectId: string,
    file: File,
    type: ProjectMediaType,
    alt?: string,
    posterFile?: File | null,
  ): Promise<ProjectMedia>
  updateProjectMediaOrder(
    projectId: string,
    orderedMediaIds: string[],
  ): Promise<void>
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
