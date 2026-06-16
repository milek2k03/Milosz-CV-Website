import { useTranslation } from 'react-i18next'
import { useSiteContent } from '@/application/portfolio/usePortfolio'
import { defaultSiteContent, getLocalizedSiteContent } from '@/content/defaultSiteContent'
import type { CompanyLogo } from '@/domain/portfolio/entities'
import { SectionHeader } from '@/presentation/components/SectionHeader'
import { Container } from '@/presentation/layout/Container'
import {
  getOptimizedImageUrl,
  getResponsiveImageSrcSet,
} from '@/shared/media/imageOptimization'

function LogoGroup({ logos }: { logos: CompanyLogo[] }) {
  return (
    <div className="company-marquee-group flex shrink-0 items-center gap-4 pr-4">
      {logos.map((company, index) => (
        <div
          aria-label={company.name}
          className="flex aspect-video w-44 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--card)]"
          key={`${company.storagePath ?? company.name}-${index}`}
          role="img"
        >
          {company.imageUrl ? (
            <img
              alt={company.name}
              className="h-full w-full object-contain p-3"
              decoding="async"
              fetchPriority="low"
              height="99"
              loading="lazy"
              onError={(event) => {
                const image = event.currentTarget
                image.onerror = null
                image.srcset = ''
                image.src = company.imageUrl ?? ''
              }}
              sizes="176px"
              src={getOptimizedImageUrl(company.imageUrl, {
                height: 99,
                quality: 72,
                resize: 'contain',
                width: 176,
              })}
              srcSet={getResponsiveImageSrcSet(company.imageUrl, [176, 352], {
                height: 198,
                quality: 72,
                resize: 'contain',
              })}
              width="176"
            />
          ) : (
            <span className="px-5 text-center font-mono text-lg font-semibold tracking-normal text-slate-200">
              {company.shortName}
            </span>
          )}
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
    <section
      id="firmy"
      className="render-later border-b border-[color:var(--border)]"
    >
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
