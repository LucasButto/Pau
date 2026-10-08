import type { ReactNode } from "react"
import { LINKS, type LinkKey } from "../config/links"
import AppLink from "../router/AppLink"

interface SiteLinkProps {
  to: LinkKey
  className?: string
  /**
   * Qué mostrar mientras el destino no existe:
   * - `"soon"`: el texto del link, sin link, con la marca "Próximamente".
   * - contenido: un link al alta del newsletter (`#newsletter`) en vez de a un callejón sin salida.
   * - nada: el link no se muestra.
   */
  pending?: ReactNode
  children: ReactNode
}

/** Link a un destino de `config/links.ts`. Sin URL cargada no se inventa ningún destino. */
export default function SiteLink({ to, className, pending, children }: SiteLinkProps) {
  const { href, external } = LINKS[to]
  if (!href) {
    if (!pending) return null
    if (pending === "soon") {
      return (
        <span className={[className, "is-pending"].filter(Boolean).join(" ")}>
          {children} <span className="soon-tag">Próximamente</span>
        </span>
      )
    }
    return (
      <a className={className} href="#newsletter">
        {pending}
      </a>
    )
  }
  if (!external) {
    return (
      <AppLink className={className} href={href}>
        {children}
      </AppLink>
    )
  }
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  )
}
