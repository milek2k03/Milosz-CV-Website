import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  CompanyLogo,
  CvDocument,
  Project,
  ProjectLocalizedContent,
  ProjectLocale,
  ProjectMedia,
  ProjectMediaType,
  ProjectTranslationsInput,
  ProjectUpsertInput,
  PortfolioSettings,
  SiteContent,
  SiteLocalizedContent,
} from '@/domain/portfolio/entities'
import { defaultSiteContent } from '@/content/defaultSiteContent'
import type { PortfolioRepository } from '@/domain/portfolio/repositories'
import {
  CV_BUCKET,
  PROJECT_MEDIA_BUCKET,
} from '@/infrastructure/supabase/client'
import type { Database, Json } from '@/infrastructure/supabase/database.types'
import {
  mapMediaRow,
  mapProjectRow,
  toProjectPayload,
} from '@/infrastructure/portfolio/mappers'

type ProjectRow = Database['public']['Tables']['projects']['Row']
type MediaRow = Database['public']['Tables']['project_media']['Row']
type TranslationRow =
  Database['public']['Tables']['project_translations']['Row']
type DeepPartial<T> = {
  [Key in keyof T]?: T[Key] extends unknown[]
    ? T[Key]
    : T[Key] extends object
      ? DeepPartial<T[Key]>
      : T[Key]
}

const sanitizeFileName = (fileName: string) =>
  fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')

const getExtension = (fileName: string) => {
  const extension = fileName.split('.').pop()
  return extension && extension.length > 0 ? extension : 'bin'
}

const mergeLocalizedContent = (
  fallback: SiteLocalizedContent,
  content: DeepPartial<SiteLocalizedContent> | undefined,
): SiteLocalizedContent => ({
  ...fallback,
  ...content,
  workflowItems: content?.workflowItems ?? fallback.workflowItems,
  projects: {
    ...fallback.projects,
    ...content?.projects,
  },
  companies: {
    ...fallback.companies,
    ...content?.companies,
  },
  areas: {
    ...fallback.areas,
    ...content?.areas,
  },
  areaPages: {
    ...fallback.areaPages,
    ...content?.areaPages,
  },
  stack: {
    ...fallback.stack,
    ...content?.stack,
    cards: content?.stack?.cards ?? fallback.stack.cards,
  },
  contact: {
    ...fallback.contact,
    ...content?.contact,
  },
})

const mergeSiteContent = (
  content: Json | null | undefined,
  updatedAt?: string,
): SiteContent => {
  const partial =
    content && typeof content === 'object' && !Array.isArray(content)
      ? (content as DeepPartial<SiteContent>)
      : undefined

  return {
    locales: {
      pl: mergeLocalizedContent(
        defaultSiteContent.locales.pl,
        partial?.locales?.pl,
      ),
      en: mergeLocalizedContent(
        defaultSiteContent.locales.en,
        partial?.locales?.en,
      ),
    },
    companyLogos:
      partial?.companyLogos && partial.companyLogos.length > 0
        ? partial.companyLogos
        : defaultSiteContent.companyLogos,
    updatedAt,
  }
}

export class SupabasePortfolioRepository implements PortfolioRepository {
  private readonly client: SupabaseClient<Database>

  constructor(client: SupabaseClient<Database>) {
    this.client = client
  }

