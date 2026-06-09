import { BriefcaseBusiness, Code2, FileText, Mail } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  useCvDocument,
  useSiteContent,
} from '@/application/portfolio/usePortfolio'
import brandLogoUrl from '@/assets/brand/milosz-logo.png'
import { siteProfile } from '@/config/profile'
import { getLocalizedSiteContent } from '@/content/defaultSiteContent'
import { getSupportedLocale, type SupportedLocale } from '@/i18n/locales'
import { Container } from '@/presentation/layout/Container'
import { cn } from '@/shared/utils/cn'

const navItems = [
  { id: 'obszary', labelKey: 'common.areas' },
  { id: 'projekty', labelKey: 'common.projects' },
  { id: 'firmy', labelKey: 'common.companies' },
  { id: 'stack', labelKey: 'common.stack' },
  { id: 'kontakt', labelKey: 'common.contact' },
] as const

export function SiteShell({ children }: PropsWithChildren) {
  const { i18n, t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { data: siteContent } = useSiteContent()
  const currentLocale = getSupportedLocale(i18n.language)
  const { data: cvDocument } = useCvDocument(currentLocale)
  const content = getLocalizedSiteContent(siteContent, currentLocale)
  const cvUrl = cvDocument?.url ?? siteProfile.cvUrl ?? '#kontakt'
  const scrollTopLabel =
    currentLocale === 'en' ? 'Scroll to top' : 'Przewiń na górę'

  const changeLanguage = (locale: SupportedLocale) => {
    void i18n.changeLanguage(locale)
  }

  const scrollToSection = (sectionId: string) => {
    const scroll = () => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`)
      window.setTimeout(scroll, 80)
      return
    }

    window.history.replaceState(null, '', `#${sectionId}`)
    scroll()
  }

  const scrollToTop = () => {
    window.history.replaceState(
      null,
      '',
      `${location.pathname}${location.search}`,
    )
    window.scrollTo({ behavior: 'smooth', top: 0 })
  }

  return (
    <div className="min-h-svh bg-[color:var(--background)] text-[color:var(--text)]">
      <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[rgba(11,17,32,0.86)] backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-6">
          <button
            type="button"
            className="focus-ring inline-flex cursor-pointer items-center rounded-md border-0 bg-transparent p-0"
            aria-label={scrollTopLabel}
            onClick={scrollToTop}
          >
            <img
              alt={siteProfile.fullName}
              className="h-9 w-auto max-w-[180px] object-contain sm:h-10 sm:max-w-[220px]"
              decoding="async"
              height="250"
              src={brandLogoUrl}
              width="1040"
            />
          </button>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1 text-sm text-[color:var(--muted)] md:flex">
              {navItems.map((item) => (
                <a
                  className="focus-ring rounded-md px-3 py-2 hover:text-white"
                  href={`#${item.id}`}
                  key={item.id}
                  onClick={(event) => {
                    event.preventDefault()
                    scrollToSection(item.id)
                  }}
                >
                  {t(item.labelKey)}
                </a>
              ))}
            </nav>

            <div
              aria-label={t('common.language')}
              className="grid grid-cols-2 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] p-1 text-xs font-medium"
              role="group"
            >
              {(['pl', 'en'] as const).map((locale) => (
                <button
                  className={cn(
                    'focus-ring min-h-8 rounded px-2 transition-colors',
                    currentLocale === locale
                      ? 'bg-cyan-300 text-slate-950'
                      : 'text-[color:var(--muted)] hover:text-white',
                  )}
                  key={locale}
                  onClick={() => changeLanguage(locale)}
                  type="button"
                >
                  {locale.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[color:var(--border)]">
        <Container className="flex flex-col gap-5 py-8 text-sm text-[color:var(--muted)] md:flex-row md:items-center md:justify-between">
          <p>
            {siteProfile.fullName} / {content.footerTagline}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              className="focus-ring inline-flex items-center gap-2 rounded-md hover:text-white"
              href={`mailto:${siteProfile.email}`}
            >
              <Mail className="size-4" />
              {t('common.email')}
            </a>
            <a
              className="focus-ring inline-flex items-center gap-2 rounded-md hover:text-white"
              href={siteProfile.links[0]?.href}
              rel="noreferrer"
              target="_blank"
            >
              <Code2 className="size-4" />
              {t('common.github')}
            </a>
            <a
              className="focus-ring inline-flex items-center gap-2 rounded-md hover:text-white"
              href={siteProfile.links[1]?.href}
              rel="noreferrer"
              target="_blank"
            >
              <BriefcaseBusiness className="size-4" />
              {t('common.linkedin')}
            </a>
            <a
              className="focus-ring inline-flex items-center gap-2 rounded-md hover:text-white"
              href={cvUrl}
              rel={cvUrl.startsWith('http') ? 'noreferrer' : undefined}
              target={cvUrl.startsWith('http') ? '_blank' : undefined}
            >
              <FileText className="size-4" />
              CV
            </a>
          </div>
        </Container>
      </footer>
    </div>
  )
}
