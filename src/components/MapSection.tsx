import { useCallback, useMemo, useRef, useState, type Ref } from "react"
import type { Directory as DirectoryState } from "../hooks/useDirectory"
import type { GeolocationState } from "../hooks/useGeolocation"
import { COMPACT_QUERY, useMediaQuery } from "../hooks/useMediaQuery"
import { GRAN_ROSARIO_BOUNDS, isWithin } from "../lib/geo"
import MapView from "../map/MapView"
import Directory from "./Directory"
import Icon from "./Icon"
import PlaceDetail from "./PlaceDetail"
import SearchAndFilters from "./SearchAndFilters"

interface MapSectionProps {
  directory: DirectoryState
  geo: GeolocationState
  /** Ancla del módulo (barra de búsqueda + mapa) para llegar desde el buscador del hero. */
  moduleRef: Ref<HTMLDivElement>
}

type MobileView = "list" | "map"

export default function MapSection({
  directory,
  geo,
  moduleRef,
}: MapSectionProps) {
  const compact = useMediaQuery(COMPACT_QUERY)
  const [mobileView, setMobileView] = useState<MobileView>("map")
  const [scrollSeq, setScrollSeq] = useState(0)
  const detailRef = useRef<HTMLElement>(null)
  const viewSwitchRef = useRef<HTMLDivElement>(null)
  const { results, selected, select, explore, closeSelection } = directory
  const locations = useMemo(
    () => results.map((entry) => entry.location),
    [results],
  )

  const distanceFrom = geo.position ? "desde tu ubicación" : "desde el centro"
  const mapActive = !compact || mobileView === "map"
  const onMapSelect = useCallback(
    (id: number) => {
      select(id)
      setScrollSeq((value) => value + 1)
    },
    [select],
  )

  const onExplore = useCallback(
    (id: number) => {
      explore(id)
      if (window.matchMedia(COMPACT_QUERY).matches) {
        // En mobile la lista se oculta al pasar al mapa: llevamos la vista al mapa y el foco a la
        // ficha, para no quedar mirando la sección de abajo.
        setMobileView("map")
        requestAnimationFrame(() => {
          const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches
          viewSwitchRef.current?.scrollIntoView({
            block: "start",
            behavior: reduce ? "auto" : "smooth",
          })
          detailRef.current?.focus({ preventScroll: true })
        })
      }
    },
    [explore],
  )

  const onCloseDetail = useCallback(() => {
    const id = selected?.location.id
    const hadFocus =
      detailRef.current?.contains(document.activeElement) ?? false
    closeSelection()
    // El foco vuelve a la tarjeta del punto si estaba dentro de la ficha.
    if (hadFocus && id !== undefined) {
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLButtonElement>(
            `.location-card[data-id="${id}"] .card-action`,
          )
          ?.focus({ preventScroll: true }),
      )
    }
  }, [closeSelection, selected])

  const outsideArea =
    geo.position !== null && !isWithin(geo.position, GRAN_ROSARIO_BOUNDS)
  const notice =
    geo.message || outsideArea ? (
      <div className="map-notice" role="status">
        <Icon name={geo.message ? "alert" : "locate"} size={18} />
        <p>
          {geo.message ??
            "Estás fuera del Gran Rosario: el mapa no se mueve hasta tu ubicación, pero las distancias se miden desde ahí."}
        </p>
        {geo.message && (
          <button
            type="button"
            onClick={geo.dismissMessage}
            aria-label="Cerrar aviso"
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>
    ) : null
  return (
    <section className="map-section" id="mapa" aria-labelledby="mapa-title">
      <div className="section-heading">
        <div>
          <h2 id="mapa-title">Raíces Vecinas</h2>
        </div>
        <p>
          Una cartografía viva para encontrar alimentos sanos, proyectos
          colectivos y manos que cultivan otra ciudad posible.
        </p>
      </div>
      <div className="map-module" ref={moduleRef} data-view={mobileView}>
        <div className="map-toolbar">
          <SearchAndFilters
            variant="map"
            query={directory.query}
            onQueryChange={directory.setQuery}
            category={directory.category}
            onCategoryChange={directory.setCategory}
            resultCount={results.length}
            total={directory.total}
            hasActiveFilters={directory.hasActiveFilters}
            onClear={directory.clearFilters}
          />
        </div>
        <div
          ref={viewSwitchRef}
          className="view-switch"
          role="group"
          aria-label="Cómo ver los resultados"
        >
          <button
            type="button"
            aria-pressed={mobileView === "list"}
            onClick={() => setMobileView("list")}
          >
            <Icon name="list" size={18} /> Lista{" "}
            <span className="view-count">{results.length}</span>
          </button>
          <button
            type="button"
            aria-pressed={mobileView === "map"}
            onClick={() => setMobileView("map")}
          >
            <Icon name="map" size={18} /> Mapa
          </button>
        </div>
        <div className="map-dashboard">
          <Directory
            distanceFrom={distanceFrom}
            usingUserLocation={geo.position !== null}
            geoStatus={geo.status}
            hasActiveFilters={directory.hasActiveFilters}
            onClear={directory.clearFilters}
            onExplore={onExplore}
            onLocate={geo.request}
            onSortChange={directory.setSort}
            results={results}
            scrollSeq={scrollSeq}
            selectedId={selected?.location.id ?? null}
            sort={directory.sort}
            visible={!compact || mobileView === "list"}
          />
          <MapView
            active={mapActive}
            detail={
              selected && (
                <PlaceDetail
                  ref={detailRef}
                  entry={selected}
                  distanceFrom={distanceFrom}
                  onClose={onCloseDetail}
                />
              )
            }
            focusRequest={directory.focusRequest}
            locating={geo.status === "locating"}
            locations={locations}
            notice={notice}
            onLocate={geo.request}
            onSelect={onMapSelect}
            onShowList={compact ? () => setMobileView("list") : undefined}
            selectedId={selected?.location.id ?? null}
            userLocateSeq={geo.seq}
            userPosition={geo.position}
          />
        </div>
      </div>
    </section>
  )
}
