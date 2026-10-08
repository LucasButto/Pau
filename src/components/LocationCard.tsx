import { CATEGORIES } from "../data/locations"
import type { DirectoryEntry } from "../hooks/useDirectory"
import { formatDistance } from "../lib/geo"
import Icon from "./Icon"

interface LocationCardProps {
  entry: DirectoryEntry
  index: number
  selected: boolean
  distanceFrom: string
  onExplore(id: number): void
}

/**
 * Tarjeta del directorio. Toda la tarjeta es clickeable a través de un único botón ("Ver en el mapa"),
 * cuya área se estira con CSS: un solo evento, un solo elemento en el orden de tabulación.
 */
export default function LocationCard({
  entry,
  index,
  selected,
  distanceFrom,
  onExplore,
}: LocationCardProps) {
  const { location, distanceKm } = entry
  const meta = CATEGORIES[location.type]
  const titleId = `location-${location.id}-title`
  return (
    <li
      className={selected ? "location-card is-selected" : "location-card"}
      data-id={location.id}
      aria-current={selected ? "true" : undefined}
    >
      <div className="location-card-head">
        <span className={`type-icon type-${meta.slug}`} aria-hidden="true">
          <Icon name={meta.icon} size={18} />
        </span>
        <span className={`type-tag type-${meta.slug}`}>{location.type}</span>
        <span className="location-number" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 id={titleId}>{location.name}</h3>
      <p>
        <Icon name="location" size={16} />
        {location.district}
      </p>
      <p>
        <Icon name="clock" size={16} />
        {location.schedule}
      </p>
      <span className="location-distance">
        {formatDistance(distanceKm)} {distanceFrom}
      </span>
      <button
        type="button"
        className="card-action"
        aria-describedby={titleId}
        onClick={() => onExplore(location.id)}
      >
        Ver en el mapa
        <Icon name="arrow" size={16} />
      </button>
    </li>
  )
}
