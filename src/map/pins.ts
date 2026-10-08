import type { Map as MapLibreMap } from "maplibre-gl"
import { iconMarkup } from "../components/iconPaths"
import { CATEGORIES, type CategorySlug } from "../data/locations"
import { PALETTE } from "../lib/palette"

/*
 * Pin del PDF: gota clásica (cabeza redonda y punta abajo), sin borde blanco, del color de la
 * categoría y con el ícono lineal en Blanco Ajito. Compost, que no está en el PDF, va en crema con
 * borde e ícono Marrón Corteza. Se arma como SVG, se rasteriza en un canvas y se registra en el mapa
 * con `map.addImage`, así los pines se dibujan en WebGL dentro de una capa `symbol`.
 */

/** Caja del pin en unidades del viewBox (= px lógicos a escala 1). */
const PIN_WIDTH = 44

const PIN_HEIGHT = 52

/** Margen alrededor del pin para la sombra y el halo del pin seleccionado. */
const MARGIN = 10

/** Cabeza: círculo con centro (22, 21) y radio 19; punta en (22, 49), tangente al círculo. */
const PIN_PATH = "M22 49 L35.96 33.89 A19 19 0 1 0 8.04 33.89 Z"

/** Punta del pin. */
const TIP_Y = 49

/** El ícono (grilla de 20) se escala para ocupar ~60 % de la cabeza. */
const ICON_SCALE = 1.15

const ICON_STROKE = 1.35

export const PIN_SCALE = 1

export const SELECTED_PIN_SCALE = 1.2

/** Altura visible del pin (para ubicar el tooltip encima). */
export const pinHeight = (scale: number) => PIN_HEIGHT * scale

/**
 * `icon-anchor: bottom` apoya el borde inferior de la imagen sobre el punto, pero la imagen tiene
 * margen para la sombra: este desplazamiento baja el pin para que la punta toque la coordenada.
 */
export const pinOffset = (scale: number): [number, number] => [0, (PIN_HEIGHT + 2 * MARGIN - (TIP_Y + MARGIN)) * scale]

export const PIN_IMAGE_PREFIX = "pau-pin-"

export const SELECTED_SUFFIX = "-selected"

export const pinImageId = (slug: CategorySlug, selected: boolean) =>
  `${PIN_IMAGE_PREFIX}${slug}${selected ? SELECTED_SUFFIX : ""}`

interface PinSvg {
  svg: string
  width: number
  height: number
}

function pinSvg(slug: CategorySlug, scale: number, selected: boolean): PinSvg {
  const meta = Object.values(CATEGORIES).find((category) => category.slug === slug)
  if (!meta) throw new Error(`Categoría desconocida: ${slug}`)
  const width = (PIN_WIDTH + 2 * MARGIN) * scale
  const height = (PIN_HEIGHT + 2 * MARGIN) * scale
  // Seleccionado: halo crema y oliva alrededor de la gota.
  const halo = selected
    ? `<path d="${PIN_PATH}" fill="none" stroke="${PALETTE.verdeCar}" stroke-opacity=".38" stroke-width="15" stroke-linejoin="round"/>` +
      `<path d="${PIN_PATH}" fill="${PALETTE.blancoAjito}" stroke="${PALETTE.blancoAjito}" stroke-width="7" stroke-linejoin="round"/>`
    : ""
  const stroke = meta.stroke ? ` stroke="${meta.stroke}" stroke-width="2.5" stroke-linejoin="round"` : ""
  const iconOffset = 22 - 10 * ICON_SCALE
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${-MARGIN} ${-MARGIN} ${PIN_WIDTH + 2 * MARGIN} ${PIN_HEIGHT + 2 * MARGIN}">` +
    halo +
    `<path d="${PIN_PATH}" fill="${meta.color}"${stroke}/>` +
    `<g transform="translate(${iconOffset} ${21 - 10 * ICON_SCALE}) scale(${ICON_SCALE})" fill="none" stroke="${meta.iconColor}" stroke-width="${ICON_STROKE}" stroke-linecap="round" stroke-linejoin="round">${iconMarkup(meta.icon)}</g>` +
    `</svg>`
  return { svg, width, height }
}

async function rasterize(svg: string, width: number, height: number, ratio: number): Promise<ImageData> {
  const image = new Image()
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  await image.decode()
  const canvas = document.createElement("canvas")
  canvas.width = Math.ceil(width * ratio)
  canvas.height = Math.ceil(height * ratio)
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Canvas 2D no disponible para dibujar los pines.")
  // Sombra suave para despegar el pin del mapa claro. Se expresa en px del canvas.
  context.shadowColor = "rgba(19, 62, 69, 0.3)"
  context.shadowBlur = 6 * ratio
  context.shadowOffsetY = 2.5 * ratio
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return context.getImageData(0, 0, canvas.width, canvas.height)
}

/** Registra en el mapa un pin normal y uno seleccionado por categoría. */
export async function addPinImages(map: MapLibreMap): Promise<void> {
  const ratio = Math.min(3, Math.max(2, Math.ceil(window.devicePixelRatio || 1)))
  const slugs = Object.values(CATEGORIES).map((category) => category.slug)
  const variants = slugs.flatMap((slug) => [
    { slug, selected: false, scale: PIN_SCALE },
    { slug, selected: true, scale: SELECTED_PIN_SCALE },
  ])

  const images = await Promise.all(
    variants.map(async ({ slug, selected, scale }) => {
      const { svg, width, height } = pinSvg(slug, scale, selected)
      return { id: pinImageId(slug, selected), data: await rasterize(svg, width, height, ratio) }
    }),
  )

  for (const { id, data } of images) {
    if (!map.hasImage(id)) map.addImage(id, data, { pixelRatio: ratio })
  }
}
