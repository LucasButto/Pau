import type {
  ExpressionSpecification,
  FillLayerSpecification,
  LayerSpecification,
  LineLayerSpecification,
  StyleSpecification,
  SymbolLayerSpecification,
} from "maplibre-gl"
import { PALETTE } from "../lib/palette"
import baseStyleJson from "./base-style.json"

/**
 * Estilo del mapa "Raíces Vecinas": parte de un estilo base vectorial con el esquema OpenMapTiles
 * (por defecto, OpenFreeMap "positron", copiado y revisado en `base-style.json`) y lo recolorea
 * con la paleta clara del PDF: fondo crema, calles en salvia y oliva, río en oliva-salvia y
 * etiquetas en Verde CAR. Las URLs de `sources`, `glyphs` y `sprite` siguen apuntando al proveedor.
 */
export const DEFAULT_STYLE_URL = "https://tiles.openfreemap.org/styles/positron"

export const STYLE_URL = import.meta.env.VITE_MAP_STYLE_URL?.trim() || DEFAULT_STYLE_URL

/** Colores del mapa, muestreados del diseño (img/02b). */
export const MAP_COLORS = {
  land: "#F6F7EE",
  blocks: "#EFF0D9",
  building: "#ECEDD5",
  path: "#E4E6CB",
  minor: "#DCDEC2",
  secondary: "#CACEA3",
  avenue: "#B6BA86",
  casing: "#9B9F67",
  motorway: "#9B9F67",
  rail: "#9B9F67",
  water: "#A1A869",
  green: "#D9DDB4",
  label: PALETTE.verdeCar,
  halo: PALETTE.blancoAjito,
  place: PALETTE.azulCianotipia,
} as const

const OPENFREEMAP_ATTRIBUTION = [
  '<a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a>',
  '<a href="https://www.openmaptiles.org/" target="_blank" rel="noreferrer">© OpenMapTiles</a>',
  'Datos: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>',
].join(" ")

export interface StyleFonts {
  regular: string[]
  bold: string[]
  italic: string[]
}

export interface PauStyle {
  style: StyleSpecification
  fonts: StyleFonts
}

/** Nombres en español cuando el dato existe; si no, el nombre local. */
const NAME_ES: ExpressionSpecification = ["coalesce", ["get", "name:es"], ["get", "name"]]

/** Clase de calle: las terciarias son "secundarias" en el diseño; el resto de las mayores, avenidas. */
const MAJOR_COLOR: ExpressionSpecification = [
  "match",
  ["get", "class"],
  "tertiary",
  MAP_COLORS.secondary,
  MAP_COLORS.avenue,
]

const MAJOR_CASING: ExpressionSpecification = [
  "match",
  ["get", "class"],
  "tertiary",
  MAP_COLORS.secondary,
  MAP_COLORS.casing,
]

function sourceLayerOf(layer: LayerSpecification): string | undefined {
  return "source-layer" in layer ? layer["source-layer"] : undefined
}

function restyleFill(layer: FillLayerSpecification): FillLayerSpecification | null {
  const { id } = layer
  const sourceLayer = sourceLayerOf(layer)
  if (sourceLayer === "water") {
    return { ...layer, paint: { "fill-color": MAP_COLORS.water, "fill-antialias": true } }
  }

  if (sourceLayer === "landcover") {
    if (/ice|glacier|sand|rock/.test(id)) return null
    return { ...layer, paint: { "fill-color": MAP_COLORS.green, "fill-opacity": /wood|forest/.test(id) ? 0.85 : 0.7 } }
  }

  if (sourceLayer === "park") {
    return { ...layer, paint: { "fill-color": MAP_COLORS.green } }
  }

  if (sourceLayer === "landuse") {
    if (/park|grass|garden|recreation|cemetery/.test(id)) {
      return { ...layer, paint: { "fill-color": MAP_COLORS.green } }
    }
    // Manzanas: apenas un tono sobre el fondo. Se quita el maxzoom del estilo base para que se vean
    // también a escala de barrio.
    const { maxzoom: _maxzoom, ...rest } = layer
    return { ...rest, paint: { "fill-color": MAP_COLORS.blocks, "fill-opacity": 0.9 } }
  }

  if (sourceLayer === "building") {
    return {
      ...layer,
      minzoom: Math.max(layer.minzoom ?? 0, 15),
      paint: { "fill-color": MAP_COLORS.building, "fill-antialias": false },
    }
  }

  if (sourceLayer === "aeroway") return { ...layer, paint: { "fill-color": MAP_COLORS.path } }
  // Muelles y otras superficies: del color del fondo.
  return { ...layer, paint: { "fill-color": MAP_COLORS.land } }
}

