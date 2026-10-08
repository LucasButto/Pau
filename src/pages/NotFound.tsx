import Icon from "../components/Icon"
import { MAP_CTA } from "../content/navegacion"
import { NOT_FOUND_SEO } from "../content/site"
import AppLink from "../router/AppLink"
import { usePageMeta } from "../router/usePageMeta"

/** Página 404 con la identidad del sitio. */
export default function NotFound() {
  usePageMeta({ title: NOT_FOUND_SEO.title, description: NOT_FOUND_SEO.description, noindex: true })
  return (
    <section className="not-found has-topo topo-crema" aria-labelledby="not-found-title">
      <div className="container">
        <p className="hero-kicker">Error 404</p>
        <h1 id="not-found-title">Acá no creció nada todavía.</h1>
        <p>La página que buscás no existe o cambió de dirección.</p>
        <div className="not-found-actions">
          <AppLink className="btn btn-verde" href="/">
            Volver al inicio
          </AppLink>
          <AppLink className="btn btn-borde" href={MAP_CTA.href}>
            {MAP_CTA.label} <Icon name="arrow" size={18} />
          </AppLink>
        </div>
      </div>
    </section>
  )
}
