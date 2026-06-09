import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Images,
  Layers,
  Monitor,
  Trophy,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Project, ProjectMedia } from '@/domain/portfolio/entities'
import { localizeProject } from '@/domain/portfolio/localizeProject'
import { Badge } from '@/presentation/components/Badge'
import { ButtonLink } from '@/presentation/components/Button'
import { ProjectMediaView } from '@/presentation/components/project/ProjectMediaView'

interface ProjectCaseStudyProps {
  project: Project
}

const uniqueItems = (items: string[]) => Array.from(new Set(items))

const splitTextItems = (value: string) =>
  value
    .replace(/\r/g, '')
    .split(/\n+|[.!?]\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 8)

const getAboutParagraphs = (project: Project) => {
  const paragraphs = project.summary
    .replace(/\r/g, '')
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (paragraphs.length > 1) {
    return paragraphs.slice(0, 4)
  }

  const summaryItems = splitTextItems(project.summary)

  if (summaryItems.length > 1) {
    return summaryItems.slice(0, 4)
  }

  return [project.summary || project.subtitle].filter(Boolean).slice(0, 4)
}

const getAchievementItems = (project: Project) => {
  const solutionItems = splitTextItems(project.solution)
  const fallbackItems = project.scope.slice(0, 4)

  return uniqueItems([...solutionItems, ...fallbackItems]).slice(0, 4)
}

const findTechnology = (project: Project, patterns: RegExp[]) =>
  project.technologies.find((technology) =>
    patterns.some((pattern) => pattern.test(technology)),
  )

const getProjectEngine = (project: Project) =>
  findTechnology(project, [/unity/i, /unreal/i, /godot/i]) ??
  (project.area === 'web' ? 'React / Vite' : 'Unity')

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

