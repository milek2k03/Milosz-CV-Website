import { Play } from 'lucide-react'
import type { ProjectMedia } from '@/domain/portfolio/entities'

interface ProjectMediaViewProps {
  media: ProjectMedia
  priority?: boolean
}

export function ProjectMediaView({
  media,
  priority = false,
}: ProjectMediaViewProps) {
  if (media.type === 'video') {
    return (
      <div className="relative overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--surface)]">
        <video
          className="aspect-video w-full object-cover"
          controls
          preload="metadata"
          poster={media.posterUrl}
        >
          <source src={media.url} />
        </video>
        <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-black/45 px-2 py-1 text-xs text-white">
          <Play className="size-3" />
          Video
        </div>
      </div>
    )
  }

  return (
    <img
      alt={media.alt}
      className="aspect-video w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] object-cover"
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      height="1080"
      loading={priority ? 'eager' : 'lazy'}
      src={media.url}
      width="1920"
    />
  )
}
