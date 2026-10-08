import { useEffect, useRef, useState } from "react"
import { DATOS_IMPACTO, ROTACION_MS } from "../content/impacto"
import { IMPACTO } from "../content/inicio"
import { REDUCED_MOTION_QUERY, useMediaQuery } from "../hooks/useMediaQuery"

/** La pestaña está visible (si no, la plaquita no rota). */
function usePageVisible(): boolean {
  const [visible, setVisible] = useState(() => document.visibilityState === "visible")
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible")
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [])
  return visible
}

/**
 * "Sembramos futuro. Cosechamos comunidad.": banda amarilla con una plaquita que muestra un dato por
 * vez y va rotando. Hecha en HTML/CSS (sin GIF ni imágenes).
 *
 * - Rota cada ~3,5 s; se pausa con hover, con foco, fuera de pantalla y con la pestaña oculta.
 * - Puntitos para elegir el dato. Al hacer click en uno, la rotación se detiene para siempre: la
 *   persona tomó el control (así se cubre la pausa de WCAG 2.2.2 sin un botón aparte).
 * - Con `prefers-reduced-motion` no arranca sola.
 * - La plaquita es decorativa para lectores de pantalla: la lista oculta tiene los 4 datos completos.
 */
export default function ImpactStats() {
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY)
  const pageVisible = usePageVisible()
  const [index, setIndex] = useState(0)
  /** La persona eligió un dato con los puntitos: la rotación queda detenida. */
  const [stopped, setStopped] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inView, setInView] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const running = !stopped && !reducedMotion && !hovered && !focused && inView && pageVisible

  useEffect(() => {
    const element = rootRef.current
    if (!element || !("IntersectionObserver" in window)) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % DATOS_IMPACTO.length), ROTACION_MS)
    return () => window.clearInterval(timer)
  }, [running])

  return (
    <section className="impact-section has-topo topo-amarillo" id="impacto" aria-labelledby="impacto-title">
      <div className="container impact-layout">
        <div className="impact-intro">
          <h2 id="impacto-title">
            {IMPACTO.titulo[0]}
            <br />
            {IMPACTO.titulo[1]}
          </h2>
          <p>{IMPACTO.bajada}</p>
          <ul className="sr-only">
            {DATOS_IMPACTO.map((dato) => (
              <li key={dato.rotulo}>
                {dato.prefijo ? `${dato.prefijo} ` : ""}
                {dato.valor} {dato.rotulo.toLowerCase()}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="impact-rotator"
          ref={rootRef}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false)
          }}
        >
          <div className="plaque" aria-hidden="true">
            {DATOS_IMPACTO.map((dato, position) => (
              <div className={position === index ? "plaque-slide is-active" : "plaque-slide"} key={dato.rotulo}>
                {dato.prefijo && <span className="plaque-prefix">{dato.prefijo}</span>}
                <strong className="plaque-number">{dato.valor}</strong>
                <span className="plaque-label">{dato.rotulo}</span>
              </div>
            ))}
          </div>
          <div className="plaque-controls">
            <ul className="plaque-dots">
              {DATOS_IMPACTO.map((dato, position) => (
                <li key={dato.rotulo}>
                  <button
                    type="button"
                    aria-label={`Ver dato ${position + 1} de ${DATOS_IMPACTO.length}`}
                    aria-current={position === index ? "true" : undefined}
                    onClick={() => {
                      setIndex(position)
                      setStopped(true)
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
