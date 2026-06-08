import { ArrowRight, Code2, Gamepad2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  usePortfolioSettings,
  useSiteContent,
} from '@/application/portfolio/usePortfolio'
import { getLocalizedSiteContent } from '@/content/defaultSiteContent'
import { ButtonLink } from '@/presentation/components/Button'
import { SectionHeader } from '@/presentation/components/SectionHeader'

const isExternalHref = (href: string) => /^https?:\/\//.test(href)

export function PortfolioAreaCards() {
  const { i18n } = useTranslation()
  const { data: settings } = usePortfolioSettings()
  const { data: siteContent } = useSiteContent()
  const content = getLocalizedSiteContent(siteContent, i18n.language)
  const webHref = settings?.webPortfolioUrl || '/websites'
  const webExternal = isExternalHref(webHref)

  return (
    <section id="obszary" className="border-b border-[color:var(--border)]">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <SectionHeader
          eyebrow={content.areas.eyebrow}
          title={content.areas.title}
          description={content.areas.description}
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
            <div className="grid size-10 place-items-center rounded-md border border-[color:var(--border)] bg-[color:var(--card)]">
              <Gamepad2 className="size-5 text-[color:var(--primary)]" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold">
              {content.areas.unityTitle}
            </h3>
            <p className="mt-3 leading-7 text-[color:var(--muted)]">
              {content.areas.unityDescription}
            </p>
            <Link
              className="focus-ring mt-6 inline-flex items-center gap-2 rounded-md text-sm font-medium text-[color:var(--primary)]"
              to="/unity"
            >
              {content.areas.unityButton}
              <ArrowRight className="size-4" />
            </Link>
          </article>

          <article className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
            <div className="grid size-10 place-items-center rounded-md border border-[color:var(--border)] bg-[color:var(--card)]">
              <Code2 className="size-5 text-[color:var(--primary)]" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold">
              {content.areas.webTitle}
            </h3>
            <p className="mt-3 leading-7 text-[color:var(--muted)]">
              {content.areas.webDescription}
            </p>
            <ButtonLink
              className="mt-6"
              href={webHref}
              rel={webExternal ? 'noreferrer' : undefined}
              target={webExternal ? '_blank' : undefined}
              variant="primary"
            >
              {content.areas.webButton}
            </ButtonLink>
          </article>
        </div>
      </div>
    </section>
  )
}
