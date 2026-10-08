import { useCallback, useMemo, useState } from "react"
import { CATEGORIES, LOCATIONS, type Category, type Location } from "../data/locations"
import { haversineKm, type LatLng } from "../lib/geo"

export type CategoryFilter = Category | "all"

export interface DirectoryEntry {
  location: Location
  distanceKm: number
}

/** Pedido de "volar" a un punto (al elegir una sugerencia del buscador). `seq` distingue pedidos repetidos. */
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

/** Búsqueda sin mayúsculas ni acentos: "ludueña" encuentra "Ludueña", "centro agro" encuentra el CAR. */
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
      `${location.name} ${location.district} ${CATEGORIES[location.type].longLabel} ${location.address}`,
    )
    return terms.every((term) => haystack.includes(term))
  })
}

/**
 * Resultados con su distancia. Sin ubicación del usuario se respeta el orden de `LOCATIONS` (el
 * primero es el que arranca seleccionado, como en el diseño); con ubicación, del más cercano al
 * más lejano.
 */
function toEntries(locations: readonly Location[], origin: LatLng, byDistance: boolean): DirectoryEntry[] {
  const entries = locations.map((location) => ({ location, distanceKm: haversineKm(origin, location) }))
  return byDistance ? entries.sort((a, b) => a.distanceKm - b.distanceKm) : entries
}

/**
 * Estado del módulo del mapa: búsqueda, filtro por categoría y lugar seleccionado. Siempre hay un
 * lugar seleccionado mientras haya resultados (la ficha es parte fija del módulo).
 *
 * @param origin Desde dónde se miden las distancias (centro de Rosario o la ubicación del usuario).
 * @param byDistance Ordenar por cercanía (cuando el usuario compartió su ubicación).
 */
export function useDirectory(origin: LatLng, byDistance: boolean) {
  const [query, setQueryState] = useState("")
  const [category, setCategoryState] = useState<CategoryFilter>("all")
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null)

  const results = useMemo(
    () => toEntries(filterLocations(LOCATIONS, query, category), origin, byDistance),
    [query, category, origin, byDistance],
  )

  // Sin selección explícita (o si quedó fuera de los resultados), la ficha muestra el primero.
  const selected = results.find((entry) => entry.location.id === selectedId) ?? results[0] ?? null

  /** Si el seleccionado sigue en los nuevos resultados se mantiene; si no, pasa a ser el primero. */
  const applyFilters = useCallback(
    (nextQuery: string, nextCategory: CategoryFilter) => {
      setQueryState(nextQuery)
      setCategoryState(nextCategory)
      setSelectedId((current) => {
        const next = toEntries(filterLocations(LOCATIONS, nextQuery, nextCategory), origin, byDistance)
        const currentId = current ?? toEntries(filterLocations(LOCATIONS, query, category), origin, byDistance)[0]?.location.id
        return next.some((entry) => entry.location.id === currentId) ? (currentId ?? null) : (next[0]?.location.id ?? null)
      })
    },
    [origin, byDistance, query, category],
  )

  const setQuery = useCallback((value: string) => applyFilters(value, category), [applyFilters, category])
  const setCategory = useCallback((value: CategoryFilter) => applyFilters(query, value), [applyFilters, query])
  const clearFilters = useCallback(() => applyFilters("", "all"), [applyFilters])

  /** Selección desde el mapa (click en un pin). */
  const select = useCallback((id: number) => setSelectedId(id), [])
  /** Selección desde el buscador: selecciona y pide al mapa que vuele hasta el punto. */
  const explore = useCallback((id: number) => {
    setSelectedId(id)
    setFocusRequest((previous) => ({ id, seq: (previous?.seq ?? 0) + 1 }))
  }, [])
  /** Vuelve a la selección por defecto (el primero de los resultados, p. ej. el más cercano). */
  const resetSelection = useCallback(() => setSelectedId(null), [])

  return {
    query,
    setQuery,
    category,
    setCategory,
    /** Búsqueda y categoría juntas (buscador del menú mobile). */
    setFilters: applyFilters,
    clearFilters,
    hasActiveFilters: query.trim() !== "" || category !== "all",
    results,
    total: LOCATIONS.length,
    selected,
    select,
    explore,
    resetSelection,
    focusRequest,
  }
}

export type Directory = ReturnType<typeof useDirectory>
