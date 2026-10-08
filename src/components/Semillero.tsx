import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react"
import logoVerticalCrema from "../assets/brand/logo-vertical-crema.webp"
import { SEMILLERO } from "../content/inicio"
import { POSTEOS, type Posteo } from "../content/semillero"
import { ANCHORS } from "../content/site"
import { prefersReducedMotion } from "../router/navigation"
import Icon from "./Icon"
import Resources from "./Resources"

/** Portada provisoria con la identidad del sitio, para posteos que todavía no tienen imagen. */
function PlaceholderCover({ titulo }: { titulo: string }) {
  // "¿Qué es el PAU?": la sigla va en amarillo, como en la portada del diseño.
  const parts = titulo.split(/(PAU)/)
  return (
    <div className="post-placeholder has-topo topo-oliva-fuerte">
      <img src={logoVerticalCrema} alt="" width={84} height={49} loading="lazy" decoding="async" />
      <span className="post-placeholder-title" aria-hidden="true">
        {parts.map((part, index) => (part === "PAU" ? <em key={index}>PAU</em> : part))}
      </span>
      <span className="post-placeholder-foot" aria-hidden="true">
        Programa de Agricultura Urbana
      </span>
    </div>
  )
}

function PostCard({ post }: { post: Posteo }) {
  const media = (
    <span className="post-media">
      {post.imagen ? (
        <img
          src={post.imagen.src}
          srcSet={post.imagen.srcSet}
          sizes="(max-width: 639px) 82vw, (max-width: 1023px) 45vw, 400px"
          width={post.imagen.width}
          height={post.imagen.height}
          alt={post.href ? "" : post.alt}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <PlaceholderCover titulo={post.titulo} />
      )}
    </span>
  )

  // Sin link todavía: solo la imagen (sin badge, sin link y con cursor normal). El tinte amarillo del hover se mantiene.
  if (!post.href) {
    return (
      <div className="post-card" role={post.imagen ? undefined : "img"} aria-label={post.imagen ? undefined : post.alt}>
        {media}
      </div>
    )
  }

  return (
    <a className="post-card" href={post.href} target="_blank" rel="noreferrer" aria-label={`${post.titulo} (se abre Instagram)`}>
      {media}
      <span className="post-badge">
        Ver en Instagram <Icon name="external" size={15} />
      </span>
    </a>
  )
}

/**
 * Semillero digital: carrusel de posteos de Instagram (imágenes estáticas + link, sin embeds) y,
 * debajo, las guías descargables. Flechas que avanzan de a una tarjeta, swipe con scroll-snap y
 * ← → con el carril enfocado.
 */
export default function Semillero() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const updateEdges = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const start = track.scrollLeft <= 2
    const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2
    setEdges((previous) => (previous.start === start && previous.end === end ? previous : { start, end }))
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    updateEdges()
    const observer = "ResizeObserver" in window ? new ResizeObserver(updateEdges) : null
    observer?.observe(track)
    return () => observer?.disconnect()
  }, [updateEdges])

  const go = (direction: 1 | -1) => {
    const track = trackRef.current
    const slide = track?.querySelector<HTMLElement>(".carousel-slide")
    if (!track || !slide) return
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    track.scrollBy({ left: direction * (slide.offsetWidth + gap), behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault()
      go(event.key === "ArrowRight" ? 1 : -1)
    }
  }

  return (
    <section className="semillero-section has-topo topo-crema" id={ANCHORS.semillero} aria-labelledby="semillero-title">
      <div className="container">
        <header className="semillero-heading">
          <h2 id="semillero-title">{SEMILLERO.titulo}</h2>
          <p>{SEMILLERO.bajada}</p>
        </header>
        <div className="carousel" role="region" aria-roledescription="carrusel" aria-label="Posteos de Instagram del Semillero digital">
          <button
            type="button"
            className="carousel-arrow is-prev"
            aria-label="Posteo anterior"
            disabled={edges.start}
            onClick={() => go(-1)}
          >
            <Icon name="chevronLeft" size={26} />
          </button>
          <div
            className="carousel-track"
            ref={trackRef}
            tabIndex={0}
            role="group"
            aria-label="Posteos: usá las flechas izquierda y derecha para pasar"
            onScroll={updateEdges}
            onKeyDown={onKeyDown}
          >
            {POSTEOS.map((post, index) => (
              <div
                className="carousel-slide"
                key={post.id}
                role="group"
                aria-roledescription="diapositiva"
                aria-label={`${index + 1} de ${POSTEOS.length}: ${post.titulo}`}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="carousel-arrow is-next"
            aria-label="Posteo siguiente"
            disabled={edges.end}
            onClick={() => go(1)}
          >
            <Icon name="chevronRight" size={26} />
          </button>
        </div>
        <Resources />
      </div>
    </section>
  )
}
