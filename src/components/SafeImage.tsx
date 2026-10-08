import { useState } from "react"
import Icon from "./Icon"

interface SafeImageProps {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  width: number
  height: number
  className?: string
  /** Imágenes del primer pantallazo: sin lazy y con prioridad alta. */
  priority?: boolean
}

/** `<img>` con lazy loading, dimensiones explícitas (sin saltos de layout) y un reemplazo si falla. */
export default function SafeImage({
  src,
  srcSet,
  sizes,
  alt,
  width,
  height,
  className,
  priority = false,
}: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  if (failedSrc === src) {
    return (
      <span
        className={["image-fallback", className].filter(Boolean).join(" ")}
        role="img"
        aria-label={alt}
      >
        <Icon name="leaf" size={26} />
        <span>Imagen no disponible</span>
      </span>
    )
  }

  return (
    <img
      alt={alt}
      className={className}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      height={height}
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailedSrc(src)}
      sizes={sizes}
      src={src}
      srcSet={srcSet}
      width={width}
    />
  )
}
