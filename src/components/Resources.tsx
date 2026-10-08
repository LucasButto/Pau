import { LINKS, type LinkKey } from "../config/links"
import { SEMILLERO } from "../content/inicio"
import { ANCHORS } from "../content/site"
import Icon from "./Icon"
import type { IconName } from "./iconPaths"
import SiteLink from "./SiteLink"

const NOTIFY_ME = (
  <>
    Avisame cuando salga <Icon name="arrow" size={17} />
  </>
)

/** Con destino real, el ícono de enlace externo; sin él, un estado en texto. */
function ResourceStatus({ link }: { link: LinkKey }) {
  return LINKS[link].href ? <Icon name="external" size={20} /> : <span className="resource-status">Próximamente</span>
}

interface Resource {
  link: LinkKey
  tone: "amarillo" | "verde" | "crema"
  format: string
  icon: IconName
  title: [string, string]
  text: string
  action: string
}

const RESOURCES: Resource[] = [
  {
    link: "guiaHuerta",
    tone: "amarillo",
    format: "Guía · PDF",
    icon: "pinHuerta",
    title: ["La Huerta", "del m²"],
    text: "Guía de cultivo para balcones y departamentos chicos.",
    action: "Descargar guía",
  },
  {
    link: "calendario",
    tone: "verde",
    format: "Calendario · Web",
    icon: "calendar",
    title: ["Estación", "× Estación"],
    text: "Calendario de cosecha y bolsones agroecológicos.",
    action: "Ver calendario",
  },
  {
    link: "fanzine",
    tone: "crema",
    format: "Fanzine · 12 pág.",
    icon: "compost",
    title: ["Basura", "Cero"],
    text: "Fanzine práctico de compostaje urbano y reducción de residuos.",
    action: "Leer fanzine",
  },
]

const TOPO: Record<Resource["tone"], string> = {
  amarillo: "topo-amarillo",
  verde: "topo-oliva-fuerte",
  crema: "topo-crema-oscuro",
}

/**
 * Guías descargables del Semillero digital (se conservan del sitio anterior). Van debajo del
 * carrusel de Instagram. Los íconos grandes usan el mismo trazo que los pines del mapa.
 */
export default function Resources() {
  return (
    <div className="resources" id={ANCHORS.recursos}>
      <header className="resources-heading">
        <h3>{SEMILLERO.recursosTitulo}</h3>
        <p>{SEMILLERO.recursosBajada}</p>
      </header>
      <ul className="resource-grid">
        {RESOURCES.map((resource) => (
          <li key={resource.link} className={`resource-card resource-${resource.tone} has-topo ${TOPO[resource.tone]}`}>
            <div className="resource-top">
              <span className="resource-format">{resource.format}</span>
              <ResourceStatus link={resource.link} />
            </div>
            <span className="resource-icon" aria-hidden="true">
              <Icon name={resource.icon} size={64} strokeWidth={1.2} />
            </span>
            <h4>
              {resource.title[0]}
              <br />
              {resource.title[1]}
            </h4>
            <p>{resource.text}</p>
            <SiteLink to={resource.link} className="resource-link" pending={NOTIFY_ME}>
              {resource.action} <Icon name="arrow" size={17} />
            </SiteLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
