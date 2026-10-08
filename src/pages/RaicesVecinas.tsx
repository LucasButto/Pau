import BandaVerde from "../components/BandaVerde"
import Hero from "../components/Hero"
import ImpactStats from "../components/ImpactStats"
import MapSection from "../components/MapSection"
import Semillero from "../components/Semillero"
import { PAGES } from "../content/site"
import { usePageMeta } from "../router/usePageMeta"

/** Página "Raíces Vecinas": hero, mapa, impacto y Semillero digital. */
export default function RaicesVecinas() {
  const page = PAGES.raicesVecinas
  usePageMeta({ title: page.seo.title, description: page.seo.description, path: page.path })
  return (
    <>
      <Hero />
      <BandaVerde />
      <MapSection />
      <ImpactStats />
      <Semillero />
    </>
  )
}
