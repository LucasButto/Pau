import { useCallback, useMemo, useState } from "react"
import { MAPA } from "../content/inicio"
import { ANCHORS } from "../content/site"
import { STACKED_QUERY } from "../hooks/useMediaQuery"
import { GRAN_ROSARIO_BOUNDS, isWithin } from "../lib/geo"
import MapView from "../map/MapView"
import { scrollToAnchor } from "../router/navigation"
import { useDirectoryContext } from "../state/DirectoryProvider"
import Icon from "./Icon"
import PlaceDetail from "./PlaceDetail"
import SearchAndFilters from "./SearchAndFilters"

/**
 * Módulo "El PAU está más cerca de lo que pensás": tarjeta con el buscador y los filtros arriba,
 * la ficha del lugar seleccionado a la izquierda y el mapa a la derecha.
 */
export default function MapSection() {
  const { directory, geo } = useDirectoryContext()
  const { results, selected, select, explore } = directory
  const locations = useMemo(() => results.map((entry) => entry.location), [results])
  /** Mobile: último pin tocado, para ofrecer "Ver ficha de… ↓" sin sacar a la persona del mapa. */
  const [pinNotice, setPinNotice] = useState<{ id: number; seq: number } | null>(null)

  const onMapSelect = useCallback(
    (id: number) => {
      select(id)
      if (window.matchMedia(STACKED_QUERY).matches) setPinNotice((prev) => ({ id, seq: (prev?.seq ?? 0) + 1 }))
    },
    [select],
  )

  const onChoose = useCallback(
    (id: number) => {
      setPinNotice(null)
      explore(id)
    },
    [explore],
  )

  const distanceFrom = geo.position ? "desde tu ubicación" : "desde el centro"
  const outsideArea = geo.position !== null && !isWithin(geo.position, GRAN_ROSARIO_BOUNDS)
  const noticeName =
    pinNotice && selected?.location.id === pinNotice.id ? selected.location.name : null

  const notices = (
    <>
      {(geo.message || outsideArea) && (
        <div className="map-notice" role="status">
          <Icon name={geo.message ? "alert" : "locate"} size={18} />
          <p>
            {geo.message ??
              "Estás fuera del Gran Rosario: el mapa no se mueve hasta tu ubicación, pero las distancias se miden desde ahí."}
          </p>
          {geo.message && (
            <button type="button" onClick={geo.dismissMessage} aria-label="Cerrar aviso">
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
      )}
      <div className="map-pin-notice" aria-live="polite">
        {noticeName && (
          <a
            key={pinNotice?.seq}
            href="#ficha-lugar"
            onClick={(event) => {
              event.preventDefault()
              setPinNotice(null)
              scrollToAnchor("ficha-lugar")
            }}
          >
            Ver ficha de {noticeName}
            <Icon name="arrow" size={16} className="is-down" />
          </a>
        )}
      </div>
    </>
  )

  return (
    <section className="map-section has-topo topo-oliva" id={ANCHORS.mapa} aria-labelledby="mapa-title">
      <div className="container">
        <header className="map-heading">
          <h2 id="mapa-title">{MAPA.titulo}</h2>
          <p>{MAPA.bajada}</p>
        </header>
        <div className="map-card">
          <SearchAndFilters
            query={directory.query}
            onQueryChange={directory.setQuery}
            category={directory.category}
            onCategoryChange={(value) => {
              setPinNotice(null)
              directory.setCategory(value)
            }}
            results={results}
            onChoose={onChoose}
          />
          <div className="map-body">
            <PlaceDetail
              entry={selected}
              distanceFrom={distanceFrom}
              searching={directory.query.trim() !== ""}
              onClear={directory.clearFilters}
            />
            <MapView
              active
              focusRequest={directory.focusRequest}
              locating={geo.status === "locating"}
              locations={locations}
              notice={notices}
              onLocate={geo.request}
              onSelect={onMapSelect}
              selectedId={selected?.location.id ?? null}
              userLocateSeq={geo.seq}
              userPosition={geo.position}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