function restyleLine(layer: LineLayerSpecification): LineLayerSpecification | null {
  const { id } = layer
  const sourceLayer = sourceLayerOf(layer)
  const withColor = (
    color: string | ExpressionSpecification,
    extra: LineLayerSpecification["paint"] = {},
  ): LineLayerSpecification => ({
    ...layer,
    paint: { ...layer.paint, "line-color": color, "line-opacity": 1, ...extra },
  })

  if (sourceLayer === "waterway") {
    return withColor(MAP_COLORS.water, {
      "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.8, 16, 3],
    })
  }

  if (sourceLayer === "boundary") {
    // Límites de país o provincia: no aportan a un mapa de ciudad.
    if (/boundary_2|disputed/.test(id)) return null
    return withColor(MAP_COLORS.secondary, { "line-dasharray": [3, 2], "line-width": 1 })
  }

  if (sourceLayer === "aeroway") return withColor(MAP_COLORS.path)
  if (sourceLayer === "transportation") {
    if (/rail|transit/.test(id)) {
      // Vías: una sola línea punteada; se descartan las capas de relleno blanco del estilo base.
      if (/dashline/.test(id)) return null
      return withColor(MAP_COLORS.rail, {
        "line-dasharray": [2, 2],
        "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.8, 16, 1.6, 20, 3],
      })
    }
    if (/motorway/.test(id)) {
      if (/subtle/.test(id)) return withColor(MAP_COLORS.motorway)
      return withColor(/casing/.test(id) ? MAP_COLORS.casing : MAP_COLORS.motorway, { "line-dasharray": [1, 0] })
    }
    if (/major/.test(id)) {
      if (/casing/.test(id)) return withColor(MAJOR_CASING, { "line-dasharray": [1, 0] })
      return withColor(MAJOR_COLOR)
    }
    if (/minor|service|street/.test(id)) return withColor(MAP_COLORS.minor, { "line-opacity": 1 })
    if (/path|track|cycle|foot/.test(id)) return withColor(MAP_COLORS.path)
    if (/pier/.test(id)) return withColor(MAP_COLORS.land)
    return withColor(MAP_COLORS.minor)
  }

  return withColor(MAP_COLORS.minor)
}

const LABEL_HALO = {
  "text-halo-color": MAP_COLORS.halo,
  "text-halo-width": 1.5,
  "text-halo-blur": 0.4,
} as const

