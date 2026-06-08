import { ArrowRight, Code2, Gamepad2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  usePortfolioSettings,
  useSiteContent,
} from '@/application/portfolio/usePortfolio'
import { getLocalizedSiteContent } from '@/content/defaultSiteContent'
import { SectionHeader } from '@/presentation/components/SectionHeader'

const isExternalHref = (href: string) => /^https?:\/\//.test(href)
const areaCtaClassName =
  'focus-ring group mt-6 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md border border-[rgba(56,189,248,0.38)] bg-[rgba(56,189,248,0.13)] px-4 text-sm font-semibold text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition-colors hover:border-[rgba(56,189,248,0.62)] hover:bg-[rgba(56,189,248,0.2)]'
const areaCtaIconClassName = 'size-4 transition-transform group-hover:translate-x-0.5'

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
              className={areaCtaClassName}
              to="/unity"
            >
              {content.areas.unityButton}
              <ArrowRight className={areaCtaIconClassName} />
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
            <a
              className={areaCtaClassName}
              href={webHref}
              rel={webExternal ? 'noreferrer' : undefined}
              target={webExternal ? '_blank' : undefined}
            >
              {content.areas.webButton}
              <ArrowRight className={areaCtaIconClassName} />
            </a>
          </article>
        </div>
      </div>
    </section>
  )
}
