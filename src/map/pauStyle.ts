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
 * (por defecto, OpenFreeMap "dark", copiado y revisado en `base-style.json`) y lo recolorea con
 * la paleta del Figma. Las URLs de `sources`, `glyphs` y `sprite` siguen apuntando al proveedor.
 */
export const DEFAULT_STYLE_URL = "https://tiles.openfreemap.org/styles/dark"

export const STYLE_URL =
  import.meta.env.VITE_MAP_STYLE_URL?.trim() || DEFAULT_STYLE_URL

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
const NAME_ES: ExpressionSpecification = [
  "coalesce",
  ["get", "name:es"],
  ["get", "name"],
]

function paper(alpha: number): string {
  return `rgba(247, 246, 240, ${alpha})`
}

function mustard(alpha: number): string {
  return `rgba(231, 166, 61, ${alpha})`
}

function forest(alpha: number): string {
  return `rgba(108, 115, 59, ${alpha})`
}

function sourceLayerOf(layer: LayerSpecification): string | undefined {
  return "source-layer" in layer ? layer["source-layer"] : undefined
}

function restyleFill(
  layer: FillLayerSpecification,
): FillLayerSpecification | null {
  const { id } = layer
  const sourceLayer = sourceLayerOf(layer)
  if (sourceLayer === "water") {
    return {
      ...layer,
      paint: {
        "fill-color": mustard(1),
        "fill-opacity": 0.2,
        "fill-antialias": true,
      },
    }
  }

  if (sourceLayer === "landcover") {
    if (/ice|glacier|sand|rock/.test(id)) return null
    const opacity = /wood|forest/.test(id) ? 0.42 : 0.28
    return {
      ...layer,
      paint: { "fill-color": forest(1), "fill-opacity": opacity },
    }
  }

  if (sourceLayer === "park") {
    return {
      ...layer,
      paint: { "fill-color": forest(0.45), "fill-outline-color": paper(0.18) },
    }
  }

  if (sourceLayer === "landuse") {
    if (/park|grass|garden|recreation/.test(id)) {
      return {
        ...layer,
        paint: {
          "fill-color": forest(0.55),
          "fill-outline-color": paper(0.22),
        },
      }
    }

    // Manzanas y usos del suelo: apenas una textura sobre el fondo. Se quita el maxzoom del
    // estilo base para que las manzanas se vean también en la escala de barrio.
    const { maxzoom: _maxzoom, ...rest } = layer
    return {
      ...rest,
      paint: {
        "fill-color": paper(1),
        "fill-opacity": /residential/.test(id) ? 0.035 : 0.025,
      },
    }
  }

  if (sourceLayer === "building") {
    return {
      ...layer,
      minzoom: Math.max(layer.minzoom ?? 0, 14),
      paint: { "fill-color": paper(0.045), "fill-outline-color": paper(0.08) },
    }
  }

  return { ...layer, paint: { "fill-color": paper(0.05) } }
}

function restyleLine(
  layer: LineLayerSpecification,
): LineLayerSpecification | null {
  const { id } = layer
  const sourceLayer = sourceLayerOf(layer)
  const withColor = (
    color: string,
    extra: LineLayerSpecification["paint"] = {},
  ): LineLayerSpecification => ({
    ...layer,
    paint: { ...layer.paint, "line-color": color, "line-opacity": 1, ...extra },
  })

  if (sourceLayer === "waterway") {
    return withColor(mustard(0.5), {
      "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.8, 16, 3],
    })
  }

  if (sourceLayer === "boundary") {
    return withColor(paper(0.2), { "line-dasharray": [2, 2], "line-width": 1 })
  }

  if (sourceLayer === "aeroway") return withColor(paper(0.08))
  if (sourceLayer === "transportation") {
    // Los bordes (casing) y las líneas punteadas de las vías ensucian sobre el fondo oscuro.
    if (/casing|dashline/.test(id)) return null
    if (/motorway/.test(id)) return withColor(paper(0.55))
    if (/major|primary|trunk|secondary|tertiary/.test(id))
      return withColor(paper(0.4))
    if (/minor|service|street/.test(id)) return withColor(paper(0.17))
    if (/path|track|cycle|foot/.test(id))
      return withColor(paper(0.13), { "line-dasharray": [1.5, 1.5] })
    if (/rail|transit/.test(id))
      return withColor(paper(0.14), { "line-width": 1.2 })
    if (/pier/.test(id)) return withColor(paper(0.08))
    return withColor(paper(0.2))
  }

  return withColor(paper(0.15))
}

const LABEL_HALO = {
  "text-halo-color": PALETTE.cyan,
  "text-halo-width": 1.5,
  "text-halo-blur": 0.3,
} as const

