import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  Code2,
  Download,
  Mail,
  Send,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { siteProfile } from '@/config/profile'
import {
  usePublishedProjects,
  useSiteContent,
} from '@/application/portfolio/usePortfolio'
import { getLocalizedSiteContent } from '@/content/defaultSiteContent'
import { localizeProject } from '@/domain/portfolio/localizeProject'
import { Badge } from '@/presentation/components/Badge'
import { Button } from '@/presentation/components/Button'
import { CompanyLogoMarquee } from '@/presentation/components/company/CompanyLogoMarquee'
import { ContactForm } from '@/presentation/components/contact/ContactForm'
import { PortfolioAreaCards } from '@/presentation/components/portfolio/PortfolioAreaCards'
import { ProjectCard } from '@/presentation/components/project/ProjectCard'
import { SectionHeader } from '@/presentation/components/SectionHeader'
import { Container } from '@/presentation/layout/Container'
import { SiteShell } from '@/presentation/layout/SiteShell'
import { Seo } from '@/shared/seo/Seo'
import { createPersonSchema } from '@/shared/seo/schema'

export function HomePage() {
  const { i18n, t } = useTranslation()
  const [showAllProjects, setShowAllProjects] = useState(false)
  const { data: projects = [], isLoading } = usePublishedProjects()
  const { data: siteContent } = useSiteContent()
  const content = getLocalizedSiteContent(siteContent, i18n.language)
  const workflowItems = content.workflowItems
  const stackCards = content.stack.cards
  const localizedProjects = projects.map((project) =>
    localizeProject(project, i18n.language),
  )
  const visibleProjects = showAllProjects ? projects : projects.slice(0, 3)
  const unityProjects = visibleProjects.filter(
    (project) => project.area === 'unity',
  )
  const webProjects = visibleProjects.filter((project) => project.area === 'web')
  const hasMoreProjects = projects.length > 3
  const scrollToSection = (sectionId: string) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <SiteShell>
      <Seo
        title={`${siteProfile.fullName} - Unity Developer / Software Developer`}
        description={content.seoDescription}
        jsonLd={createPersonSchema(
          localizedProjects,
          content.heroDescription,
        )}
      />

      <section className="border-b border-[color:var(--border)]">
        <Container className="grid gap-10 py-14 md:grid-cols-[minmax(0,1fr)_360px] md:py-16">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap gap-2">
              {siteProfile.roles.map((role) => (
                <Badge key={role} tone="accent">
                  {role}
                </Badge>
              ))}
            </div>
            <h1 className="text-balance text-5xl font-semibold text-[color:var(--text)] sm:text-6xl">
              {siteProfile.fullName}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
              {content.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                icon={<ArrowRight className="size-4" />}
                onClick={() => scrollToSection('obszary')}
                type="button"
                variant="primary"
              >
                {t('common.projects')}
              </Button>
              <Button
                icon={<Download className="size-4" />}
                onClick={() => scrollToSection('kontakt')}
                type="button"
              >
                {t('common.cv')}
              </Button>
              <Button
                icon={<Send className="size-4" />}
                onClick={() => scrollToSection('kontakt')}
                type="button"
              >
                {t('common.contact')}
              </Button>
            </div>
          </div>

          <aside className="technical-grid rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
            <p className="text-xs font-semibold uppercase text-[color:var(--primary)]">
              {content.currentScope}
            </p>
            <ul className="mt-5 grid gap-4">
              {workflowItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-300">
                  <span className="mt-2 size-1.5 rounded-full bg-[color:var(--primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      </section>

      <PortfolioAreaCards />

      <section id="projekty" className="border-b border-[color:var(--border)]">
        <Container className="py-12 sm:py-16">
          <SectionHeader
            eyebrow={content.projects.eyebrow}
            title={content.projects.title}
            description={content.projects.description}
          />

          <div className="mt-10 grid gap-6">
            {isLoading ? (
              <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-sm text-[color:var(--muted)]">
                {t('common.loadingProjects')}
              </div>
            ) : (
              <>
                {unityProjects.length > 0 ? (
                  <div className="grid gap-4">
                    <h3 className="text-xl font-semibold">
                      {content.projects.unityHeading}
                    </h3>
                    <div className="grid gap-6">
                      {unityProjects.map((project, index) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          priority={index === 0}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {webProjects.length > 0 ? (
                  <div className="grid gap-4">
                    <h3 className="text-xl font-semibold">
                      {content.projects.webHeading}
                    </h3>
                    <div className="grid gap-6">
                      {webProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  </div>
                ) : null}

                {hasMoreProjects ? (
                  <div className="flex justify-center pt-2">
                    <Button
                      icon={
                        showAllProjects ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )
                      }
                      onClick={() =>
                        setShowAllProjects((currentValue) => !currentValue)
                      }
                      type="button"
                    >
                      {showAllProjects
                        ? content.projects.showLess
                        : content.projects.showMore}
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </Container>
      </section>

      <CompanyLogoMarquee />

      <section id="stack" className="border-b border-[color:var(--border)]">
        <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow={content.stack.eyebrow}
            title={content.stack.title}
            description={content.stack.description}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {stackCards.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5"
              >
                <h3 className="font-semibold text-[color:var(--text)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="kontakt">
        <Container className="grid gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_420px]">
          <div>
            <SectionHeader
              eyebrow={content.contact.eyebrow}
              title={content.contact.title}
              description={content.contact.description}
            />
            <div className="grid gap-3">
              <a
                className="focus-ring mt-8 inline-flex items-center gap-3 rounded-md border border-[color:var(--border)] px-4 py-3 text-sm hover:border-cyan-300/45"
                href={`mailto:${siteProfile.email}`}
              >
                <Mail className="size-4 text-[color:var(--primary)]" />
                {siteProfile.email}
              </a>
              <a
                className="focus-ring inline-flex items-center gap-3 rounded-md border border-[color:var(--border)] px-4 py-3 text-sm hover:border-cyan-300/45"
                href={siteProfile.links[0]?.href}
                rel="noreferrer"
                target="_blank"
              >
                <Code2 className="size-4 text-[color:var(--primary)]" />
                {t('common.github')}
              </a>
              <a
                className="focus-ring inline-flex items-center gap-3 rounded-md border border-[color:var(--border)] px-4 py-3 text-sm hover:border-cyan-300/45"
                href={siteProfile.links[1]?.href}
                rel="noreferrer"
                target="_blank"
              >
                <BriefcaseBusiness className="size-4 text-[color:var(--primary)]" />
                {t('common.linkedin')}
              </a>
            </div>
          </div>

          <ContactForm />
        </Container>
      </section>
    </SiteShell>
  )
}
