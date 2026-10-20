import type { Map as MapLibreMap } from "maplibre-gl"
import { CATEGORIES, PIN_ASPECT, type CategorySlug } from "../data/locations"
import { PALETTE } from "../lib/palette"

/*
 * Pines oficiales de la diseñadora (un PNG por categoría, `src/assets/pines`). Se dibujan en un
 * canvas, con sombra, y se registran en el mapa con `map.addImage`, así los pines se pintan en WebGL
 * dentro de una capa `symbol`. El pin seleccionado es más grande y lleva un halo crema y oliva que
 * sigue la silueta del PNG.
 */

/** Caja del pin en px lógicos a escala 1; el PNG no tiene margen, así que la punta toca el borde de abajo. */
const PIN_HEIGHT = 52

const PIN_WIDTH = PIN_HEIGHT * PIN_ASPECT

/** Margen alrededor del pin para la sombra y el halo del pin seleccionado. */
const MARGIN = 10

export const PIN_SCALE = 1

export const SELECTED_PIN_SCALE = 1.2

/** Cuánto sobresale el halo crema y el oliva de la silueta (px lógicos a escala 1). */
const HALO_CREAM = 3.5

const HALO_OLIVE = 7.5

/** Altura visible del pin (para ubicar el tooltip encima). */
export const pinHeight = (scale: number) => PIN_HEIGHT * scale

/**
 * `icon-anchor: bottom` apoya el borde inferior de la imagen sobre el punto, pero la imagen tiene
 * margen para la sombra: este desplazamiento baja el pin para que la punta toque la coordenada.
 */
export const pinOffset = (scale: number): [number, number] => [0, MARGIN * scale]

export const PIN_IMAGE_PREFIX = "pau-pin-"

export const SELECTED_SUFFIX = "-selected"

export const pinImageId = (slug: CategorySlug, selected: boolean) =>
  `${PIN_IMAGE_PREFIX}${slug}${selected ? SELECTED_SUFFIX : ""}`

function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Canvas 2D no disponible para dibujar los pines.")
  return [canvas, context]
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image()
  image.src = src
  await image.decode()
  return image
}

/** Silueta del pin en un solo color, engordada `grow` px: el contorno del halo. */
function grownSilhouette(
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  canvasSize: [number, number],
  color: string,
  grow: number,
): HTMLCanvasElement {
  const [shape, shapeContext] = createCanvas(...canvasSize)
  shapeContext.drawImage(image, x, y, width, height)
  shapeContext.globalCompositeOperation = "source-in"
  shapeContext.fillStyle = color
  shapeContext.fillRect(0, 0, ...canvasSize)

  const [grown, grownContext] = createCanvas(...canvasSize)
  // Engordar = repetir la silueta desplazada en un anillo de direcciones (a color pleno, sin acumular opacidad).
  const steps = 24
  for (let step = 0; step < steps; step += 1) {
    const angle = (step / steps) * 2 * Math.PI
    grownContext.drawImage(shape, Math.cos(angle) * grow, Math.sin(angle) * grow)
  }
  grownContext.drawImage(shape, 0, 0)
  return grown
}

function rasterize(image: HTMLImageElement, scale: number, selected: boolean, ratio: number): ImageData {
  const unit = scale * ratio
  const canvasSize: [number, number] = [Math.ceil((PIN_WIDTH + 2 * MARGIN) * unit), Math.ceil((PIN_HEIGHT + 2 * MARGIN) * unit)]
  const x = MARGIN * unit
  const y = MARGIN * unit
  const width = PIN_WIDTH * unit
  const height = PIN_HEIGHT * unit

  const [stage, stageContext] = createCanvas(...canvasSize)
  if (selected) {
    const olive = grownSilhouette(image, x, y, width, height, canvasSize, PALETTE.verdeCar, HALO_OLIVE * unit)
    stageContext.globalAlpha = 0.38
    stageContext.drawImage(olive, 0, 0)
    stageContext.globalAlpha = 1
    stageContext.drawImage(
      grownSilhouette(image, x, y, width, height, canvasSize, PALETTE.blancoAjito, HALO_CREAM * unit),
      0,
      0,
    )
  }
  stageContext.drawImage(image, x, y, width, height)

  const [canvas, context] = createCanvas(...canvasSize)
  // Sombra suave para despegar el pin del mapa claro. Se expresa en px del canvas.
  context.shadowColor = "rgba(19, 62, 69, 0.3)"
  context.shadowBlur = 6 * ratio
  context.shadowOffsetY = 2.5 * ratio
  context.drawImage(stage, 0, 0)
  return context.getImageData(0, 0, canvas.width, canvas.height)
}

/** Registra en el mapa un pin normal y uno seleccionado por categoría. */
export async function addPinImages(map: MapLibreMap): Promise<void> {
  const ratio = Math.min(3, Math.max(2, Math.ceil(window.devicePixelRatio || 1)))

  const images = await Promise.all(
    Object.values(CATEGORIES).map(async ({ slug, pin }) => {
      const image = await loadImage(pin)
      return [
        { id: pinImageId(slug, false), data: rasterize(image, PIN_SCALE, false, ratio) },
        { id: pinImageId(slug, true), data: rasterize(image, SELECTED_PIN_SCALE, true, ratio) },
      ]
    }),
  )

  for (const { id, data } of images.flat()) {
    if (!map.hasImage(id)) map.addImage(id, data, { pixelRatio: ratio })
  }
}
