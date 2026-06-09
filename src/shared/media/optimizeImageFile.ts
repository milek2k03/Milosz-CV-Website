interface OptimizeImageOptions {
  maxWidth: number
  maxHeight: number
  quality?: number
  forceAspectRatio?: number
}

const optimizedImageType = 'image/webp'
const optimizedExtensionPattern = /\.[a-z0-9]+$/i

const canOptimizeImage = (file: File) =>
  file.type.startsWith('image/') && file.type !== 'image/svg+xml'

const loadImage = async (file: File) => {
  const objectUrl = URL.createObjectURL(file)

  try {
    const image = new Image()
    image.decoding = 'async'
    image.src = objectUrl

    await image.decode()
    return image
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

const getOptimizedFileName = (fileName: string) => {
  const baseName = fileName.replace(optimizedExtensionPattern, '')
  return `${baseName || 'image'}.webp`
}

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
          return
        }

        reject(new Error('Nie udało się zoptymalizować obrazu.'))
      },
      optimizedImageType,
      quality,
    )
  })

export async function optimizeImageFile(
  file: File,
  {
    forceAspectRatio,
    maxHeight,
    maxWidth,
    quality = 0.82,
  }: OptimizeImageOptions,
) {
  if (!canOptimizeImage(file)) {
    return file
  }

  const image = await loadImage(file).catch(() => null)

  if (!image) {
    return file
  }
  const sourceWidth = image.naturalWidth || image.width
  const sourceHeight = image.naturalHeight || image.height

  if (!sourceWidth || !sourceHeight) {
    return file
  }

  let targetWidth = sourceWidth
  let targetHeight = sourceHeight
  const sourceRatio = sourceWidth / sourceHeight

  if (forceAspectRatio) {
    targetWidth = maxWidth
    targetHeight = Math.round(maxWidth / forceAspectRatio)

    if (targetHeight > maxHeight) {
      targetHeight = maxHeight
      targetWidth = Math.round(maxHeight * forceAspectRatio)
    }
  } else {
    const scale = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight)
    targetWidth = Math.round(sourceWidth * scale)
    targetHeight = Math.round(sourceHeight * scale)
  }

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight

  const context = canvas.getContext('2d')

  if (!context) {
    return file
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'

  if (forceAspectRatio) {
    const targetRatio = targetWidth / targetHeight
    const drawWidth =
      sourceRatio > targetRatio
        ? targetWidth
        : Math.round(targetHeight * sourceRatio)
    const drawHeight =
      sourceRatio > targetRatio
        ? Math.round(targetWidth / sourceRatio)
        : targetHeight
    const drawX = Math.round((targetWidth - drawWidth) / 2)
    const drawY = Math.round((targetHeight - drawHeight) / 2)

    context.clearRect(0, 0, targetWidth, targetHeight)
    context.drawImage(image, drawX, drawY, drawWidth, drawHeight)
  } else {
    context.drawImage(image, 0, 0, targetWidth, targetHeight)
  }

  const optimizedBlob = await canvasToBlob(canvas, quality)

  if (optimizedBlob.size >= file.size && file.type === optimizedImageType) {
    return file
  }

  return new File([optimizedBlob], getOptimizedFileName(file.name), {
    lastModified: Date.now(),
    type: optimizedImageType,
  })
}
