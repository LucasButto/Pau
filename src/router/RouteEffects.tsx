import { useEffect, useRef } from "react"
import { useLocation } from "wouter"
import { moveFocus, scrollToAnchor } from "./navigation"

/**
 * Efectos de cada cambio de página: si la URL trae un ancla, scroll hasta ella (también al entrar
 * directo por URL, p. ej. `/sobre-nosotros#labor`); si no, scroll arriba y foco al `<h1>`.
 */
export default function RouteEffects() {
  const [path] = useLocation()
  /** Última ruta atendida (`null` = carga inicial). Evita repetir el efecto con StrictMode. */
  const handledPath = useRef<string | null>(null)

  useEffect(() => {
    if (handledPath.current === path) return
    const isFirst = handledPath.current === null
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""))

    if (!hash) {
      handledPath.current = path
      if (isFirst) return // carga inicial sin ancla: el navegador ya está arriba
      window.scrollTo({ top: 0, behavior: "instant" })
      moveFocus(document.querySelector<HTMLElement>("main h1") ?? document.querySelector<HTMLElement>("main"))
      return
    }

    // La página recién se pintó: se espera un frame y se repite al terminar de cargar las fuentes
    // (pueden cambiar el alto de lo que está arriba), salvo que la persona ya haya scrolleado.
    let cancelled = false
    const frame = requestAnimationFrame(() => {
      handledPath.current = path
      scrollToAnchor(hash, { smooth: false })
      const startY = window.scrollY
      document.fonts?.ready.then(() => {
        if (!cancelled && Math.abs(window.scrollY - startY) < 2) scrollToAnchor(hash, { smooth: false, focus: false })
      })
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [path])

  return null
}
