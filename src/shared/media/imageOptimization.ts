interface ImageVariantOptions {
  height?: number
  quality?: number
  resize?: 'contain' | 'cover' | 'fill'
  width: number
}

const supabasePublicObjectPath = '/storage/v1/object/public/'
const supabaseRenderImagePath = '/storage/v1/render/image/public/'

export const getOptimizedImageUrl = (
  url: string,
  { height, quality = 72, resize = 'cover', width }: ImageVariantOptions,
) => {
  if (!url.includes(supabasePublicObjectPath)) {
    return url
  }

  try {
    const imageUrl = new URL(url)

    imageUrl.pathname = imageUrl.pathname.replace(
      supabasePublicObjectPath,
      supabaseRenderImagePath,
    )

    imageUrl.searchParams.set('width', String(width))
    imageUrl.searchParams.set('quality', String(quality))
    imageUrl.searchParams.set('resize', resize)

    if (height) {
      imageUrl.searchParams.set('height', String(height))
    }

    return imageUrl.toString()
  } catch {
    return url
  }
}

export const getResponsiveImageSrcSet = (
  url: string,
  widths: number[],
  options?: Omit<ImageVariantOptions, 'width'>,
) =>
  widths
    .map((width) => {
      const height =
        options?.height && widths.length > 0
          ? Math.round((options.height / widths[widths.length - 1]) * width)
          : undefined

      return `${getOptimizedImageUrl(url, {
        ...options,
        height,
        width,
      })} ${width}w`
    })
    .join(', ')
