import { Play } from 'lucide-react'
import { useState, type ReactNode, type SyntheticEvent } from 'react'
import type { ProjectMedia } from '@/domain/portfolio/entities'

type MediaOrientation = 'landscape' | 'portrait'

interface VideoFrameThumbnailProps {
  media: ProjectMedia
  className?: string
}

interface OrientationAwareImageFrameProps {
  alt: string
  children?: ReactNode
  className?: string
  decoding?: 'async' | 'auto' | 'sync'
  fetchPriority?: 'auto' | 'high' | 'low'
  imageClassName?: string
  landscapeClassName?: string
  loading?: 'eager' | 'lazy'
  portraitClassName?: string
  src: string
}

interface ProjectMediaViewProps {
  media: ProjectMedia
  autoPlay?: boolean
  priority?: boolean
  showVideoBadge?: boolean
  thumbnailOnly?: boolean
}

const getMediaOrientation = (
  width: number,
  height: number,
): MediaOrientation => (height > width ? 'portrait' : 'landscape')

export function OrientationAwareImageFrame({
  alt,
  children,
  className = '',
  decoding = 'async',
  fetchPriority = 'auto',
  imageClassName = 'object-contain',
  landscapeClassName = 'aspect-video w-full',
  loading = 'lazy',
  portraitClassName = 'mx-auto aspect-[9/16] h-72 max-w-full sm:h-80',
  src,
}: OrientationAwareImageFrameProps) {
  const [orientation, setOrientation] =
    useState<MediaOrientation>('landscape')
  const frameClassName =
    orientation === 'portrait' ? portraitClassName : landscapeClassName

  return (
    <div className={`${frameClassName} ${className}`}>
      <img
        alt={alt}
        className={`h-full w-full ${imageClassName}`}
        decoding={decoding}
        fetchPriority={fetchPriority}
        loading={loading}
        onLoad={(event) => {
          const image = event.currentTarget
          setOrientation(
            getMediaOrientation(image.naturalWidth, image.naturalHeight),
          )
        }}
        src={src}
      />
      {children}
    </div>
  )
}

export function VideoFrameThumbnail({
  className = 'aspect-video w-full object-contain',
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
        <div className="relative h-full w-full overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--surface)]">
          {media.posterUrl ? (
            <OrientationAwareImageFrame
              alt={media.alt}
              fetchPriority={priority ? 'high' : 'auto'}
              imageClassName="object-contain"
              landscapeClassName="aspect-video h-full w-full"
              loading={priority ? 'eager' : 'lazy'}
              portraitClassName="mx-auto aspect-[9/16] h-full max-w-full"
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
