import {
  BookOpen,
  FileText,
  FolderKanban,
  Home,
  ImageIcon,
  ImagePlus,
  LogOut,
  Mail,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Trash2,
  Upload,
  UserRound,
} from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import { z } from 'zod'
import { useSupabaseSession } from '@/application/auth/useSupabaseSession'
import {
  useAdminProjects,
  useDeleteProject,
  useRemoveProjectMedia,
  useSaveProject,
  useUpdatePortfolioSettings,
  useUpdateSiteContent,
  useUploadCv,
  useUploadCompanyLogo,
  useUploadProjectMedia,
} from '@/application/admin/useAdminProjects'
import brandLogoUrl from '@/assets/brand/milosz-logo.png'
import { defaultSiteContent } from '@/content/defaultSiteContent'
import { hasSupabaseConfig } from '@/config/env'
import type {
  CompanyLogo,
  Project,
  ProjectArea,
  ProjectLocalizedContent,
  ProjectLink,
  ProjectLinkType,
  ProjectLocale,
  ProjectStatus,
  ProjectUpsertInput,
  SiteAreaPagesContent,
  SiteAreasContent,
  SiteContent,
  SiteLocalizedContent,
  SiteProjectSectionContent,
  SiteSectionContent,
  SiteStackCardContent,
} from '@/domain/portfolio/entities'
import { Button } from '@/presentation/components/Button'
import {
  useCvDocument,
  usePortfolioSettings,
  useSiteContent,
} from '@/application/portfolio/usePortfolio'
import { siteProfile } from '@/config/profile'
import { Container } from '@/presentation/layout/Container'
import { Seo } from '@/shared/seo/Seo'
import { optimizeImageFile } from '@/shared/media/optimizeImageFile'
import { cn } from '@/shared/utils/cn'

const linkTypes: ProjectLinkType[] = [
  'live',
  'demo',
  'repository',
  'case-study',
  'video',
  'other',
]

type AdminSection = 'guide' | 'content' | 'projects' | 'media' | 'settings'

const adminNavItems = [
  {
    id: 'guide',
    label: 'Instrukcja',
    description: 'Jak pracować z panelem',
    icon: BookOpen,
  },
  {
    id: 'content',
    label: 'Treści',
    description: 'Teksty PL/EN i logotypy',
    icon: FileText,
  },
  {
    id: 'projects',
    label: 'Projekty',
    description: 'Case studies i tłumaczenia',
    icon: FolderKanban,
  },
  {
    id: 'media',
    label: 'Media i CV',
    description: 'Upload plików do Storage',
    icon: ImageIcon,
  },
  {
    id: 'settings',
    label: 'Ustawienia',
    description: 'Linki i konfiguracja',
    icon: Settings,
  },
] as const

const projectStatusSchema = z.union([
  z.literal('draft'),
  z.literal('published'),
])

const projectAreaSchema = z.union([z.literal('unity'), z.literal('web')])

const projectLinkSchema = z.object({
  label: z.string().min(1, 'podaj etykietę linku'),
  url: z.string().min(1, 'podaj adres linku'),
  type: z.union([
    z.literal('live'),
    z.literal('demo'),
    z.literal('repository'),
    z.literal('case-study'),
    z.literal('video'),
    z.literal('other'),
  ]),
})

const projectTranslationSchema = z.object({
  title: z.string().min(2, 'minimum 2 znaki'),
  subtitle: z.string().min(2, 'minimum 2 znaki'),
  summary: z.string().min(20, 'minimum 20 znaków'),
  problem: z.string().min(20, 'minimum 20 znaków'),
  solution: z.string().min(20, 'minimum 20 znaków'),
  scope: z.array(z.string().min(1)).min(1, 'dodaj przynajmniej jeden punkt'),
  role: z.string().optional(),
  duration: z.string().optional(),
})

const projectFormSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .min(2, 'minimum 2 znaki')
    .regex(/^[a-z0-9-]+$/, 'użyj tylko małych liter, cyfr i myślników'),
  title: z.string().min(2, 'minimum 2 znaki'),
  subtitle: z.string().min(2, 'minimum 2 znaki'),
  summary: z.string().min(20, 'minimum 20 znaków'),
  problem: z.string().min(20, 'minimum 20 znaków'),
  solution: z.string().min(20, 'minimum 20 znaków'),
  technologies: z.array(z.string().min(1)).min(1, 'dodaj przynajmniej jedną technologię'),
  scope: z.array(z.string().min(1)).min(1, 'dodaj przynajmniej jeden punkt zakresu'),
  role: z.string().min(2, 'minimum 2 znaki'),
  duration: z.string().optional(),
  year: z.number().int().min(2000, 'rok nie może być wcześniejszy niż 2000').max(2100, 'rok nie może być późniejszy niż 2100'),
  area: projectAreaSchema,
  status: projectStatusSchema,
  featured: z.boolean(),
  links: z.array(projectLinkSchema),
})

const siteSectionSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(10),
})

const siteProjectSectionSchema = siteSectionSchema.extend({
  unityHeading: z.string().min(1),
  webHeading: z.string().min(1),
  showMore: z.string().min(1),
  showLess: z.string().min(1),
})

const siteAreasSchema = siteSectionSchema.extend({
  unityTitle: z.string().min(1),
  unityDescription: z.string().min(10),
  unityButton: z.string().min(1),
  webTitle: z.string().min(1),
  webDescription: z.string().min(10),
  webButton: z.string().min(1),
})

const siteAreaPagesSchema = z.object({
  unityTitle: z.string().min(1),
  unityDescription: z.string().min(10),
  webTitle: z.string().min(1),
  webDescription: z.string().min(10),
  empty: z.string().min(1),
})

const siteStackCardSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(10),
})

const siteStackSchema = siteSectionSchema.extend({
  cards: z.array(siteStackCardSchema).min(1),
})

const siteLocalizedContentSchema = z.object({
  seoDescription: z.string().min(20),
  footerTagline: z.string().min(2),
  heroDescription: z.string().min(20),
  currentScope: z.string().min(2),
  workflowItems: z.array(z.string().min(5)).min(1),
  projects: siteProjectSectionSchema,
  companies: siteSectionSchema,
  areas: siteAreasSchema,
  areaPages: siteAreaPagesSchema,
  stack: siteStackSchema,
  contact: siteSectionSchema,
})

const siteContentSchema = z.object({
  locales: z.object({
    pl: siteLocalizedContentSchema,
    en: siteLocalizedContentSchema,
  }),
  companyLogos: z
    .array(
      z.object({
        name: z.string().min(1),
        shortName: z.string().min(1),
        imageUrl: z.string().optional(),
        storagePath: z.string().optional(),
      }),
    )
    .min(1),
})

interface ProjectFormState {
  id?: string
  slug: string
  title: string
  subtitle: string
  summary: string
  problem: string
  solution: string
  technologiesText: string
  scopeText: string
  role: string
  duration: string
  year: string
  area: ProjectArea
  status: ProjectStatus
  featured: boolean
  linksText: string
  enTitle: string
  enSubtitle: string
  enSummary: string
  enProblem: string
  enSolution: string
  enScopeText: string
  enRole: string
  enDuration: string
  mediaAlt: string
}

