import { LINKS, type LinkKey } from "../config/links"
import Icon from "./Icon"
import SiteLink from "./SiteLink"

const NOTIFY_ME = (
  <>
    Avisame cuando salga <Icon name="arrow" size={17} />
  </>
)

/** Con destino real, el ícono de enlace externo; sin él, un estado en texto. */
function ResourceStatus({ link }: { link: LinkKey }) {
  return LINKS[link].href ? (
    <Icon name="external" size={20} />
  ) : (
    <span className="resource-status">Próximamente</span>
  )
}

export default function Resources() {
  return (
    <section
      className="resources-section"
      id="recursos"
      aria-labelledby="recursos-title"
    >
      <div className="section-heading resources-heading">
        <div>
          <h2 id="recursos-title">Semillero Digital</h2>
        </div>
        <p>
          Ideas, herramientas y saberes para empezar hoy. Leé, guardá, compartí
          y hacé circular el conocimiento.
        </p>
      </div>
      <div className="resource-grid">
        <article className="resource-card resource-yellow">
          <div className="resource-top">
            <span className="resource-format">GUÍA · PDF</span>
            <ResourceStatus link="guiaHuerta" />
          </div>
          <div
            className="resource-illustration meter-garden"
            aria-hidden="true"
          >
            <span className="pot pot-one" />
            <span className="pot pot-two" />
            <span className="pot pot-three" />
            <Icon name="sprout" size={84} />
          </div>
          <h3>
            La Huerta
            <br />
            del m²
          </h3>
          <p>Guía de cultivo para balcones y departamentos chicos.</p>
          <SiteLink
            to="guiaHuerta"
            className="resource-link"
            pending={NOTIFY_ME}
          >
            Descargar guía <Icon name="arrow" size={17} />
          </SiteLink>
        </article>
        <article className="resource-card resource-green">
          <div className="resource-top">
            <span className="resource-format">CALENDARIO · WEB</span>
            <ResourceStatus link="calendario" />
          </div>
          <div className="season-wheel" aria-hidden="true">
            <span>OTOÑO</span>
            <i />
            <span>INVIERNO</span>
            <i />
            <span>PRIMAVERA</span>
            <i />
            <span>VERANO</span>
          </div>
          <h3>
            Estación
            <br />× Estación
          </h3>
          <p>Calendario de cosecha y bolsones agroecológicos.</p>
          <SiteLink
            to="calendario"
            className="resource-link"
            pending={NOTIFY_ME}
          >
            Ver calendario <Icon name="arrow" size={17} />
          </SiteLink>
        </article>
        <article className="resource-card resource-paper">
          <div className="resource-top">
            <span className="resource-format">FANZINE · 12 PÁG.</span>
            <ResourceStatus link="fanzine" />
          </div>
          <div className="compost-art" aria-hidden="true">
            <span className="compost-ring">
              <Icon name="compost" size={72} />
            </span>
            <span>restos</span>
            <span>tierra</span>
            <span>vida</span>
          </div>
          <h3>
            Basura
            <br />
            Cero
          </h3>
          <p>Fanzine práctico de compostaje urbano y reducción de residuos.</p>
          <SiteLink
            to="fanzine"
            className="resource-link"
            pending={NOTIFY_ME}
          >
            Leer fanzine <Icon name="arrow" size={17} />
          </SiteLink>
        </article>
      </div>
    </section>
  )
}
