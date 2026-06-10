import { Play } from 'lucide-react'
import type { ProjectMedia } from '@/domain/portfolio/entities'

interface ProjectMediaViewProps {
  media: ProjectMedia
  autoPlay?: boolean
  priority?: boolean
  thumbnailOnly?: boolean
}

export function ProjectMediaView({
  autoPlay = false,
  media,
  priority = false,
  thumbnailOnly = false,
}: ProjectMediaViewProps) {
  if (media.type === 'video') {
    if (thumbnailOnly) {
      return (
        <div className="relative overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--surface)]">
          {media.posterUrl ? (
            <img
              alt={media.alt}
              className="aspect-video w-full object-fill"
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
              loading={priority ? 'eager' : 'lazy'}
              src={media.posterUrl}
            />
          ) : (
            <div className="grid aspect-video w-full place-items-center text-sm text-[color:var(--muted)]">
              Video
            </div>
          )}
          <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-black/45 px-2 py-1 text-xs text-white">
            <Play className="size-3" />
            Video
          </div>
        </div>
      )
    }

    return (
      <div className="relative overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--surface)]">
        <video
          aria-label={media.alt}
          autoPlay={autoPlay}
          className="aspect-video w-full object-contain"
          controls
          muted={autoPlay}
          playsInline
          preload={autoPlay ? 'auto' : 'metadata'}
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
      className="aspect-video w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] object-fill"
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      height="1080"
      loading={priority ? 'eager' : 'lazy'}
      src={media.url}
      width="1920"
    />
  )
}
