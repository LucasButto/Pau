import fs from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"
import { PAGE_LIST, PAGES, SITE_NAME, type PageConfig } from "../src/content/site"

/**
 * Metadatos y archivos de SEO del sitio publicado.
 *
 * - Completa los `{{...}}` de index.html con los textos de cada página (`src/content/site.ts`) y con
 *   la URL pública de producción: canonical, og:url, og:image y datos estructurados necesitan una
 *   URL absoluta.
 * - En el build genera un HTML por ruta (p. ej. `dist/sobre-nosotros/index.html`) con su `<title>`,
 *   descripción, canonical y og:* propios, para que buscadores y WhatsApp los vean sin ejecutar JS.
 *   En desarrollo hace lo mismo según la URL pedida.
 * - En producción quita los comentarios HTML (los de index.html son notas para quien edita).
 * - Deja una sola versión de cada metaetiqueta. Si otro plugin del build inyecta una repetida
 *   (descripción, og:*, robots...), se descarta y gana la que está en index.html.
 * - Escribe `robots.txt` (permite indexar y apunta al sitemap) y `sitemap.xml` con todas las rutas.
 * - Avisa si en los archivos publicados queda alguna mención a "figma".
 *
 * URL pública, en este orden:
 *   1. `VITE_SITE_URL` (para un dominio propio; ver .env.example)
 *   2. `VERCEL_PROJECT_PRODUCTION_URL` (dominio de producción; Vercel lo define solo)
 *   3. el valor por defecto de abajo
 */
const DEFAULT_SITE_URL = "https://pau-red.vercel.app"
const FORBIDDEN = /figma/i
const PUBLISHED_TEXT_FILES = ["robots.txt", "sitemap.xml", "site.webmanifest"]

export function resolveSiteUrl(explicit?: string, vercelHost?: string): string {
  const raw = explicit?.trim() || (vercelHost?.trim() ? `https://${vercelHost.trim()}` : DEFAULT_SITE_URL)
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return withScheme.replace(/\/+$/, "")
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

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

const pageUrl = (siteUrl: string, page: PageConfig) => `${siteUrl}${page.path === "/" ? "/" : page.path}`

/** Datos estructurados: el sitio, la organización y la página. */
function jsonLd(siteUrl: string, page: PageConfig): string {
  const url = pageUrl(siteUrl, page)
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "PLANTATE. No seas nabo.",
      alternateName: SITE_NAME,
      description: PAGES.raicesVecinas.seo.ogDescription,
      inLanguage: "es-AR",
      publisher: { "@id": `${siteUrl}/#organizacion` },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organizacion`,
      name: "Programa de Agricultura Urbana de Rosario",
      alternateName: "PAU",
      url: `${siteUrl}/`,
      logo: `${siteUrl}/icon-512.png`,
      areaServed: { "@type": "City", name: "Rosario, Santa Fe, Argentina" },
    },
    {
      "@type": page.id === "institucional" ? "AboutPage" : "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.seo.title,
      description: page.seo.description,
      inLanguage: "es-AR",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organizacion` },
      primaryImageOfPage: { "@type": "ImageObject", url: `${siteUrl}/og-image.png`, width: 1200, height: 630 },
    },
  ]
  // `<` escapado: el JSON va dentro de un <script>.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")
}

function preloadTag(page: PageConfig): string {
  const image = page.preload
  if (!image) return ""
  return `<link rel="preload" as="image" type="${image.type}" imagesrcset="${image.srcset}" imagesizes="${image.sizes}" fetchpriority="high" />`
}

