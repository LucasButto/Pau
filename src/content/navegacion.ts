import { ANCHORS, HOME_PAGE, pageHref, type PageId } from "./site"

/**
 * Menú principal y columnas del footer. Los destinos salen de `site.ts`, así que cambiar la página
 * principal (opción A / B) no obliga a tocar este archivo.
 */

export interface NavLink {
  label: string
  href: string
}

export interface NavItem extends NavLink {
  /** Página en la que el ítem se marca como activo (`aria-current="page"`). */
  activeOn?: PageId
  /** Sub-ítems del desplegable. */
  children?: NavLink[]
}

const SOBRE_NOSOTROS_LINKS: NavLink[] = [
  { label: "¿Qué es el PAU?", href: pageHref("institucional", ANCHORS.queEsElPau) },
  { label: "Historia", href: pageHref("institucional", ANCHORS.historia) },
  { label: "Labor", href: pageHref("institucional", ANCHORS.labor) },
]

export const NAV_ITEMS: NavItem[] =
  HOME_PAGE === "raices-vecinas"
    ? [
        { label: "Inicio", href: "/", activeOn: "raicesVecinas" },
        {
          label: "Sobre nosotros",
          href: pageHref("institucional"),
          activeOn: "institucional",
          children: SOBRE_NOSOTROS_LINKS,
        },
        { label: "Semillero digital", href: pageHref("raicesVecinas", ANCHORS.semillero) },
      ]
    : [
        {
          label: "Inicio",
          href: "/",
          activeOn: "institucional",
        },
        {
          label: "Sobre nosotros",
          href: pageHref("institucional", ANCHORS.queEsElPau),
          children: SOBRE_NOSOTROS_LINKS,
        },
        { label: "Raíces Vecinas", href: pageHref("raicesVecinas"), activeOn: "raicesVecinas" },
        { label: "Semillero digital", href: pageHref("raicesVecinas", ANCHORS.semillero) },
      ]

/** Botón "Encontrá tu huerta" del header y CTA "Hay una huerta": siempre al mapa. */
export const MAP_CTA = {
  label: "Encontrá tu huerta",
  shortLabel: "Ver mapa",
  href: pageHref("raicesVecinas", ANCHORS.mapa),
}

export const FOOTER_COLUMNS = {
  explorar: {
    title: "Explorar",
    links: [
      { label: "Raíces Vecinas", href: pageHref("raicesVecinas", ANCHORS.mapa) },
      { label: "Semillero Digital", href: pageHref("raicesVecinas", ANCHORS.semillero) },
      { label: "Guías y recursos", href: pageHref("raicesVecinas", ANCHORS.recursos) },
    ] satisfies NavLink[],
  },
  conocer: {
    title: "Conocer",
    links: [
      { label: "El programa", href: pageHref("institucional") },
      { label: "Nuestra historia", href: pageHref("institucional", ANCHORS.historia) },
    ] satisfies NavLink[],
  },
}

export const FOOTER_TEXT = {
  tagline: "Cultivando soberanía alimentaria, trabajo digno y paisaje urbano.",
  institutions: "Municipalidad de Rosario · Cátedra Spiaggi / Garat FAPyD UNR",
  newsletterTitle: ["Que la próxima", "temporada te encuentre."],
}
