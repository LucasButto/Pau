import type {
  ExpressionSpecification,
  GeoJSONSource,
  Map as MapLibreMap,
  MapLayerMouseEvent,
} from "maplibre-gl"
import {
  CATEGORIES,
  type Category,
  type CategorySlug,
  type Location,
} from "../data/locations"
import type { LatLng } from "../lib/geo"
import { PALETTE } from "../lib/palette"
import type { StyleFonts } from "./pauStyle"
import {
  PIN_IMAGE_PREFIX,
  PIN_SCALE,
  SELECTED_PIN_SCALE,
  SELECTED_SUFFIX,
  pinHeight,
  pinOffset,
} from "./pins"

/*
 * Fuentes y capas propias del mapa: puntos agrupados (cluster), pin seleccionado y ubicación del
 * usuario. El pin seleccionado vive en una fuente aparte, sin agrupar, para que nunca quede
 * escondido dentro de un grupo y siempre se dibuje arriba.
 */

export const SOURCE_POINTS = "pau-points"

export const SOURCE_SELECTED = "pau-selected"

export const SOURCE_USER = "pau-user"

export const LAYER_CLUSTER_HALO = "pau-cluster-halo"

export const LAYER_CLUSTERS = "pau-clusters"

export const LAYER_CLUSTER_COUNT = "pau-cluster-count"

export const LAYER_PINS = "pau-pins"

export const LAYER_SELECTED = "pau-selected-pin"

export const LAYER_USER_HALO = "pau-user-halo"

export const LAYER_USER = "pau-user-dot"

export const CLUSTER_MAX_ZOOM = 13

/** Colores de los grupos (círculo, halo, número) y de su cartelito. */
export interface ClusterTheme {
  color: string
  ink: string
}

/** Sin filtro (o con varias categorías a la vez): Verde CAR, como siempre. */
const DEFAULT_CLUSTER_THEME: ClusterTheme = { color: PALETTE.verdeCar, ink: PALETTE.blancoAjito }

/** Si todos los puntos son de una sola categoría (filtro activo), los grupos toman su color. */
export function clusterThemeFor(locations: readonly Location[]): ClusterTheme {
  const first = locations[0]
  if (!first || locations.some((location) => location.type !== first.type)) return DEFAULT_CLUSTER_THEME
  const { color, ink } = CATEGORIES[first.type]
  return { color, ink }
}

/**
 * Pinta los grupos con `theme`. El cartelito es HTML fuera del canvas: lo recibe por variables CSS
 * en el contenedor del mapa (`--cluster-color` y `--cluster-ink`, ver `mapa.css`).
 */
export function applyClusterTheme(map: MapLibreMap, { color, ink }: ClusterTheme): void {
  map.setPaintProperty(LAYER_CLUSTER_HALO, "circle-color", color)
  map.setPaintProperty(LAYER_CLUSTERS, "circle-color", color)
  map.setPaintProperty(LAYER_CLUSTER_COUNT, "text-color", ink)
  const container = map.getContainer()
  container.style.setProperty("--cluster-color", color)
  container.style.setProperty("--cluster-ink", ink)
}

export interface PinProperties {
  id: number
  name: string
  type: Category
  slug: CategorySlug
  /** Para ordenar los pines: los de más al sur se dibujan encima. */
  order: number
}

interface PointGeometry {
  type: "Point"
  coordinates: [number, number]
}

interface PointFeature<P> {
  type: "Feature"
  geometry: PointGeometry
  properties: P
}

interface FeatureCollection<P> {
  type: "FeatureCollection"
  features: PointFeature<P>[]
}

export function locationsToGeoJSON(
  locations: readonly Location[],
): FeatureCollection<PinProperties> {
  return {
    type: "FeatureCollection",
    features: locations.map((location) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [location.lng, location.lat] },
      properties: {
        id: location.id,
        name: location.name,
        type: location.type,
        slug: CATEGORIES[location.type].slug,
        order: -location.lat,
      },
    })),
  }
}

export function userToGeoJSON(
  position: LatLng | null,
): FeatureCollection<Record<string, never>> {
  return {
    type: "FeatureCollection",
    features: position
      ? [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [position.lng, position.lat],
            },
            properties: {},
          },
        ]
      : [],
  }
}