const getProjectLabels = (isEnglish: boolean) => ({
  about: isEnglish ? 'About the project' : 'O projekcie',
  achievements: isEnglish ? 'Key achievements' : 'Najważniejsze osiągnięcia',
  duration: isEnglish ? 'Time on project' : 'Czas pracy',
  engine: isEnglish ? 'Engine' : 'Silnik',
  role: isEnglish ? 'My role' : 'Moja rola',
  platform: isEnglish ? 'Platform' : 'Platforma',
  whatIDid: isEnglish ? 'What I worked on' : 'Czym się zajmowałem',
  year: isEnglish ? 'Year' : 'Rok',
})

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const { i18n, t } = useTranslation()
  const localizedProject = localizeProject(project, i18n.language)
  const isEnglish = i18n.language.toLowerCase().startsWith('en')
  const labels = getProjectLabels(isEnglish)
  const aboutParagraphs = getAboutParagraphs(localizedProject)
  const achievementItems = getAchievementItems(localizedProject)
  const projectFacts = [
    { label: labels.role, value: localizedProject.role },
    { label: labels.year, value: String(localizedProject.year) },
    { label: labels.duration, value: localizedProject.duration ?? '-' },
    { label: labels.engine, value: getProjectEngine(localizedProject) },
    { label: labels.platform, value: getProjectPlatform(localizedProject) },
  ]

  return (
    <article className="py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            <Badge tone="accent">{localizedProject.role}</Badge>
            <Badge>{String(localizedProject.year)}</Badge>
            {localizedProject.duration ? (
              <Badge>{localizedProject.duration}</Badge>
            ) : null}
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold text-[color:var(--text)] sm:text-5xl">
            {localizedProject.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
            {localizedProject.subtitle}
          </p>
        </div>

        <aside className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
          <div className="grid gap-4">
            {projectFacts.map((item) => (
              <div
                className="grid gap-1 border-b border-[color:var(--border)] pb-3 last:border-b-0 last:pb-0"
                key={item.label}
              >
                <span className="text-xs font-semibold uppercase text-[color:var(--muted)]">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-[color:var(--text)]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-[color:var(--border)] pt-5">
            <p className="mb-3 text-xs font-semibold uppercase text-[color:var(--primary)]">
              {t('project.technologies')}
            </p>
            <div className="flex flex-wrap gap-2">
              {localizedProject.technologies.map((technology) => (
                <Badge key={technology}>{technology}</Badge>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-10">
        {localizedProject.media.length > 0 ? (
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

      <section className="mt-10 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-md border border-[color:var(--border)] bg-[color:var(--card)]">
            <Layers className="size-5 text-[color:var(--primary)]" />
          </div>
          <h2 className="text-2xl font-semibold">{labels.about}</h2>
        </div>
        <div className="grid max-w-4xl gap-4 text-sm leading-7 text-slate-300 sm:text-base">
          {aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        <section className="rounded-lg border border-cyan-300/25 bg-[rgba(56,189,248,0.07)] p-6">
          <p className="text-xs font-semibold uppercase text-[color:var(--primary)]">
            {labels.role}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[color:var(--text)]">
            {localizedProject.role}
          </h2>
          {localizedProject.duration ? (
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              {localizedProject.duration} · {localizedProject.year}
            </p>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              {localizedProject.year}
            </p>
          )}
        </section>

        <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-md border border-[color:var(--border)] bg-[color:var(--card)]">
              <Monitor className="size-5 text-[color:var(--primary)]" />
            </div>
            <h2 className="text-2xl font-semibold">{labels.whatIDid}</h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {localizedProject.scope.map((item) => (
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
      </div>

      {achievementItems.length > 0 ? (
        <section className="mt-8 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-md border border-[color:var(--border)] bg-[color:var(--card)]">
              <Trophy className="size-5 text-amber-300" />
            </div>
            <h2 className="text-2xl font-semibold">{labels.achievements}</h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {achievementItems.map((item) => (
              <li
                className="rounded-md border border-amber-300/18 bg-amber-300/[0.055] p-4 text-sm font-medium leading-6 text-slate-200"
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {localizedProject.links.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {localizedProject.links.map((link) => (
            <ButtonLink
              key={`${link.label}-${link.url}`}
              href={link.url}
              icon={<ExternalLink className="size-4" />}
              rel={link.url.startsWith('http') ? 'noreferrer' : undefined}
              target={link.url.startsWith('http') ? '_blank' : undefined}
            >
              {link.label}
            </ButtonLink>
          ))}
        </div>
      ) : null}
    </article>
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
  const additionalMediaCount = Math.max(media.length - 3, 0)
  const previousLabel = isEnglish ? 'Previous media' : 'Poprzednie media'
  const nextLabel = isEnglish ? 'Next media' : 'Następne media'
  const moreLabel = isEnglish
    ? `+${additionalMediaCount} more`
    : `+${additionalMediaCount} więcej zdjęć`
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
        <ProjectMediaView media={selectedMedia} priority />

        <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-black/55 px-2.5 py-1 text-xs font-semibold text-white">
          <Images className="size-3.5" />
          {mediaCountLabel}
        </div>

        {additionalMediaCount > 0 ? (
          <div className="pointer-events-none absolute right-3 top-3 rounded-md border border-[color:var(--border)] bg-black/55 px-2.5 py-1 text-xs font-semibold text-white">
            {moreLabel}
          </div>
        ) : null}

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
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {media.map((item, index) => {
            const isSelected = index === selectedIndex
            const thumbnailUrl =
              item.type === 'video' ? item.posterUrl : item.url
            const showMoreBadge = index === 2 && additionalMediaCount > 0

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
                    className="size-full object-fill"
                    decoding="async"
                    loading="lazy"
                    src={thumbnailUrl}
                  />
                ) : (
                  <span className="grid size-full place-items-center text-xs font-semibold uppercase tracking-normal text-[color:var(--muted)]">
                    Video
                  </span>
                )}
                {showMoreBadge ? (
                  <span className="absolute inset-0 grid place-items-center bg-black/58 text-sm font-semibold text-white">
                    {moreLabel}
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
