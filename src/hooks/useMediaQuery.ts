import { useCallback, useSyncExternalStore } from "react"

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", notify)
      return () => list.removeEventListener("change", notify)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Debajo de este ancho la ficha del módulo del mapa va debajo del mapa. Igual que en `styles/mapa.css`. */
export const STACKED_QUERY = "(max-width: 767px)"

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"
