import { useId, useRef, useState, type KeyboardEvent } from "react"
import { CATEGORIES, CATEGORY_LIST } from "../data/locations"
import type { CategoryFilter, DirectoryEntry } from "../hooks/useDirectory"
import CategoryPin from "./CategoryPin"
import Icon from "./Icon"

interface SearchAndFiltersProps {
  query: string
  onQueryChange(value: string): void
  category: CategoryFilter
  onCategoryChange(value: CategoryFilter): void
  /** Coincidencias de la búsqueda actual (también son las sugerencias). */
  results: DirectoryEntry[]
  /** Se eligió una sugerencia: seleccionar el lugar y volar hasta él. */
  onChoose(id: number): void
}

const FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "Todo" },
  ...CATEGORY_LIST.map((category) => ({ value: category, label: CATEGORIES[category].label })),
]

/**
 * Barra superior del módulo del mapa: buscador "Buscá por nombre" con sugerencias (patrón ARIA
 * combobox + listbox) y chips de categoría. Reemplaza al directorio en lista como forma de recorrer
 * los lugares con teclado: ↑↓ para moverse, Enter para elegir, Esc para cerrar.
 */
export default function SearchAndFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  results,
  onChoose,
}: SearchAndFiltersProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const inputId = useId()
  const listId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const expanded = open && results.length > 0
  const optionId = (index: number) => `${listId}-opcion-${index}`

  const close = () => {
    setOpen(false)
    setActive(-1)
  }

  const choose = (entry: DirectoryEntry) => {
    onQueryChange(entry.location.name)
    onChoose(entry.location.id)
    close()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (!results.length) return
      setOpen(true)
      if (!open) {
        setActive(event.key === "ArrowDown" ? 0 : results.length - 1)
        return
      }
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) => (index + step + results.length) % results.length)
    } else if (event.key === "Enter") {
      // Sin opción marcada, Enter elige la primera coincidencia.
      const entry = results[active] ?? (query.trim() ? results[0] : undefined)
      if (!entry) return
      event.preventDefault()
      choose(entry)
    } else if (event.key === "Escape") {
      if (expanded) {
        event.preventDefault()
        close()
      } else if (query) {
        event.preventDefault()
        onQueryChange("")
      }
    } else if (event.key === "Tab") close()
  }

  return (
    <div className="map-filters">
      <div
        className="map-search"
        ref={wrapRef}
        onBlur={(event) => {
          if (!wrapRef.current?.contains(event.relatedTarget as Node)) close()
        }}
      >
        <label className="sr-only" htmlFor={inputId}>
          Buscá por nombre
        </label>
        <Icon name="search" size={20} />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={expanded && active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          enterKeyHint="search"
          spellCheck={false}
          placeholder="Buscá por nombre"
          value={query}
          onChange={(event) => {
            onQueryChange(event.target.value)
            setOpen(event.target.value.trim() !== "")
            setActive(-1)
          }}
          onKeyDown={onKeyDown}
        />
        {query && (
          <button
            type="button"
            className="map-search-clear"
            aria-label="Borrar búsqueda"
            onClick={() => {
              onQueryChange("")
              close()
              inputRef.current?.focus()
            }}
          >
            <Icon name="close" size={18} />
          </button>
        )}
        <ul id={listId} role="listbox" aria-label="Lugares que coinciden" className="map-suggestions" hidden={!expanded}>
          {results.map((entry, index) => {
            const { location } = entry
            const meta = CATEGORIES[location.type]
            return (
              <li
                key={location.id}
                id={optionId(index)}
                role="option"
                aria-selected={index === active}
                className={index === active ? "is-active" : undefined}
                // mousedown: que el input no pierda el foco antes del click
                onMouseDown={(event) => event.preventDefault()}
                onMouseMove={() => setActive(index)}
                onClick={() => choose(entry)}
              >
                <CategoryPin category={location.type} height={32} />
                <span className="suggestion-text">
                  <strong>{location.name}</strong>
                  <span>{meta.longLabel}</span>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {results.length === 1 ? "1 lugar en el mapa" : `${results.length} lugares en el mapa`}
      </p>
      <div className="chip-row" role="group" aria-label="Filtrar por categoría">
        {FILTERS.map(({ value, label }) => (
          <button
            aria-pressed={category === value}
            className={category === value ? "chip is-active" : "chip"}
            key={value}
            onClick={() => onCategoryChange(value)}
            type="button"
            // El nombre accesible empieza con el texto visible: "CAR, Centro Agroecológico Rosario".
            {...(value !== "all" && CATEGORIES[value].longLabel !== label
              ? { "aria-label": `${label}, ${CATEGORIES[value].longLabel.replace(/\s*\(.*\)$/, "")}` }
              : {})}
          >
            {value !== "all" && <span className={`chip-dot type-${CATEGORIES[value].slug}`} aria-hidden="true" />}
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