const emptyFormState: ProjectFormState = {
  slug: '',
  title: '',
  subtitle: '',
  summary: '',
  problem: '',
  solution: '',
  technologiesText: 'Unity, C#, TypeScript',
  scopeText: '',
  role: 'Unity Developer',
  duration: '',
  year: String(new Date().getFullYear()),
  area: 'unity',
  status: 'draft',
  featured: true,
  linksText: '',
  enTitle: '',
  enSubtitle: '',
  enSummary: '',
  enProblem: '',
  enSolution: '',
  enScopeText: '',
  enRole: '',
  enDuration: '',
  mediaAlt: '',
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Wystąpił nieznany błąd.'

const projectFieldLabels: Record<string, string> = {
  links: 'Linki',
  problem: 'Problem',
  role: 'Rola',
  scope: 'Czym sie zajmowalem',
  slug: 'Slug',
  solution: 'Najważniejsze osiągnięcia',
  subtitle: 'Podtytuł',
  summary: 'Krótki opis',
  technologies: 'Technologie',
  title: 'Tytuł',
  year: 'Rok',
}

const translationFieldLabels: Record<string, string> = {
  scope: 'What I worked on EN',
  solution: 'Key achievements EN',
  subtitle: 'Podtytuł EN',
  summary: 'Krótki opis EN',
  title: 'Tytuł EN',
}

const formatValidationIssue = (
  issue: { message: string; path: PropertyKey[] },
  labels: Record<string, string>,
) => {
  const field = String(issue.path[0] ?? '')
  const label = labels[field]

  return label ? `${label}: ${issue.message}` : issue.message
}

const splitCommaList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const splitLineList = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

const isProjectLinkType = (value: string): value is ProjectLinkType =>
  linkTypes.includes(value as ProjectLinkType)

const isUrl = (value: string) => /^https?:\/\//i.test(value)

const getLinkLabelFromUrl = (url: string) => {
  if (/store\.steampowered\.com/i.test(url)) {
    return 'Steam'
  }

  if (/github\.com/i.test(url)) {
    return 'GitHub'
  }

  if (/youtu\.be|youtube\.com/i.test(url)) {
    return 'Video'
  }

  return 'Link'
}

const parseLinks = (value: string): ProjectLink[] =>
  splitLineList(value).map((line) => {
    const parts = line
      .split('|')
      .map((part) => part.trim())
      .filter(Boolean)
    const [first = '', second = '', third = 'other'] = parts
    const hasOnlyUrl = parts.length === 1 && isUrl(first)
    const label = hasOnlyUrl ? getLinkLabelFromUrl(first) : first
    const url = hasOnlyUrl ? first : second
    const type = hasOnlyUrl ? 'live' : third

    return {
      label,
      url,
      type: isProjectLinkType(type) ? type : 'other',
    }
  })

const linksToText = (links: ProjectLink[]) =>
  links.map((link) => `${link.label} | ${link.url} | ${link.type}`).join('\n')

const stackCardsToText = (cards: SiteStackCardContent[]) =>
  cards.map((card) => `${card.title} | ${card.text}`).join('\n')

const parseStackCards = (value: string): SiteStackCardContent[] =>
  splitLineList(value).map((line) => {
    const [title = '', text = ''] = line.split('|').map((part) => part.trim())

    return { title, text }
  })

const createCompanyLogo = (): CompanyLogo => ({
  name: 'Nowa firma',
  shortName: 'Firma',
})

const cloneSiteContent = (content: SiteContent): SiteContent => ({
  locales: {
    pl: {
      ...content.locales.pl,
      workflowItems: [...content.locales.pl.workflowItems],
      projects: { ...content.locales.pl.projects },
      companies: { ...content.locales.pl.companies },
      areas: { ...content.locales.pl.areas },
      areaPages: { ...content.locales.pl.areaPages },
      stack: {
        ...content.locales.pl.stack,
        cards: content.locales.pl.stack.cards.map((card) => ({ ...card })),
      },
      contact: { ...content.locales.pl.contact },
    },
    en: {
      ...content.locales.en,
      workflowItems: [...content.locales.en.workflowItems],
      projects: { ...content.locales.en.projects },
      companies: { ...content.locales.en.companies },
      areas: { ...content.locales.en.areas },
      areaPages: { ...content.locales.en.areaPages },
      stack: {
        ...content.locales.en.stack,
        cards: content.locales.en.stack.cards.map((card) => ({ ...card })),
      },
      contact: { ...content.locales.en.contact },
    },
  },
  companyLogos: content.companyLogos.map((logo) => ({ ...logo })),
  updatedAt: content.updatedAt,
})

const hasTranslationDraft = (state: ProjectFormState) =>
  [
    state.enTitle,
    state.enSubtitle,
    state.enSummary,
    state.enProblem,
    state.enSolution,
    state.enScopeText,
    state.enRole,
    state.enDuration,
  ].some((value) => value.trim().length > 0)

const getFallbackProjectText = (...values: string[]) =>
  values.map((value) => value.trim()).find(Boolean) ?? ''

const createSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formStateFromProject = (project: Project | null): ProjectFormState => {
  if (!project) {
    return emptyFormState
  }
  const english = project.translations?.en

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    subtitle: project.subtitle,
    summary: project.summary,
    problem: project.problem,
    solution: project.solution,
    technologiesText: project.technologies.join(', '),
    scopeText: project.scope.join('\n'),
    role: project.role,
    duration: project.duration ?? '',
    year: String(project.year),
    area: project.area,
    status: project.status,
    featured: project.featured,
    linksText: linksToText(project.links),
    enTitle: english?.title ?? '',
    enSubtitle: english?.subtitle ?? '',
    enSummary: english?.summary ?? '',
    enProblem: english?.problem ?? '',
    enSolution: english?.solution ?? '',
    enScopeText: english?.scope.join('\n') ?? '',
    enRole: english?.role ?? '',
    enDuration: english?.duration ?? '',
    mediaAlt: '',
  }
}

const formValuesFromState = (state: ProjectFormState): ProjectUpsertInput => {
  const parsed = projectFormSchema.safeParse({
    id: state.id,
    slug: state.slug,
    title: state.title,
    subtitle: state.subtitle,
    summary: state.summary,
    problem: getFallbackProjectText(state.problem, state.summary),
    solution: state.solution,
    technologies: splitCommaList(state.technologiesText),
    scope: splitLineList(state.scopeText),
    role: state.role,
    duration: state.duration.trim() || undefined,
    year: Number(state.year),
    area: state.area,
    status: state.status,
    featured: state.featured,
    links: parseLinks(state.linksText),
  })

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    throw new Error(
      issue
        ? formatValidationIssue(issue, projectFieldLabels)
        : 'Formularz jest niepoprawny.',
    )
  }

  const input: ProjectUpsertInput = parsed.data

  if (hasTranslationDraft(state)) {
    const translation = projectTranslationSchema.safeParse({
      title: state.enTitle,
      subtitle: state.enSubtitle,
      summary: state.enSummary,
      problem: getFallbackProjectText(state.enProblem, state.enSummary),
      solution: state.enSolution,
      scope: splitLineList(state.enScopeText),
      role: state.enRole.trim() || undefined,
      duration: state.enDuration.trim() || undefined,
    })

    if (!translation.success) {
      const issue = translation.error.issues[0]
      throw new Error(
        issue
          ? formatValidationIssue(issue, translationFieldLabels)
          : 'Tłumaczenie EN jest niepoprawne.',
      )
    }

    input.translations = {
      en: translation.data as ProjectLocalizedContent,
    }
  } else {
    input.translations = {
      en: {
        title: '',
        subtitle: '',
        summary: '',
        problem: '',
        solution: '',
        scope: [],
      },
    }
  }

  return input
}

export function AdminPage() {
  const { session, signIn, signOut, status } = useSupabaseSession()

  if (!hasSupabaseConfig || status === 'disabled') {
    return <AdminUnavailable />
  }

  if (status === 'loading') {
    return <AdminFrame>Ładowanie sesji...</AdminFrame>
  }

  if (!session) {
    return <AdminLogin onSignIn={signIn} />
  }

  return (
    <AdminWorkspace
      onSignOut={signOut}
      userEmail={session.user.email ?? 'admin'}
    />
  )
}

function AdminFrame({ children }: { children: ReactNode }) {
  return (
    <div className="admin-page min-h-svh bg-[color:var(--background)] text-[color:var(--text)]">
      <Seo
        canonicalPath="/admin"
        description="Panel administracyjny portfolio."
        title="Admin - Portfolio"
      />
      <Container className="max-w-[1560px] py-6 sm:px-8">
        {children}
      </Container>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#111827',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '8px',
            color: '#F8FAFC',
          },
        }}
      />
    </div>
  )
}

