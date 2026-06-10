import { Play } from 'lucide-react'
import type { SyntheticEvent } from 'react'
import type { ProjectMedia } from '@/domain/portfolio/entities'

interface VideoFrameThumbnailProps {
  media: ProjectMedia
  className?: string
}

interface ProjectMediaViewProps {
  media: ProjectMedia
  autoPlay?: boolean
  priority?: boolean
  showVideoBadge?: boolean
  thumbnailOnly?: boolean
}

export function VideoFrameThumbnail({
  className = 'aspect-video w-full object-fill',
  media,
}: VideoFrameThumbnailProps) {
  const handleLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget
    const seekTime =
      Number.isFinite(video.duration) && video.duration > 1
        ? Math.min(0.25, video.duration * 0.05)
        : 0

    if (seekTime <= 0 || video.currentTime > 0) {
      return
    }

    try {
      video.currentTime = seekTime
    } catch {
      // Some browsers do not allow seeking before enough video data is ready.
    }
  }

  return (
    <video
      aria-label={media.alt}
      className={className}
      muted
      onLoadedMetadata={handleLoadedMetadata}
      playsInline
      poster={media.posterUrl}
      preload="metadata"
      src={media.url}
    />
  )
}

export function ProjectMediaView({
  autoPlay = false,
  media,
  priority = false,
  showVideoBadge = true,
  thumbnailOnly = false,
}: ProjectMediaViewProps) {
  const handleCanPlay = (event: SyntheticEvent<HTMLVideoElement>) => {
    if (!autoPlay) {
      return
    }

    const video = event.currentTarget
    video.muted = false
    video.volume = 1
    void video.play().catch(() => undefined)
  }

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
            <VideoFrameThumbnail media={media} />
          )}
          {showVideoBadge ? (
            <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-black/45 px-2 py-1 text-xs text-white">
              <Play className="size-3" />
              Video
            </div>
          ) : null}
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
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          disableRemotePlayback
          muted={false}
          onCanPlay={handleCanPlay}
          playsInline
          preload={autoPlay ? 'auto' : 'metadata'}
          poster={media.posterUrl}
        >
          <source src={media.url} />
        </video>
        {showVideoBadge ? (
          <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-black/45 px-2 py-1 text-xs text-white">
            <Play className="size-3" />
            Video
          </div>
        ) : null}
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
