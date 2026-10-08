/**
 * Configuración general del sitio: qué página es la principal, rutas, nombres y SEO por página.
 *
 * Este archivo también lo lee el plugin de SEO (`vite-plugins/seo.ts`) durante el build para armar
 * el sitemap, los canonical y el HTML de cada ruta: no puede usar APIs del navegador ni
 * `import.meta.env`, ni importar componentes.
 */

/**
 * DECISIÓN ABIERTA: cuál es la página principal.
 *
 * - `"raices-vecinas"` (opción A, la del PDF): `/` = mapa, `/sobre-nosotros` = institucional.
 * - `"institucional"` (opción B): `/` = institucional, `/raices-vecinas` = mapa.
 *
 * Cambiar este valor alcanza: de acá salen las rutas, el menú, los links del footer, el sitemap y
 * los canonical.
 */
export type HomePage = "raices-vecinas" | "institucional"

export const HOME_PAGE = "raices-vecinas" as HomePage

export const SITE_NAME = "PAU Rosario"

export type PageId = "raicesVecinas" | "institucional"

export interface PageSeo {
  /** `<title>`: hasta ~60 caracteres. */
  title: string
  /** Meta descripción: entre 120 y 160 caracteres. */
  description: string
  /** Título para redes sociales (WhatsApp, Facebook, X). */
  ogTitle: string
  ogDescription: string
}

/** Imagen principal de la página (LCP): el HTML de esa ruta la precarga. */
export interface PreloadImage {
  type: string
  srcset: string
  sizes: string
}

export interface PageConfig {
  id: PageId
  path: string
  /** Nombre de la página para el menú y los datos estructurados. */
  name: string
  seo: PageSeo
  preload?: PreloadImage
}

const isMapHome = HOME_PAGE === "raices-vecinas"

export const PAGES: Record<PageId, PageConfig> = {
  raicesVecinas: {
    id: "raicesVecinas",
    path: isMapHome ? "/" : "/raices-vecinas",
    name: "Raíces Vecinas",
    seo: {
      title: "Huertas, ferias y compost en Rosario | PLANTATE · PAU",
      description:
        "Encontrá parques huerta, huertas, ferias, el Centro Agroecológico (CAR) y puntos de compost del Programa de Agricultura Urbana de Rosario. Mapa y horarios.",
      ogTitle: "PLANTATE. No seas nabo. · Huertas y ferias de Rosario",
      ogDescription:
        "Mapa de parques huerta, huertas, ferias, el Centro Agroecológico (CAR) y puntos de compost del Programa de Agricultura Urbana de Rosario.",
    },
    preload: {
      type: "image/avif",
      srcset: "/img/collage-hero-600.avif 600w, /img/collage-hero-900.avif 900w, /img/collage-hero-1086.avif 1086w",
      sizes: "(max-width: 767px) min(520px, calc(100vw - 40px)), 46vw",
    },
  },
  institucional: {
    id: "institucional",
    path: isMapHome ? "/sobre-nosotros" : "/",
    name: "Sobre nosotros",
    seo: {
      title: "Quiénes somos | Programa de Agricultura Urbana de Rosario",
      description:
        "Desde 2002, el Programa de Agricultura Urbana de Rosario transforma terrenos vacantes en espacios productivos. Quiénes somos, propuestas y objetivos.",
      ogTitle: "Programa de Agricultura Urbana · Rosario",
      ogDescription:
        "Desde 2002, el PAU transforma terrenos vacantes en espacios productivos, verdes y compartidos. Conocé quiénes somos y qué hacemos.",
    },
    preload: {
      type: "image/avif",
      srcset: "/img/sobre-nosotros-600.avif 600w, /img/sobre-nosotros-870.avif 870w",
      sizes: "100vw",
    },
  },
}

/** Páginas en orden: la principal primero (sitemap, datos estructurados). */
export const PAGE_LIST: PageConfig[] = isMapHome
  ? [PAGES.raicesVecinas, PAGES.institucional]
  : [PAGES.institucional, PAGES.raicesVecinas]

export const NOT_FOUND_SEO = {
  title: "Página no encontrada | PAU Rosario",
  description: "La página que buscás no existe o cambió de dirección. Volvé al inicio o buscá una huerta en el mapa del Programa de Agricultura Urbana de Rosario.",
}

/** Anclas internas de las páginas (ids de las secciones). */
export const ANCHORS = {
  mapa: "mapa",
  semillero: "semillero-digital",
  recursos: "recursos",
  queEsElPau: "que-es-el-pau",
  historia: "historia",
  labor: "labor",
} as const

/** Link a una página, con ancla opcional: `pageHref("raicesVecinas", "mapa")` → `/#mapa`. */
export function pageHref(page: PageId, anchor?: string): string {
  return anchor ? `${PAGES[page].path}#${anchor}` : PAGES[page].path
}
