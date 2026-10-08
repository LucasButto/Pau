/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL de un estilo MapLibre (esquema OpenMapTiles). Por defecto, OpenFreeMap "dark". */
  readonly VITE_MAP_STYLE_URL?: string
  /** Endpoint que recibe `POST { email }` para el newsletter. */
  readonly VITE_NEWSLETTER_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
