import {
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Images,
  Layers,
  Monitor,
  Play,
  Trophy,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type {
  Project,
  ProjectLink,
  ProjectMedia,
} from '@/domain/portfolio/entities'
import { localizeProject } from '@/domain/portfolio/localizeProject'
import { Badge } from '@/presentation/components/Badge'
import { ButtonLink } from '@/presentation/components/Button'
import {
  ProjectMediaView,
  VideoFrameThumbnail,
} from '@/presentation/components/project/ProjectMediaView'

interface ProjectCaseStudyProps {
  project: Project
}

const uniqueItems = (items: string[]) =>
  Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)))

const normalizeListItem = (item: string) =>
  item
    .trim()
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')

const splitTextItems = (value: string) =>
  value
    .replace(/\r/g, '')
    .split(/\n+|[.!?]\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 8)

const splitLongText = (value: string) => {
  if (value.length <= 360) {
    return [value]
  }

  const chunks: string[] = []
  let rest = value

  while (rest.length > 360 && chunks.length < 3) {
    const cutIndex = rest.lastIndexOf(' ', 320)
    const safeCutIndex = cutIndex > 160 ? cutIndex : 320
    chunks.push(rest.slice(0, safeCutIndex).trim())
    rest = rest.slice(safeCutIndex).trim()
  }

  if (rest) {
    chunks.push(rest)
  }

  return chunks
}

const getAboutParagraphs = (project: Project) => {
  const paragraphs = project.summary
    .replace(/\r/g, '')
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (paragraphs.length > 1) {
    return paragraphs.slice(0, 4)
  }

  return splitLongText(project.summary || project.subtitle).slice(0, 4)
}

const getResponsibilityItems = (project: Project) => {
  if (project.scope.length > 0) {
    return uniqueItems(project.scope).slice(0, 8)
  }

  return splitTextItems(project.problem).slice(0, 8)
}

const getAchievementItems = (project: Project) => {
  const responsibilityKeys = new Set(
    getResponsibilityItems(project).map(normalizeListItem),
  )
  const solutionItems = splitTextItems(project.solution)

  return uniqueItems(solutionItems)
    .filter((item) => !responsibilityKeys.has(normalizeListItem(item)))
    .slice(0, 4)
}

const findTechnology = (project: Project, patterns: RegExp[]) =>
  project.technologies.find((technology) =>
    patterns.some((pattern) => pattern.test(technology)),
  )

const getProjectPlatform = (project: Project) => {
  const hasSteamLink = project.links.some((link) =>
    /store\.steampowered\.com|steam/i.test(link.url),
  )
  const hasSteamTechnology = Boolean(findTechnology(project, [/steam/i]))
  const hasVrTechnology = Boolean(
    findTechnology(project, [/vr/i, /openxr/i, /oculus/i, /quest/i, /meta/i]),
  )

  if (hasSteamLink || hasSteamTechnology) {
    return 'PC / Steam'
  }

  if (hasVrTechnology) {
    return 'VR'
  }

  return project.area === 'web' ? 'Web' : 'PC'
}

const isExternalUrl = (url: string) => /^https?:\/\//i.test(url)

const getPrimaryWebProjectLink = (project: Project) =>
  project.links.find(
    (link) =>
      isExternalUrl(link.url) && ['live', 'demo'].includes(link.type),
  ) ?? project.links.find((link) => isExternalUrl(link.url))

const getHostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const getProjectLabels = (isEnglish: boolean) => ({
  about: isEnglish ? 'About the project' : 'O projekcie',
  achievements: isEnglish ? 'Key achievements' : 'Najważniejsze osiągnięcia',
  duration: isEnglish ? 'Time on project' : 'Czas pracy',
  links: isEnglish ? 'Links' : 'Linki',
  role: isEnglish ? 'My role' : 'Moja rola',
  platform: isEnglish ? 'Platform' : 'Platforma',
  whatIDid: isEnglish ? 'What I worked on' : 'Czym się zajmowałem',
  year: isEnglish ? 'Project period' : 'Okres realizacji',
})

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const { i18n, t } = useTranslation()
  const localizedProject = localizeProject(project, i18n.language)
  const isEnglish = i18n.language.toLowerCase().startsWith('en')
  const labels = getProjectLabels(isEnglish)
  const aboutParagraphs = getAboutParagraphs(localizedProject)
  const responsibilityItems = getResponsibilityItems(localizedProject)
  const achievementItems = getAchievementItems(localizedProject)
  const primaryWebProjectLink = getPrimaryWebProjectLink(localizedProject)
  const projectFacts = [
    { label: labels.year, value: String(localizedProject.year) },
    { label: labels.duration, value: localizedProject.duration ?? '-' },
    { label: labels.platform, value: getProjectPlatform(localizedProject) },
  ]

  return (
    <article className="py-8 sm:py-12">
      <header className="mb-8 max-w-4xl">
        <div className="mb-5 flex flex-wrap gap-2">
          <Badge tone="accent">{localizedProject.role}</Badge>
          <Badge>{String(localizedProject.year)}</Badge>
          {localizedProject.duration ? (
            <Badge>{localizedProject.duration}</Badge>
          ) : null}
        </div>
        <h1 className="text-4xl font-semibold tracking-normal text-[color:var(--text)] sm:text-5xl">
          {localizedProject.title}
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="min-w-0">
          {localizedProject.area === 'web' ? (
            <WebProjectPreview
              isEnglish={isEnglish}
              key={primaryWebProjectLink?.url ?? localizedProject.id}
              link={primaryWebProjectLink}
              project={localizedProject}
            />
          ) : localizedProject.media.length > 0 ? (
            <ProjectMediaGallery
              isEnglish={isEnglish}
              media={localizedProject.media}
            />
          ) : (
            <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-sm text-[color:var(--muted)]">
              {t('project.mediaPending')}
            </div>
          )}
        </div>

        <aside className="grid gap-4 lg:sticky lg:top-24 lg:row-span-2">
          <section className="rounded-lg border border-cyan-300/30 bg-[rgba(56,189,248,0.08)] p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-md border border-cyan-300/25 bg-[rgba(11,17,32,0.58)]">
                <BriefcaseBusiness className="size-5 text-[color:var(--primary)]" />
              </div>
              <p className="text-xs font-semibold uppercase text-[color:var(--primary)]">
                {labels.role}
              </p>
            </div>
            <h2 className="text-2xl font-semibold text-[color:var(--text)]">
              {localizedProject.role}
            </h2>
          </section>

          <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
            <div className="grid gap-4">
              {projectFacts.map((item) => (
                <div
                  className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] pb-3 last:border-b-0 last:pb-0"
                  key={item.label}
                >
                  <span className="text-xs font-semibold uppercase text-[color:var(--muted)]">
                    {item.label}
                  </span>
                  <span className="max-w-[170px] text-right text-sm font-semibold text-[color:var(--text)]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
            <p className="mb-3 text-xs font-semibold uppercase text-[color:var(--primary)]">
              {t('project.technologies')}
            </p>
            <div className="flex flex-wrap gap-2">
              {localizedProject.technologies.map((technology) => (
                <Badge key={technology}>{technology}</Badge>
              ))}
            </div>
          </section>

          {localizedProject.links.length > 0 ? (
            <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
              <p className="mb-3 text-xs font-semibold uppercase text-[color:var(--primary)]">
                {labels.links}
              </p>
              <div className="grid gap-2">
                {localizedProject.links.map((link) => (
                  <ButtonLink
                    className="w-full"
                    href={link.url}
                    icon={<ExternalLink className="size-4" />}
                    key={`${link.label}-${link.url}`}
                    rel={link.url.startsWith('http') ? 'noreferrer' : undefined}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                  >
                    {link.label}
                  </ButtonLink>
                ))}
              </div>
            </section>
          ) : null}
        </aside>

        <div className="grid min-w-0 gap-6 lg:col-start-1">
          <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-md border border-[color:var(--border)] bg-[color:var(--card)]">
                <Layers className="size-5 text-[color:var(--primary)]" />
              </div>
              <h2 className="text-2xl font-semibold">{labels.about}</h2>
            </div>
            <div className="grid gap-4 text-base leading-7 text-slate-300">
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-md border border-[color:var(--border)] bg-[color:var(--card)]">
                <Monitor className="size-5 text-[color:var(--primary)]" />
              </div>
              <h2 className="text-2xl font-semibold">{labels.whatIDid}</h2>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {responsibilityItems.map((item) => (
                <li
                  className="flex gap-3 rounded-md border border-[color:var(--border)] bg-[color:var(--background)] p-4 text-sm leading-6 text-slate-300"
                  key={item}
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[color:var(--primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {achievementItems.length > 0 ? (
            <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-md border border-[color:var(--border)] bg-[color:var(--card)]">
                  <Trophy className="size-5 text-amber-300" />
                </div>
                <h2 className="text-2xl font-semibold">
                  {labels.achievements}
                </h2>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {achievementItems.map((item) => (
                  <li
                    className="rounded-md border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm font-medium leading-6 text-slate-200"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function WebProjectPreview({
  isEnglish,
  link,
  project,
}: {
  isEnglish: boolean
  link?: ProjectLink
  project: Project
}) {
  const openLabel = isEnglish ? 'Open website' : 'Otwórz stronę'
  const previewLabel = isEnglish ? 'Website image' : 'Zdjęcie strony'
  const webPreviewImage = project.media.find((media) => media.type === 'image')

  if (!link) {
    return (
      <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-sm text-[color:var(--muted)]">
        {isEnglish
          ? 'Add a live project link in the admin panel. The project image will open that website.'
          : 'Dodaj link do strony w panelu administracyjnym. Zdjęcie projektu będzie otwierać tę stronę.'}
      </div>
    )
  }

  if (!webPreviewImage) {
    return (
      <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-sm text-[color:var(--muted)]">
        {isEnglish
          ? 'Add one website image in the project media section.'
          : 'Dodaj jedno zdjęcie strony w sekcji mediów projektu.'}
      </div>
    )
  }

  const hostname = getHostname(link.url)

  return (
    <a
      aria-label={`${openLabel}: ${project.title}`}
      className="focus-ring group block overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] transition-colors hover:border-cyan-300/45"
      href={link.url}
      rel="noreferrer"
      target="_blank"
    >
      <div className="relative aspect-video overflow-hidden bg-[color:var(--card)]">
        <img
          alt={webPreviewImage.alt || `${previewLabel}: ${project.title}`}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          decoding="async"
          loading="eager"
          src={webPreviewImage.url}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-black/75 to-transparent p-4 pt-16">
          <p className="min-w-0 truncate text-xs font-semibold uppercase text-white">
            {previewLabel}
          </p>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-md border border-white/20 bg-black/45 px-3 py-2 text-xs font-semibold text-white backdrop-blur">
            {openLabel}
            <ExternalLink className="size-3.5" />
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[color:var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[color:var(--text)]">
            {link.label || project.title}
          </p>
          <p className="mt-1 truncate text-xs text-[color:var(--muted)]">
            {hostname}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[color:var(--primary)]">
          {openLabel}
          <ExternalLink className="size-4" />
        </span>
      </div>
    </a>
  )
}

function ProjectMediaGallery({
  isEnglish,
  media,
}: {
  isEnglish: boolean
  media: ProjectMedia[]
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedMedia = media[selectedIndex] ?? media[0]
  const hasMultipleMedia = media.length > 1
  const previousLabel = isEnglish ? 'Previous media' : 'Poprzednie media'
  const nextLabel = isEnglish ? 'Next media' : 'Następne media'
  const mediaCountLabel = `${selectedIndex + 1} / ${media.length}`

  if (!selectedMedia) {
    return null
  }

  const goToPrevious = () => {
    setSelectedIndex((currentIndex) =>
      currentIndex === 0 ? media.length - 1 : currentIndex - 1,
    )
  }

  const goToNext = () => {
    setSelectedIndex((currentIndex) =>
      currentIndex === media.length - 1 ? 0 : currentIndex + 1,
    )
  }

  return (
    <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3 sm:p-4">
      <div className="relative overflow-hidden rounded-md bg-[color:var(--card)]">
        <ProjectMediaView
          autoPlay={selectedMedia.type === 'video'}
          key={selectedMedia.id}
          media={selectedMedia}
          priority
          showVideoBadge={false}
        />

        <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-black/55 px-2.5 py-1 text-xs font-semibold text-white">
          <Images className="size-3.5" />
          {mediaCountLabel}
        </div>

        {hasMultipleMedia ? (
          <>
            <button
              aria-label={previousLabel}
              className="focus-ring absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 text-white transition-colors hover:bg-black/70"
              onClick={goToPrevious}
              type="button"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              aria-label={nextLabel}
              className="focus-ring absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 text-white transition-colors hover:bg-black/70"
              onClick={goToNext}
              type="button"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      {hasMultipleMedia ? (
        <div className="mt-3 flex items-start gap-3 overflow-x-auto pb-1">
          {media.map((item, index) => {
            const isSelected = index === selectedIndex
            const thumbnailUrl =
              item.type === 'video' ? item.posterUrl : item.url

            return (
              <button
                aria-label={`${isEnglish ? 'Open media' : 'Otwórz media'} ${index + 1}`}
                className={`focus-ring relative aspect-video w-32 shrink-0 overflow-hidden rounded-md border bg-[color:var(--card)] transition-colors sm:w-40 ${
                  isSelected
                    ? 'border-[color:var(--primary)]'
                    : 'border-[color:var(--border)] hover:border-cyan-300/45'
                }`}
                key={item.id}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                {thumbnailUrl ? (
                  <img
                    alt={item.alt}
                    className="size-full object-contain"
                    decoding="async"
                    loading="lazy"
                    src={thumbnailUrl}
                  />
                ) : item.type === 'video' ? (
                  <VideoFrameThumbnail
                    className="size-full object-contain"
                    media={item}
                  />
                ) : (
                  <span className="grid size-full place-items-center text-xs font-semibold uppercase tracking-normal text-[color:var(--muted)]">
                    Video
                  </span>
                )}
                {item.type === 'video' ? (
                  <span className="pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-md border border-white/20 bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-normal text-white">
                    <Play className="size-3" />
                    Video
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
