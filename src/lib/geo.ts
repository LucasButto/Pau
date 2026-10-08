export interface LatLng {
  lat: number
  lng: number
}

/** [[oeste, sur], [este, norte]] en el orden de MapLibre (lng, lat). */
export type LngLatBounds = [[number, number], [number, number]]

/** Kilómetro cero de Rosario: Plaza 25 de Mayo (coordenada de OpenStreetMap). */
export const ROSARIO_CENTER: LatLng = { lat: -32.9470336, lng: -60.6331836 }

/** Centro inicial del mapa antes de encuadrar los puntos. */
export const MAP_INITIAL_CENTER: LatLng = { lat: -32.95, lng: -60.65 }

/**
 * Límite de navegación: Gran Rosario (de Granadero Baigorria a Villa Gobernador Gálvez,
 * de Funes a las islas frente a la ciudad). Evita que el usuario se pierda arrastrando.
 */
export const GRAN_ROSARIO_BOUNDS: LngLatBounds = [
  [-60.98, -33.16],
  [-60.42, -32.74],
]

const EARTH_RADIUS_KM = 6371.0088
const toRad = (deg: number) => (deg * Math.PI) / 180

/** Distancia en km sobre la esfera (fórmula de Haversine). */
export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

const kmFormat = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})
const kmWholeFormat = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 0,
})

/** "850 m", "4,2 km", "312 km". */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.max(10, Math.round((km * 1000) / 10) * 10)} m`
  if (km >= 100) return `${kmWholeFormat.format(km)} km`
  return `${kmFormat.format(km)} km`
}

export function boundsOf(points: readonly LatLng[]): LngLatBounds | null {
  if (!points.length) return null
  let west = Infinity
  let south = Infinity
  let east = -Infinity
  let north = -Infinity
  for (const { lat, lng } of points) {
    west = Math.min(west, lng)
    east = Math.max(east, lng)
    south = Math.min(south, lat)
    north = Math.max(north, lat)
  }
  return [
    [west, south],
    [east, north],
  ]
}

export function isWithin(
  point: LatLng,
  [[west, south], [east, north]]: LngLatBounds,
): boolean {
  return (
    point.lng >= west &&
    point.lng <= east &&
    point.lat >= south &&
    point.lat <= north
  )
}

/** Link de Google Maps con indicaciones hasta la coordenada (API de URLs de Google Maps). */
export function directionsUrl({ lat, lng }: LatLng): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat.toFixed(6)},${lng.toFixed(6)}`
}