function AdminHomeLink({
  className,
  label = 'Wróć do strony',
  variant = 'text',
}: {
  className?: string
  label?: string
  variant?: 'button' | 'text'
}) {
  return (
    <Link
      className={cn(
        'focus-ring inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors',
        variant === 'button'
          ? 'min-h-10 justify-center border border-[color:var(--border-strong)] bg-[color:var(--surface)] px-4 text-[color:var(--text)] hover:border-cyan-300/45'
          : 'text-[color:var(--muted)] hover:text-white',
        className,
      )}
      to="/"
    >
      <Home className="size-4" />
      {label}
    </Link>
  )
}

function AdminUnavailable() {
  return (
    <AdminFrame>
      <div className="mx-auto max-w-2xl rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
        <AdminHomeLink className="mb-5" />
        <h1 className="text-2xl font-semibold">Supabase nie jest skonfigurowany</h1>
        <p className="mt-4 leading-7 text-[color:var(--muted)]">
          Dodaj zmienne środowiskowe VITE_SUPABASE_URL i
          VITE_SUPABASE_ANON_KEY, a następnie uruchom aplikację ponownie.
          Publiczna strona korzysta teraz z lokalnych danych demo.
        </p>
      </div>
    </AdminFrame>
  )
}

function AdminLogin({
  onSignIn,
}: {
  onSignIn(email: string, password: string): Promise<void>
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      await onSignIn(email, password)
      toast.success('Zalogowano.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminFrame>
      <form
        className="mx-auto grid max-w-md gap-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6"
        onSubmit={handleSubmit}
      >
        <div>
          <p className="text-xs font-semibold uppercase text-[color:var(--primary)]">
            /admin
          </p>
          <h1 className="mt-3 text-2xl font-semibold">Logowanie</h1>
        </div>
        <AdminHomeLink />
        <label className="grid gap-2 text-sm">
          Email
          <input
            autoComplete="email"
            className="form-field"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>
        <label className="grid gap-2 text-sm">
          Hasło
          <input
            autoComplete="current-password"
            className="form-field"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        <Button disabled={isSubmitting} type="submit" variant="primary">
          {isSubmitting ? 'Logowanie...' : 'Zaloguj'}
        </Button>
      </form>
    </AdminFrame>
  )
}

function AdminWorkspace({
  onSignOut,
  userEmail,
}: {
  onSignOut(): Promise<void>
  userEmail: string
}) {
  const projectsQuery = useAdminProjects(true)
  const deleteProject = useDeleteProject()
  const [activeSection, setActiveSection] = useState<AdminSection>('content')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const projects = useMemo(
    () => projectsQuery.data ?? [],
    [projectsQuery.data],
  )
  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedId) ?? null,
    [projects, selectedId],
  )

  const handleDelete = async () => {
    if (!selectedProject) {
      return
    }

    const confirmed = window.confirm(`Usunąć projekt "${selectedProject.title}"?`)

    if (!confirmed) {
      return
    }

    try {
      await deleteProject.mutateAsync(selectedProject.id)
      setSelectedId(null)
      toast.success('Projekt usunięty.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const activeNavItem =
    adminNavItems.find((item) => item.id === activeSection) ?? adminNavItems[0]

  return (
    <AdminFrame>
      <AdminTopBar onSignOut={onSignOut} userEmail={userEmail} />
      <AdminSaveStrip activeLabel={activeNavItem.label} />

      <div className="admin-layout grid gap-6">
        <AdminSidebar
          activeSection={activeSection}
          onChange={setActiveSection}
        />

        <main className="min-w-0 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)] sm:p-6">
          {activeSection === 'guide' ? <AdminGuidePanel /> : null}
          {activeSection === 'content' ? <SiteContentManager /> : null}
          {activeSection === 'projects' ? (
            <ProjectsManager
              error={projectsQuery.error}
              onDelete={handleDelete}
              onNewProject={() => setSelectedId(null)}
              onSelectProject={setSelectedId}
              onSaved={(projectId) => setSelectedId(projectId)}
              projects={projects}
              selectedId={selectedId}
              selectedProject={selectedProject}
            />
          ) : null}
          {activeSection === 'media' ? (
            <MediaManager
              onOpenProjects={() => setActiveSection('projects')}
              projectsCount={projects.length}
            />
          ) : null}
          {activeSection === 'settings' ? <PortfolioSettingsManager /> : null}
        </main>
      </div>
    </AdminFrame>
  )
}

function AdminTopBar({
  onSignOut,
  userEmail,
}: {
  onSignOut(): Promise<void>
  userEmail: string
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <Link
        className="focus-ring inline-flex h-20 w-64 max-w-full items-center justify-center rounded-xl border border-[color:var(--border-strong)] bg-[rgba(26,34,51,0.92)] px-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        to="/"
      >
        <img
          alt={siteProfile.fullName}
          className="h-14 w-auto object-contain"
          decoding="async"
          height="250"
          src={brandLogoUrl}
          width="1040"
        />
      </Link>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[color:var(--border)] bg-[rgba(17,24,39,0.72)] p-2">
        <div className="flex min-h-10 items-center gap-2 rounded-md bg-[rgba(11,17,32,0.64)] px-3 text-sm text-slate-200">
          <UserRound className="size-4 text-[color:var(--muted)]" />
          {userEmail}
        </div>
        <div className="hidden min-h-10 items-center px-3 text-sm font-medium md:flex">
          {siteProfile.fullName}
        </div>
        <Button
          className="border-transparent bg-transparent text-white hover:border-[color:var(--border)] hover:bg-[rgba(11,17,32,0.62)]"
          icon={<LogOut className="size-4" />}
          onClick={onSignOut}
          type="button"
        >
          Wyloguj
        </Button>
      </div>
    </header>
  )
}

function AdminSaveStrip({ activeLabel }: { activeLabel: string }) {
  const triggerActiveSave = () => {
    const saveButton = document.querySelector<HTMLButtonElement>(
      '[data-admin-save="true"]:not(:disabled)',
    )

    if (!saveButton) {
      toast('Brak aktywnego zapisu w tej sekcji.')
      return
    }

    saveButton.click()
  }

  const triggerActiveReset = () => {
    const resetButton = document.querySelector<HTMLButtonElement>(
      '[data-admin-reset="true"]:not(:disabled)',
    )

    if (!resetButton) {
      toast('Ta sekcja nie ma szybkiego resetu.')
      return
    }

    resetButton.click()
  }

  return (
    <section className="mb-10 flex flex-col gap-4 rounded-lg border border-[color:var(--border-strong)] bg-[rgba(26,34,51,0.58)] p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-base font-semibold">Zapis zmian</h1>
        <p className="mt-2 text-sm text-slate-300">
          Aktywna sekcja: {activeLabel}. Każdy moduł zapisuje własne dane.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#d8b982]/70 bg-[#d8b982] px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#e5c890]"
          onClick={triggerActiveSave}
          type="button"
        >
          <Save className="size-4" />
          Zapisz zmiany
        </button>
        <button
          className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-transparent px-4 text-sm font-semibold text-white transition-colors hover:border-[color:var(--border)] hover:bg-[rgba(11,17,32,0.42)]"
          onClick={triggerActiveReset}
          type="button"
        >
          <RotateCcw className="size-4" />
          Przywróć domyślne
        </button>
      </div>
    </section>
  )
}

function AdminSidebar({
  activeSection,
  onChange,
}: {
  activeSection: AdminSection
  onChange(section: AdminSection): void
}) {
  return (
    <aside className="rounded-lg border border-[color:var(--border)] bg-[rgba(26,34,51,0.86)] p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Panel administratora</h2>
        <p className="mt-3 leading-7 text-slate-300">
          Zarządzanie treścią, projektami, mediami i konfiguracją portfolio.
        </p>
      </div>

      <nav className="grid gap-1">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              className={cn(
                'focus-ring flex items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#d8b982] text-slate-950'
                  : 'text-slate-200 hover:bg-[rgba(11,17,32,0.45)] hover:text-white',
              )}
              key={item.id}
              onClick={() => onChange(item.id)}
              type="button"
            >
              <Icon className="size-4 shrink-0" />
              <span>
                <span className="block">{item.label}</span>
                <span
                  className={cn(
                    'mt-0.5 block text-xs font-normal',
                    isActive ? 'text-slate-800' : 'text-[color:var(--muted)]',
                  )}
                >
                  {item.description}
                </span>
              </span>
            </button>
          )
        })}
      </nav>

      <div className="mt-6 border-t border-[color:var(--border)] pt-4">
        <AdminHomeLink label="Wróć do strony" />
      </div>
    </aside>
  )
}

