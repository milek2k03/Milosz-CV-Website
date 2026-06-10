import { Container } from '@/presentation/layout/Container'
import { cn } from '@/shared/utils/cn'

interface ProjectGridSkeletonProps {
  className?: string
  count?: number
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-[rgba(148,163,184,0.12)]',
        className,
      )}
    />
  )
}

export function PublicPageSkeleton() {
  return (
    <div className="min-h-svh bg-[color:var(--background)] text-[color:var(--text)]">
      <header className="border-b border-[color:var(--border)] bg-[rgba(11,17,32,0.86)]">
        <Container className="flex h-16 items-center justify-between gap-6">
          <SkeletonBlock className="h-9 w-44" />
          <div className="hidden items-center gap-3 md:flex">
            <SkeletonBlock className="h-8 w-20" />
            <SkeletonBlock className="h-8 w-16" />
            <SkeletonBlock className="h-8 w-20" />
            <SkeletonBlock className="h-9 w-20" />
          </div>
        </Container>
      </header>

      <main>
        <Container className="grid gap-10 py-14 md:grid-cols-[minmax(0,1fr)_360px] md:py-16">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <SkeletonBlock className="h-8 w-32" />
              <SkeletonBlock className="h-8 w-28" />
              <SkeletonBlock className="h-8 w-40" />
            </div>
            <SkeletonBlock className="h-16 max-w-xl" />
            <SkeletonBlock className="mt-6 h-28 max-w-2xl" />
            <div className="mt-8 flex gap-3">
              <SkeletonBlock className="h-12 w-32" />
              <SkeletonBlock className="h-12 w-24" />
              <SkeletonBlock className="h-12 w-32" />
            </div>
          </div>

          <aside className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
            <SkeletonBlock className="h-4 w-40" />
            <div className="mt-5 grid gap-4">
              <SkeletonBlock className="h-10" />
              <SkeletonBlock className="h-10" />
              <SkeletonBlock className="h-10" />
            </div>
          </aside>
        </Container>
      </main>
    </div>
  )
}

export function ProjectGridSkeleton({
  className,
  count = 3,
}: ProjectGridSkeletonProps) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 xl:grid-cols-3', className)}>
      {Array.from({ length: count }, (_, index) => (
        <article
          className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3"
          key={index}
        >
          <SkeletonBlock className="aspect-video w-full" />
          <div className="p-1 pt-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-4 w-12" />
            </div>
            <SkeletonBlock className="h-6 w-4/5" />
            <SkeletonBlock className="mt-4 h-16 w-full" />
            <div className="mt-5 flex gap-2">
              <SkeletonBlock className="h-7 w-14" />
              <SkeletonBlock className="h-7 w-14" />
              <SkeletonBlock className="h-7 w-16" />
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
