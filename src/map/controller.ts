import maplibregl, { type GeoJSONSource } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import type { Location } from "../data/locations"
import {
  GRAN_ROSARIO_BOUNDS,
  MAP_INITIAL_CENTER,
  boundsOf,
  type LatLng,
} from "../lib/geo"
import {
  SOURCE_POINTS,
  SOURCE_SELECTED,
  SOURCE_USER,
  addPauLayers,
  bindInteractions,
  locationsToGeoJSON,
  userToGeoJSON,
  type Tooltip,
} from "./clusters"
import { loadPauStyle } from "./pauStyle"
import { addPinImages } from "./pins"

/*
 * Motor del mapa. Se carga con `import()` dinámico desde `useMap` (junto con maplibre-gl, su CSS y
 * el estilo), así nada de esto pesa en la carga inicial de la página.
 */

const MIN_ZOOM = 10

const MAX_ZOOM = 18

const FOCUS_ZOOM = 15

const LOAD_TIMEOUT_MS = 15000

const LOCALE: Record<string, string> = {
  "AttributionControl.ToggleAttribution": "Mostrar u ocultar la atribución",
  "AttributionControl.MapFeedback": "Reportar un error del mapa",
  "Map.Title": "Mapa interactivo de Raíces Vecinas",
  "Popup.Close": "Cerrar",
  "CooperativeGesturesHandler.WindowsHelpText":
    "Usá Ctrl + rueda del mouse para hacer zoom en el mapa",
  "CooperativeGesturesHandler.MacHelpText":
    "Usá ⌘ + rueda del mouse para hacer zoom en el mapa",
  "CooperativeGesturesHandler.MobileHelpText":
    "Usá dos dedos para mover el mapa",
}

export type MapLoadReason = "offline" | "timeout" | "style" | "unknown"

export class MapLoadError extends Error {
  constructor(
    readonly reason: MapLoadReason,
    message: string,
  ) {
    super(message)
    this.name = "MapLoadError"
  }
}

/** Margen libre de la cámara en px (barra superior, controles y ficha). */
export interface Padding {
  top: number
  right: number
  bottom: number
  left: number
}

export interface MapController {
  setData(locations: readonly Location[], selectedId: number | null): void
  setUser(position: LatLng | null): void
  /** Encuadra los puntos (o centra si es uno solo). */
  fitTo(points: readonly LatLng[], padding: Padding): void
  /** Vuela a un punto con zoom de calle. */
  focus(point: LatLng, padding: Padding, zoom?: number): void
  /** Si el punto quedó tapado por la ficha o fuera de cuadro, lo trae a la vista sin cambiar el zoom. */
  ensureVisible(point: LatLng, padding: Padding): void
  zoomBy(delta: number): void
  resize(): void
  destroy(): void
}

export interface MapControllerOptions {
  container: HTMLElement
  signal: AbortSignal
  reducedMotion: boolean
  onSelect(id: number): void
  /** Se perdió (o volvió) la conexión con el mapa ya cargado. */
  onConnectivityChange(offline: boolean): void
}

function abortError(): DOMException {
  return new DOMException("Carga del mapa cancelada", "AbortError")
}

/** MapLibre agrega estos datos a los errores de carga de una fuente o un tile. */
interface SourceErrorDetails {
  sourceId?: string
  tile?: unknown
}

function waitForLoad(map: maplibregl.Map, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false
    const finish = (error?: Error) => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      map.off("error", onError)
      signal.removeEventListener("abort", onAbort)
      if (error) reject(error)
      else resolve()
    }

    const onError = (event: maplibregl.ErrorEvent & SourceErrorDetails) => {
      // Un tile suelto que falla no es fatal; sí lo es no poder cargar la fuente o estar sin red.
      if (!navigator.onLine)
        finish(new MapLoadError("offline", "Sin conexión a internet."))
      else if (event.sourceId && !event.tile)
        finish(
          new MapLoadError(
            "style",
            event.error?.message ?? "No se pudo cargar la fuente del mapa.",
          ),
        )
    }

    const onAbort = () => finish(abortError())
    const timer = window.setTimeout(
      () =>
        finish(
          new MapLoadError(
            navigator.onLine ? "timeout" : "offline",
            "El mapa tardó demasiado en cargar.",
          ),
        ),
      LOAD_TIMEOUT_MS,
    )

    map.once("load", () => finish())
    map.on("error", onError)
    signal.addEventListener("abort", onAbort)
  })
}

