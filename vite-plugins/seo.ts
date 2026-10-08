import fs from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"

/**
 * Metadatos y archivos de SEO del sitio publicado.
 *
 * - Reemplaza `{{SITE_URL}}` en index.html por la URL pública de producción: canonical, og:url,
 *   og:image y datos estructurados necesitan una URL absoluta.
 * - En producción quita los comentarios HTML (los de index.html son notas para quien edita).
 * - Deja una sola versión de cada metaetiqueta. Si otro plugin del build inyecta una repetida
 *   (descripción, og:*, robots...), se descarta y gana la que está en index.html.
 * - Escribe `robots.txt` (permite indexar y apunta al sitemap) y `sitemap.xml` en la carpeta de salida.
 * - Avisa si en los archivos publicados queda alguna mención a "figma".
 *
 * URL pública, en este orden:
 *   1. `VITE_SITE_URL` (para un dominio propio; ver .env.example)
 *   2. `VERCEL_PROJECT_PRODUCTION_URL` (dominio de producción; Vercel lo define solo)
 *   3. el valor por defecto de abajo
 */
const DEFAULT_SITE_URL = "https://pau-red.vercel.app"
const PLACEHOLDER = /\{\{SITE_URL\}\}/g
const FORBIDDEN = /figma/i
const PUBLISHED_TEXT_FILES = ["index.html", "robots.txt", "sitemap.xml", "site.webmanifest"]

export function resolveSiteUrl(explicit?: string, vercelHost?: string): string {
  const raw = explicit?.trim() || (vercelHost?.trim() ? `https://${vercelHost.trim()}` : DEFAULT_SITE_URL)
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return withScheme.replace(/\/+$/, "")
}

/** Clave que identifica una metaetiqueta de página (descripción, og:title, robots...). */
function metaKey(tag: string): string | null {
  const attribute = (name: string) => new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i").exec(tag)
  const byName = attribute("name")
  if (byName) return `name:${(byName[1] ?? byName[2] ?? "").toLowerCase()}`
  const byProperty = attribute("property")
  if (byProperty) return `property:${(byProperty[1] ?? byProperty[2] ?? "").toLowerCase()}`
  return null // charset, http-equiv: no se tocan
}

export function stripComments(html: string): string {
  return html.replace(/[ \t]*<!--[\s\S]*?-->[ \t]*\r?\n?/g, "")
}

/** Conserva la primera aparición de cada metaetiqueta (las de index.html van primero). */
export function dedupeMeta(html: string): string {
  const seen = new Set<string>()
  return html.replace(/[ \t]*<meta\b[^>]*>[ \t]*\r?\n?/gi, (match) => {
    const key = metaKey(match)
    if (!key) return match
    if (seen.has(key)) return ""
    seen.add(key)
    return match
  })
}

const robotsTxt = (siteUrl: string) => `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`

const sitemapXml = (siteUrl: string, lastmod: string) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n</urlset>\n`

export default function seo(): Plugin {
  let siteUrl = DEFAULT_SITE_URL
  let outDir = ""
  let isBuild = false
  return {
    name: "pau-seo",
    configResolved(config) {
      siteUrl = resolveSiteUrl(config.env.VITE_SITE_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL)
      outDir = path.resolve(config.root, config.build.outDir)
      isBuild = config.command === "build"
    },
    transformIndexHtml: {
      order: "post",
      handler: (html) => {
        const withUrl = html.replace(PLACEHOLDER, siteUrl)
        return dedupeMeta(isBuild ? stripComments(withUrl) : withUrl)
      },
    },
    writeBundle(options) {
      const dir = options.dir ?? outDir
      fs.writeFileSync(path.join(dir, "robots.txt"), robotsTxt(siteUrl))
      fs.writeFileSync(path.join(dir, "sitemap.xml"), sitemapXml(siteUrl, new Date().toISOString().slice(0, 10)))
      for (const file of PUBLISHED_TEXT_FILES) {
        const target = path.join(dir, file)
        if (fs.existsSync(target) && FORBIDDEN.test(fs.readFileSync(target, "utf8"))) {
          console.warn(`\n[pau-seo] Atención: ${file} menciona "figma". Revisá los metadatos antes de publicar.\n`)
        }
      }
    },
  }
}
