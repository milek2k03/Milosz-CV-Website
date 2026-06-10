import { defaultSiteContent } from '@/content/defaultSiteContent'
import { seedProjects } from '@/content/seedProjects'
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
import type { PortfolioRepository } from '@/domain/portfolio/repositories'

const cloneProjects = () => seedProjects.map((project) => ({ ...project }))

const emptyAnalyticsSummary: AnalyticsSummary = {
  totalViews: 0,
  totalVisitors: 0,
  periods: {
    day: [],
    week: [],
    month: [],
    year: [],
  },
  topPages: [],
}

export class FallbackPortfolioRepository implements PortfolioRepository {
  async trackPageView(input: PageViewInput): Promise<void> {
    void input
  }

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return emptyAnalyticsSummary
  }

  async listPublishedProjects(): Promise<Project[]> {
    return cloneProjects().filter((project) => project.status === 'published')
  }

  async listAdminProjects(): Promise<Project[]> {
    throw new Error('Panel admina wymaga konfiguracji Supabase.')
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    return (
      cloneProjects().find(
        (project) => project.slug === slug && project.status === 'published',
      ) ?? null
    )
  }

  async upsertProject(input: ProjectUpsertInput): Promise<Project> {
    void input
    throw new Error('Zapisywanie projektow wymaga konfiguracji Supabase.')
  }

  async deleteProject(id: string): Promise<void> {
    void id
    throw new Error('Usuwanie projektow wymaga konfiguracji Supabase.')
  }

  async updateProjectOrder(
    area: Project['area'],
    orderedProjectIds: string[],
  ): Promise<void> {
    void area
    void orderedProjectIds
    throw new Error('Zmiana kolejnosci projektow wymaga konfiguracji Supabase.')
  }

  async updateProjectFeatured(id: string, featured: boolean): Promise<void> {
    void id
    void featured
    throw new Error('Wyroznianie projektow wymaga konfiguracji Supabase.')
  }

  async uploadProjectMedia(
    projectId: string,
    file: File,
    type: ProjectMediaType,
    alt?: string,
    posterFile?: File | null,
  ): Promise<ProjectMedia> {
    void projectId
    void file
    void type
    void alt
    void posterFile
    throw new Error('Upload mediow wymaga konfiguracji Supabase.')
  }

  async removeProjectMedia(media: ProjectMedia): Promise<void> {
    void media
    throw new Error('Usuwanie mediow wymaga konfiguracji Supabase.')
  }

  async updateProjectMediaOrder(
    projectId: string,
    orderedMediaIds: string[],
  ): Promise<void> {
    void projectId
    void orderedMediaIds
    throw new Error('Zmiana kolejnosci mediow wymaga konfiguracji Supabase.')
  }

  async getCvDocument(locale: ProjectLocale): Promise<CvDocument | null> {
    void locale
    return null
  }

  async uploadCv(file: File, locale: ProjectLocale): Promise<CvDocument> {
    void file
    void locale
    throw new Error('Upload CV wymaga konfiguracji Supabase.')
  }

  async uploadCompanyLogo(
    file: File,
  ): Promise<Pick<CompanyLogo, 'imageUrl' | 'storagePath'>> {
    void file
    throw new Error('Upload logotypow wymaga konfiguracji Supabase.')
  }

  async getPortfolioSettings(): Promise<PortfolioSettings> {
    return {
      webPortfolioUrl: '/websites',
    }
  }

  async updatePortfolioSettings(
    settings: PortfolioSettings,
  ): Promise<PortfolioSettings> {
    void settings
    throw new Error('Edycja ustawien portfolio wymaga konfiguracji Supabase.')
  }

  async getSiteContent(): Promise<SiteContent> {
    return defaultSiteContent
  }

  async updateSiteContent(content: SiteContent): Promise<SiteContent> {
    void content
    throw new Error('Edycja tresci strony wymaga konfiguracji Supabase.')
  }
}
