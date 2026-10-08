import type { AnchorHTMLAttributes, MouseEvent, Ref } from "react"
import { useLocation } from "wouter"
import { parseInternalHref, scrollToAnchor } from "./navigation"

interface AppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  ref?: Ref<HTMLAnchorElement>
}

/**
 * Link del sitio. A otra página: navega sin recargar (y `RouteEffects` hace scroll al ancla, si hay).
 * Dentro de la misma página: scroll suave al ancla. Externos, nueva pestaña o con teclas
 * modificadoras: comportamiento normal del navegador.
 */
export default function AppLink({ href, onClick, ref, ...rest }: AppLinkProps) {
  const [path, navigate] = useLocation()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    if (rest.target && rest.target !== "_self") return
    const target = parseInternalHref(href)
    if (!target) return
    event.preventDefault()
    if (target.path === path) {
      if (target.hash) {
        // Misma página: se actualiza la URL (para compartir o volver atrás) y se hace scroll.
        if (window.location.hash !== `#${target.hash}`) window.history.pushState(null, "", `${target.path}#${target.hash}`)
        scrollToAnchor(target.hash)
      } else {
        if (window.location.hash) window.history.pushState(null, "", target.path)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      return
    }
    navigate(target.hash ? `${target.path}#${target.hash}` : target.path)
  }

  return <a ref={ref} href={href} onClick={handleClick} {...rest} />
}