function restyleSymbol(
  layer: SymbolLayerSpecification,
  fonts: StyleFonts,
  ownFonts: boolean,
): SymbolLayerSpecification | null {
  const { id } = layer
  const sourceLayer = sourceLayerOf(layer)
  const layout = layer.layout ?? {}
  // POI comerciales y de transporte, aeropuertos, números de puerta y picos: fuera.
  if (!sourceLayer || ["poi", "aerodrome_label", "housenumber", "mountain_peak"].includes(sourceLayer)) return null
  if (!layout["text-field"]) return null
  const font = (kind: keyof StyleFonts) => (ownFonts ? { "text-font": fonts[kind] } : {})
  const label = (
    extraLayout: SymbolLayerSpecification["layout"],
    paint: SymbolLayerSpecification["paint"],
  ): SymbolLayerSpecification => {
    const { "icon-image": _icon, "icon-size": _iconSize, "icon-optional": _optional, "icon-allow-overlap": _overlap, ...textLayout } =
      layout
    return {
      ...layer,
      layout: { ...textLayout, "text-field": NAME_ES, ...extraLayout },
      paint: { ...LABEL_HALO, ...paint },
    }
  }

  if (sourceLayer === "transportation_name") {
    if (/shield|ref/.test(id)) return null
    return label({ ...font("regular") }, { "text-color": MAP_COLORS.label })
  }

  if (sourceLayer === "water_name" || sourceLayer === "waterway") {
    return label(
      { ...font("italic"), "text-letter-spacing": 0.2, "text-transform": "uppercase", "text-size": 12 },
      { "text-color": MAP_COLORS.place },
    )
  }

  if (sourceLayer === "place") {
    if (/state|country|continent/.test(id)) return null
    if (/city|town/.test(id)) {
      return label(
        {
          ...font("bold"),
          "text-size": ["interpolate", ["linear"], ["zoom"], 10, 12, 14, 14],
          "text-letter-spacing": 0.14,
          "text-transform": "uppercase",
          "text-offset": [0, 0],
          "text-anchor": "center",
        },
        { "text-color": MAP_COLORS.place },
      )
    }
    // Barrios: Azul Cianotipia en mayúsculas chicas.
    return label(
      { ...font("regular"), "text-size": 11, "text-letter-spacing": 0.12, "text-transform": "uppercase" },
      { "text-color": MAP_COLORS.place },
    )
  }

  return label({}, { "text-color": MAP_COLORS.label })
}

function restyle(layer: LayerSpecification, fonts: StyleFonts, ownFonts: boolean): LayerSpecification | null {
  switch (layer.type) {
    case "background":
      return { ...layer, paint: { "background-color": MAP_COLORS.land } }
    case "fill":
      return restyleFill(layer)
    case "line":
      return restyleLine(layer)
    case "symbol":
      return restyleSymbol(layer, fonts, ownFonts)
    // Relieve, rasters y edificios 3D no aportan a este mapa plano.
    case "raster":
    case "hillshade":
    case "color-relief":
    case "fill-extrusion":
      return null
    default:
      return layer
  }
}

/** Capas que el estilo base puede no traer: pasto y el nombre del río sobre su cauce. */
function extraLayers(base: StyleSpecification, vectorSource: string, fonts: StyleFonts, ownFonts: boolean) {
  const has = (sourceLayer: string, type: LayerSpecification["type"]) =>
    base.layers.some((layer) => layer.type === type && sourceLayerOf(layer) === sourceLayer)

  const fills: LayerSpecification[] = [
    {
      id: "pau-landcover-grass",
      type: "fill",
      source: vectorSource,
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "grass"],
      paint: { "fill-color": MAP_COLORS.green, "fill-opacity": 0.7 },
    },
  ]
  if (!has("park", "fill")) {
    fills.push({
      id: "pau-park",
      type: "fill",
      source: vectorSource,
      "source-layer": "park",
      paint: { "fill-color": MAP_COLORS.green },
    })
  }

  const labels: LayerSpecification[] = has("waterway", "symbol")
    ? []
    : [
        {
          id: "pau-waterway-name",
          type: "symbol",
          source: vectorSource,
          "source-layer": "waterway",
          filter: ["all", ["==", ["get", "class"], "river"], ["has", "name"]],
          layout: {
            "symbol-placement": "line",
            "symbol-spacing": 420,
            "text-field": NAME_ES,
            ...(ownFonts ? { "text-font": fonts.italic } : {}),
            "text-size": 12,
            "text-letter-spacing": 0.2,
            "text-transform": "uppercase",
            "text-max-angle": 25,
          },
          paint: { "text-color": MAP_COLORS.place, ...LABEL_HALO },
        },
      ]

  return { fills, labels }
}

/** Fuente vectorial principal (esquema OpenMapTiles). */
function findVectorSource(style: StyleSpecification): string | undefined {
  const entries = Object.entries(style.sources)
  return (entries.find(([id, source]) => source.type === "vector" && id === "openmaptiles") ??
    entries.find(([, s]) => s.type === "vector"))?.[0]
}

