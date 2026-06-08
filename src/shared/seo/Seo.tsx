import { useEffect } from 'react'
import { siteProfile } from '@/config/profile'

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

export function Seo({
  title,
  description,
  canonicalPath = '/',
  image = '/og-image.svg',
  jsonLd,
}: SeoProps) {
  const canonicalUrl = new URL(canonicalPath, siteProfile.siteUrl).toString()
  const imageUrl = new URL(image, siteProfile.siteUrl).toString()
  const jsonLdContent = jsonLd ? JSON.stringify(jsonLd) : undefined

  useEffect(() => {
    document.title = title
    upsertNamedMeta('description', description)
    upsertPropertyMeta('og:title', title)
    upsertPropertyMeta('og:description', description)
    upsertPropertyMeta('og:url', canonicalUrl)
    upsertPropertyMeta('og:image', imageUrl)
    upsertNamedMeta('twitter:title', title)
    upsertNamedMeta('twitter:description', description)
    upsertNamedMeta('twitter:image', imageUrl)

    const canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    )
    const canonicalElement = canonical ?? document.createElement('link')
    canonicalElement.setAttribute('rel', 'canonical')
    canonicalElement.setAttribute('href', canonicalUrl)

    if (!canonical) {
      document.head.append(canonicalElement)
    }

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
  }, [canonicalUrl, description, imageUrl, jsonLdContent, title])

  return null
}
