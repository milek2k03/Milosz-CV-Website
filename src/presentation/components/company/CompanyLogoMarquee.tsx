import { useTranslation } from 'react-i18next'
import { useSiteContent } from '@/application/portfolio/usePortfolio'
import { defaultSiteContent, getLocalizedSiteContent } from '@/content/defaultSiteContent'
import type { CompanyLogo } from '@/domain/portfolio/entities'
import { SectionHeader } from '@/presentation/components/SectionHeader'
import { Container } from '@/presentation/layout/Container'

function LogoGroup({ logos }: { logos: CompanyLogo[] }) {
  return (
    <div className="company-marquee-group flex shrink-0 items-center gap-4 pr-4">
      {logos.map((company) => (
        <div
          aria-label={company.name}
          className="flex h-16 min-w-44 items-center justify-center rounded-md border border-[color:var(--border)] bg-[color:var(--card)] px-5"
          key={company.name}
          role="img"
        >
          <span className="font-mono text-lg font-semibold tracking-normal text-slate-200">
            {company.shortName}
          </span>
        </div>
      ))}
    </div>
  )
}

export function CompanyLogoMarquee() {
  const { i18n } = useTranslation()
  const { data: siteContent } = useSiteContent()
  const content = getLocalizedSiteContent(siteContent, i18n.language)
  const logos =
    siteContent?.companyLogos.length && siteContent.companyLogos.length > 0
      ? siteContent.companyLogos
      : defaultSiteContent.companyLogos

  return (
    <section id="firmy" className="border-b border-[color:var(--border)]">
      <Container className="py-12 sm:py-16">
        <SectionHeader
          eyebrow={content.companies.eyebrow}
          title={content.companies.title}
          description={content.companies.description}
        />

        <div className="mt-10 overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="company-marquee flex w-max items-center py-5">
            <LogoGroup logos={logos} />
            <LogoGroup logos={logos} />
          </div>
        </div>
      </Container>
    </section>
  )
}
