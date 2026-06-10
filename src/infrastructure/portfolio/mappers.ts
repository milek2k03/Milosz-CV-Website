import type {
  Project,
  ProjectLink,
  ProjectLinkType,
  ProjectLocalizedContent,
  ProjectLocale,
  ProjectMedia,
  ProjectMediaType,
  ProjectStatus,
  ProjectUpsertInput,
} from '@/domain/portfolio/entities'
import type { Database, Json } from '@/infrastructure/supabase/database.types'

type ProjectRow = Database['public']['Tables']['projects']['Row']
type MediaRow = Database['public']['Tables']['project_media']['Row']
type TranslationRow =
  Database['public']['Tables']['project_translations']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']

const linkTypes: ProjectLinkType[] = [
  'live',
  'demo',
  'repository',
  'case-study',
  'video',
  'other',
]

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isProjectLink = (value: unknown): value is ProjectLink => {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.label === 'string' &&
    typeof value.url === 'string' &&
    typeof value.type === 'string' &&
    linkTypes.includes(value.type as ProjectLinkType)
  )
}

export const parseProjectLinks = (value: Json): ProjectLink[] => {
  if (!Array.isArray(value)) {
    return []
  }

  const links: ProjectLink[] = []

  for (const item of value) {
    if (isProjectLink(item)) {
      links.push(item)
    }
  }

  return links
}

export const mapMediaRow = (row: MediaRow): ProjectMedia => ({
  id: row.id,
  type: row.type as ProjectMediaType,
  url: row.url,
  alt: row.alt,
  posterUrl: row.poster_url ?? undefined,
  posterStoragePath: row.poster_storage_path ?? undefined,
  storagePath: row.storage_path ?? undefined,
  sortOrder: row.sort_order,
})

export const mapProjectRow = (
  row: ProjectRow,
  mediaRows: MediaRow[] = [],
  translationRows: TranslationRow[] = [],
): Project => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  subtitle: row.subtitle,
  summary: row.summary,
  problem: row.problem,
  solution: row.solution,
  technologies: row.technologies,
  scope: row.scope,
  role: row.role,
  duration: row.duration ?? undefined,
  year: row.year,
  area: row.area,
  status: row.status as ProjectStatus,
  featured: row.featured,
  links: parseProjectLinks(row.links),
  media: mediaRows.map(mapMediaRow),
  translations: mapTranslationRows(translationRows),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapTranslationRows = (
  rows: TranslationRow[],
): Partial<Record<ProjectLocale, ProjectLocalizedContent>> => {
  const translations: Partial<Record<ProjectLocale, ProjectLocalizedContent>> =
    {}

  for (const row of rows) {
    translations[row.locale] = {
      title: row.title,
      subtitle: row.subtitle,
      summary: row.summary,
      problem: row.problem,
      solution: row.solution,
      scope: row.scope,
      role: row.role ?? undefined,
      duration: row.duration ?? undefined,
    }
  }

  return translations
}

export const toProjectPayload = (input: ProjectUpsertInput): ProjectInsert => ({
  slug: input.slug,
  title: input.title,
  subtitle: input.subtitle,
  summary: input.summary,
  problem: input.problem,
  solution: input.solution,
  technologies: input.technologies,
  scope: input.scope,
  role: input.role,
  duration: input.duration ?? null,
  year: input.year,
  area: input.area,
  status: input.status,
  featured: input.featured,
  links: input.links as unknown as Json,
})
