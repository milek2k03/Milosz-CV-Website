import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { siteProfile } from '@/config/profile'
import { getSupportedLocale } from '@/i18n/locales'

interface SeoProps {
  title: string
  description: string
  canonicalPath?: string
  image?: string
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
}

const upsertMeta = (
  selector: string,
  attribute: 'content',
  value: string,
  create: () => HTMLMetaElement,
) => {
  const existing = document.head.querySelector<HTMLMetaElement>(selector)
  const element = existing ?? create()
  element.setAttribute(attribute, value)

  if (!existing) {
    document.head.append(element)
  }
}

const upsertNamedMeta = (name: string, content: string) => {
  upsertMeta(`meta[name="${name}"]`, 'content', content, () => {
    const element = document.createElement('meta')
    element.setAttribute('name', name)
    return element
  })
}

const upsertPropertyMeta = (property: string, content: string) => {
  upsertMeta(`meta[property="${property}"]`, 'content', content, () => {
    const element = document.createElement('meta')
    element.setAttribute('property', property)
    return element
  })
}

const upsertLink = (rel: string, href: string, hreflang?: string) => {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`
  const existing = document.head.querySelector<HTMLLinkElement>(selector)
  const element = existing ?? document.createElement('link')
  element.setAttribute('rel', rel)
  element.setAttribute('href', href)

  if (hreflang) {
    element.setAttribute('hreflang', hreflang)
  }

  if (!existing) {
    document.head.append(element)
  }
}

const getImageType = (url: string) => {
  if (url.endsWith('.svg')) return 'image/svg+xml'
  if (url.endsWith('.png')) return 'image/png'
  if (url.endsWith('.webp')) return 'image/webp'
  return 'image/jpeg'
}

const getLocalizedUrl = (canonicalPath: string, locale: 'pl' | 'en') => {
  const url = new URL(canonicalPath, siteProfile.siteUrl)

  if (locale === 'en') {
    url.searchParams.set('lng', 'en')
  } else {
    url.searchParams.delete('lng')
  }

  return url.toString()
}

export function Seo({
  title,
  description,
  canonicalPath = '/',
  image = '/og-image.svg',
  jsonLd,
}: SeoProps) {
  const { i18n } = useTranslation()
  const locale = getSupportedLocale(i18n.language)
  const canonicalUrl = getLocalizedUrl(canonicalPath, locale)
  const polishUrl = getLocalizedUrl(canonicalPath, 'pl')
  const englishUrl = getLocalizedUrl(canonicalPath, 'en')
  const imageUrl = new URL(image, siteProfile.siteUrl).toString()
  const imageType = getImageType(imageUrl)
  const jsonLdContent = jsonLd ? JSON.stringify(jsonLd) : undefined

  useEffect(() => {
    document.title = title
    document.documentElement.lang = locale
    upsertNamedMeta('description', description)
    upsertPropertyMeta('og:type', 'website')
    upsertPropertyMeta('og:site_name', 'Miłosz Czech Portfolio')
    upsertPropertyMeta('og:title', title)
    upsertPropertyMeta('og:description', description)
    upsertPropertyMeta('og:url', canonicalUrl)
    upsertPropertyMeta('og:image', imageUrl)
    upsertPropertyMeta('og:image:secure_url', imageUrl)
    upsertPropertyMeta('og:image:type', imageType)
    upsertPropertyMeta('og:image:width', '1200')
    upsertPropertyMeta('og:image:height', '630')
    upsertPropertyMeta('og:image:alt', title)
    upsertPropertyMeta('og:locale', locale === 'pl' ? 'pl_PL' : 'en_US')
    upsertPropertyMeta('og:locale:alternate', locale === 'pl' ? 'en_US' : 'pl_PL')
    upsertNamedMeta('twitter:card', 'summary_large_image')
    upsertNamedMeta('twitter:title', title)
    upsertNamedMeta('twitter:description', description)
    upsertNamedMeta('twitter:image', imageUrl)
    upsertNamedMeta('twitter:image:alt', title)
    upsertNamedMeta(
      'thumbnail',
      new URL('/milosz-small-logo.png', siteProfile.siteUrl).toString(),
    )

    upsertLink('canonical', canonicalUrl)
    upsertLink('alternate', polishUrl, 'pl')
    upsertLink('alternate', englishUrl, 'en')
    upsertLink('alternate', polishUrl, 'x-default')
    upsertLink('image_src', imageUrl)

    const existingJsonLd = document.head.querySelector<HTMLScriptElement>(
      'script[data-json-ld="page"]',
    )

    if (jsonLdContent) {
      const script = existingJsonLd ?? document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.jsonLd = 'page'
      script.textContent = jsonLdContent

      if (!existingJsonLd) {
        document.head.append(script)
      }
    } else {
      existingJsonLd?.remove()
    }
  }, [
    canonicalUrl,
    description,
    englishUrl,
    imageType,
    imageUrl,
    jsonLdContent,
    locale,
    polishUrl,
    title,
  ])

  return null
}
