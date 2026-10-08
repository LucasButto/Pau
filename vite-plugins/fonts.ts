import fs from "node:fs"
import path from "node:path"
import type { HtmlTagDescriptor, Plugin } from "vite"

/**
 * Tipografía Pacaembu (la del diseño), lista para cuando lleguen los archivos.
 *
 * Busca en `public/fonts/pacaembu/` los cuatro pesos y, solo para los archivos que existen, agrega
 * al HTML los `@font-face` (con `font-display: swap`) y la precarga de Regular y Extrabold. Sin
 * archivos no agrega nada: el sitio usa Outfit y no quedan 404 en la consola. Al copiar los
 * archivos no hace falta tocar código (en desarrollo, reiniciá el servidor).
 */
const FONT_DIR = "fonts/pacaembu"

const WEIGHTS = [
  { file: "Pacaembu-Regular.woff2", weight: 400, preload: true },
  { file: "Pacaembu-Semibold.woff2", weight: 600, preload: false },
  { file: "Pacaembu-Bold.woff2", weight: 700, preload: false },
  { file: "Pacaembu-Extrabold.woff2", weight: 800, preload: true },
]

export default function pacaembu(): Plugin {
  let publicDir = ""
  let base = "/"
  return {
    name: "pau-fonts",
    configResolved(config) {
      publicDir = config.publicDir
      base = config.base
    },
    transformIndexHtml() {
      const available = WEIGHTS.filter(({ file }) => publicDir && fs.existsSync(path.join(publicDir, FONT_DIR, file)))
      if (!available.length) return []
      const url = (file: string) => `${base}${FONT_DIR}/${file}`
      const faces = available
        .map(
          ({ file, weight }) =>
            `@font-face{font-family:"Pacaembu";src:url("${url(file)}") format("woff2");font-weight:${weight};font-style:normal;font-display:swap}`,
        )
        .join("")
      const tags: HtmlTagDescriptor[] = available
        .filter(({ preload }) => preload)
        .map(({ file }) => ({
          tag: "link",
          attrs: { rel: "preload", href: url(file), as: "font", type: "font/woff2", crossorigin: "" },
          injectTo: "head-prepend",
        }))
      tags.push({ tag: "style", children: faces, injectTo: "head-prepend" })
      return tags
    },
  }
}