export function addPauLayers(map: MapLibreMap, fonts: StyleFonts): void {
  const empty = locationsToGeoJSON([])
  map.addSource(SOURCE_POINTS, {
    type: "geojson",
    data: empty,
    cluster: true,
    clusterRadius: 46,
    clusterMaxZoom: CLUSTER_MAX_ZOOM,
  })

  map.addSource(SOURCE_SELECTED, { type: "geojson", data: empty })
  map.addSource(SOURCE_USER, { type: "geojson", data: userToGeoJSON(null) })
  // El círculo crece con la cantidad de puntos del grupo.
  const clusterRadius = (extra: number): ExpressionSpecification => [
    "+",
    ["step", ["get", "point_count"], 22, 5, 25, 12, 29],
    extra,
  ]

  // Grupos: círculo Verde CAR con anillo crema de 3 px y un halo exterior translúcido. Radio mínimo
  // de 22 px: el área táctil del grupo mide al menos 44 px.
  map.addLayer({
    id: LAYER_CLUSTER_HALO,
    type: "circle",
    source: SOURCE_POINTS,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": PALETTE.verdeCar,
      "circle-opacity": 0.22,
      "circle-radius": clusterRadius(7),
    },
  })

  map.addLayer({
    id: LAYER_CLUSTERS,
    type: "circle",
    source: SOURCE_POINTS,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": PALETTE.verdeCar,
      "circle-radius": clusterRadius(0),
      "circle-stroke-color": PALETTE.blancoAjito,
      "circle-stroke-width": 3,
    },
  })

  map.addLayer({
    id: LAYER_CLUSTER_COUNT,
    type: "symbol",
    source: SOURCE_POINTS,
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": fonts.bold,
      "text-size": ["step", ["get", "point_count"], 15, 12, 17],
      "text-allow-overlap": true,
      "text-ignore-placement": true,
    },
    paint: { "text-color": PALETTE.blancoAjito },
  })

  map.addLayer({
    id: LAYER_USER_HALO,
    type: "circle",
    source: SOURCE_USER,
    paint: {
      "circle-color": PALETTE.azulCianotipia,
      "circle-opacity": 0.18,
      "circle-radius": 16,
    },
  })

  map.addLayer({
    id: LAYER_USER,
    type: "circle",
    source: SOURCE_USER,
    paint: {
      "circle-color": PALETTE.azulCianotipia,
      "circle-radius": 6,
      "circle-stroke-color": PALETTE.blancoAjito,
      "circle-stroke-width": 3,
    },
  })

  map.addLayer({
    id: LAYER_PINS,
    type: "symbol",
    source: SOURCE_POINTS,
    filter: ["!", ["has", "point_count"]],
    layout: {
      "icon-image": ["concat", PIN_IMAGE_PREFIX, ["get", "slug"]],
      "icon-anchor": "bottom",
      "icon-offset": pinOffset(PIN_SCALE),
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
      "symbol-sort-key": ["get", "order"],
    },
  })

  map.addLayer({
    id: LAYER_SELECTED,
    type: "symbol",
    source: SOURCE_SELECTED,
    layout: {
      "icon-image": [
        "concat",
        PIN_IMAGE_PREFIX,
        ["get", "slug"],
        SELECTED_SUFFIX,
      ],
      "icon-anchor": "bottom",
      "icon-offset": pinOffset(SELECTED_PIN_SCALE),
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
  })
}

export interface Tooltip {
  /** `cluster`: el cartelito de un grupo, que toma el color de la categoría. */
  show(coordinates: [number, number], text: string, offsetY: number, cluster?: boolean): void
  hide(): void
}

interface InteractionOptions {
  onSelect(id: number): void
  tooltip: Tooltip | null
  /** Duración de las animaciones de cámara (0 con movimiento reducido). */
  duration: number
}

function featureCoordinates(
  event: MapLayerMouseEvent,
): [number, number] | null {
  const geometry = event.features?.[0]?.geometry
  return geometry?.type === "Point"
    ? [geometry.coordinates[0], geometry.coordinates[1]]
    : null
}

/** Click, cursor y tooltip sobre grupos y pines. */
export function bindInteractions(
  map: MapLibreMap,
  { onSelect, tooltip, duration }: InteractionOptions,
): void {
  const canvas = map.getCanvas()
  map.on("click", LAYER_CLUSTERS, async (event) => {
    const feature = event.features?.[0]
    const coordinates = featureCoordinates(event)
    const clusterId = feature?.properties?.cluster_id
    if (!coordinates || typeof clusterId !== "number") return
    const source = map.getSource<GeoJSONSource>(SOURCE_POINTS)
    if (!source) return
    const zoom = await source.getClusterExpansionZoom(clusterId)
    map.easeTo({
      center: coordinates,
      zoom: Math.min(zoom + 0.25, map.getMaxZoom()),
      duration,
    })
  })

  const selectFromEvent = (event: MapLayerMouseEvent) => {
    const id = Number(event.features?.[0]?.properties?.id)
    if (Number.isFinite(id)) onSelect(id)
  }

  map.on("click", LAYER_PINS, selectFromEvent)
  map.on("click", LAYER_SELECTED, selectFromEvent)
  for (const layer of [LAYER_CLUSTERS, LAYER_PINS, LAYER_SELECTED]) {
    map.on("mouseenter", layer, () => {
      canvas.style.cursor = "pointer"
    })

    map.on("mouseleave", layer, () => {
      canvas.style.cursor = ""
      tooltip?.hide()
    })
  }

  if (!tooltip) return
  const showFor = (
    layer: string,
    offsetY: number,
    label: (event: MapLayerMouseEvent) => string,
    cluster = false,
  ) => {
    map.on("mousemove", layer, (event) => {
      const coordinates = featureCoordinates(event)
      if (coordinates) tooltip.show(coordinates, label(event), offsetY, cluster)
    })
  }

  showFor(LAYER_PINS, pinHeight(PIN_SCALE) + 4, (event) =>
    String(event.features?.[0]?.properties?.name ?? ""),
  )

  showFor(LAYER_SELECTED, pinHeight(SELECTED_PIN_SCALE) + 4, (event) =>
    String(event.features?.[0]?.properties?.name ?? ""),
  )

  showFor(
    LAYER_CLUSTERS,
    30,
    (event) => {
      const count = Number(event.features?.[0]?.properties?.point_count ?? 0)
      return `${count} lugares · click para acercar`
    },
    true,
  )

  map.on("dragstart", () => tooltip.hide())
}
