import { ANCHORS, pageHref } from "../content/site"

/**
 * Destinos del sitio que no son secciones propias, todos en un solo lugar.
 *
 * `href: null` significa que todavía no hay un destino real: el link se muestra como
 * "Próximamente" en vez de apuntar a un ancla falsa. No inventar URLs: completar con las reales.
 */
export interface SiteLinkConfig {
  href: string | null
  /** Abre en pestaña nueva (documentos y sitios externos). */
  external?: boolean
}

export const LINKS = {
  // TODO: URL del PDF de la guía "La Huerta del m²".
  guiaHuerta: { href: null, external: true },
  // TODO: URL del calendario "Estación × Estación" (cosecha y bolsones agroecológicos).
  calendario: { href: null, external: true },
  // TODO: URL del fanzine "Basura Cero" (PDF o versión web).
  fanzine: { href: null, external: true },
  // TODO: confirmar que la cuenta exista con este nombre de usuario.
  instagram: {
    href: "https://www.instagram.com/semillero.digital/",
    external: true,
  },
  // Destino interno: la banda "Más de dos décadas echando raíces" de "Sobre nosotros".
  historia: { href: pageHref("institucional", ANCHORS.historia), external: false },
  // TODO: canal de contacto (página, formulario o mailto:).
  contacto: { href: null, external: true },
  // TODO: política de privacidad.
  privacidad: { href: null, external: true },
  // TODO: declaración de accesibilidad.
  accesibilidad: { href: null, external: true },
} satisfies Record<string, SiteLinkConfig>

export type LinkKey = keyof typeof LINKS
