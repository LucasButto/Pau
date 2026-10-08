import logoCrema from "../assets/brand/logo-horizontal-crema.webp"
import { FOOTER_COLUMNS, FOOTER_TEXT } from "../content/navegacion"
import AppLink from "../router/AppLink"
import Icon from "./Icon"
import Newsletter from "./Newsletter"
import SiteLink from "./SiteLink"

/** Footer del PDF (Marrón Corteza) con los links, la línea institucional y los legales del sitio anterior. */
export default function Footer() {
  const { explorar, conocer } = FOOTER_COLUMNS
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <AppLink href="/" className="footer-logo" aria-label="Programa de Agricultura Urbana de Rosario: ir al inicio">
            <img src={logoCrema} alt="" width={162} height={56} loading="lazy" decoding="async" />
          </AppLink>
          <p>{FOOTER_TEXT.tagline}</p>
          <SiteLink to="instagram" className="footer-social">
            <Icon name="instagram" size={20} /> @semillero.digital
          </SiteLink>
        </div>
        <nav className="footer-links" aria-label="Enlaces del pie de página">
          <div>
            <h2>{explorar.title}</h2>
            <ul>
              {explorar.links.map((link) => (
                <li key={link.href}>
                  <AppLink href={link.href}>{link.label}</AppLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{conocer.title}</h2>
            <ul>
              {conocer.links.map((link) => (
                <li key={link.href}>
                  <AppLink href={link.href}>{link.label}</AppLink>
                </li>
              ))}
              <li>
                <SiteLink to="contacto" pending="soon">
                  Contacto
                </SiteLink>
              </li>
            </ul>
          </div>
        </nav>
        <Newsletter />
      </div>
      <div className="container footer-bottom">
        <span>{FOOTER_TEXT.institutions}</span>
        <span>© {new Date().getFullYear()} PAU Rosario</span>
        <span className="footer-legal">
          <SiteLink to="privacidad" pending="soon">
            Privacidad
          </SiteLink>
          <span aria-hidden="true">·</span>
          <SiteLink to="accesibilidad" pending="soon">
            Accesibilidad
          </SiteLink>
        </span>
      </div>
    </footer>
  )
}
