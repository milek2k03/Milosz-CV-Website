import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { getSupportedLocale } from '@/i18n/locales'
import { getPortfolioRepository } from '@/infrastructure/portfolio/repositoryFactory'

const repository = getPortfolioRepository()
const visitorStorageKey = 'portfolio_visitor_id'
const trackedPageViews = new Map<string, number>()
const pageViewDedupeMs = 30_000

const botUserAgentPattern =
  /bot|crawler|spider|crawling|preview|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|googlebot|bingbot|yandex|baiduspider|duckduckbot|ahrefs|semrush|mj12bot|dotbot|petalbot|bytespider|gptbot|chatgpt-user|claudebot|anthropic-ai|perplexitybot|ccbot|applebot|ia_archiver|headlesschrome|phantomjs|puppeteer|playwright|curl|wget|python-requests|httpclient|go-http-client|okhttp|axios|postman|insomnia|uptime|statuscake|pingdom|monitor|lighthouse|pagespeed|gtmetrix/i

const isLikelyHumanVisit = () => {
  if (typeof window === 'undefined') {
    return false
  }

  const userAgent = window.navigator.userAgent

  if (!userAgent || botUserAgentPattern.test(userAgent)) {
    return false
  }

  if (window.navigator.webdriver) {
    return false
  }

  if (window.navigator.languages.length === 0) {
    return false
  }

  const prerenderableDocument = document as Document & {
    prerendering?: boolean
  }

  if (prerenderableDocument.prerendering) {
    return false
  }

  return true
}

const getVisitorId = () => {
  try {
    const storedVisitorId = window.localStorage.getItem(visitorStorageKey)

    if (storedVisitorId) {
      return storedVisitorId
    }

    const visitorId = crypto.randomUUID()
    window.localStorage.setItem(visitorStorageKey, visitorId)
    return visitorId
  } catch {
    return crypto.randomUUID()
  }
}

export function useTrackPageView() {
  const location = useLocation()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (location.pathname.startsWith('/admin') || !isLikelyHumanVisit()) {
      return
    }

    const path = `${location.pathname}${location.search}`
    const visitorId = getVisitorId()
    const trackingKey = `${visitorId}:${path}`
    const now = Date.now()
    const lastTrackedAt = trackedPageViews.get(trackingKey)

    if (lastTrackedAt && now - lastTrackedAt < pageViewDedupeMs) {
      return
    }

    trackedPageViews.set(trackingKey, now)

    void repository
      .trackPageView({
        locale: getSupportedLocale(i18n.language),
        path,
        referrer: document.referrer,
        sessionId: visitorId,
      })
      .catch(() => {
        trackedPageViews.delete(trackingKey)
      })
  }, [i18n.language, location.pathname, location.search])
}

export function useAnalyticsSummary(enabled: boolean) {
  return useQuery({
    queryKey: ['admin', 'analytics-summary'],
    queryFn: () => repository.getAnalyticsSummary(),
    enabled,
    refetchInterval: 60_000,
  })
}
