import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { useProjectBySlug } from '@/application/portfolio/usePortfolio'
import { localizeProject } from '@/domain/portfolio/localizeProject'
import { ProjectCaseStudy } from '@/presentation/components/project/ProjectCaseStudy'
import { Container } from '@/presentation/layout/Container'
import { SiteShell } from '@/presentation/layout/SiteShell'
import { Seo } from '@/shared/seo/Seo'
import { createProjectSchema } from '@/shared/seo/schema'

export function ProjectDetailPage() {
  const { i18n, t } = useTranslation()
  const { slug } = useParams()
  const { data: project, isLoading } = useProjectBySlug(slug)
  const localizedProject = project
    ? localizeProject(project, i18n.language)
    : null

  return (
    <SiteShell>
      <Container>
        <Link
          className="focus-ring mt-8 inline-flex items-center gap-2 rounded-md text-sm text-[color:var(--muted)] hover:text-white"
          to="/#projekty"
        >
          <ArrowLeft className="size-4" />
          {t('notFound.backProjects')}
        </Link>

        {isLoading ? (
          <div className="py-20 text-sm text-[color:var(--muted)]">
            {t('common.loadingProject')}
          </div>
        ) : localizedProject ? (
          <>
            <Seo
              canonicalPath={`/projects/${localizedProject.slug}`}
              description={localizedProject.summary}
              image={localizedProject.media[0]?.url}
              jsonLd={createProjectSchema(localizedProject)}
              title={`${localizedProject.title} - Case study`}
            />
            <ProjectCaseStudy project={localizedProject} />
          </>
        ) : (
          <>
            <Seo
              canonicalPath="/404"
              description="Nie znaleziono projektu."
              title="Projekt nie znaleziony"
            />
            <div className="py-20">
              <h1 className="text-3xl font-semibold">
                {t('notFound.projectTitle')}
              </h1>
              <p className="mt-4 text-[color:var(--muted)]">
                {t('notFound.projectDescription')}
              </p>
            </div>
          </>
        )}
      </Container>
    </SiteShell>
  )
}
