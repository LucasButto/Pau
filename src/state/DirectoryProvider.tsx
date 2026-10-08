import { createContext, useContext, useEffect, useRef, type ReactNode } from "react"
import { useDirectory, type Directory } from "../hooks/useDirectory"
import { useGeolocation, type GeolocationState } from "../hooks/useGeolocation"
import { ROSARIO_CENTER } from "../lib/geo"

interface DirectoryContextValue {
  directory: Directory
  geo: GeolocationState
}

const DirectoryContext = createContext<DirectoryContextValue | null>(null)

/**
 * Estado compartido del buscador y del mapa. Vive arriba de las rutas porque lo usan el módulo del
 * mapa y el buscador del menú mobile (que puede estar en cualquier página).
 */
export default function DirectoryProvider({ children }: { children: ReactNode }) {
  const geo = useGeolocation()
  const directory = useDirectory(geo.position ?? ROSARIO_CENTER, geo.position !== null)

  // Al obtener la ubicación, la ficha pasa al lugar más cercano.
  const { resetSelection } = directory
  const handledSeq = useRef(0)
  useEffect(() => {
    if (geo.seq === handledSeq.current) return
    handledSeq.current = geo.seq
    resetSelection()
  }, [geo.seq, resetSelection])

  return <DirectoryContext.Provider value={{ directory, geo }}>{children}</DirectoryContext.Provider>
}

export function useDirectoryContext(): DirectoryContextValue {
  const value = useContext(DirectoryContext)
  if (!value) throw new Error("useDirectoryContext debe usarse dentro de <DirectoryProvider>.")
  return value
}