function restyleSymbol(
  layer: SymbolLayerSpecification,
  fonts: StyleFonts,
  ownFonts: boolean,
): SymbolLayerSpecification | null {
  const { id } = layer
  const sourceLayer = sourceLayerOf(layer)
  const layout = layer.layout ?? {}
  // POI comerciales y de transporte, números de puerta, picos y flechas de mano única: fuera.
  if (
    !sourceLayer ||
    ["poi", "aerodrome_label", "housenumber", "mountain_peak"].includes(
      sourceLayer,
    )
  )
    return null
  if (!layout["text-field"]) return null
  const font = (kind: keyof StyleFonts) =>
    ownFonts ? { "text-font": fonts[kind] } : {}
  const label = (
    extraLayout: SymbolLayerSpecification["layout"],
    paint: SymbolLayerSpecification["paint"],
  ): SymbolLayerSpecification => {
    const { "icon-image": _icon, "icon-size": _iconSize, ...textLayout } =
      layout
    return {
      ...layer,
      layout: { ...textLayout, "text-field": NAME_ES, ...extraLayout },
      paint: { ...LABEL_HALO, ...paint },
    }
  }

  if (sourceLayer === "transportation_name") {
    if (/motorway|shield|ref/.test(id)) return null
    return {
      ...label(
        {
          ...font("regular"),
          "text-size": 11,
          "text-letter-spacing": 0.06,
          "text-transform": "uppercase",
        },
        { "text-color": paper(0.82) },
      ),
      minzoom: Math.max(layer.minzoom ?? 0, 13),
    }
  }

  if (sourceLayer === "water_name") {
    return label(
      {
        ...font("italic"),
        "text-size": 12,
        "text-letter-spacing": 0.25,
        "text-transform": "uppercase",
      },
      { "text-color": paper(0.92) },
    )
  }

  if (sourceLayer === "place") {
    if (/state|country|continent/.test(id)) return null
    if (/city/.test(id)) {
      return label(
        {
          ...font("bold"),
          "text-size": 15,
          "text-letter-spacing": 0.2,
          "text-transform": "uppercase",
          "text-offset": [0, 0],
          "text-anchor": "center",
        },
        { "text-color": PALETTE.paper },
      )
    }

    if (/suburb|town|village/.test(id)) {
      return label(
        {
          ...font("regular"),
          "text-size": 12,
          "text-letter-spacing": 0.14,
          "text-transform": "uppercase",
        },
        { "text-color": paper(0.85) },
      )
    }

    return label(
      {
        ...font("regular"),
        "text-size": 11,
        "text-letter-spacing": 0.1,
        "text-transform": "uppercase",
      },
      { "text-color": paper(0.7) },
    )
  }

  return label({}, { "text-color": paper(0.8) })
}

function restyle(
  layer: LayerSpecification,
  fonts: StyleFonts,
  ownFonts: boolean,
): LayerSpecification | null {
  switch (layer.type) {
    case "background":
      return { ...layer, paint: { "background-color": PALETTE.cyan } }
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

/** Capas que el estilo base no trae y el diseño necesita: pasto/parques y el nombre del río. */
function extraLayers(
  vectorSource: string,
  fonts: StyleFonts,
  ownFonts: boolean,
) {
  const fills: LayerSpecification[] = [
    {
      id: "pau-landcover-grass",
      type: "fill",
      source: vectorSource,
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "grass"],
      paint: { "fill-color": forest(1), "fill-opacity": 0.3 },
    },
    {
      id: "pau-park",
      type: "fill",
      source: vectorSource,
      "source-layer": "park",
      paint: { "fill-color": forest(0.38), "fill-outline-color": paper(0.16) },
    },
  ]

  const labels: LayerSpecification[] = [
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
        "text-size": 13,
        "text-letter-spacing": 0.3,
        "text-transform": "uppercase",
        "text-max-angle": 25,
      },
      paint: { "text-color": PALETTE.paper, ...LABEL_HALO },
    },
  ]

  return { fills, labels }
}

/** Fuente vectorial principal (esquema OpenMapTiles). */
function findVectorSource(style: StyleSpecification): string | undefined {
  const entries = Object.entries(style.sources)
  return (entries.find(
    ([id, source]) => source.type === "vector" && id === "openmaptiles",
  ) ?? entries.find(([, s]) => s.type === "vector"))?.[0]
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
      const names = font.filter(
        (name): name is string => typeof name === "string",
      )

      if (names.length && names.length === font.length) {
        return {
          ownFonts: false,
          fonts: { regular: names, bold: names, italic: names },
        }
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
    const { fills, labels } = extraLayers(vectorSource, fonts, ownFonts)
    // Rellenos verdes debajo de calles y edificios; el nombre del río, con el resto de las etiquetas.
    const firstAbove = layers.findIndex((l) =>
      ["waterway", "transportation", "building", "aeroway"].includes(
        sourceLayerOf(l) ?? "",
      ),
    )

    layers.splice(firstAbove === -1 ? layers.length : firstAbove, 0, ...fills)
    const firstPlace = layers.findIndex((l) => sourceLayerOf(l) === "place")
    layers.splice(firstPlace === -1 ? layers.length : firstPlace, 0, ...labels)
  }

  // Solo se declaran las fuentes que alguna capa usa (el relieve raster de OpenFreeMap queda afuera).
  const used = new Set(
    layers.map((l) => ("source" in l ? l.source : undefined)).filter(Boolean),
  )

  const sources: StyleSpecification["sources"] = {}
  for (const [id, source] of Object.entries(base.sources)) {
    if (!used.has(id)) continue
    const isOpenFreeMap =
      source.type === "vector" &&
      Boolean(source.url?.includes("tiles.openfreemap.org"))
    sources[id] =
      isOpenFreeMap && source.type === "vector"
        ? { ...source, attribution: OPENFREEMAP_ATTRIBUTION }
        : source
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
    return buildPauStyle(
      structuredClone(baseStyleJson) as unknown as StyleSpecification,
    )
  }

  let response: Response
  try {
    response = await fetch(STYLE_URL, { signal })
  } catch (error) {
    if (signal.aborted) throw error
    throw new StyleLoadError(
      `No se pudo descargar el estilo del mapa (${STYLE_URL}).`,
    )
  }

  if (!response.ok)
    throw new StyleLoadError(`El estilo del mapa respondió ${response.status}.`)
  const json: unknown = await response.json()
  if (!isStyle(json))
    throw new StyleLoadError(
      "La URL configurada no devuelve un estilo de MapLibre válido.",
    )
  return buildPauStyle(json)
}
