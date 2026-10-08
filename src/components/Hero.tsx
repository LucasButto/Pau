import type { Directory } from "../hooks/useDirectory"
import { unsplash } from "../data/locations"
import { seasonInRosario } from "../lib/schedule"
import Icon from "./Icon"
import SafeImage from "./SafeImage"
import SearchAndFilters from "./SearchAndFilters"

const MAIN_PHOTO = unsplash(
  "1789654498356-0efa1fb40243",
  "Dos jóvenes trabajando junto a un invernadero",
  820,
  900,
)
const DETAIL_PHOTO = unsplash(
  "1788538812851-9aacd4189fa8",
  "Jóvenes cuidando canteros elevados",
  560,
  420,
)

interface HeroProps {
  directory: Directory
  onGoToResults(): void
}

export default function Hero({ directory, onGoToResults }: HeroProps) {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-kicker">
        <span>Temporada de {seasonInRosario()}</span>
        <span>Rosario · Santa Fe · Argentina</span>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <h1 id="hero-title">
            <span>PLANTATE.</span>
            <br />
            No seas nabo.
          </h1>
          <p className="hero-description">
            Descubrí la red de huertas, parques agroecológicos y ferias locales
            de Rosario.{" "}
            <strong>Soberanía alimentaria a la vuelta de tu casa.</strong>
          </p>
        </div>
        <div className="hero-collage">
          <span className="collage-sun" aria-hidden="true" />
          <span className="collage-grid" aria-hidden="true" />
          <span className="collage-leaf collage-leaf-one" aria-hidden="true">
            <Icon name="leaf" size={72} />
          </span>
          <span className="collage-leaf collage-leaf-two" aria-hidden="true">
            <Icon name="sprout" size={56} />
          </span>
          <div className="collage-photo collage-photo-main">
            <SafeImage
              {...MAIN_PHOTO}
              sizes="(max-width: 860px) 80vw, 36vw"
              width={820}
              height={900}
              priority
            />
          </div>
          <div className="collage-photo collage-photo-detail">
            <SafeImage
              {...DETAIL_PHOTO}
              sizes="(max-width: 860px) 42vw, 22vw"
              width={560}
              height={420}
            />
          </div>
          <span className="collage-caption" aria-hidden="true">
            MANOS EN LA TIERRA
            <br />
            MIRADA EN EL FUTURO
          </span>
          <span className="collage-coordinate" aria-hidden="true">
            32°57′S · 60°39′O
          </span>
          <p className="hero-stamp">
            <Icon name="sprout" size={24} />
            <span>
              Cultivar
              <br />
              es político
            </span>
          </p>
        </div>
      </div>
      <div className="quick-filter">
        <SearchAndFilters
          variant="hero"
          query={directory.query}
          onQueryChange={directory.setQuery}
          category={directory.category}
          onCategoryChange={directory.setCategory}
          onGoToResults={onGoToResults}
        />
      </div>
    </section>
  )
}