/** HTML de una página a partir de la plantilla (index.html ya procesado por Vite). */
export function renderPage(template: string, siteUrl: string, page: PageConfig): string {
  const values: Record<string, string> = {
    TITLE: escapeHtml(page.seo.title),
    DESCRIPTION: escapeHtml(page.seo.description),
    OG_TITLE: escapeHtml(page.seo.ogTitle),
    OG_DESCRIPTION: escapeHtml(page.seo.ogDescription),
    PAGE_URL: pageUrl(siteUrl, page),
    SITE_URL: siteUrl,
    JSON_LD: jsonLd(siteUrl, page),
    NOSCRIPT_TITLE: escapeHtml(page.id === "raicesVecinas" ? "PLANTATE. No seas nabo." : "Programa de Agricultura Urbana de Rosario"),
  }
  return template
    .replace(/<!--\s*pau:preload\s*-->/, preloadTag(page))
    .replace(/\{\{([A-Z_]+)\}\}/g, (match, key: string) => values[key] ?? match)
}

const robotsTxt = (siteUrl: string) => `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`

const sitemapXml = (siteUrl: string, lastmod: string) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGE_LIST.map(
    (page) => `  <url>\n    <loc>${pageUrl(siteUrl, page)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n`,
  ).join("")}</urlset>\n`

/** Página que corresponde a una URL (en desarrollo); si no coincide ninguna, la principal. */
function pageForUrl(url: string | undefined): PageConfig {
  const pathname = (url ?? "/").split(/[?#]/)[0].replace(/\/+$/, "") || "/"
  return PAGE_LIST.find((page) => page.path === pathname) ?? PAGE_LIST[0]
}

export default function seo(): Plugin {
  let siteUrl = DEFAULT_SITE_URL
  let outDir = ""
  let isBuild = false
  /** index.html procesado, con los `{{...}}` de página todavía sin completar. */
  let template = ""
  return {
    name: "pau-seo",
    configResolved(config) {
      siteUrl = resolveSiteUrl(config.env.VITE_SITE_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL)
      outDir = path.resolve(config.root, config.build.outDir)
      isBuild = config.command === "build"
    },
    transformIndexHtml: {
      order: "post",
      handler: (html, ctx) => {
        template = dedupeMeta(html)
        return isBuild ? stripComments(renderPage(template, siteUrl, PAGE_LIST[0])) : renderPage(template, siteUrl, pageForUrl(ctx.originalUrl))
      },
    },
    // `vite preview` responde como Vercel: cada ruta con su propio HTML (dist/<ruta>/index.html).
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url ?? "/").split(/[?#]/)[0].replace(/\/+$/, "")
        const page = PAGE_LIST.find((candidate) => candidate.path !== "/" && candidate.path === pathname)
        const file = page ? path.join(outDir, page.path.replace(/^\//, ""), "index.html") : ""
        if (!file || !fs.existsSync(file)) return next()
        res.setHeader("Content-Type", "text/html; charset=utf-8")
        res.end(fs.readFileSync(file))
      })
    },
    writeBundle(options) {
      const dir = options.dir ?? outDir
      // Una copia del HTML por cada ruta que no es la principal (la principal es dist/index.html).
      for (const page of PAGE_LIST) {
        if (page.path === "/") continue
        const target = path.join(dir, page.path.replace(/^\//, ""), "index.html")
        fs.mkdirSync(path.dirname(target), { recursive: true })
        fs.writeFileSync(target, stripComments(renderPage(template, siteUrl, page)))
      }
      fs.writeFileSync(path.join(dir, "robots.txt"), robotsTxt(siteUrl))
      fs.writeFileSync(path.join(dir, "sitemap.xml"), sitemapXml(siteUrl, new Date().toISOString().slice(0, 10)))

      const published = [
        ...PAGE_LIST.map((page) => path.join(page.path.replace(/^\//, ""), "index.html")),
        ...PUBLISHED_TEXT_FILES,
      ]
      for (const file of published) {
        const target = path.join(dir, file)
        if (fs.existsSync(target) && FORBIDDEN.test(fs.readFileSync(target, "utf8"))) {
          console.warn(`\n[pau-seo] Atención: ${file} menciona "figma". Revisá los metadatos antes de publicar.\n`)
        }
        if (fs.existsSync(target) && /\{\{[A-Z_]+\}\}/.test(fs.readFileSync(target, "utf8"))) {
          console.warn(`\n[pau-seo] Atención: ${file} tiene marcadores {{...}} sin completar.\n`)
        }
      }
    },
  }
}
