import { defaultSiteContent } from '@/content/defaultSiteContent'
import { seedProjects } from '@/content/seedProjects'
import type {
  CvDocument,
  Project,
  ProjectMedia,
  ProjectMediaType,
  ProjectUpsertInput,
  PortfolioSettings,
  SiteContent,
} from '@/domain/portfolio/entities'
import type { PortfolioRepository } from '@/domain/portfolio/repositories'

const cloneProjects = () => seedProjects.map((project) => ({ ...project }))

export class FallbackPortfolioRepository implements PortfolioRepository {
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

  async uploadProjectMedia(
    projectId: string,
    file: File,
    type: ProjectMediaType,
    alt?: string,
  ): Promise<ProjectMedia> {
    void projectId
    void file
    void type
    void alt
    throw new Error('Upload mediow wymaga konfiguracji Supabase.')
  }

  async removeProjectMedia(media: ProjectMedia): Promise<void> {
    void media
    throw new Error('Usuwanie mediow wymaga konfiguracji Supabase.')
  }

  async getCvDocument(): Promise<CvDocument | null> {
    return null
  }

  async uploadCv(file: File): Promise<CvDocument> {
    void file
    throw new Error('Upload CV wymaga konfiguracji Supabase.')
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
