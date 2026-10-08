import { useCallback, useMemo, useState } from "react"
import { LOCATIONS, type Category, type Location } from "../data/locations"
import { haversineKm, type LatLng } from "../lib/geo"
import { COMPACT_QUERY } from "./useMediaQuery"

export type CategoryFilter = Category | "all"
export type SortKey = "distance" | "name"

export interface DirectoryEntry {
  location: Location
  distanceKm: number
}

/** Pedido de "volar" a un punto desde el directorio. `seq` distingue clicks repetidos. */
export interface FocusRequest {
  id: number
  seq: number
}

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()

/** Búsqueda sin mayúsculas ni acentos: "ludueña" encuentra "Ludueña", "centro agro" encuentra el centro. */
export function filterLocations(
  locations: readonly Location[],
  query: string,
  category: CategoryFilter,
): Location[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  return locations.filter((location) => {
    if (category !== "all" && location.type !== category) return false
    if (!terms.length) return true
    const haystack = normalize(
      `${location.name} ${location.district} ${location.type} ${location.address}`,
    )
    return terms.every((term) => haystack.includes(term))
  })
}

const byName = new Intl.Collator("es-AR", { sensitivity: "base" })

export function useDirectory(origin: LatLng) {
  const [query, setQueryState] = useState("")
  const [category, setCategoryState] = useState<CategoryFilter>("all")
  const [sort, setSort] = useState<SortKey>("distance")
  // En escritorio la ficha arranca abierta con el punto más cercano (como en el diseño); en mobile, cerrada.
  const [selectedId, setSelectedId] = useState<number | null>(() => {
    if (window.matchMedia(COMPACT_QUERY).matches) return null
    const nearest = [...LOCATIONS].sort(
      (a, b) => haversineKm(origin, a) - haversineKm(origin, b),
    )[0]
    return nearest?.id ?? null
  })
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null)
  const results = useMemo<DirectoryEntry[]>(() => {
    const entries = filterLocations(LOCATIONS, query, category).map(
      (location) => ({ location, distanceKm: haversineKm(origin, location) }),
    )
    return entries.sort((a, b) =>
      sort === "name"
        ? byName.compare(a.location.name, b.location.name)
        : a.distanceKm - b.distanceKm,
    )
  }, [query, category, sort, origin])

  const selected =
    results.find((entry) => entry.location.id === selectedId) ?? null
  /** Si la selección queda fuera de los resultados, se cierra la ficha. */
  const applyFilters = useCallback(
    (nextQuery: string, nextCategory: CategoryFilter) => {
      setQueryState(nextQuery)
      setCategoryState(nextCategory)
      setSelectedId((current) =>
        current !== null &&
        !filterLocations(LOCATIONS, nextQuery, nextCategory).some(
          (location) => location.id === current,
        )
          ? null
          : current,
      )
    },
    [],
  )

  const setQuery = useCallback(
    (value: string) => applyFilters(value, category),
    [applyFilters, category],
  )
  const setCategory = useCallback(
    (value: CategoryFilter) => applyFilters(query, value),
    [applyFilters, query],
  )
  const clearFilters = useCallback(
    () => applyFilters("", "all"),
    [applyFilters],
  )

  /** Selección desde el mapa (click en un pin). */
  const select = useCallback((id: number) => setSelectedId(id), [])
  /** "Explorar" desde el directorio: selecciona y pide al mapa que vuele hasta el punto. */
  const explore = useCallback((id: number) => {
    setSelectedId(id)
    setFocusRequest((previous) => ({ id, seq: (previous?.seq ?? 0) + 1 }))
  }, [])

  const closeSelection = useCallback(() => setSelectedId(null), [])
  return {
    query,
    setQuery,
    category,
    setCategory,
    sort,
    setSort,
    clearFilters,
    hasActiveFilters: query.trim() !== "" || category !== "all",
    results,
    total: LOCATIONS.length,
    selected,
    select,
    explore,
    closeSelection,
    focusRequest,
  }
}

export type Directory = ReturnType<typeof useDirectory>
