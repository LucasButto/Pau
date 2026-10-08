import type { CSSProperties } from "react"
import logoHojaCrema from "../assets/brand/logo-hoja-crema.webp"
import BandaVerde from "../components/BandaVerde"
import Icon from "../components/Icon"
import { AUSPICIANTES } from "../content/auspiciantes"
import { MAP_CTA } from "../content/navegacion"
import { ANCHORS, PAGES } from "../content/site"
import {
  BANDA_DECADAS,
  CTA_HUERTA,
  HERO_SOBRE,
  HISTORIA,
  OBJETIVOS,
  PROPUESTAS,
  QUIENES_SOMOS,
} from "../content/sobre-nosotros"
import AppLink from "../router/AppLink"
import { usePageMeta } from "../router/usePageMeta"

const photoSet = (format: "avif" | "webp") =>
  `/img/sobre-nosotros-600.${format} 600w, /img/sobre-nosotros-870.${format} 870w`

/** Foto de la página (TODO: original en alta). Hero a sangre y foto de Objetivos. */
function Photo({ alt, sizes, priority = false }: { alt: string; sizes: string; priority?: boolean }) {
  return (
    <picture>
      <source type="image/avif" srcSet={photoSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={photoSet("webp")} sizes={sizes} />
      <img
        src="/img/sobre-nosotros-870.webp"
        alt={alt}
        width={870}
        height={580}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
      />
    </picture>
  )
}

/**
 * Franja de instituciones que acompañan al PAU. Sin logos cargados no se muestra en producción; en
 * desarrollo se ven 5 círculos vacíos para revisar el diseño.
 */
function Auspiciantes() {
  const placeholders = import.meta.env.DEV && AUSPICIANTES.length === 0
  if (!AUSPICIANTES.length && !placeholders) return null
  return (
    <section className="sponsors">
      <div className="container">
        <ul className="sponsor-list" aria-label="Instituciones que acompañan al PAU">
          {placeholders
            ? Array.from({ length: 5 }, (_, index) => (
                <li key={index} className="sponsor">
                  <span className="sponsor-circle is-placeholder">Logo</span>
                </li>
              ))
            : AUSPICIANTES.map((sponsor) => {
                // En reposo, el logo en Azul Cianotipia (máscara); con link, a color al pasar el mouse.
                const logo = (
                  <span className="sponsor-circle">
                    <span
                      className="sponsor-mono"
                      role="img"
                      aria-label={sponsor.nombre}
                      style={{ "--logo": `url("${sponsor.logo}")` } as CSSProperties}
                    />
                    {sponsor.href && <img src={sponsor.logo} alt="" loading="lazy" decoding="async" />}
                  </span>
                )
                return (
                  <li key={sponsor.nombre} className="sponsor">
                    {sponsor.href ? (
                      <a href={sponsor.href} target="_blank" rel="noreferrer">
                        {logo}
                        <span className="sr-only"> (se abre en una pestaña nueva)</span>
                      </a>
                    ) : (
                      logo
                    )}
                  </li>
                )
              })}
        </ul>
      </div>
    </section>
  )
}

/** Página institucional: hero, historia, Quiénes somos, Propuestas, Objetivos, CTA y auspiciantes. */
export default function SobreNosotros() {
  const page = PAGES.institucional
  usePageMeta({ title: page.seo.title, description: page.seo.description, path: page.path })

  return (
    <>
      <section className="about-hero" aria-labelledby="about-title">
        <Photo alt={HERO_SOBRE.fotoAlt} sizes="100vw" priority />
        <div className="container about-hero-content">
          <h1 id="about-title" className="about-title">
            <span className="about-title-pre">{HERO_SOBRE.antetitulo}</span>{" "}
            <span className="about-title-main">
              {HERO_SOBRE.titulo[0]}{" "}
              <span className="about-title-last">
                {HERO_SOBRE.titulo[1]}
                <img src={logoHojaCrema} alt="" width={105} height={90} />
              </span>
            </span>
          </h1>
          <p className="about-lead">{HERO_SOBRE.bajada}</p>
          <AppLink className="btn btn-crema" href={`#${ANCHORS.historia}`}>
            {HERO_SOBRE.boton}
          </AppLink>
        </div>
      </section>

      <BandaVerde id={ANCHORS.historia} labelledBy="historia-title">
        <div className="decades">
          <Icon name="sprout" size={34} strokeWidth={1.5} />
          <div>
            <h2 id="historia-title">{BANDA_DECADAS.titulo}</h2>
            <p>{BANDA_DECADAS.texto}</p>
          </div>
        </div>
      </BandaVerde>

      {HISTORIA && (
        <section className="about-section about-history has-topo topo-crema" aria-labelledby="historia-completa-title">
          <div className="container">
            <h2 id="historia-completa-title" className="about-heading">
              {HISTORIA.titulo}
            </h2>
            {HISTORIA.parrafos.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      <section className="about-section about-who has-topo topo-crema" id={ANCHORS.queEsElPau} aria-labelledby="quienes-title">
        <div className="container">
          <h2 id="quienes-title" className="about-heading">
            {QUIENES_SOMOS.titulo}
          </h2>
          <div className="about-text">
            {QUIENES_SOMOS.parrafos.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section about-proposals has-topo topo-amarillo" id={ANCHORS.labor} aria-labelledby="propuestas-title">
        <div className="container">
          <h2 id="propuestas-title" className="about-heading">
            {PROPUESTAS.titulo}
          </h2>
          <ul className="about-list">
            {PROPUESTAS.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-goals" aria-labelledby="objetivos-title">
        <div className="container about-goals-layout">
          <div className="about-goals-copy">
            <h2 id="objetivos-title" className="about-heading">
              {OBJETIVOS.titulo}
            </h2>
            <ul className="about-list">
              {OBJETIVOS.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="about-goals-photo">
          <Photo alt={OBJETIVOS.fotoAlt} sizes="(max-width: 767px) 100vw, 50vw" />
        </div>
      </section>

      <section className="cta-huerta" aria-labelledby="cta-huerta-title">
        <div className="container">
          <h2 id="cta-huerta-title">
            {CTA_HUERTA.titulo[0]}
            <br />
            {CTA_HUERTA.titulo[1]}
          </h2>
          <p>{CTA_HUERTA.texto}</p>
          <AppLink className="btn btn-crema" href={MAP_CTA.href}>
            {CTA_HUERTA.boton} <Icon name="arrow" size={18} />
          </AppLink>
        </div>
      </section>

      <Auspiciantes />
    </>
  )
}
