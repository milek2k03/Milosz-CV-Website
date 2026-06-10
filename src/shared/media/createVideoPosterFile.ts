interface VideoPosterOptions {
  maxWidth: number
  maxHeight: number
  quality?: number
}

const posterType = 'image/webp'
const extensionPattern = /\.[a-z0-9]+$/i

const createPosterFileName = (fileName: string) => {
  const baseName = fileName.replace(extensionPattern, '')
  return `${baseName || 'video'}-poster.webp`
}

const waitForVideoEvent = (
  video: HTMLVideoElement,
  eventName: keyof HTMLMediaElementEventMap,
) =>
  new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener(eventName, handleEvent)
      video.removeEventListener('error', handleError)
    }
    const handleEvent = () => {
      cleanup()
      resolve()
    }
    const handleError = () => {
      cleanup()
      reject(new Error('Nie udalo sie odczytac filmu.'))
    }

    video.addEventListener(eventName, handleEvent, { once: true })
    video.addEventListener('error', handleError, { once: true })
  })

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
          return
        }

        reject(new Error('Nie udalo sie utworzyc miniaturki filmu.'))
      },
      posterType,
      quality,
    )
  })

export async function createVideoPosterFile(
  file: File,
  { maxHeight, maxWidth, quality = 0.76 }: VideoPosterOptions,
) {
  if (!file.type.startsWith('video/')) {
    return null
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'metadata'
    video.src = objectUrl

    await waitForVideoEvent(video, 'loadedmetadata')

    const seekTime =
      Number.isFinite(video.duration) && video.duration > 1
        ? Math.min(1, video.duration * 0.08)
        : 0

    if (seekTime > 0) {
      video.currentTime = seekTime
      await waitForVideoEvent(video, 'seeked')
    } else {
      await waitForVideoEvent(video, 'loadeddata').catch(() => undefined)
    }

    const sourceWidth = video.videoWidth
    const sourceHeight = video.videoHeight

    if (!sourceWidth || !sourceHeight) {
      return null
    }

    const scale = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight)
    const targetWidth = Math.round(sourceWidth * scale)
    const targetHeight = Math.round(sourceHeight * scale)
    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const context = canvas.getContext('2d')

    if (!context) {
      return null
    }

    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(video, 0, 0, targetWidth, targetHeight)

    const posterBlob = await canvasToBlob(canvas, quality)

    return new File([posterBlob], createPosterFileName(file.name), {
      lastModified: Date.now(),
      type: posterType,
    })
  } catch {
    return null
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
