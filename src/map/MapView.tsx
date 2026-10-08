import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import Icon from "../components/Icon"
import { CATEGORIES, CATEGORY_LIST, type Location } from "../data/locations"
import type { FocusRequest } from "../hooks/useDirectory"
import { GRAN_ROSARIO_BOUNDS, isWithin, type LatLng } from "../lib/geo"
import type { Padding } from "./controller"
import { useMap } from "./useMap"

interface MapViewProps {
  /** Resultados visibles (filtrados). */
  locations: readonly Location[]
  selectedId: number | null
  focusRequest: FocusRequest | null
  userPosition: LatLng | null
  /** Aumenta cada vez que se obtiene la ubicación del usuario. */
  userLocateSeq: number
  locating: boolean
  /** El contenedor se ve (en mobile, pestaña "Mapa" activa). */
  active: boolean
  onSelect(id: number): void
  onLocate(): void
  /** En mobile, cuando el mapa no está disponible, ofrece volver a la lista. */
  onShowList?(): void
  /** Ficha del punto seleccionado (se mide para que la cámara no la tape). */
  detail: ReactNode
  /** Avisos (por ejemplo, de geolocalización). */
  notice?: ReactNode
}

const EDGE = 24

/** Los pines se apoyan en la coordenada y crecen hacia arriba: lugar extra para que no los tape la barra. */
const PIN_CLEARANCE = 56

