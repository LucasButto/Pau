import { FRASES_SUPERIORES, HERO } from "../content/inicio"
import { ANCHORS } from "../content/site"
import { seasonInRosario } from "../lib/schedule"
import AppLink from "../router/AppLink"

const COLLAGE_SIZES = "(max-width: 767px) min(520px, calc(100vw - 40px)), 46vw"
const collageSet = (format: "avif" | "webp") =>
  [600, 900, 1086].map((width) => `/img/collage-hero-${width}.${format} ${width}w`).join(", ")

/** Hero de "Raíces Vecinas": frases superiores, titular PLANTATE con el tratamiento del PDF y el collage. */
export default function Hero() {
  return (
    <section className="hero has-topo topo-crema" aria-labelledby="hero-title">
      <div className="container">
        <div className="top-phrases">
          <p>{FRASES_SUPERIORES.izquierda}</p>
          <p>{FRASES_SUPERIORES.derecha(seasonInRosario())}</p>
        </div>
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="hero-kicker">{HERO.antetitulo}</p>
            <h1 id="hero-title" className="hero-title">
              <span className="hero-title-block">{HERO.titulo.bloque}</span>{" "}
              <span className="hero-title-rest">{HERO.titulo.resto}</span>
            </h1>
            <p className="hero-lead">
              <strong>{HERO.bajadaDestacada}</strong>
              {HERO.bajada}
            </p>
            <AppLink className="btn btn-verde" href={`#${ANCHORS.mapa}`}>
              {HERO.boton}
            </AppLink>
          </div>
          {/* Imagen LCP: sin lazy, con prioridad alta (el HTML de la ruta además la precarga). */}
          <picture className="hero-collage">
            <source type="image/avif" srcSet={collageSet("avif")} sizes={COLLAGE_SIZES} />
            <source type="image/webp" srcSet={collageSet("webp")} sizes={COLLAGE_SIZES} />
            <img
              src="/img/collage-hero-900.webp"
              alt={HERO.collageAlt}
              width={1086}
              height={1208}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
      </div>
    </section>
  )
}