function AdminGuidePanel() {
  return (
    <section id="admin-active-section" className="grid gap-5">
      <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-5">
        <h2 className="text-2xl font-semibold">Instrukcja</h2>
        <p className="mt-3 max-w-3xl leading-7 text-slate-300">
          Panel jest podzielony na sekcje. Treści strony zapisujesz w module
          Treści, projekty jako osobne case studies, a CV i media przez
          Supabase Storage.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AdminGuideCard
          icon={<FileText className="size-5" />}
          title="Treści"
          text="Edytuj PL/EN, opisy sekcji, SEO oraz logotypy firm."
        />
        <AdminGuideCard
          icon={<FolderKanban className="size-5" />}
          title="Projekty"
          text="Dodawaj case studies, tłumaczenia, linki i media projektu."
        />
        <AdminGuideCard
          icon={<Mail className="size-5" />}
          title="Kontakt"
          text="Formularz kontaktowy korzysta z Supabase Edge Function."
        />
      </div>
    </section>
  )
}

function AdminGuideCard({
  icon,
  text,
  title,
}: {
  icon: ReactNode
  text: string
  title: string
}) {
  return (
    <article className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-5">
      <div className="mb-4 grid size-10 place-items-center rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] text-[#d8b982]">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{text}</p>
    </article>
  )
}

function ProjectsManager({
  error,
  onDelete,
  onNewProject,
  onSaved,
  onSelectProject,
  projects,
  selectedId,
  selectedProject,
}: {
  error: unknown
  onDelete(): Promise<void>
  onNewProject(): void
  onSaved(projectId: string): void
  onSelectProject(projectId: string): void
  projects: Project[]
  selectedId: string | null
  selectedProject: Project | null
}) {
  return (
    <section id="admin-active-section" className="grid gap-5">
      <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Projekty</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Case studies, tłumaczenia, technologie, linki oraz media.
            </p>
          </div>
          <Button icon={<Plus className="size-4" />} onClick={onNewProject}>
            Nowy projekt
          </Button>
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-rose-300/25 bg-rose-400/10 p-3 text-sm text-rose-200">
          {getErrorMessage(error)}
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-4">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="font-semibold">Lista projektów</h3>
            <span className="text-xs text-[color:var(--muted)]">
              {projects.length}
            </span>
          </div>
          <div className="grid gap-2">
            {projects.map((project) => (
              <button
                className={cn(
                  'focus-ring rounded-md border px-3 py-3 text-left text-sm transition-colors',
                  selectedId === project.id
                    ? 'border-[#d8b982]/70 bg-[#d8b982]/12'
                    : 'border-[color:var(--border)] hover:border-[#d8b982]/50',
                )}
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                type="button"
              >
                <span className="block font-medium">{project.title}</span>
                <span className="mt-1 block text-xs text-[color:var(--muted)]">
                  {project.status} / {project.area} / {project.year}
                </span>
              </button>
            ))}
          </div>

          {selectedProject ? (
            <Button
              className="mt-4 w-full"
              icon={<Trash2 className="size-4" />}
              onClick={() => void onDelete()}
              variant="danger"
            >
              Usuń projekt
            </Button>
          ) : null}
        </aside>

        <ProjectEditor
          key={selectedProject?.id ?? 'new-project'}
          onSaved={onSaved}
          project={selectedProject}
        />
      </div>
    </section>
  )
}

function MediaManager({
  onOpenProjects,
  projectsCount,
}: {
  onOpenProjects(): void
  projectsCount: number
}) {
  return (
    <section id="admin-active-section" className="grid gap-5">
      <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-5">
        <h2 className="text-2xl font-semibold">Media i CV</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">
          CV zarządzasz tutaj. Zdjęcia i filmy są przypisane do konkretnych
          projektów, więc ich upload znajduje się w edycji projektu.
        </p>
        <Button
          className="mt-4"
          icon={<FolderKanban className="size-4" />}
          onClick={onOpenProjects}
          type="button"
        >
          Przejdź do projektów ({projectsCount})
        </Button>
      </div>
      <CvManager />
    </section>
  )
}

function SiteContentManager() {
  const { data: siteContent, isLoading } = useSiteContent()
  const content = siteContent ?? defaultSiteContent

  return (
    <SiteContentEditor
      initialContent={content}
      isLoading={isLoading}
      key={content.updatedAt ?? 'default-site-content'}
    />
  )
}

