import { CATEGORIES } from "../data/locations"
import type { DirectoryEntry } from "../hooks/useDirectory"
import { directionsUrl, formatDistance } from "../lib/geo"
import { DAY_NAMES, openStatus } from "../lib/schedule"
import Icon from "./Icon"
import SafeImage from "./SafeImage"

interface PlaceDetailProps {
  /** Lugar seleccionado; `null` cuando la búsqueda o el filtro no tienen resultados. */
  entry: DirectoryEntry | null
  distanceFrom: string
  /** Hay texto en el buscador (para el mensaje del estado vacío). */
  searching: boolean
  onClear(): void
}

/**
 * Ficha del lugar seleccionado: columna izquierda del módulo del mapa (debajo del mapa en mobile).
 *
 * Estructura: un área que scrollea (foto + datos) y, fuera de ella, el botón "Cómo llegar", fijo al
 * pie de la columna para que se vea aunque el contenido no entre.
 */
export default function PlaceDetail({ entry, distanceFrom, searching, onClear }: PlaceDetailProps) {
  if (!entry) {
    return (
      <section id="ficha-lugar" className="place-panel" aria-labelledby="ficha-vacia-titulo">
        <p className="sr-only" aria-live="polite">
          Sin resultados
        </p>
        <div className="place-empty">
          <span className="place-empty-icon" aria-hidden="true">
            <Icon name="pinParque" size={34} strokeWidth={1.4} />
          </span>
          <h3 id="ficha-vacia-titulo">{searching ? "No encontramos lugares con ese nombre." : "Todavía no hay lugares cargados en esta categoría."}</h3>
          <p>{searching ? "Probá con otro o elegí “Todo”." : "Elegí “Todo” para ver el resto de los lugares del mapa."}</p>
          <button type="button" className="btn btn-verde" onClick={onClear}>
            {searching ? "Limpiar búsqueda" : "Ver todo"}
          </button>
        </div>
      </section>
    )
  }

  const { location, distanceKm } = entry
  const meta = CATEGORIES[location.type]
  const status = openStatus(location.openDays)
  const titleId = `lugar-${location.id}-titulo`

  return (
    <section id="ficha-lugar" className="place-panel" aria-labelledby={titleId}>
      <p className="sr-only" aria-live="polite">
        Ficha de {location.name}
      </p>
      {/* `key`: al cambiar de lugar, la ficha entra con un fundido corto. */}
      <article className="place-detail" key={location.id}>
        <div className="place-scroll">
          <div className="place-media">
            <SafeImage
              src={location.photo.src}
              srcSet={location.photo.srcSet}
              sizes="(max-width: 767px) 100vw, 380px"
              alt={location.photo.alt}
              width={640}
              height={480}
            />
          </div>
          <div className="place-body">
            <div className="place-meta">
              <span className={`type-tag type-${meta.slug}`}>
                {meta.label === meta.longLabel ? (
                  meta.label
                ) : (
                  <>
                    <span aria-hidden="true">{meta.label}</span>
                    <span className="sr-only">{meta.longLabel}</span>
                  </>
                )}
              </span>
              <span className={status.openToday ? "open-badge is-open" : "open-badge"}>
                {status.openToday
                  ? "Abierto hoy"
                  : status.nextDay
                    ? `Abre el ${DAY_NAMES[status.nextDay]}`
                    : "Sin días cargados"}
              </span>
            </div>
            <h3 id={titleId} className="place-name">
              <span className={`category-icon type-${meta.slug}`} aria-hidden="true">
                <Icon name={meta.icon} size={20} strokeWidth={1.5} />
              </span>
              <span>{location.name}</span>
            </h3>
            <div className="place-data">
              <p className="place-line">
                <Icon name="location" size={17} />
                <span>
                  {location.address}
                  <small className="place-distance">
                    {formatDistance(distanceKm)} {distanceFrom}
                  </small>
                </span>
              </p>
              <p className="place-line">
                <Icon name="clock" size={17} />
                <span>{location.schedule}</span>
              </p>
            </div>
          </div>
        </div>
        <a className="directions-button" href={directionsUrl(location)} target="_blank" rel="noreferrer">
          Cómo llegar
          <span className="sr-only"> a {location.name} (abre Google Maps en una pestaña nueva)</span>
          <Icon name="external" size={18} />
        </a>
      </article>
    </section>
  )
}
