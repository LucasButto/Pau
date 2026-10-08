/** Ayudas de navegación: scroll a anclas (compensando el header sticky vía `scroll-margin-top`) y foco. */

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Lleva el foco a un elemento sin mover el scroll (si no es enfocable, lo vuelve enfocable). */
export function moveFocus(element: HTMLElement | null) {
  if (!element) return
  if (!element.matches("a[href], button, input, select, textarea, [tabindex]")) element.setAttribute("tabindex", "-1")
  element.focus({ preventScroll: true })
}

/** Scroll hasta el elemento con ese id. Devuelve `false` si todavía no existe en la página. */
export function scrollToAnchor(id: string, { smooth = true, focus = true } = {}): boolean {
  const element = document.getElementById(id)
  if (!element) return false
  element.scrollIntoView({ behavior: smooth && !prefersReducedMotion() ? "smooth" : "auto", block: "start" })
  if (focus) moveFocus(element)
  return true
}

/** Parte un href interno en ruta y ancla. Devuelve `null` si apunta a otro sitio. */
export function parseInternalHref(href: string): { path: string; hash: string } | null {
  if (/^(mailto:|tel:)/i.test(href)) return null
  const url = new URL(href, window.location.href)
  if (url.origin !== window.location.origin) return null
  return { path: url.pathname, hash: url.hash.replace(/^#/, "") }
}