interface DetectedFonts {
  fonts: StyleFonts
  /** Los glifos son de OpenFreeMap: podemos elegir regular, negrita e itálica. */
  ownFonts: boolean
}

function detectFonts(style: StyleSpecification): DetectedFonts {
  if (style.glyphs?.includes("tiles.openfreemap.org")) {
    return {
      ownFonts: true,
      fonts: {
        regular: ["Noto Sans Regular"],
        bold: ["Noto Sans Bold"],
        italic: ["Noto Sans Italic"],
      },
    }
  }

  // Otro proveedor: usamos la tipografía que el estilo ya declara (sus glifos existen seguro).
  for (const layer of style.layers) {
    if (layer.type === "symbol") {
      const font: unknown = layer.layout?.["text-font"]
      if (!Array.isArray(font)) continue
      const names = font.filter((name): name is string => typeof name === "string")
      if (names.length && names.length === font.length) {
        return { ownFonts: false, fonts: { regular: names, bold: names, italic: names } }
      }
    }
  }

  return {
    ownFonts: false,
    fonts: {
      regular: ["Noto Sans Regular"],
      bold: ["Noto Sans Regular"],
      italic: ["Noto Sans Regular"],
    },
  }
}

export function buildPauStyle(base: StyleSpecification): PauStyle {
  const { fonts, ownFonts } = detectFonts(base)
  const vectorSource = findVectorSource(base)
  const layers: LayerSpecification[] = []
  for (const layer of base.layers) {
    const next = restyle(layer, fonts, ownFonts)
    if (next) layers.push(next)
  }

  if (vectorSource) {
    const { fills, labels } = extraLayers(base, vectorSource, fonts, ownFonts)
    // Rellenos verdes debajo de calles y edificios; el nombre del río, con el resto de las etiquetas.
    const firstAbove = layers.findIndex((l) =>
      ["waterway", "transportation", "building", "aeroway"].includes(sourceLayerOf(l) ?? ""),
    )
    layers.splice(firstAbove === -1 ? layers.length : firstAbove, 0, ...fills)
    const firstPlace = layers.findIndex((l) => sourceLayerOf(l) === "place")
    layers.splice(firstPlace === -1 ? layers.length : firstPlace, 0, ...labels)
  }

  // Solo se declaran las fuentes que alguna capa usa (el relieve raster de OpenFreeMap queda afuera).
  const used = new Set(layers.map((l) => ("source" in l ? l.source : undefined)).filter(Boolean))

  const sources: StyleSpecification["sources"] = {}
  for (const [id, source] of Object.entries(base.sources)) {
    if (!used.has(id)) continue
    const isOpenFreeMap = source.type === "vector" && Boolean(source.url?.includes("tiles.openfreemap.org"))
    sources[id] = isOpenFreeMap && source.type === "vector" ? { ...source, attribution: OPENFREEMAP_ATTRIBUTION } : source
  }

  return {
    style: { ...base, name: "PAU · Raíces Vecinas", sources, layers },
    fonts,
  }
}

export class StyleLoadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "StyleLoadError"
  }
}

function isStyle(value: unknown): value is StyleSpecification {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { version?: unknown }).version === 8 &&
    Array.isArray((value as { layers?: unknown }).layers)
  )
}

/** Estilo final. Con la URL por defecto no hace falta pedirlo: usamos la copia revisada. */
export async function loadPauStyle(signal: AbortSignal): Promise<PauStyle> {
  if (STYLE_URL === DEFAULT_STYLE_URL) {
    return buildPauStyle(structuredClone(baseStyleJson) as unknown as StyleSpecification)
  }

  let response: Response
  try {
    response = await fetch(STYLE_URL, { signal })
  } catch (error) {
    if (signal.aborted) throw error
    throw new StyleLoadError(`No se pudo descargar el estilo del mapa (${STYLE_URL}).`)
  }

  if (!response.ok) throw new StyleLoadError(`El estilo del mapa respondió ${response.status}.`)
  const json: unknown = await response.json()
  if (!isStyle(json)) throw new StyleLoadError("La URL configurada no devuelve un estilo de MapLibre válido.")
  return buildPauStyle(json)
}
