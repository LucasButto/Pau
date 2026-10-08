import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import type { MapController, MapLoadReason } from "./controller"

export type MapStatus = "idle" | "loading" | "ready" | "error" | "unsupported"

interface UseMapOptions {
  onSelect(id: number): void
}

export interface UseMapResult {
  status: MapStatus
  errorReason: MapLoadReason | null
  /** El mapa ya cargado perdió la conexión: puede verse incompleto. */
  offline: boolean
  controller: MapController | null
  retry(): void
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    // Liberamos el contexto de prueba: los navegadores limitan cuántos puede haber abiertos.
    gl?.getExtension("WEBGL_lose_context")?.loseContext()
    return gl !== null
  } catch {
    return false
  }
}

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

function reasonOf(error: unknown): MapLoadReason {
  if (typeof error === "object" && error !== null && "reason" in error) {
    const { reason } = error as { reason: unknown }
    if (
      reason === "offline" ||
      reason === "timeout" ||
      reason === "style" ||
      reason === "unknown"
    )
      return reason
  }

  // Falla del import() dinámico: casi siempre es falta de red.
  return navigator.onLine ? "unknown" : "offline"
}

/**
 * Crea el mapa recién cuando su contenedor se acerca al viewport (y es visible: en mobile, con la
 * pestaña "Mapa" activa), cargando maplibre-gl con `import()` dinámico. Un solo mapa por montaje,
 * también bajo `React.StrictMode`; se destruye al desmontar.
 */
export function useMap(
  containerRef: RefObject<HTMLDivElement | null>,
  { onSelect }: UseMapOptions,
): UseMapResult {
  const [status, setStatus] = useState<MapStatus>("idle")
  const [errorReason, setErrorReason] = useState<MapLoadReason | null>(null)
  const [controller, setController] = useState<MapController | null>(null)
  const [offline, setOffline] = useState(false)
  const [nearViewport, setNearViewport] = useState(false)
  const [attempt, setAttempt] = useState(0)
  /** Falló la descarga del código del mapa: el navegador cachea ese import() fallido. */
  const chunkFailed = useRef(false)
  const onSelectRef = useRef(onSelect)
  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    const element = containerRef.current
    if (!element || nearViewport) return
    if (!("IntersectionObserver" in window)) {
      setNearViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: "250px 0px" },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [containerRef, nearViewport])

  useEffect(() => {
    const element = containerRef.current
    if (!nearViewport || !element) return
    if (!hasWebGL()) {
      setStatus("unsupported")
      return
    }

    const abort = new AbortController()
    let created: MapController | null = null
    setStatus("loading")
    setErrorReason(null)
    setOffline(false)
    import("./controller")
      .catch((error: unknown) => {
        chunkFailed.current = true
        throw error
      })

      .then(({ createMapController }) =>
        createMapController({
          container: element,
          signal: abort.signal,
          reducedMotion: prefersReducedMotion(),
          onSelect: (id) => onSelectRef.current(id),
          onConnectivityChange: setOffline,
        }),
      )

      .then((instance) => {
        if (abort.signal.aborted) {
          instance.destroy()
          return
        }

        created = instance
        setController(instance)
        setStatus("ready")
      })

      .catch((error: unknown) => {
        if (abort.signal.aborted) return
        if (import.meta.env.DEV)
          console.warn("[mapa] no se pudo cargar:", error)
        setErrorReason(reasonOf(error))
        setStatus("error")
      })
    return () => {
      abort.abort()
      created?.destroy()
      setController(null)
    }
  }, [containerRef, nearViewport, attempt])

  // El contenedor cambia de tamaño sin que cambie la ventana (pestañas Lista/Mapa, ficha, etc.).
  useEffect(() => {
    const element = containerRef.current
    if (!controller || !element || !("ResizeObserver" in window)) return
    const observer = new ResizeObserver(() => controller.resize())
    observer.observe(element)
    return () => observer.disconnect()
  }, [containerRef, controller])

  // Un import() dinámico que falló queda cacheado como fallido hasta recargar la página.
  const retry = useCallback(() => {
    if (chunkFailed.current) window.location.reload()
    else setAttempt((value) => value + 1)
  }, [])

  return { status, errorReason, offline, controller, retry }
}