function SiteContentEditor({
  initialContent,
  isLoading,
}: {
  initialContent: SiteContent
  isLoading: boolean
}) {
  const updateSiteContent = useUpdateSiteContent()
  const uploadCompanyLogo = useUploadCompanyLogo()
  const [state, setState] = useState<SiteContent>(() =>
    cloneSiteContent(initialContent),
  )

  const updateLocale = (
    locale: ProjectLocale,
    updater: (content: SiteLocalizedContent) => SiteLocalizedContent,
  ) => {
    setState((current) => ({
      ...current,
      locales: {
        ...current.locales,
        [locale]: updater(current.locales[locale]),
      },
    }))
  }

  const updateCompanyLogo = (
    index: number,
    updater: (logo: CompanyLogo) => CompanyLogo,
  ) => {
    setState((current) => ({
      ...current,
      companyLogos: current.companyLogos.map((logo, logoIndex) =>
        logoIndex === index ? updater(logo) : logo,
      ),
    }))
  }

  const handleAddCompanyLogo = () => {
    setState((current) => ({
      ...current,
      companyLogos: [...current.companyLogos, createCompanyLogo()],
    }))
  }

  const handleRemoveCompanyLogo = (index: number) => {
    setState((current) => ({
      ...current,
      companyLogos: current.companyLogos.filter((_, logoIndex) => logoIndex !== index),
    }))
  }

  const handleCompanyLogoUpload = async (
    index: number,
    file: File | undefined,
  ) => {
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Wybierz plik graficzny.')
      return
    }

    try {
      const optimizedFile = await optimizeImageFile(file, {
        forceAspectRatio: 16 / 9,
        maxHeight: 720,
        maxWidth: 1280,
        quality: 0.82,
      })
      const uploaded = await uploadCompanyLogo.mutateAsync(optimizedFile)
      updateCompanyLogo(index, (logo) => ({
        ...logo,
        ...uploaded,
        name: logo.name.trim() || file.name,
        shortName: logo.shortName.trim() || logo.name || file.name,
      }))
      toast.success('Zdjecie firmy zoptymalizowane i wgrane. Kliknij Zapisz tresci.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleSave = async () => {
    try {
      const values = siteContentSchema.parse(state)
      await updateSiteContent.mutateAsync({
        ...values,
        updatedAt: state.updatedAt,
      })
      toast.success('Treści strony zapisane.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleReset = () => {
    setState(cloneSiteContent(initialContent))
  }

  return (
    <section
      className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-5"
      id="admin-active-section"
    >
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Treści strony</h2>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Teksty homepage, podstron Unity/Web, stopki oraz pasek firm.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button data-admin-reset="true" onClick={handleReset} type="button">
            Cofnij zmiany
          </Button>
          <Button
            data-admin-save="true"
            disabled={isLoading || updateSiteContent.isPending}
            icon={<Save className="size-4" />}
            onClick={handleSave}
            type="button"
            variant="primary"
          >
            {updateSiteContent.isPending ? 'Zapisywanie...' : 'Zapisz treści'}
          </Button>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <LocalizedSiteContentFields
            content={state.locales.pl}
            locale="pl"
            onChange={(updater) => updateLocale('pl', updater)}
          />
          <LocalizedSiteContentFields
            content={state.locales.en}
            locale="en"
            onChange={(updater) => updateLocale('en', updater)}
          />
        </div>

        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="font-semibold">Zdjecia firm do paska</h3>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                Wgrywaj poziome grafiki 16:9, najlepiej 1600x900 lub 1200x675.
                Publiczny pasek wymusza ten sam rozmiar dla kazdej pozycji.
              </p>
            </div>
            <Button
              icon={<Plus className="size-4" />}
              onClick={handleAddCompanyLogo}
              type="button"
            >
              Dodaj firme
            </Button>
          </div>

          <div className="mt-5 grid gap-4">
            {state.companyLogos.map((logo, index) => (
              <div
                className="grid gap-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4 lg:grid-cols-[220px_minmax(0,1fr)]"
                key={`${logo.storagePath ?? logo.name}-${index}`}
              >
                <div>
                  <div className="aspect-video overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--background)]">
                    {logo.imageUrl ? (
                      <img
                        alt={logo.name}
                        className="h-full w-full object-contain p-3"
                        loading="lazy"
                        src={logo.imageUrl}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs font-semibold uppercase tracking-normal text-[color:var(--muted)]">
                        Brak zdjecia 16:9
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">
                    Podglad ma taki sam format jak kafelek w pasku.
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Nazwa firmy">
                      <input
                        className="form-field"
                        onChange={(event) =>
                          updateCompanyLogo(index, (current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        value={logo.name}
                      />
                    </Field>
                    <Field label="Tekst awaryjny">
                      <input
                        className="form-field"
                        onChange={(event) =>
                          updateCompanyLogo(index, (current) => ({
                            ...current,
                            shortName: event.target.value,
                          }))
                        }
                        value={logo.shortName}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="focus-ring inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--background)] px-4 text-sm font-medium transition-colors hover:border-cyan-300/45">
                      <ImagePlus className="size-4" />
                      Wgraj zdjecie
                      <input
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        onChange={(event) => {
                          void handleCompanyLogoUpload(
                            index,
                            event.currentTarget.files?.[0],
                          )
                          event.currentTarget.value = ''
                        }}
                        type="file"
                      />
                    </label>
                    <Button
                      disabled={state.companyLogos.length <= 1}
                      icon={<Trash2 className="size-4" />}
                      onClick={() => handleRemoveCompanyLogo(index)}
                      type="button"
                      variant="danger"
                    >
                      Usun
                    </Button>
                    {logo.imageUrl ? (
                      <a
                        className="text-sm font-medium text-[color:var(--primary)] hover:text-sky-200"
                        href={logo.imageUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Otworz plik
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function LocalizedSiteContentFields({
  content,
  locale,
  onChange,
}: {
  content: SiteLocalizedContent
  locale: ProjectLocale
  onChange(updater: (content: SiteLocalizedContent) => SiteLocalizedContent): void
}) {
  const updateField = (
    field:
      | 'seoDescription'
      | 'footerTagline'
      | 'heroDescription'
      | 'currentScope',
    value: string,
  ) => {
    onChange((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const updateWorkflowItems = (value: string) => {
    onChange((current) => ({
      ...current,
      workflowItems: splitLineList(value),
    }))
  }

  const updateProjectsField = (
    field: keyof SiteProjectSectionContent,
    value: string,
  ) => {
    onChange((current) => ({
      ...current,
      projects: {
        ...current.projects,
        [field]: value,
      },
    }))
  }

  const updateSectionField = (
    section: 'companies' | 'contact',
    field: keyof SiteSectionContent,
    value: string,
  ) => {
    onChange((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }))
  }

  const updateAreasField = (field: keyof SiteAreasContent, value: string) => {
    onChange((current) => ({
      ...current,
      areas: {
        ...current.areas,
        [field]: value,
      },
    }))
  }

  const updateAreaPagesField = (
    field: keyof SiteAreaPagesContent,
    value: string,
  ) => {
    onChange((current) => ({
      ...current,
      areaPages: {
        ...current.areaPages,
        [field]: value,
      },
    }))
  }

  const updateStackField = (field: keyof SiteSectionContent, value: string) => {
    onChange((current) => ({
      ...current,
      stack: {
        ...current.stack,
        [field]: value,
      },
    }))
  }

  const updateStackCards = (value: string) => {
    onChange((current) => ({
      ...current,
      stack: {
        ...current.stack,
        cards: parseStackCards(value),
      },
    }))
  }

  const localeLabel = locale === 'pl' ? 'Polski' : 'Angielski'

  return (
    <details
      className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-4"
      open
    >
      <summary className="cursor-pointer font-semibold">
        Treści: {localeLabel}
      </summary>

      <div className="mt-5 grid gap-5">
        <div className="grid gap-4">
          <Field label="SEO description">
            <textarea
              className="form-field min-h-28"
              onChange={(event) =>
                updateField('seoDescription', event.target.value)
              }
              value={content.seoDescription}
            />
          </Field>
          <Field label="Stopka">
            <input
              className="form-field"
              onChange={(event) =>
                updateField('footerTagline', event.target.value)
              }
              value={content.footerTagline}
            />
          </Field>
        </div>

        <div className="grid gap-4">
          <Field label="Hero opis">
            <textarea
              className="form-field min-h-32"
              onChange={(event) =>
                updateField('heroDescription', event.target.value)
              }
              value={content.heroDescription}
            />
          </Field>
          <Field label="Aktualny zakres - nagłówek">
            <input
              className="form-field"
              onChange={(event) =>
                updateField('currentScope', event.target.value)
              }
              value={content.currentScope}
            />
          </Field>
        </div>

        <Field label="Aktualny zakres - punkty, każdy w osobnej linii">
          <textarea
            className="form-field min-h-32"
            onChange={(event) => updateWorkflowItems(event.target.value)}
            value={content.workflowItems.join('\n')}
          />
        </Field>

        <ContentEditorGroup title="Sekcja projektów">
          <div className="grid gap-4">
            <Field label="Eyebrow">
              <input
                className="form-field"
                onChange={(event) =>
                  updateProjectsField('eyebrow', event.target.value)
                }
                value={content.projects.eyebrow}
              />
            </Field>
            <Field label="Tytuł">
              <input
                className="form-field"
                onChange={(event) =>
                  updateProjectsField('title', event.target.value)
                }
                value={content.projects.title}
              />
            </Field>
          </div>
          <Field label="Opis">
            <textarea
              className="form-field min-h-28"
              onChange={(event) =>
                updateProjectsField('description', event.target.value)
              }
              value={content.projects.description}
            />
          </Field>
          <div className="grid gap-4">
            <Field label="Nagłówek Unity">
              <input
                className="form-field"
                onChange={(event) =>
                  updateProjectsField('unityHeading', event.target.value)
                }
                value={content.projects.unityHeading}
              />
            </Field>
            <Field label="Nagłówek Web">
              <input
                className="form-field"
                onChange={(event) =>
                  updateProjectsField('webHeading', event.target.value)
                }
                value={content.projects.webHeading}
              />
            </Field>
            <Field label="Przycisk pokaż więcej">
              <input
                className="form-field"
                onChange={(event) =>
                  updateProjectsField('showMore', event.target.value)
                }
                value={content.projects.showMore}
              />
            </Field>
            <Field label="Przycisk pokaż mniej">
              <input
                className="form-field"
                onChange={(event) =>
                  updateProjectsField('showLess', event.target.value)
                }
                value={content.projects.showLess}
              />
            </Field>
          </div>
        </ContentEditorGroup>

        <ContentEditorGroup title="Obszary portfolio">
          <div className="grid gap-4">
            <Field label="Eyebrow">
              <input
                className="form-field"
                onChange={(event) =>
                  updateAreasField('eyebrow', event.target.value)
                }
                value={content.areas.eyebrow}
              />
            </Field>
            <Field label="Tytuł">
              <input
                className="form-field"
                onChange={(event) =>
                  updateAreasField('title', event.target.value)
                }
                value={content.areas.title}
              />
            </Field>
          </div>
          <Field label="Opis">
            <textarea
              className="form-field min-h-28"
              onChange={(event) =>
                updateAreasField('description', event.target.value)
              }
              value={content.areas.description}
            />
          </Field>
          <div className="grid gap-4">
            <Field label="Unity title">
              <input
                className="form-field"
                onChange={(event) =>
                  updateAreasField('unityTitle', event.target.value)
                }
                value={content.areas.unityTitle}
              />
            </Field>
            <Field label="Unity button">
              <input
                className="form-field"
                onChange={(event) =>
                  updateAreasField('unityButton', event.target.value)
                }
                value={content.areas.unityButton}
              />
            </Field>
          </div>
          <Field label="Unity description">
            <textarea
              className="form-field min-h-24"
              onChange={(event) =>
                updateAreasField('unityDescription', event.target.value)
              }
              value={content.areas.unityDescription}
            />
          </Field>
          <div className="grid gap-4">
            <Field label="Web title">
              <input
                className="form-field"
                onChange={(event) =>
                  updateAreasField('webTitle', event.target.value)
                }
                value={content.areas.webTitle}
              />
            </Field>
            <Field label="Web button">
              <input
                className="form-field"
                onChange={(event) =>
                  updateAreasField('webButton', event.target.value)
                }
                value={content.areas.webButton}
              />
            </Field>
          </div>
          <Field label="Web description">
            <textarea
              className="form-field min-h-24"
              onChange={(event) =>
                updateAreasField('webDescription', event.target.value)
              }
              value={content.areas.webDescription}
            />
          </Field>
        </ContentEditorGroup>

        <ContentEditorGroup title="Podstrony Unity i Web">
          <div className="grid gap-4">
            <Field label="Unity title">
              <input
                className="form-field"
                onChange={(event) =>
                  updateAreaPagesField('unityTitle', event.target.value)
                }
                value={content.areaPages.unityTitle}
              />
            </Field>
            <Field label="Web title">
              <input
                className="form-field"
                onChange={(event) =>
                  updateAreaPagesField('webTitle', event.target.value)
                }
                value={content.areaPages.webTitle}
              />
            </Field>
          </div>
          <div className="grid gap-4">
            <Field label="Unity description">
              <textarea
                className="form-field min-h-28"
                onChange={(event) =>
                  updateAreaPagesField('unityDescription', event.target.value)
                }
                value={content.areaPages.unityDescription}
              />
            </Field>
            <Field label="Web description">
              <textarea
                className="form-field min-h-28"
                onChange={(event) =>
                  updateAreaPagesField('webDescription', event.target.value)
                }
                value={content.areaPages.webDescription}
              />
            </Field>
          </div>
          <Field label="Komunikat pustej listy">
            <input
              className="form-field"
              onChange={(event) =>
                updateAreaPagesField('empty', event.target.value)
              }
              value={content.areaPages.empty}
            />
          </Field>
        </ContentEditorGroup>

        <ContentEditorGroup title="Firmy">
          <div className="grid gap-4">
            <Field label="Eyebrow">
              <input
                className="form-field"
                onChange={(event) =>
                  updateSectionField('companies', 'eyebrow', event.target.value)
                }
                value={content.companies.eyebrow}
              />
            </Field>
            <Field label="Tytuł">
              <input
                className="form-field"
                onChange={(event) =>
                  updateSectionField('companies', 'title', event.target.value)
                }
                value={content.companies.title}
              />
            </Field>
          </div>
          <Field label="Opis">
            <textarea
              className="form-field min-h-28"
              onChange={(event) =>
                updateSectionField(
                  'companies',
                  'description',
                  event.target.value,
                )
              }
              value={content.companies.description}
            />
          </Field>
        </ContentEditorGroup>

        <ContentEditorGroup title="Stack / sposób pracy">
          <div className="grid gap-4">
            <Field label="Eyebrow">
              <input
                className="form-field"
                onChange={(event) =>
                  updateStackField('eyebrow', event.target.value)
                }
                value={content.stack.eyebrow}
              />
            </Field>
            <Field label="Tytuł">
              <input
                className="form-field"
                onChange={(event) =>
                  updateStackField('title', event.target.value)
                }
                value={content.stack.title}
              />
            </Field>
          </div>
          <Field label="Opis">
            <textarea
              className="form-field min-h-28"
              onChange={(event) =>
                updateStackField('description', event.target.value)
              }
              value={content.stack.description}
            />
          </Field>
          <Field label="Karty stacka: tytuł | opis">
            <textarea
              className="form-field min-h-36"
              onChange={(event) => updateStackCards(event.target.value)}
              value={stackCardsToText(content.stack.cards)}
            />
          </Field>
        </ContentEditorGroup>

        <ContentEditorGroup title="Kontakt">
          <div className="grid gap-4">
            <Field label="Eyebrow">
              <input
                className="form-field"
                onChange={(event) =>
                  updateSectionField('contact', 'eyebrow', event.target.value)
                }
                value={content.contact.eyebrow}
              />
            </Field>
            <Field label="Tytuł">
              <input
                className="form-field"
                onChange={(event) =>
                  updateSectionField('contact', 'title', event.target.value)
                }
                value={content.contact.title}
              />
            </Field>
          </div>
          <Field label="Opis">
            <textarea
              className="form-field min-h-28"
              onChange={(event) =>
                updateSectionField('contact', 'description', event.target.value)
              }
              value={content.contact.description}
            />
          </Field>
        </ContentEditorGroup>
      </div>
    </details>
  )
}

function ContentEditorGroup({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <div className="grid gap-4 rounded-lg border border-[color:var(--border)] p-4">
      <h4 className="font-semibold">{title}</h4>
      {children}
    </div>
  )
}

function ProjectEditor({
  onSaved,
  project,
}: {
  project: Project | null
  onSaved(projectId: string): void
}) {
  const [state, setState] = useState<ProjectFormState>(() =>
    formStateFromProject(project),
  )
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const saveProject = useSaveProject()
  const uploadProjectMedia = useUploadProjectMedia()
  const removeProjectMedia = useRemoveProjectMedia()

  const updateField = <Field extends keyof ProjectFormState>(
    field: Field,
    value: ProjectFormState[Field],
  ) => {
    setState((current) => ({ ...current, [field]: value }))
  }

  const handleTitleChange = (value: string) => {
    setState((current) => ({
      ...current,
      title: value,
      slug: current.id || current.slug ? current.slug : createSlug(value),
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const values = formValuesFromState(state)
      const savedProject = await saveProject.mutateAsync(values)

      for (const file of mediaFiles) {
        const type = file.type.startsWith('video/') ? 'video' : 'image'
        const uploadFile =
          type === 'image'
            ? await optimizeImageFile(file, {
                maxHeight: 1080,
                maxWidth: 1920,
                quality: 0.8,
              })
            : file

        await uploadProjectMedia.mutateAsync({
          projectId: savedProject.id,
          file: uploadFile,
          type,
          alt: state.mediaAlt,
        })
      }

      setMediaFiles([])
      updateField('mediaAlt', '')
      onSaved(savedProject.id)
      toast.success('Projekt zapisany.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleRemoveMedia = async (mediaId: string) => {
    const media = project?.media.find((item) => item.id === mediaId)

    if (!media) {
      return
    }

    try {
      await removeProjectMedia.mutateAsync(media)
      toast.success('Media usunięte.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const isSaving = saveProject.isPending || uploadProjectMedia.isPending

  return (
    <form
      className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5"
      onSubmit={handleSubmit}
    >
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {project ? 'Edycja projektu' : 'Nowy projekt'}
          </h2>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Case study z problemem, zakresem prac, technologiami i mediami.
          </p>
        </div>
        <Button
          data-admin-save="true"
          disabled={isSaving}
          icon={<Save className="size-4" />}
          type="submit"
          variant="primary"
        >
          {isSaving ? 'Zapisywanie...' : 'Zapisz'}
        </Button>
      </div>

      <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-4">
        <div className="mb-4">
          <h3 className="font-semibold">Tresci projektu i tlumaczenie</h3>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Lewa kolumna to wersja polska, prawa kolumna to wersja angielska.
            Pola sa ustawione obok siebie, zeby latwiej tlumaczyc projekt po
            kolei.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid gap-4 rounded-lg border border-[color:var(--border)] p-4">
            <h4 className="font-semibold text-[color:var(--text)]">Polski (PL)</h4>
            <Field label="Tytul PL">
              <input
                className="form-field"
                onChange={(event) => handleTitleChange(event.target.value)}
                required
                value={state.title}
              />
            </Field>
            <Field label="Podtytul PL">
              <input
                className="form-field"
                onChange={(event) => updateField('subtitle', event.target.value)}
                required
                value={state.subtitle}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Rola PL">
                <input
                  className="form-field"
                  onChange={(event) => updateField('role', event.target.value)}
                  required
                  value={state.role}
                />
              </Field>
              <Field label="Czas trwania PL">
                <input
                  className="form-field"
                  onChange={(event) =>
                    updateField('duration', event.target.value)
                  }
                  placeholder="np. 8 tygodni"
                  value={state.duration}
                />
              </Field>
            </div>
            <Field label="Krotki opis PL">
              <textarea
                className="form-field min-h-32"
                onChange={(event) => updateField('summary', event.target.value)}
                required
                value={state.summary}
              />
            </Field>
            <Field label="Czym sie zajmowalem PL, kazdy punkt w osobnej linii">
              <textarea
                className="form-field min-h-32"
                onChange={(event) => updateField('scopeText', event.target.value)}
                value={state.scopeText}
              />
            </Field>
            <Field label="Najwazniejsze osiagniecia PL">
              <textarea
                className="form-field min-h-40"
                onChange={(event) => updateField('solution', event.target.value)}
                required
                value={state.solution}
              />
            </Field>
          </div>

          <div className="grid gap-4 rounded-lg border border-[color:var(--border)] p-4">
            <h4 className="font-semibold text-[color:var(--text)]">English (EN)</h4>
            <Field label="Title EN">
              <input
                className="form-field"
                onChange={(event) => updateField('enTitle', event.target.value)}
                value={state.enTitle}
              />
            </Field>
            <Field label="Subtitle EN">
              <input
                className="form-field"
                onChange={(event) =>
                  updateField('enSubtitle', event.target.value)
                }
                value={state.enSubtitle}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Role EN">
                <input
                  className="form-field"
                  onChange={(event) => updateField('enRole', event.target.value)}
                  value={state.enRole}
                />
              </Field>
              <Field label="Duration EN">
                <input
                  className="form-field"
                  onChange={(event) =>
                    updateField('enDuration', event.target.value)
                  }
                  value={state.enDuration}
                />
              </Field>
            </div>
            <Field label="Short description EN">
              <textarea
                className="form-field min-h-32"
                onChange={(event) =>
                  updateField('enSummary', event.target.value)
                }
                value={state.enSummary}
              />
            </Field>
            <Field label="What I worked on EN, each item on a new line">
              <textarea
                className="form-field min-h-32"
                onChange={(event) =>
                  updateField('enScopeText', event.target.value)
                }
                value={state.enScopeText}
              />
            </Field>
            <Field label="Key achievements EN">
              <textarea
                className="form-field min-h-40"
                onChange={(event) =>
                  updateField('enSolution', event.target.value)
                }
                value={state.enSolution}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-4">
        <div className="mb-4">
          <h3 className="font-semibold">Ustawienia projektu</h3>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Wspolne dane techniczne, publikacja, technologie i linki projektu.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Slug">
            <input
              className="form-field"
              onChange={(event) =>
                updateField('slug', createSlug(event.target.value))
              }
              required
              value={state.slug}
            />
          </Field>
          <Field label="Rok">
            <input
              className="form-field"
              min="2000"
              onChange={(event) => updateField('year', event.target.value)}
              required
              type="number"
              value={state.year}
            />
          </Field>
          <Field label="Status">
            <select
              className="form-field"
              onChange={(event) =>
                updateField('status', event.target.value as ProjectStatus)
              }
              value={state.status}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </Field>
          <Field label="Obszar portfolio">
            <select
              className="form-field"
              onChange={(event) =>
                updateField('area', event.target.value as ProjectArea)
              }
              value={state.area}
            >
              <option value="unity">Unity / VR</option>
              <option value="web">Strony internetowe</option>
            </select>
          </Field>
          <Field label="Technologie, po przecinku">
            <input
              className="form-field"
              onChange={(event) =>
                updateField('technologiesText', event.target.value)
              }
              value={state.technologiesText}
            />
          </Field>
          <label className="flex min-h-12 items-center gap-3 rounded-lg border border-[color:var(--border)] px-3 text-sm text-[color:var(--muted)]">
            <input
              checked={state.featured}
              className="size-4 accent-cyan-300"
              onChange={(event) => updateField('featured', event.target.checked)}
              type="checkbox"
            />
            Projekt wyrozniony
          </label>
        </div>
        <div className="mt-4">
          <Field label="Linki, kazdy w osobnej linii">
            <textarea
              className="form-field min-h-24"
              onChange={(event) => updateField('linksText', event.target.value)}
              placeholder="https://example.com lub Wdrozenie | https://example.com | live"
              value={state.linksText}
            />
          </Field>
        </div>
      </section>

      <fieldset className="hidden" disabled>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tytuł">
          <input
            className="form-field"
            onChange={(event) => handleTitleChange(event.target.value)}
            required
            value={state.title}
          />
        </Field>
        <Field label="Slug">
          <input
            className="form-field"
            onChange={(event) => updateField('slug', createSlug(event.target.value))}
            required
            value={state.slug}
          />
        </Field>
        <Field label="Rola">
          <input
            className="form-field"
            onChange={(event) => updateField('role', event.target.value)}
            required
            value={state.role}
          />
        </Field>
        <Field label="Rok">
          <input
            className="form-field"
            min="2000"
            onChange={(event) => updateField('year', event.target.value)}
            required
            type="number"
            value={state.year}
          />
        </Field>
        <Field label="Czas trwania">
          <input
            className="form-field"
            onChange={(event) => updateField('duration', event.target.value)}
            placeholder="np. 8 tygodni"
            value={state.duration}
          />
        </Field>
        <Field label="Status">
          <select
            className="form-field"
            onChange={(event) =>
              updateField('status', event.target.value as ProjectStatus)
            }
            value={state.status}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </Field>
        <Field label="Obszar portfolio">
          <select
            className="form-field"
            onChange={(event) =>
              updateField('area', event.target.value as ProjectArea)
            }
            value={state.area}
          >
            <option value="unity">Unity / VR</option>
            <option value="web">Strony internetowe</option>
          </select>
        </Field>
      </div>

      <div className="mt-4 grid gap-4">
        <Field label="Podtytuł">
          <input
            className="form-field"
            onChange={(event) => updateField('subtitle', event.target.value)}
            required
            value={state.subtitle}
          />
        </Field>
        <Field label="Krótki opis">
          <textarea
            className="form-field min-h-28"
            onChange={(event) => updateField('summary', event.target.value)}
            required
            value={state.summary}
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Problem">
            <textarea
              className="form-field min-h-40"
              onChange={(event) => updateField('problem', event.target.value)}
              required
              value={state.problem}
            />
          </Field>
          <Field label="Najważniejsze osiągnięcia">
            <textarea
              className="form-field min-h-40"
              onChange={(event) => updateField('solution', event.target.value)}
              required
              value={state.solution}
            />
          </Field>
        </div>
        <Field label="Technologie, po przecinku">
          <input
            className="form-field"
            onChange={(event) =>
              updateField('technologiesText', event.target.value)
            }
            value={state.technologiesText}
          />
        </Field>
        <Field label="Czym sie zajmowalem, kazdy punkt w osobnej linii">
          <textarea
            className="form-field min-h-32"
            onChange={(event) => updateField('scopeText', event.target.value)}
            value={state.scopeText}
          />
        </Field>
        <Field label="Linki, każdy w osobnej linii">
          <textarea
            className="form-field min-h-24"
            onChange={(event) => updateField('linksText', event.target.value)}
            placeholder="https://example.com lub Wdrozenie | https://example.com | live"
            value={state.linksText}
          />
        </Field>
        <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-4">
          <div className="mb-4">
            <h3 className="font-semibold">Tłumaczenie EN</h3>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Te pola trafiają do tabeli project_translations i są używane po
              przełączeniu strony na język angielski.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="EN title">
              <input
                className="form-field"
                onChange={(event) => updateField('enTitle', event.target.value)}
                value={state.enTitle}
              />
            </Field>
            <Field label="EN subtitle">
              <input
                className="form-field"
                onChange={(event) =>
                  updateField('enSubtitle', event.target.value)
                }
                value={state.enSubtitle}
              />
            </Field>
            <Field label="EN role">
              <input
                className="form-field"
                onChange={(event) => updateField('enRole', event.target.value)}
                value={state.enRole}
              />
            </Field>
            <Field label="EN duration">
              <input
                className="form-field"
                onChange={(event) =>
                  updateField('enDuration', event.target.value)
                }
                value={state.enDuration}
              />
            </Field>
          </div>
          <div className="mt-4 grid gap-4">
            <Field label="EN short description">
              <textarea
                className="form-field min-h-28"
                onChange={(event) =>
                  updateField('enSummary', event.target.value)
                }
                value={state.enSummary}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="EN problem">
                <textarea
                  className="form-field min-h-40"
                  onChange={(event) =>
                    updateField('enProblem', event.target.value)
                  }
                  value={state.enProblem}
                />
              </Field>
              <Field label="EN solution">
                <textarea
                  className="form-field min-h-40"
                  onChange={(event) =>
                    updateField('enSolution', event.target.value)
                  }
                  value={state.enSolution}
                />
              </Field>
            </div>
            <Field label="What I worked on EN, each item on a new line">
              <textarea
                className="form-field min-h-32"
                onChange={(event) =>
                  updateField('enScopeText', event.target.value)
                }
                value={state.enScopeText}
              />
            </Field>
          </div>
        </section>
        <label className="flex items-center gap-3 text-sm text-[color:var(--muted)]">
          <input
            checked={state.featured}
            className="size-4 accent-cyan-300"
            onChange={(event) => updateField('featured', event.target.checked)}
            type="checkbox"
          />
          Projekt wyróżniony
        </label>
      </div>
      </fieldset>

      <div className="mt-6 rounded-lg border border-[color:var(--border)] p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold">Media projektu</h3>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Obrazy i filmy są wysyłane do Supabase Storage.
            </p>
          </div>
          <label className="focus-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-[color:var(--border-strong)] bg-[color:var(--background)] px-4 py-2 text-sm font-medium hover:border-cyan-300/45">
            <ImagePlus className="size-4" />
            Dodaj media
            <input
              accept="image/*,video/*"
              className="sr-only"
              multiple
              onChange={(event) =>
                setMediaFiles(Array.from(event.currentTarget.files ?? []))
              }
              type="file"
            />
          </label>
        </div>
        <Field label="Opis alt dla nowych mediów">
          <input
            className="form-field"
            onChange={(event) => updateField('mediaAlt', event.target.value)}
            placeholder="np. Zrzut ekranu z aplikacji VR"
            value={state.mediaAlt}
          />
        </Field>

        {mediaFiles.length > 0 ? (
          <ul className="mt-4 grid gap-2 text-sm text-[color:var(--muted)]">
            {mediaFiles.map((file) => (
              <li key={`${file.name}-${file.size}`}>{file.name}</li>
            ))}
          </ul>
        ) : null}

        {project?.media.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {project.media.map((media) => (
              <div
                className="rounded-md border border-[color:var(--border)] bg-[color:var(--background)] p-3"
                key={media.id}
              >
                <p className="truncate text-sm">{media.alt}</p>
                <p className="mt-1 text-xs text-[color:var(--muted)]">
                  {media.type}
                </p>
                <Button
                  className="mt-3"
                  icon={<Trash2 className="size-4" />}
                  onClick={() => void handleRemoveMedia(media.id)}
                  type="button"
                  variant="danger"
                >
                  Usuń
                </Button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </form>
  )
}

function PortfolioSettingsManager() {
  const { data: settings } = usePortfolioSettings()
  const updateSettings = useUpdatePortfolioSettings()
  const [editedUrl, setEditedUrl] = useState<string | null>(null)
  const webPortfolioUrl = editedUrl ?? settings?.webPortfolioUrl ?? '/websites'

  const handleSave = async () => {
    try {
      const value = webPortfolioUrl.trim() || '/websites'
      await updateSettings.mutateAsync({
        webPortfolioUrl: value,
      })
      setEditedUrl(value)
      toast.success('Link do portfolio web zapisany.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <section
      className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-5"
      id="admin-active-section"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Link do portfolio web</h2>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Ten adres zasila przycisk wejścia do obszaru stron internetowych.
            Możesz podać /websites albo pełny link zewnętrzny.
          </p>
        </div>
        <Button
          data-admin-save="true"
          disabled={updateSettings.isPending}
          icon={<Save className="size-4" />}
          onClick={handleSave}
          type="button"
          variant="primary"
        >
          {updateSettings.isPending ? 'Zapisywanie...' : 'Zapisz link'}
        </Button>
      </div>

      <input
        className="form-field mt-5"
        onChange={(event) => setEditedUrl(event.target.value)}
        placeholder="/websites lub https://..."
        value={webPortfolioUrl}
      />
    </section>
  )
}

function CvManager() {
  const { data: plCvDocument } = useCvDocument('pl')
  const { data: enCvDocument } = useCvDocument('en')
  const uploadCv = useUploadCv()
  const [files, setFiles] = useState<Partial<Record<ProjectLocale, File>>>({})

  const handleUpload = async (locale: ProjectLocale) => {
    const file = files[locale]
    if (!file) {
      return
    }

    try {
      await uploadCv.mutateAsync({ file, locale })
      setFiles((current) => ({ ...current, [locale]: undefined }))
      toast.success(`CV ${locale.toUpperCase()} zaktualizowane.`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const cvItems: Array<{
    locale: ProjectLocale
    label: string
    document: typeof plCvDocument
  }> = [
    { locale: 'pl', label: 'CV po polsku', document: plCvDocument },
    { locale: 'en', label: 'CV po angielsku', document: enCvDocument },
  ]

  return (
    <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">CV</h2>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Wgraj osobny plik PDF dla wersji PL i EN. Publiczna strona wybiera
            CV zgodnie z aktualnym jezykiem.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {cvItems.map((item) => (
          <div
            className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4"
            key={item.locale}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">{item.label}</h3>
                <p className="mt-1 text-xs uppercase tracking-normal text-[color:var(--muted)]">
                  locale: {item.locale}
                </p>
              </div>
              {item.document ? (
                <a
                  className="focus-ring inline-flex items-center gap-2 rounded-md text-sm text-[color:var(--primary)]"
                  href={item.document.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <FileText className="size-4" />
                  Aktualny plik
                </a>
              ) : null}
            </div>

            {item.document ? (
              <p className="mt-3 text-xs leading-5 text-[color:var(--muted)]">
                {item.document.fileName}
              </p>
            ) : (
              <p className="mt-3 text-xs leading-5 text-[color:var(--muted)]">
                Brak wgranego pliku.
              </p>
            )}

            <div className="mt-4 grid gap-3">
              <input
                accept="application/pdf"
                className="form-field"
                onChange={(event) => {
                  const selectedFile = event.currentTarget.files?.[0]
                  setFiles((current) => ({
                    ...current,
                    [item.locale]: selectedFile ?? undefined,
                  }))
                }}
                type="file"
              />
              <Button
                data-admin-save={item.locale === 'pl' ? 'true' : undefined}
                disabled={!files[item.locale] || uploadCv.isPending}
                icon={<Upload className="size-4" />}
                onClick={() => void handleUpload(item.locale)}
                type="button"
                variant="primary"
              >
                {uploadCv.isPending
                  ? 'Wysylanie...'
                  : `Wyslij ${item.locale.toUpperCase()}`}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Field({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  return (
    <label className="grid gap-2 text-sm text-[color:var(--muted)]">
      <span>{label}</span>
      {children}
    </label>
  )
}
