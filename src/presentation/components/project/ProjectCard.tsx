import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { Project } from '@/domain/portfolio/entities'
import { localizeProject } from '@/domain/portfolio/localizeProject'
import { Badge } from '@/presentation/components/Badge'
import { ProjectMediaView } from '@/presentation/components/project/ProjectMediaView'

interface ProjectCardProps {
  project: Project
  priority?: boolean
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const { i18n, t } = useTranslation()
  const localizedProject = localizeProject(project, i18n.language)
  const cover = localizedProject.media[0]

  return (
    <article className="group grid gap-0 overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] md:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)]">
      <Link
        className="focus-ring block bg-[color:var(--card)]"
        to={`/projects/${localizedProject.slug}`}
      >
        <div className="project-card-image overflow-hidden">
          {cover ? (
            <ProjectMediaView media={cover} priority={priority} />
          ) : (
            <div className="grid h-full place-items-center text-sm text-[color:var(--muted)]">
              Media projektu
            </div>
          )}
        </div>
      </Link>

      <div className="flex min-h-[320px] flex-col justify-between gap-8 p-6 sm:p-8">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge tone="accent">{localizedProject.role}</Badge>
            <Badge>{String(localizedProject.year)}</Badge>
            {localizedProject.duration ? (
              <Badge>{localizedProject.duration}</Badge>
            ) : null}
          </div>
          <h3 className="text-2xl font-semibold text-[color:var(--text)]">
            {localizedProject.title}
          </h3>
          <p className="mt-2 text-sm font-medium text-[color:var(--muted)]">
            {localizedProject.subtitle}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            {localizedProject.summary}
          </p>
        </div>

        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            {localizedProject.technologies.slice(0, 6).map((technology) => (
              <Badge key={technology}>{technology}</Badge>
            ))}
          </div>
          <Link
            className="focus-ring inline-flex items-center gap-2 rounded-md text-sm font-medium text-[color:var(--primary)]"
            to={`/projects/${localizedProject.slug}`}
          >
            {t('common.caseStudy')}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
