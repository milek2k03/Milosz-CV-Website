import { useTranslation } from 'react-i18next'
import { hasSupabaseConfig } from '@/config/env'
import type { ProjectArea } from '@/domain/portfolio/entities'
import {
  usePublishedProjects,
  useSiteContent,
} from '@/application/portfolio/usePortfolio'
import { getLocalizedSiteContent } from '@/content/defaultSiteContent'
import { localizeProject } from '@/domain/portfolio/localizeProject'
import {
  ProjectGridSkeleton,
  PublicPageSkeleton,
} from '@/presentation/components/LoadingSkeleton'
import { ProjectCard } from '@/presentation/components/project/ProjectCard'
import { SectionHeader } from '@/presentation/components/SectionHeader'
import { Container } from '@/presentation/layout/Container'
import { SiteShell } from '@/presentation/layout/SiteShell'
import { Seo } from '@/shared/seo/Seo'
import { createPersonSchema } from '@/shared/seo/schema'

interface PortfolioAreaPageProps {
  area: ProjectArea
}

export function PortfolioAreaPage({ area }: PortfolioAreaPageProps) {
  const { i18n, t } = useTranslation()
  const { data: projects = [], isLoading } = usePublishedProjects()
  const { data: siteContent, isLoading: isSiteContentLoading } =
    useSiteContent()

  if (hasSupabaseConfig && isSiteContentLoading) {
    return <PublicPageSkeleton />
  }

  const content = getLocalizedSiteContent(siteContent, i18n.language)
  const filteredProjects = projects.filter((project) => project.area === area)
  const localizedProjects = filteredProjects.map((project) =>
    localizeProject(project, i18n.language),
  )
  const title =
    area === 'unity' ? content.areaPages.unityTitle : content.areaPages.webTitle
  const description =
    area === 'unity'
      ? content.areaPages.unityDescription
      : content.areaPages.webDescription
  const canonicalPath = area === 'unity' ? '/unity' : '/websites'

  return (
    <SiteShell>
      <Seo
        canonicalPath={canonicalPath}
        description={description}
        jsonLd={createPersonSchema(localizedProjects, description)}
        title={`${title} - ${area === 'unity' ? 'Unity / VR' : 'Web'}`}
      />

      <section className="border-b border-[color:var(--border)]">
        <Container className="py-12 sm:py-16">
          <SectionHeader
            eyebrow={area === 'unity' ? t('common.unity') : t('common.web')}
            title={title}
            description={description}
          />
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <ProjectGridSkeleton className="sm:col-span-2 xl:col-span-3" />
          ) : localizedProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                priority={index === 0}
                project={project}
              />
            ))
          ) : (
            <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-sm text-[color:var(--muted)] sm:col-span-2 xl:col-span-3">
              {content.areaPages.empty}
            </div>
          )}
        </div>
      </Container>
    </SiteShell>
  )
}
