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
    if (location.pathname.startsWith('/admin')) {
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
