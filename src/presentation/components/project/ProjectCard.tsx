import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { Project } from '@/domain/portfolio/entities'
import { localizeProject } from '@/domain/portfolio/localizeProject'
import { ProjectMediaView } from '@/presentation/components/project/ProjectMediaView'

interface ProjectCardProps {
  project: Project
  priority?: boolean
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const { i18n, t } = useTranslation()
  const localizedProject = localizeProject(project, i18n.language)
  const cover = localizedProject.media[0]
  const visibleTechnologies = localizedProject.technologies.slice(0, 3)
  const hiddenTechnologiesCount = Math.max(
    localizedProject.technologies.length - visibleTechnologies.length,
    0,
  )

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] transition-colors hover:border-cyan-300/35">
      <Link
        className="focus-ring block p-3 pb-0"
        to={`/projects/${localizedProject.slug}`}
      >
        <div className="project-card-image overflow-hidden rounded-md bg-[color:var(--card)]">
          {cover ? (
            <ProjectMediaView media={cover} priority={priority} />
          ) : (
            <div className="grid h-full place-items-center text-sm text-[color:var(--muted)]">
              Media projektu
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs font-medium text-[color:var(--muted)]">
          <span className="text-clamp-1">{localizedProject.role}</span>
          <span className="shrink-0">{localizedProject.year}</span>
        </div>

        <Link
          className="focus-ring rounded-sm"
          to={`/projects/${localizedProject.slug}`}
        >
          <h3 className="text-clamp-2 text-lg font-semibold leading-snug text-[color:var(--text)] transition-colors group-hover:text-white">
            {localizedProject.title}
          </h3>
        </Link>

        <p className="text-clamp-3 mt-3 text-sm leading-6 text-slate-300">
          {localizedProject.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {visibleTechnologies.map((technology) => (
            <span
              className="rounded-md border border-[color:var(--border)] px-2 py-1 text-xs font-medium text-[color:var(--muted)]"
              key={technology}
            >
              {technology}
            </span>
          ))}
          {hiddenTechnologiesCount > 0 ? (
            <span className="rounded-md border border-[color:var(--border)] px-2 py-1 text-xs font-medium text-[color:var(--muted)]">
              +{hiddenTechnologiesCount}
            </span>
          ) : null}
        </div>

        <Link
          className="focus-ring mt-auto inline-flex w-fit items-center gap-2 rounded-md pt-5 text-sm font-medium text-[color:var(--primary)]"
          to={`/projects/${localizedProject.slug}`}
        >
          {t('common.caseStudy')}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}
