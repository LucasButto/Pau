import { useEffect, useId, useRef } from "react"
import type { DirectoryEntry, SortKey } from "../hooks/useDirectory"
import type { GeoStatus } from "../hooks/useGeolocation"
import Icon from "./Icon"
import LocationCard from "./LocationCard"

interface DirectoryProps {
  results: DirectoryEntry[]
  selectedId: number | null
  /** Pedido de llevar la tarjeta seleccionada a la vista (click en un pin). */
  scrollSeq: number
  visible: boolean
  sort: SortKey
  onSortChange(value: SortKey): void
  distanceFrom: string
  usingUserLocation: boolean
  geoStatus: GeoStatus
  onLocate(): void
  onExplore(id: number): void
  hasActiveFilters: boolean
  onClear(): void
}

export default function Directory(props: DirectoryProps) {
  const {
    results,
    selectedId,
    scrollSeq,
    visible,
    sort,
    onSortChange,
    distanceFrom,
    usingUserLocation,
    geoStatus,
    onLocate,
    onExplore,
    hasActiveFilters,
    onClear,
  } = props

  const listRef = useRef<HTMLOListElement>(null)
  const sortId = useId()
  // Click en un pin → la tarjeta seleccionada aparece en el directorio.
  useEffect(() => {
    const list = listRef.current
    if (!list || !visible || selectedId === null || scrollSeq === 0) return
    const card = list.querySelector<HTMLElement>(`[data-id="${selectedId}"]`)
    if (!card) return
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth"
    if (list.scrollHeight > list.clientHeight + 1) {
      const top = card.offsetTop - 12
      const bottom = card.offsetTop + card.offsetHeight + 12
      if (top < list.scrollTop || bottom > list.scrollTop + list.clientHeight)
        list.scrollTo({ top, behavior })
    } else {
      card.scrollIntoView({ block: "nearest", behavior })
    }
  }, [scrollSeq, selectedId, visible])

  return (
    <aside className="directory" aria-label="Directorio de puntos">
      <div className="directory-top">
        <div>
          <span className="directory-label">Directorio local</span>
          <label className="sort-control" htmlFor={sortId}>
            <span className="sr-only">Ordenar por</span>
            <select
              id={sortId}
              value={sort}
              onChange={(event) => {
                const { value } = event.target
                if (value === "distance" || value === "name")
                  onSortChange(value)
              }}
            >
              <option value="distance">Más cercanos</option>
              <option value="name">Nombre (A–Z)</option>
            </select>
            <Icon name="chevron" size={18} />
          </label>
        </div>
      </div>
      <p className="distance-origin">
        <Icon name="locate" size={16} />
        <span>
          Distancias {distanceFrom}
          {!usingUserLocation && " (Plaza 25 de Mayo)"}.
        </span>
        {!usingUserLocation && (
          <button
            type="button"
            onClick={onLocate}
            disabled={geoStatus === "locating"}
          >
            {geoStatus === "locating" ? "Ubicando…" : "Usar mi ubicación"}
          </button>
        )}
      </p>
      {results.length ? (
        <ol className="directory-list" ref={listRef}>
          {results.map((entry, index) => (
            <LocationCard
              distanceFrom={distanceFrom}
              entry={entry}
              index={index}
              key={entry.location.id}
              onExplore={onExplore}
              selected={entry.location.id === selectedId}
            />
          ))}
        </ol>
      ) : (
        <div className="empty-state">
          <Icon name="leaf" size={28} />
          <strong>No encontramos coincidencias</strong>
          <span>Probá con otro barrio o cambiá el filtro.</span>
          {hasActiveFilters && (
            <button type="button" onClick={onClear}>
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </aside>
  )
}
