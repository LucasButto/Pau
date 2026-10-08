import { Route, Switch } from "wouter"
import Footer from "./components/Footer"
import Header from "./components/Header"
import { PAGES } from "./content/site"
import NotFound from "./pages/NotFound"
import RaicesVecinas from "./pages/RaicesVecinas"
import SobreNosotros from "./pages/SobreNosotros"
import RouteEffects from "./router/RouteEffects"
import DirectoryProvider from "./state/DirectoryProvider"

/*
 * Rutas (wouter): las de cada página salen de `content/site.ts` (opción A / B). El mapa (MapLibre)
 * se descarga recién cuando su módulo se acerca a la pantalla, así que la página institucional
 * nunca lo pide.
 */
export default function App() {
  return (
    <DirectoryProvider>
      <div className="app-shell">
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" tabIndex={-1}>
          <Switch>
            <Route path={PAGES.raicesVecinas.path}>
              <RaicesVecinas />
            </Route>
            <Route path={PAGES.institucional.path}>
              <SobreNosotros />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </main>
        <Footer />
        <RouteEffects />
      </div>
    </DirectoryProvider>
  )
}
