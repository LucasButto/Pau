import type { ReactNode } from "react"
import { LINKS, type LinkKey } from "../config/links"

interface SiteLinkProps {
  to: LinkKey
  className?: string
  /**
   * Qué mostrar mientras el destino no existe. Con contenido, el link lleva al alta del newsletter
   * (`#newsletter`) en vez de a un callejón sin salida. Sin contenido, el link no se muestra.
   */
  pending?: ReactNode
  children: ReactNode
}

/** Link a un destino de `config/links.ts`. Sin URL cargada no se inventa ningún destino. */
export default function SiteLink({
  to,
  className,
  pending,
  children,
}: SiteLinkProps) {
  const { href, external } = LINKS[to]
  if (!href) {
    if (!pending) return null
    return (
      <a className={className} href="#newsletter">
        {pending}
      </a>
    )
  }
  return (
    <a
      className={className}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
      {external && (
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      )}
    </a>
  )
}
