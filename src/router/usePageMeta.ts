import { useEffect } from "react"

interface PageMeta {
  title: string
  description: string
  /** Ruta canónica (`/`, `/sobre-nosotros`). Sin ruta (404): no se toca el canonical. */
  path?: string
  /** Páginas que no deben indexarse (404). */
  noindex?: boolean
}

function setMeta(selector: string, attribute: "content" | "href", value: string) {
  document.head.querySelector(selector)?.setAttribute(attribute, value)
}

/**
 * `<title>`, descripción y canonical de cada página al navegar dentro del sitio. El HTML que llega
 * del servidor ya trae los de cada ruta (lo genera `vite-plugins/seo.ts`); esto los mantiene
 * correctos después de navegar sin recargar.
 */
export function usePageMeta({ title, description, path, noindex = false }: PageMeta) {
  useEffect(() => {
    document.title = title
    setMeta('meta[name="description"]', "content", description)
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical && path !== undefined) {
      const origin = new URL(canonical.href).origin
      canonical.href = `${origin}${path}`
      setMeta('meta[property="og:url"]', "content", canonical.href)
    }
    if (!noindex) return
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const previous = robots?.content
    if (robots) robots.content = "noindex, follow"
    return () => {
      if (robots && previous !== undefined) robots.content = previous
    }
  }, [title, description, path, noindex])
}
