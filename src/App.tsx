import { lazy, Suspense } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { AppProviders } from '@/app/providers/AppProviders'
import { ScrollToTop } from '@/presentation/layout/ScrollToTop'

const PageViewTracker = lazy(() =>
  import('@/presentation/analytics/PageViewTracker').then((module) => ({
    default: module.PageViewTracker,
  })),
)

const HomePage = lazy(() =>
  import('@/presentation/pages/HomePage').then((module) => ({
    default: module.HomePage,
  })),
)

const PortfolioAreaPage = lazy(() =>
  import('@/presentation/pages/PortfolioAreaPage').then((module) => ({
    default: module.PortfolioAreaPage,
  })),
)

const NotFoundPage = lazy(() =>
  import('@/presentation/pages/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  })),
)

const AdminPage = lazy(() =>
  import('@/presentation/pages/AdminPage').then((module) => ({
    default: module.AdminPage,
  })),
)

const ProjectDetailPage = lazy(() =>
  import('@/presentation/pages/ProjectDetailPage').then((module) => ({
    default: module.ProjectDetailPage,
  })),
)

function RouteFallback() {
  return (
    <div className="min-h-svh bg-[color:var(--background)] p-8 text-sm text-[color:var(--muted)]">
      Ładowanie...
    </div>
  )
}

function App() {
  return (
    <AppProviders>
      <Router>
        <ScrollToTop />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/unity" element={<PortfolioAreaPage area="unity" />} />
            <Route path="/websites" element={<PortfolioAreaPage area="web" />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </AppProviders>
  )
}

export default App
