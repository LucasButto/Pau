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
    ["path", { d: "M5 12h14" }],
    ["path", { d: "m13 6 6 6-6 6" }],
  ],
  calendar: [
    ["path", { d: "M5 4v3M15 4v3M3 9h14" }],
    ["rect", { x: 3, y: 5, width: 14, height: 13, rx: 2 }],
  ],
  check: [["path", { d: "m4.5 10.5 3.5 3.5 7.5-8" }]],
  chevron: [["path", { d: "m6 9 4 4 4-4" }]],
  clock: [
    ["circle", { cx: 10, cy: 10, r: 7 }],
    ["path", { d: "M10 6v4l3 2" }],
  ],
  close: [["path", { d: "m5 5 10 10M15 5 5 15" }]],
  compost: [
    ["path", { d: "M7 15c-3-2-3-7 0-10 4 0 7 3 7 7-2 3-5 4-7 3Z" }],
    ["path", { d: "M6 16c2-4 4-6 7-8" }],
  ],
  external: [
    ["path", { d: "M8 4H4v12h12v-4" }],
    ["path", { d: "M10 4h6v6M16 4l-7 7" }],
  ],
  fair: [
    ["path", { d: "M4 8h12l-1-4H5L4 8Z" }],
    ["path", { d: "M5 8v8h10V8M8 16v-5h4v5" }],
  ],
  fit: [
    ["path", { d: "M3 7.5V3h4.5M12.5 3H17v4.5M17 12.5V17h-4.5M7.5 17H3v-4.5" }],
    ["rect", { x: 7, y: 7, width: 6, height: 6, rx: 1 }],
  ],
  garden: [
    ["path", { d: "M10 18V9" }],
    [
      "path",
      { d: "M10 10C6 10 4 8 4 4c4 0 6 2 6 6ZM10 13c4 0 6-2 6-6-4 0-6 2-6 6Z" },
    ],
  ],
  image: [
    ["rect", { x: 3, y: 4, width: 14, height: 12, rx: 2 }],
    ["path", { d: "m3.5 14 4-4 3 3 2-2 4 4" }],
    ["circle", { cx: 13, cy: 7.5, r: 1.2 }],
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
  list: [
    [
      "path",
      {
        d: "M7.5 5.5h9M7.5 10h9M7.5 14.5h9M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01",
      },
    ],
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
    [
      "path",
      { d: "M10 12C6 12 4 10 4 6c4 0 6 2 6 6ZM10 14c4 0 6-2 6-6-4 0-6 2-6 6Z" },
    ],
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
