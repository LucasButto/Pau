import Brand from "./Brand"
import Icon from "./Icon"
import Newsletter from "./Newsletter"
import SiteLink from "./SiteLink"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Brand inverse />
          <p>
            Cultivando soberanía alimentaria, trabajo digno y paisaje urbano
            desde Rosario.
          </p>
          <SiteLink to="instagram" className="footer-social">
            <Icon name="instagram" size={17} /> @semillero.digital{" "}
            <Icon name="external" size={15} />
          </SiteLink>
        </div>
        <nav className="footer-links" aria-label="Enlaces del pie de página">
          <div>
            <strong>EXPLORAR</strong>
            <a href="#mapa">Raíces Vecinas</a>
            <a href="#recursos">Semillero Digital</a>
          </div>
          <div>
            <strong>CONOCER</strong>
            <a href="#impacto">El programa</a>
            <SiteLink to="historia">Nuestra historia</SiteLink>
            <SiteLink to="contacto">Contacto</SiteLink>
          </div>
        </nav>
        <Newsletter />
      </div>
      <div className="footer-bottom">
        <span>
          Municipalidad de Rosario · Cátedra Spiaggi / Garat FAPyD UNR
        </span>
        <span>© {new Date().getFullYear()} PAU Rosario</span>
        <span className="footer-legal">
          <SiteLink to="privacidad">Privacidad</SiteLink>
          <SiteLink to="accesibilidad">Accesibilidad</SiteLink>
        </span>
      </div>
    </footer>
  )
}
