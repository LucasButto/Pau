import { useId, type FormEvent } from "react"
import { CATEGORIES, CATEGORY_LIST } from "../data/locations"
import type { CategoryFilter } from "../hooks/useDirectory"
import Icon from "./Icon"

interface SearchAndFiltersProps {
  /** "hero": acceso rápido que lleva al mapa. "map": barra dentro del módulo del mapa. */
  variant: "hero" | "map"
  query: string
  onQueryChange(value: string): void
  category: CategoryFilter
  onCategoryChange(value: CategoryFilter): void
  /** Hero: Enter, la flecha o un filtro llevan a los resultados. */
  onGoToResults?(): void
  /** Barra del mapa: conteo y limpiar. */
  resultCount?: number
  total?: number
  hasActiveFilters?: boolean
  onClear?(): void
}

interface FilterOption {
  value: CategoryFilter
  label: string
}

const FILTERS: FilterOption[] = [
  { value: "all", label: "Todos" },
  ...CATEGORY_LIST.map((category) => ({ value: category, label: category })),
]

/**
 * Buscador + filtros. Se usa dos veces (hero y módulo del mapa) sobre el mismo estado, con el
 * mismo lenguaje visual, para que se lean como un único sistema.
 */
export default function SearchAndFilters(props: SearchAndFiltersProps) {
  const {
    variant,
    query,
    onQueryChange,
    category,
    onCategoryChange,
    onGoToResults,
  } = props

  const inputId = useId()
  const isHero = variant === "hero"
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onGoToResults?.()
  }

  const pickCategory = (value: CategoryFilter) => {
    onCategoryChange(value)
    if (isHero) onGoToResults?.()
  }

  return (
    <div className={`search-filters search-filters-${variant}`}>
      <form
        className="search-box"
        role="search"
        onSubmit={submit}
        aria-label={
          isHero
            ? "Buscar puntos en el mapa"
            : "Buscar en el directorio y el mapa"
        }
      >
        <label className="sr-only" htmlFor={inputId}>
          Buscar por barrio, parque huerta o feria
        </label>
        <Icon name="search" size={isHero ? 22 : 20} />
        <input
          id={inputId}
          type="search"
          autoComplete="off"
          enterKeyHint="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Barrio, parque o feria"
        />
        {isHero ? (
          <button
            type="submit"
            className="search-submit"
            aria-label="Buscar en el mapa"
          >
            <span className="search-submit-label">Buscar</span>
            <Icon name="arrow" size={20} />
          </button>
        ) : (
          query && (
            <button
              type="button"
              className="search-clear"
              aria-label="Borrar búsqueda"
              onClick={() => onQueryChange("")}
            >
              <Icon name="close" size={18} />
            </button>
          )
        )}
      </form>
      <div
        className="filter-row"
        role="group"
        aria-label="Filtrar por tipo de punto"
      >
        {FILTERS.map(({ value, label }) => (
          <button
            aria-pressed={category === value}
            className={
              category === value ? "filter-pill is-active" : "filter-pill"
            }
            key={value}
            onClick={() => pickCategory(value)}
            type="button"
          >
            {value !== "all" && (
              <span
                className={`filter-dot type-${CATEGORIES[value].slug}`}
                aria-hidden="true"
              />
            )}
            {label}
          </button>
        ))}
      </div>
      {!isHero && (
        <div className="results-bar">
          <p className="results-count" aria-live="polite" aria-atomic="true">
            <strong>{props.resultCount}</strong>{" "}
            {props.resultCount === 1 ? "punto" : "puntos"}
            {props.hasActiveFilters && <span> de {props.total}</span>}
          </p>
          <button
            type="button"
            className="clear-filters"
            onClick={props.onClear}
            disabled={!props.hasActiveFilters}
          >
            <Icon name="close" size={16} />
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  )
}