export default function MapView(props: MapViewProps) {
  const {
    locations,
    selectedId,
    focusRequest,
    userPosition,
    userLocateSeq,
    locating,
    active,
    onSelect,
    onLocate,
    onShowList,
    detail,
    notice,
  } = props

  const frameRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const topbarRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  /** Último pin clickeado: al abrirse su ficha, se corre la cámara si lo tapa. */
  const pendingEnsure = useRef<number | null>(null)
  const handleMapSelect = useCallback(
    (id: number) => {
      pendingEnsure.current = id
      onSelect(id)
    },
    [onSelect],
  )

  const { status, errorReason, offline, controller, retry } = useMap(
    containerRef,
    { onSelect: handleMapSelect },
  )

  const [fitSeq, setFitSeq] = useState(0)
  /** Zona libre del mapa: descuenta la barra superior, los controles y la ficha abierta. */
  const getPadding = useCallback((): Padding => {
    const padding = { top: EDGE, right: EDGE, bottom: EDGE, left: EDGE }
    const frame = frameRef.current?.getBoundingClientRect()
    if (!frame) return padding
    const topbar = topbarRef.current?.getBoundingClientRect()
    padding.top = (topbar ? topbar.bottom - frame.top : 0) + PIN_CLEARANCE
    const controls = controlsRef.current?.getBoundingClientRect()
    if (controls && controls.width > 0) {
      // Abajo (escritorio) se descuentan del borde inferior; arriba a un costado (mobile), del lateral.
      if (controls.top - frame.top > frame.height / 2)
        padding.bottom = Math.max(
          padding.bottom,
          frame.bottom - controls.top + 12,
        )
      else
        padding.right = Math.max(
          padding.right,
          frame.right - controls.left + 12,
        )
    }

    // La atribución (obligatoria) tampoco debe tapar pines.
    const attribution = frameRef.current
      ?.querySelector(".maplibregl-ctrl-bottom-right")
      ?.getBoundingClientRect()
    const attributionHeight =
      attribution && attribution.height > 0 ? attribution.height : 0
    if (attributionHeight)
      padding.bottom = Math.max(padding.bottom, attributionHeight + 12)
    const panel = detailRef.current?.firstElementChild?.getBoundingClientRect()
    if (panel && panel.width > 0) {
      if (panel.width < frame.width * 0.6)
        padding.right = Math.max(padding.right, frame.right - panel.left + EDGE)
      // Panel inferior: la atribución se apoya sobre él, así que su alto también se descuenta.
      else
        padding.bottom = Math.max(
          padding.bottom,
          frame.bottom - panel.top + attributionHeight + EDGE,
        )
    }

    return padding
  }, [])

  const resultsKey = locations.map((location) => location.id).join(",")
  const fitKey = `${resultsKey}:${fitSeq}`
  // Los efectos de cámara leen siempre los últimos valores sin re-ejecutarse por cada render.
  const latest = useRef({ locations, fitKey })
  useEffect(() => {
    latest.current = { locations, fitKey }
  })

  const fittedKey = useRef<string | null>(null)
  const handledFocus = useRef(0)
  const handledLocate = useRef(0)
  // Mapa ↔ datos: puntos filtrados y pin seleccionado.
  useEffect(() => {
    controller?.setData(locations, selectedId)
  }, [controller, locations, selectedId])

  useEffect(() => {
    controller?.setUser(userPosition)
  }, [controller, userPosition])

  // Al volverse visible (pestaña "Mapa"), el contenedor cambió de tamaño.
  useEffect(() => {
    if (active) controller?.resize()
  }, [active, controller])

  // "Explorar" desde el directorio: volar al punto. Tiene prioridad sobre un encuadre pendiente.
  useEffect(() => {
    if (
      !controller ||
      !active ||
      !focusRequest ||
      focusRequest.seq === handledFocus.current
    )
      return
    fittedKey.current = latest.current.fitKey
    pendingEnsure.current = null
    // La ficha recién se abrió: esperamos un frame para medirla.
    const frame = requestAnimationFrame(() => {
      handledFocus.current = focusRequest.seq
      const target = latest.current.locations.find(
        (location) => location.id === focusRequest.id,
      )

      if (target) controller.focus(target, getPadding())
    })

    return () => cancelAnimationFrame(frame)
  }, [controller, active, focusRequest, getPadding])

  // Buscar, filtrar o "Ver todo": encuadrar los resultados.
  useEffect(() => {
    if (!controller || !active || fittedKey.current === fitKey) return
    const isFirst = fittedKey.current === null
    const timer = window.setTimeout(
      () => {
        fittedKey.current = fitKey
        const points = latest.current.locations
        if (points.length) controller.fitTo(points, getPadding())
      },
      isFirst ? 0 : 280,
    )

    return () => window.clearTimeout(timer)
  }, [controller, active, fitKey, getPadding])

  // Click en un pin: si la ficha que se abre lo tapa, se corre la cámara (sin cambiar el zoom).
  useEffect(() => {
    if (
      !controller ||
      !active ||
      selectedId === null ||
      pendingEnsure.current !== selectedId
    )
      return
    const frame = requestAnimationFrame(() => {
      pendingEnsure.current = null
      const target = latest.current.locations.find(
        (location) => location.id === selectedId,
      )

      if (target) controller.ensureVisible(target, getPadding())
    })

    return () => cancelAnimationFrame(frame)
  }, [controller, active, selectedId, getPadding])

  // "Mi ubicación": centrar en el usuario si está dentro del Gran Rosario.
  useEffect(() => {
    if (
      !controller ||
      !active ||
      !userPosition ||
      userLocateSeq === handledLocate.current
    )
      return
    handledLocate.current = userLocateSeq
    if (isWithin(userPosition, GRAN_ROSARIO_BOUNDS))
      controller.focus(userPosition, getPadding(), 14)
  }, [controller, active, userPosition, userLocateSeq, getPadding])

  // La atribución (obligatoria) se apoya sobre la ficha: publicamos su alto actual como variable CSS.
  useEffect(() => {
    const frame = frameRef.current
    const panel = detailRef.current?.firstElementChild
    if (!frame || !(panel instanceof HTMLElement)) return
    const update = () =>
      frame.style.setProperty("--sheet-h", `${panel.offsetHeight}px`)
    update()
    const observer =
      "ResizeObserver" in window ? new ResizeObserver(update) : null
    observer?.observe(panel)
    return () => {
      observer?.disconnect()
      frame.style.removeProperty("--sheet-h")
    }
  }, [selectedId])

  const ready = status === "ready" && controller !== null
  return (
    <div className="map-canvas" ref={frameRef} data-status={status}>
      <div className="map-topbar" ref={topbarRef}>
        <span>
          <strong>ROSARIO</strong> / SANTA FE
        </span>
        <ul className="map-legend" aria-label="Referencias">
          {CATEGORY_LIST.map((category) => (
            <li key={category}>
              <i
                className={`legend-dot type-${CATEGORIES[category].slug}`}
                aria-hidden="true"
              />
              <span>{CATEGORIES[category].legend}</span>
            </li>
          ))}
        </ul>
      </div>
      <div ref={containerRef} className="map-gl" />
      <span className="map-texture" aria-hidden="true" />
      {(status === "idle" || status === "loading") && (
        <div className="map-state" role="status">
          <span className="map-state-icon is-loading" aria-hidden="true">
            <Icon name="sprout" size={28} />
          </span>
          <strong>Cargando el mapa…</strong>
        </div>
      )}

      {status === "error" && (
        <div className="map-state" role="alert">
          <span className="map-state-icon" aria-hidden="true">
            <Icon name="alert" size={28} />
          </span>
          <strong>
            {errorReason === "offline"
              ? "Estás sin conexión"
              : "No pudimos cargar el mapa"}
          </strong>
          <p>
            {errorReason === "offline"
              ? "Revisá tu conexión a internet y probá de nuevo."
              : "Puede ser un problema momentáneo del servidor de mapas."}{" "}
            El directorio sigue funcionando con toda la información de cada
            punto.
          </p>
          <div className="map-state-actions">
            <button type="button" className="map-state-button" onClick={retry}>
              <Icon name="refresh" size={18} /> Reintentar
            </button>
            {onShowList && (
              <button
                type="button"
                className="map-state-link"
                onClick={onShowList}
              >
                Ver la lista
              </button>
            )}
          </div>
        </div>
      )}

      {status === "unsupported" && (
        <div className="map-state" role="alert">
          <span className="map-state-icon" aria-hidden="true">
            <Icon name="map" size={28} />
          </span>
          <strong>Este navegador no puede mostrar el mapa</strong>
          <p>
            El mapa interactivo necesita WebGL, que está desactivado o no está
            disponible en este dispositivo. Usá el directorio: tiene toda la
            información de cada punto.
          </p>
          {onShowList && (
            <div className="map-state-actions">
              <button
                type="button"
                className="map-state-button"
                onClick={onShowList}
              >
                <Icon name="list" size={18} /> Ver la lista
              </button>
            </div>
          )}
        </div>
      )}

      {ready && offline && (
        <p className="map-banner" role="status">
          <Icon name="alert" size={16} /> Sin conexión: el mapa puede verse
          incompleto.
        </p>
      )}

      {ready && (
        <div
          className="map-controls"
          ref={controlsRef}
          role="group"
          aria-label="Controles del mapa"
        >
          <div className="map-zoom">
            <button
              type="button"
              onClick={() => controller.zoomBy(1)}
              aria-label="Acercar"
              title="Acercar"
            >
              <Icon name="plus" size={20} />
            </button>
            <button
              type="button"
              onClick={() => controller.zoomBy(-1)}
              aria-label="Alejar"
              title="Alejar"
            >
              <Icon name="minus" size={20} />
            </button>
          </div>
          <button
            type="button"
            className="map-control-wide"
            onClick={() => setFitSeq((value) => value + 1)}
            aria-label="Ver todo: encuadrar todos los resultados"
            title="Ver todo"
          >
            <Icon name="fit" size={19} />
            <span className="map-control-label">Ver todo</span>
          </button>
          <button
            type="button"
            className="map-control-wide"
            onClick={onLocate}
            aria-busy={locating}
            disabled={locating}
            aria-label="Mi ubicación: medir distancias desde donde estás"
            title="Mi ubicación"
          >
            <Icon
              name="locate"
              size={19}
              className={locating ? "is-spinning" : undefined}
            />
            <span className="map-control-label">
              {locating ? "Ubicando…" : "Mi ubicación"}
            </span>
          </button>
        </div>
      )}

      {notice}
      <div className="map-detail-slot" ref={detailRef}>
        {detail}
      </div>
    </div>
  )
}
