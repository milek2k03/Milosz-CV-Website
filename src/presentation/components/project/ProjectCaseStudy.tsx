import { ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Project } from '@/domain/portfolio/entities'
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

      <div className="mt-10 grid gap-4">
        {localizedProject.media.length > 0 ? (
          localizedProject.media.map((media, index) => (
            <ProjectMediaView
              key={media.id}
              media={media}
              priority={index === 0}
            />
          ))
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
