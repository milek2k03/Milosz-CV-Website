export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type ProjectRow = {
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
  duration: string | null
  year: number
  area: 'unity' | 'web'
  status: 'draft' | 'published'
  featured: boolean
  sort_order: number
  links: Json
  created_at: string
  updated_at: string
}

type ProjectInsert = {
  id?: string
  slug: string
  title: string
  subtitle: string
  summary: string
  problem: string
  solution: string
  technologies?: string[]
  scope?: string[]
  role: string
  duration?: string | null
  year: number
  area?: 'unity' | 'web'
  status?: 'draft' | 'published'
  featured?: boolean
  sort_order?: number
  links?: Json
}

type ProjectMediaRow = {
  id: string
  project_id: string
  type: 'image' | 'video'
  url: string
  alt: string
  poster_url: string | null
  storage_path: string | null
  sort_order: number
  created_at: string
}

type ProjectMediaInsert = {
  id?: string
  project_id: string
  type: 'image' | 'video'
  url: string
  alt: string
  poster_url?: string | null
  storage_path?: string | null
  sort_order?: number
}

type ProjectTranslationRow = {
  id: string
  project_id: string
  locale: 'pl' | 'en'
  title: string
  subtitle: string
  summary: string
  problem: string
  solution: string
  scope: string[]
  role: string | null
  duration: string | null
  created_at: string
  updated_at: string
}

type ProjectTranslationInsert = {
  id?: string
  project_id: string
  locale: 'pl' | 'en'
  title: string
  subtitle: string
  summary: string
  problem: string
  solution: string
  scope?: string[]
  role?: string | null
  duration?: string | null
}

type CvDocumentRow = {
  id: string
  file_name: string
  url: string
  storage_path: string
  locale: 'pl' | 'en'
  updated_at: string
}

type CvDocumentInsert = {
  id?: string
  file_name: string
  url: string
  storage_path: string
  locale?: 'pl' | 'en'
}

type PortfolioSettingsRow = {
  id: boolean
  web_portfolio_url: string
  updated_at: string
}

type PortfolioSettingsInsert = {
  id?: boolean
  web_portfolio_url?: string
}

type SiteContentRow = {
  id: boolean
  content: Json
  updated_at: string
}

type SiteContentInsert = {
  id?: boolean
  content?: Json
}

type ContactMessageRow = {
  id: string
  name: string
  email: string
  company: string | null
  subject: string
  message: string
  locale: 'pl' | 'en'
  source_url: string
  user_agent: string | null
  status: 'unread' | 'read' | 'archived'
  created_at: string
}

type ContactMessageInsert = {
  id?: string
  name: string
  email: string
  company?: string | null
  subject: string
  message: string
  locale?: 'pl' | 'en'
  source_url: string
  user_agent?: string | null
  status?: 'unread' | 'read' | 'archived'
}

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow
        Insert: ProjectInsert
        Update: Partial<ProjectInsert>
        Relationships: []
      }
      project_media: {
        Row: ProjectMediaRow
        Insert: ProjectMediaInsert
        Update: Partial<ProjectMediaInsert>
        Relationships: []
      }
      project_translations: {
        Row: ProjectTranslationRow
        Insert: ProjectTranslationInsert
        Update: Partial<ProjectTranslationInsert>
        Relationships: []
      }
      cv_documents: {
        Row: CvDocumentRow
        Insert: CvDocumentInsert
        Update: Partial<CvDocumentInsert>
        Relationships: []
      }
      portfolio_settings: {
        Row: PortfolioSettingsRow
        Insert: PortfolioSettingsInsert
        Update: Partial<PortfolioSettingsInsert>
        Relationships: []
      }
      site_content: {
        Row: SiteContentRow
        Insert: SiteContentInsert
        Update: Partial<SiteContentInsert>
        Relationships: []
      }
      contact_messages: {
        Row: ContactMessageRow
        Insert: ContactMessageInsert
        Update: Partial<ContactMessageInsert>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
