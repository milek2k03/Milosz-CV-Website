import { useTrackPageView } from '@/application/analytics/useAnalytics'

export function PageViewTracker() {
  useTrackPageView()

  return null
}