  async listPublishedProjects(): Promise<Project[]> {
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .order('year', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return this.withMedia(data ?? [])
  }

  async listAdminProjects(): Promise<Project[]> {
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('updated_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return this.withMedia(data ?? [])
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    if (!data) {
      return null
    }

    const media = await this.getMediaForProjects([data.id])
    const translations = await this.getTranslationsForProjects([data.id])
    return mapProjectRow(data, media, translations)
  }

  async upsertProject(input: ProjectUpsertInput): Promise<Project> {
    const payload = toProjectPayload(input)
    const request = input.id
      ? this.client
          .from('projects')
          .update(payload)
          .eq('id', input.id)
          .select()
          .single()
      : this.client.from('projects').insert(payload).select().single()

    const { data, error } = await request

    if (error) {
      throw new Error(error.message)
    }

    await this.upsertProjectTranslations(data.id, input.translations)

    const media = await this.getMediaForProjects([data.id])
    const translations = await this.getTranslationsForProjects([data.id])
    return mapProjectRow(data, media, translations)
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await this.client.from('projects').delete().eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  }

  async uploadProjectMedia(
    projectId: string,
    file: File,
    type: ProjectMediaType,
    alt?: string,
  ): Promise<ProjectMedia> {
    const storagePath = `${projectId}/${crypto.randomUUID()}.${getExtension(file.name)}`
    const { error: uploadError } = await this.client.storage
      .from(PROJECT_MEDIA_BUCKET)
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    const { data: publicUrlData } = this.client.storage
      .from(PROJECT_MEDIA_BUCKET)
      .getPublicUrl(storagePath)

    const { data, error } = await this.client
      .from('project_media')
      .insert({
        project_id: projectId,
        type,
        url: publicUrlData.publicUrl,
        alt: alt?.trim() || sanitizeFileName(file.name),
        storage_path: storagePath,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return mapMediaRow(data)
  }

  async removeProjectMedia(media: ProjectMedia): Promise<void> {
    if (media.storagePath) {
      const { error: storageError } = await this.client.storage
        .from(PROJECT_MEDIA_BUCKET)
        .remove([media.storagePath])

      if (storageError) {
        throw new Error(storageError.message)
      }
    }

    const { error } = await this.client
      .from('project_media')
      .delete()
      .eq('id', media.id)

    if (error) {
      throw new Error(error.message)
    }
  }

  async getCvDocument(locale: ProjectLocale): Promise<CvDocument | null> {
    const { data, error } = await this.client
      .from('cv_documents')
      .select('*')
      .eq('locale', locale)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    return data
      ? {
          id: data.id,
          fileName: data.file_name,
          url: data.url,
          storagePath: data.storage_path,
          locale: data.locale,
          updatedAt: data.updated_at,
        }
      : null
  }

  async uploadCv(file: File, locale: ProjectLocale): Promise<CvDocument> {
    const storagePath = `cv/${locale}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`
    const { error: uploadError } = await this.client.storage
      .from(CV_BUCKET)
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    const { data: publicUrlData } = this.client.storage
      .from(CV_BUCKET)
      .getPublicUrl(storagePath)

    const { data, error } = await this.client
      .from('cv_documents')
      .upsert(
        {
          locale,
          file_name: sanitizeFileName(file.name),
          url: publicUrlData.publicUrl,
          storage_path: storagePath,
        },
        {
          onConflict: 'locale',
        },
      )
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return {
      id: data.id,
      fileName: data.file_name,
      url: data.url,
      storagePath: data.storage_path,
      locale: data.locale,
      updatedAt: data.updated_at,
    }
  }

  async uploadCompanyLogo(
    file: File,
  ): Promise<Pick<CompanyLogo, 'imageUrl' | 'storagePath'>> {
    if (!file.type.startsWith('image/')) {
      throw new Error('Logo firmy musi byc obrazem.')
    }

    const storagePath = `company-logos/${crypto.randomUUID()}.${getExtension(file.name)}`
    const { error: uploadError } = await this.client.storage
      .from(PROJECT_MEDIA_BUCKET)
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    const { data: publicUrlData } = this.client.storage
      .from(PROJECT_MEDIA_BUCKET)
      .getPublicUrl(storagePath)

    return {
      imageUrl: publicUrlData.publicUrl,
      storagePath,
    }
  }

  async getPortfolioSettings(): Promise<PortfolioSettings> {
    const { data, error } = await this.client
      .from('portfolio_settings')
      .select('*')
      .eq('id', true)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    return {
      webPortfolioUrl: data?.web_portfolio_url ?? '/websites',
      updatedAt: data?.updated_at,
    }
  }

  async updatePortfolioSettings(
    settings: PortfolioSettings,
  ): Promise<PortfolioSettings> {
    const { data, error } = await this.client
      .from('portfolio_settings')
      .upsert({
        id: true,
        web_portfolio_url: settings.webPortfolioUrl,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return {
      webPortfolioUrl: data.web_portfolio_url,
      updatedAt: data.updated_at,
    }
  }

  async getSiteContent(): Promise<SiteContent> {
    const { data, error } = await this.client
      .from('site_content')
      .select('*')
      .eq('id', true)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    return mergeSiteContent(data?.content, data?.updated_at)
  }

  async updateSiteContent(content: SiteContent): Promise<SiteContent> {
    const { data, error } = await this.client
      .from('site_content')
      .upsert({
        id: true,
        content: content as unknown as Json,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return mergeSiteContent(data.content, data.updated_at)
  }

  private async withMedia(projectRows: ProjectRow[]): Promise<Project[]> {
    const projectIds = projectRows.map((project) => project.id)
    const media = await this.getMediaForProjects(projectIds)
    const translations = await this.getTranslationsForProjects(projectIds)

    return projectRows.map((project) =>
      mapProjectRow(
        project,
        media.filter((item) => item.project_id === project.id),
        translations.filter((item) => item.project_id === project.id),
      ),
    )
  }

  private async getMediaForProjects(projectIds: string[]): Promise<MediaRow[]> {
    if (projectIds.length === 0) {
      return []
    }

    const { data, error } = await this.client
      .from('project_media')
      .select('*')
      .in('project_id', projectIds)
      .order('sort_order', { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    return data ?? []
  }

  private async getTranslationsForProjects(
    projectIds: string[],
  ): Promise<TranslationRow[]> {
    if (projectIds.length === 0) {
      return []
    }

    const { data, error } = await this.client
      .from('project_translations')
      .select('*')
      .in('project_id', projectIds)

    if (error) {
      throw new Error(error.message)
    }

    return data ?? []
  }

  private async upsertProjectTranslations(
    projectId: string,
    translations: ProjectTranslationsInput | undefined,
  ): Promise<void> {
    if (!translations) {
      return
    }

    const locales = Object.keys(translations) as ProjectLocale[]

    for (const locale of locales) {
      const translation = translations[locale]

      if (!translation || this.isEmptyTranslation(translation)) {
        const { error } = await this.client
          .from('project_translations')
          .delete()
          .eq('project_id', projectId)
          .eq('locale', locale)

        if (error) {
          throw new Error(error.message)
        }

        continue
      }

      const { error } = await this.client.from('project_translations').upsert(
        {
          project_id: projectId,
          locale,
          title: translation.title,
          subtitle: translation.subtitle,
          summary: translation.summary,
          problem: translation.problem,
          solution: translation.solution,
          scope: translation.scope,
          role: translation.role ?? null,
          duration: translation.duration ?? null,
        },
        {
          onConflict: 'project_id,locale',
        },
      )

      if (error) {
        throw new Error(error.message)
      }
    }
  }

  private isEmptyTranslation(translation: ProjectLocalizedContent): boolean {
    return [
      translation.title,
      translation.subtitle,
      translation.summary,
      translation.problem,
      translation.solution,
      translation.role,
      translation.duration,
      ...translation.scope,
    ].every((value) => !value || value.trim().length === 0)
  }
}
