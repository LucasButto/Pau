import type { KeyboardEvent, Ref } from "react"
import { CATEGORIES } from "../data/locations"
import type { DirectoryEntry } from "../hooks/useDirectory"
import { directionsUrl, formatDistance } from "../lib/geo"
import { DAY_NAMES, DISPLAY_DAYS, openStatus } from "../lib/schedule"
import Icon from "./Icon"
import SafeImage from "./SafeImage"

interface PlaceDetailProps {
  entry: DirectoryEntry
  distanceFrom: string
  onClose(): void
  ref?: Ref<HTMLElement>
}

/**
 * Ficha del punto seleccionado: panel flotante en escritorio, panel inferior en mobile.
 *
 * Estructura: un área que scrollea (`place-scroll`: foto + datos) y, fuera de ella, el botón
 * "Cómo llegar". Así la acción principal queda siempre a la vista aunque el contenido no entre.
 */
export default function PlaceDetail({
  entry,
  distanceFrom,
  onClose,
  ref,
}: PlaceDetailProps) {
  const { location, distanceKm } = entry
  const meta = CATEGORIES[location.type]
  const status = openStatus(location.openDays)
  const titleId = `place-${location.id}-title`
  const daysId = `${titleId}-days`
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") onClose()
  }

  return (
    <article
      className="place-detail"
      ref={ref}
      tabIndex={-1}
      aria-labelledby={titleId}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        className="place-close"
        onClick={onClose}
        aria-label={`Cerrar la ficha de ${location.name}`}
      >
        <Icon name="close" size={18} />
      </button>
      <div className="place-scroll">
        <div className="place-media">
          <SafeImage
            src={location.photo.src}
            srcSet={location.photo.srcSet}
            sizes="320px"
            alt={location.photo.alt}
            width={640}
            height={400}
          />
        </div>
        <div className="place-content">
          <div className="place-meta">
            <span className={`type-tag type-${meta.slug}`}>{location.type}</span>
            <span
              className={status.openToday ? "open-badge is-open" : "open-badge"}
            >
              {status.openToday
                ? "Abierto hoy"
                : status.nextDay
                  ? `Abre el ${DAY_NAMES[status.nextDay]}`
                  : "Sin días cargados"}
            </span>
          </div>
          <h3 id={titleId}>{location.name}</h3>
          <p className="place-line place-address">
            <Icon name="location" size={17} />
            <span>
              {location.address}
              <small>
                {formatDistance(distanceKm)} {distanceFrom}
              </small>
            </span>
          </p>
          <p className="place-line place-schedule">
            <Icon name="clock" size={17} />
            <span>{location.schedule}</span>
          </p>
          <div className="growers">
            <p>
              <small>Huerteros</small>
              {location.people}
            </p>
          </div>
          <div className="open-days">
            <small id={daysId}>Días de apertura</small>
            <ul aria-labelledby={daysId}>
              {DISPLAY_DAYS.map((day) => {
                const open = location.openDays.includes(day)
                const isToday = day === status.today
                return (
                  <li
                    className={
                      [open ? "is-open" : "", isToday ? "is-today" : ""]
                        .join(" ")
                        .trim() || undefined
                    }
                    key={day}
                  >
                    <span aria-hidden="true">{day}</span>
                    <span className="sr-only">
                      {DAY_NAMES[day]}: {open ? "abierto" : "cerrado"}
                      {isToday ? " (hoy)" : ""}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      <a
        className="directions-button"
        href={directionsUrl(location)}
        target="_blank"
        rel="noreferrer"
      >
        Cómo llegar
        <span className="sr-only">
          {" "}
          (abre Google Maps en una pestaña nueva)
        </span>
        <Icon name="external" size={17} />
      </a>
    </article>
  )
}
