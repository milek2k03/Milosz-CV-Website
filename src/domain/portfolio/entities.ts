export type ProjectStatus = 'draft' | 'published'
export type ProjectArea = 'unity' | 'web'
export type ProjectMediaType = 'image' | 'video'
export type ProjectLinkType =
  | 'live'
  | 'demo'
  | 'repository'
  | 'case-study'
  | 'video'
  | 'other'
export type ProjectLocale = 'pl' | 'en'

export interface ProjectLink {
  label: string
  url: string
  type: ProjectLinkType
}

export interface ProjectMedia {
  id: string
  type: ProjectMediaType
  url: string
  alt: string
  posterUrl?: string
  posterStoragePath?: string
  storagePath?: string
  sortOrder: number
}

export interface Project {
  id: string
  slug: string
  title: string
  subtitle: string
  summary: string
  problem: string
  solution: string
  technologies: string[]
  scope: string[]
  role: string
  duration?: string
  year: number
  area: ProjectArea
  status: ProjectStatus
  featured: boolean
  sortOrder: number
  links: ProjectLink[]
  media: ProjectMedia[]
  translations?: Partial<Record<ProjectLocale, ProjectLocalizedContent>>
  createdAt: string
  updatedAt: string
}

export interface ProjectLocalizedContent {
  title: string
  subtitle: string
  summary: string
  problem: string
  solution: string
  scope: string[]
  role?: string
  duration?: string
}

export type ProjectTranslationsInput = Partial<
  Record<ProjectLocale, ProjectLocalizedContent>
>

export interface ProjectUpsertInput {
  id?: string
  slug: string
  title: string
  subtitle: string
  summary: string
  problem: string
  solution: string
  technologies: string[]
  scope: string[]
  role: string
  duration?: string
  year: number
  area: ProjectArea
  status: ProjectStatus
  featured: boolean
  links: ProjectLink[]
  translations?: ProjectTranslationsInput
}

export interface CvDocument {
  id: string
  fileName: string
  url: string
  storagePath: string
  locale: ProjectLocale
  updatedAt: string
}

export interface CompanyLogo {
  name: string
  shortName: string
  imageUrl?: string
  storagePath?: string
}

export interface SiteSectionContent {
  eyebrow: string
  title: string
  description: string
}

export interface SiteProjectSectionContent extends SiteSectionContent {
  unityHeading: string
  webHeading: string
  showMore: string
  showLess: string
}

export interface SiteAreasContent extends SiteSectionContent {
  unityTitle: string
  unityDescription: string
  unityButton: string
  webTitle: string
  webDescription: string
  webButton: string
}

export interface SiteAreaPagesContent {
  unityTitle: string
  unityDescription: string
  webTitle: string
  webDescription: string
  empty: string
}

export interface SiteStackCardContent {
  title: string
  text: string
}

export interface SiteStackContent extends SiteSectionContent {
  cards: SiteStackCardContent[]
}

export interface SiteLocalizedContent {
  seoDescription: string
  footerTagline: string
  heroDescription: string
  currentScope: string
  workflowItems: string[]
  projects: SiteProjectSectionContent
  companies: SiteSectionContent
  areas: SiteAreasContent
  areaPages: SiteAreaPagesContent
  stack: SiteStackContent
  contact: SiteSectionContent
}

export interface SiteContent {
  locales: Record<ProjectLocale, SiteLocalizedContent>
  companyLogos: CompanyLogo[]
  updatedAt?: string
}

export interface PortfolioSettings {
  webPortfolioUrl: string
  updatedAt?: string
}

export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'year'

export interface AnalyticsDataPoint {
  label: string
  views: number
  visitors: number
}

export interface AnalyticsTopPage {
  path: string
  views: number
}

export interface AnalyticsSummary {
  totalViews: number
  totalVisitors: number
  periods: Record<AnalyticsPeriod, AnalyticsDataPoint[]>
  topPages: AnalyticsTopPage[]
}

export interface PageViewInput {
  path: string
  locale: ProjectLocale
  referrer?: string
  sessionId: string
}
