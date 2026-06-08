import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Container } from '@/presentation/layout/Container'
import { SiteShell } from '@/presentation/layout/SiteShell'
import { Seo } from '@/shared/seo/Seo'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <SiteShell>
      <Seo
        canonicalPath="/404"
        description={t('notFound.description')}
        title={t('notFound.title')}
      />
      <Container className="py-20">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase text-[color:var(--primary)]">
            404
          </p>
          <h1 className="mt-4 text-4xl font-semibold">
            {t('notFound.title')}
          </h1>
          <p className="mt-4 text-[color:var(--muted)]">
            {t('notFound.description')}
          </p>
          <Link
            className="focus-ring mt-8 inline-flex rounded-md text-sm font-medium text-[color:var(--primary)]"
            to="/"
          >
            {t('notFound.backHome')}
          </Link>
        </div>
      </Container>
    </SiteShell>
  )
}