export async function createMapController(
  options: MapControllerOptions,
): Promise<MapController> {
  const { container, signal, reducedMotion, onSelect, onConnectivityChange } =
    options
  if (!navigator.onLine)
    throw new MapLoadError("offline", "Sin conexión a internet.")
  const { style, fonts } = await loadPauStyle(signal).catch(
    (error: unknown) => {
      if (signal.aborted) throw abortError()
      throw error instanceof Error
        ? new MapLoadError(
            navigator.onLine ? "style" : "offline",
            error.message,
          )
        : error
    },
  )

  // StrictMode monta, desmonta y vuelve a montar: si ya nos cancelaron, ni siquiera creamos el mapa.
  if (signal.aborted) throw abortError()
  const duration = reducedMotion ? 0 : 900
  const map = new maplibregl.Map({
    container,
    style,
    center: [MAP_INITIAL_CENTER.lng, MAP_INITIAL_CENTER.lat],
    zoom: 11.3,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    maxBounds: GRAN_ROSARIO_BOUNDS,
    attributionControl: false,
    cooperativeGestures: true,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    maxPitch: 0,
    fadeDuration: reducedMotion ? 0 : 300,
    locale: LOCALE,
  })

  // Solo en desarrollo: acceso al mapa para pruebas end-to-end (no existe en el build de producción).
  if (import.meta.env.DEV) Object.assign(window, { __pauMap: map })
  map.touchZoomRotate.disableRotation()
  map.keyboard.disableRotation()
  // Atribución obligatoria: compacta (botón "i") en mapas angostos, nunca oculta.
  map.addControl(new maplibregl.AttributionControl(), "bottom-right")
  try {
    await waitForLoad(map, signal)
    await addPinImages(map)
    if (signal.aborted) throw abortError()
    addPauLayers(map, fonts)
  } catch (error) {
    map.remove()
    throw error
  }

  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches

  let popup: maplibregl.Popup | null = null
  const tooltip: Tooltip | null = canHover
    ? {
        show(coordinates, text, offsetY) {
          popup ??= new maplibregl.Popup({
            anchor: "bottom",
            closeButton: false,
            closeOnClick: false,
            className: "map-tooltip",
            maxWidth: "240px",
          })

          popup.setOffset([0, -offsetY]).setLngLat(coordinates).setText(text)
          if (!popup.isOpen()) popup.addTo(map)
        },
        hide() {
          popup?.remove()
        },
      }
    : null
  bindInteractions(map, { onSelect, tooltip, duration })
  // Errores después de la carga: casi siempre tiles que no llegan por falta de red.
  const onRuntimeError = () => {
    if (!navigator.onLine) onConnectivityChange(true)
  }

  const onOnline = () => onConnectivityChange(false)
  const onOffline = () => onConnectivityChange(true)
  map.on("error", onRuntimeError)
  window.addEventListener("online", onOnline)
  window.addEventListener("offline", onOffline)
  /** El padding no puede dejar sin lugar al encuadre (MapLibre lo rechaza con un warning). */
  const safePadding = (padding: Padding): Padding => {
    const { clientWidth: width, clientHeight: height } = map.getContainer()
    const fit = (a: number, b: number, size: number) => {
      const room = size - 48
      return a + b <= room
        ? [a, b]
        : [Math.max(0, (a / (a + b)) * room), Math.max(0, (b / (a + b)) * room)]
    }

    const [left, right] = fit(padding.left, padding.right, width)
    const [top, bottom] = fit(padding.top, padding.bottom, height)
    return { top, right, bottom, left }
  }

  return {
    setData(locations, selectedId) {
      const selected = locations.find((location) => location.id === selectedId)
      map
        .getSource<GeoJSONSource>(SOURCE_POINTS)
        ?.setData(
          locationsToGeoJSON(
            locations.filter((location) => location !== selected),
          ),
        )
      map
        .getSource<GeoJSONSource>(SOURCE_SELECTED)
        ?.setData(locationsToGeoJSON(selected ? [selected] : []))
    },
    setUser(position) {
      map
        .getSource<GeoJSONSource>(SOURCE_USER)
        ?.setData(userToGeoJSON(position))
    },
    fitTo(points, padding) {
      const bounds = boundsOf(points)
      if (!bounds) return
      if (points.length === 1) {
        map.easeTo({
          center: [points[0].lng, points[0].lat],
          zoom: FOCUS_ZOOM - 0.5,
          padding: safePadding(padding),
          duration,
        })

        return
      }

      map.fitBounds(bounds, {
        padding: safePadding(padding),
        maxZoom: FOCUS_ZOOM,
        duration,
      })
    },
    focus(point, padding, zoom = FOCUS_ZOOM) {
      const camera = {
        center: [point.lng, point.lat] as [number, number],
        zoom: Math.max(zoom, map.getZoom()),
        padding: safePadding(padding),
      }

      if (reducedMotion) map.jumpTo(camera)
      else map.flyTo({ ...camera, duration: 1100, essential: false })
    },
    ensureVisible(point, padding) {
      const { x, y } = map.project([point.lng, point.lat])
      const { clientWidth: width, clientHeight: height } = map.getContainer()
      const safe = safePadding(padding)
      const inside =
        x >= safe.left &&
        x <= width - safe.right &&
        y >= safe.top + 40 &&
        y <= height - safe.bottom
      if (!inside)
        map.easeTo({ center: [point.lng, point.lat], padding: safe, duration })
    },
    zoomBy(delta) {
      map.easeTo({
        zoom: map.getZoom() + delta,
        duration: reducedMotion ? 0 : 300,
      })
    },
    resize() {
      map.resize()
    },
    destroy() {
      window.removeEventListener("online", onOnline)
      window.removeEventListener("offline", onOffline)
      popup?.remove()
      map.remove()
    },
  }
}
