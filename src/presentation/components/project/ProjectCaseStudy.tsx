import { ChevronLeft, ChevronRight, ExternalLink, Images } from 'lucide-react'
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

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const { i18n, t } = useTranslation()
  const localizedProject = localizeProject(project, i18n.language)

  return (
    <article className="py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
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
          <p className="mb-3 text-xs font-semibold uppercase text-[color:var(--primary)]">
            {t('project.technologies')}
          </p>
          <div className="flex flex-wrap gap-2">
            {localizedProject.technologies.map((technology) => (
              <Badge key={technology}>{technology}</Badge>
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-10">
        {localizedProject.media.length > 0 ? (
          <ProjectMediaGallery
            isEnglish={i18n.language.toLowerCase().startsWith('en')}
            media={localizedProject.media}
          />
        ) : (
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-sm text-[color:var(--muted)]">
            {t('project.mediaPending')}
          </div>
        )}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
          <h2 className="text-xl font-semibold">{t('project.problem')}</h2>
          <p className="mt-4 leading-7 text-slate-300">
            {localizedProject.problem}
          </p>
        </section>
        <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
          <h2 className="text-xl font-semibold">{t('project.solution')}</h2>
          <p className="mt-4 leading-7 text-slate-300">
            {localizedProject.solution}
          </p>
        </section>
      </div>

      <section className="mt-8 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
        <h2 className="text-xl font-semibold">{t('project.scope')}</h2>
        <ul className="mt-5 grid gap-3 text-slate-300 sm:grid-cols-2">
          {localizedProject.scope.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 size-1.5 rounded-full bg-[color:var(--primary)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

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
