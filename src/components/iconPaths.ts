/**
 * Íconos de trazo (grilla de 20×20, trazo redondeado) como datos, para usarlos tanto en React
 * (`Icon.tsx`) como en los pines del mapa, que se dibujan en canvas a partir de SVG (`map/pins.ts`).
 */
interface PathAttributes {
  d: string
}

interface CircleAttributes {
  cx: number
  cy: number
  r: number
}

interface RectAttributes {
  x: number
  y: number
  width: number
  height: number
  rx?: number
}

export type IconShape = ["path", PathAttributes] | ["circle", CircleAttributes] | ["rect", RectAttributes]

export const ICON_PATHS = {
  alert: [
    ["circle", { cx: 10, cy: 10, r: 7.5 }],
    ["path", { d: "M10 6.2v4.6M10 13.8h.01" }],
  ],
  arrow: [
    ["path", { d: "M4 10h12" }],
    ["path", { d: "m11 5 5 5-5 5" }],
  ],
  calendar: [
    ["path", { d: "M6.5 3.5v3M13.5 3.5v3M3.5 8.5h13" }],
    ["rect", { x: 3.5, y: 5, width: 13, height: 12, rx: 2 }],
    ["path", { d: "M7 12h.01M10 12h.01M13 12h.01M7 14.5h.01M10 14.5h.01" }],
  ],
  chevron: [["path", { d: "m6 8 4 4 4-4" }]],
  chevronLeft: [["path", { d: "m12.5 4.5-5.5 5.5 5.5 5.5" }]],
  chevronRight: [["path", { d: "m7.5 4.5 5.5 5.5-5.5 5.5" }]],
  clock: [
    ["circle", { cx: 10, cy: 10, r: 7 }],
    ["path", { d: "M10 6v4l3 2" }],
  ],
  close: [["path", { d: "m5 5 10 10M15 5 5 15" }]],
  // Compost: se conserva el ícono del sitio anterior (puntos de compost).
  compost: [
    ["path", { d: "M7 15c-3-2-3-7 0-10 4 0 7 3 7 7-2 3-5 4-7 3Z" }],
    ["path", { d: "M6 16c2-4 4-6 7-8" }],
  ],
  external: [
    ["path", { d: "M8 4H4v12h12v-4" }],
    ["path", { d: "M10 4h6v6M16 4l-7 7" }],
  ],
  fit: [
    ["path", { d: "M3 7.5V3h4.5M12.5 3H17v4.5M17 12.5V17h-4.5M7.5 17H3v-4.5" }],
    ["rect", { x: 7, y: 7, width: 6, height: 6, rx: 1 }],
  ],
  instagram: [
    ["rect", { x: 3, y: 3, width: 14, height: 14, rx: 4 }],
    ["circle", { cx: 10, cy: 10, r: 3.2 }],
    ["path", { d: "M14.2 5.8h.01" }],
  ],
  leaf: [
    ["path", { d: "M5 16C3 9 7 4 16 4c0 8-4 12-11 12Z" }],
    ["path", { d: "M5 16c3-4 6-7 10-10" }],
  ],
  locate: [
    ["circle", { cx: 10, cy: 10, r: 5 }],
    ["circle", { cx: 10, cy: 10, r: 1.4 }],
    ["path", { d: "M10 1.8v3M10 15.2v3M1.8 10h3M15.2 10h3" }],
  ],
  location: [
    ["path", { d: "M16 8c0 5-6 10-6 10S4 13 4 8a6 6 0 1 1 12 0Z" }],
    ["circle", { cx: 10, cy: 8, r: 2 }],
  ],
  mail: [
    ["rect", { x: 3, y: 5, width: 14, height: 11, rx: 2 }],
    ["path", { d: "m4 7 6 5 6-5" }],
  ],
  map: [
    ["path", { d: "M2.5 5.2 7.5 3l5 2.2 5-2.2v11.8l-5 2.2-5-2.2-5 2.2Z" }],
    ["path", { d: "M7.5 3v11.8M12.5 5.2V17" }],
  ],
  menu: [["path", { d: "M3 6h14M3 10h14M3 14h14" }]],
  minus: [["path", { d: "M4.5 10h11" }]],
  pause: [["path", { d: "M7.5 5v10M12.5 5v10" }]],
  play: [["path", { d: "M7 4.8v10.4L15 10 7 4.8Z" }]],
  plus: [["path", { d: "M10 4.5v11M4.5 10h11" }]],
  refresh: [
    ["path", { d: "M16 10a6 6 0 1 1-1.8-4.3" }],
    ["path", { d: "M16.2 3.2v3.4h-3.4" }],
  ],
  search: [
    ["circle", { cx: 9, cy: 9, r: 5.5 }],
    ["path", { d: "m13 13 4 4" }],
  ],
  sprout: [
    ["path", { d: "M10 18v-7" }],
    ["path", { d: "M10 12C6 12 4 10 4 6c4 0 6 2 6 6ZM10 14c4 0 6-2 6-6-4 0-6 2-6 6Z" }],
  ],

  /*
   * Íconos de categoría (pines, ficha, sugerencias y chips). Dibujados a partir de img/11 del PDF.
   * TODO: reemplazar cada uno por el SVG oficial de la diseñadora (alcanza con cambiar los paths).
   */
  // TODO: SVG oficial. Parques huertas: brote con dos hojas sobre la tierra.
  pinParque: [
    ["path", { d: "M10 14.6V7.6" }],
    ["path", { d: "M10 7.6C8.4 6.2 8.4 3.8 10 2.2c1.6 1.6 1.6 4 0 5.4Z" }],
    ["path", { d: "M10 11.6C8.6 9.5 6.1 8.8 3.6 9.7c1.4 2.2 4 2.8 6.4 1.9Z" }],
    ["path", { d: "M10 11.6c1.4-2.1 3.9-2.8 6.4-1.9-1.4 2.2-4 2.8-6.4 1.9Z" }],
    ["path", { d: "M3.6 16.8a1.3 1.1 0 0 1 2.6 0 1.3 1.1 0 0 1 2.6 0 1.3 1.1 0 0 1 2.6 0 1.3 1.1 0 0 1 2.6 0 1.3 1.1 0 0 1 2.6 0" }],
  ],
  // TODO: SVG oficial. Ferias: puesto de feria con toldo y una persona.
  pinFeria: [
    ["path", { d: "M2.8 7.4 10 3l7.2 4.4Z" }],
    ["path", { d: "M4.4 7.4v9.2M15.6 7.4v9.2" }],
    ["circle", { cx: 10, cy: 9.7, r: 1.6 }],
    ["path", { d: "M7.2 13.4c0-1.7 1.2-2.4 2.8-2.4s2.8.7 2.8 2.4" }],
    ["rect", { x: 3, y: 13.4, width: 14, height: 3.2, rx: 0.3 }],
  ],
  // TODO: SVG oficial. CAR: tres hojas, como el isotipo.
  pinCar: [
    ["path", { d: "M9.6 16C6.9 13.2 6.5 7.6 8.4 3c2.6 3.3 3.1 8.8 1.2 13Z" }],
    ["path", { d: "M8.4 3.6c.3 4.1.7 8.2 1.2 12.4" }],
    ["path", { d: "M9.3 16.4C5.4 16.4 3 13.7 2.6 9.6c3.8.4 6.3 3 6.7 6.8Z" }],
    ["path", { d: "M10.2 16.4c.3-4.8 3.4-8.1 7.3-8.6-.3 4.9-3.1 8.3-7.3 8.6Z" }],
    ["path", { d: "M10.2 16.4c1.9-3 4.3-5.7 7.3-8.6" }],
  ],
  // TODO: SVG oficial. Huertas: planta que sale de una maceta con tierra.
  pinHuerta: [
    ["path", { d: "M3.4 11.4h13.2c0 3.5-2.9 6-6.6 6s-6.6-2.5-6.6-6Z" }],
    ["path", { d: "M5.6 15.4 10 11.4M8.6 17.2l5.9-5.4" }],
    ["path", { d: "M10 11.4V2.6" }],
    ["path", { d: "M10 8.1C8.7 6.5 6.9 6.1 5.3 6.7c.9 1.6 2.8 2.1 4.7 1.4Z" }],
    ["path", { d: "M10 5.4c1.1-1.5 2.8-2 4.4-1.6-.8 1.6-2.6 2.2-4.4 1.6Z" }],
    ["path", { d: "M10 9c1.2-1.4 2.9-1.8 4.5-1.3-.9 1.6-2.7 2-4.5 1.3Z" }],
  ],
} satisfies Record<string, IconShape[]>

export type IconName = keyof typeof ICON_PATHS

/** Marcado SVG interno de un ícono (sin el <svg> contenedor). */
export function iconMarkup(name: IconName): string {
  return (ICON_PATHS[name] as IconShape[])
    .map(([tag, attrs]) => {
      const attributes = Object.entries(attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")
      return `<${tag} ${attributes}/>`
    })
    .join("")
}
