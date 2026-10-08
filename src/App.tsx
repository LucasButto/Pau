import { useCallback, useRef } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Hero from "./components/Hero"
import ImpactStats from "./components/ImpactStats"
import MapSection from "./components/MapSection"
import Resources from "./components/Resources"
import { useDirectory } from "./hooks/useDirectory"
import { useGeolocation } from "./hooks/useGeolocation"
import { ROSARIO_CENTER } from "./lib/geo"

export default function App() {
  const geo = useGeolocation()
  const directory = useDirectory(geo.position ?? ROSARIO_CENTER)
  const mapModuleRef = useRef<HTMLDivElement>(null)
  // El buscador del hero lleva al módulo del mapa; `scroll-margin-top` lo deja debajo del header.
  const goToResults = useCallback(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    mapModuleRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    })
  }, [])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#mapa">
        Saltar al mapa
      </a>
      <Header />
      <main id="contenido">
        <Hero directory={directory} onGoToResults={goToResults} />
        <MapSection directory={directory} geo={geo} moduleRef={mapModuleRef} />
        <ImpactStats />
        <Resources />
      </main>
      <Footer />
    </div>
  )
}
