import molinoBlanco from "../assets/lugares/molino-blanco.webp"
import pinCar from "../assets/pines/car.png"
import pinFeria from "../assets/pines/feria.png"
import pinHuerta from "../assets/pines/huerta.png"
import pinParque from "../assets/pines/parque-huertas.png"
import { PALETTE } from "../lib/palette"
import type { DayCode } from "../lib/schedule"

/*
 * Lugares del mapa: los 27 puntos de `docs/cambios-v2/huertitas.pdf` (5 huertas, 9 parques huerta,
 * el CAR y 12 ferias). El PDF trae el nombre, el link de Google Maps y, en las ferias, el día y el
 * horario; no trae direcciones, fotos ni días de las huertas, los parques y el CAR. Si llegan, se
 * cargan en cada punto (`address`, `schedule`, `openDays`, `photo`).
 */

export type Category = "Ferias" | "Huertas" | "CAR" | "Parques huertas"
export type CategorySlug = "feria" | "huerta" | "car" | "parque"

export interface CategoryMeta {
  slug: CategorySlug
  /** Rótulo del chip de filtro. */
  label: string
  /** Rótulo largo y accesible. */
  longLabel: string
  /** Pin oficial de la diseñadora (PNG con transparencia, `PIN_ASPECT`). */
  pin: string
  /** Color del pin: los chips, las etiquetas y la ficha lo repiten. */
  color: string
}

/** Proporción de los PNG de los pines (157 × 197 px): la punta queda abajo y centrada, sin margen. */
export const PIN_ASPECT = 157 / 197

/** Cada color es el del pin que entregó la diseñadora. */
export const CATEGORIES: Record<Category, CategoryMeta> = {
  Ferias: {
    slug: "feria",
    label: "Ferias",
    longLabel: "Ferias",
    pin: pinFeria,
    color: PALETTE.amarillo6pm,
  },
  Huertas: {
    slug: "huerta",
    label: "Huertas",
    longLabel: "Huertas",
    pin: pinHuerta,
    color: PALETTE.verdeCar,
  },
  CAR: {
    slug: "car",
    label: "CAR",
    longLabel: "Centro Agroecológico Rosario (CAR)",
    pin: pinCar,
    color: PALETTE.azulCianotipia,
  },
  "Parques huertas": {
    slug: "parque",
    label: "Parques huertas",
    longLabel: "Parques huertas",
    pin: pinParque,
    color: PALETTE.marronCorteza,
  },
}

/** Orden de los chips: Todo · Ferias · Huertas · CAR · Parques huertas. */
export const CATEGORY_LIST = Object.keys(CATEGORIES) as Category[]

export interface Photo {
  src: string
  srcSet?: string
  alt: string
}

/** Fotos de Unsplash recortadas del lado del servidor (tamaño y peso fijos). */
export function unsplash(id: string, alt: string, width: number, height: number): Photo {
  const url = (w: number) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${Math.round((w * height) / width)}&q=75`
  return {
    src: url(width),
    srcSet: `${url(Math.round(width / 2))} ${Math.round(width / 2)}w, ${url(width)} ${width}w`,
    alt,
  }
}

export interface Location {
  id: number
  name: string
  type: Category
  /** Dirección. El PDF no trae: la ficha muestra solo la distancia hasta que se cargue. */
  address?: string
  /** Día y horario tal como los publica el PDF (solo las ferias lo tienen). */
  schedule?: string
  /** Días de apertura, para el cartel "Abierto hoy". Vacío si no se conocen. */
  openDays: DayCode[]
  lat: number
  lng: number
  photo: Photo
}

/*
 * TODO: fotos reales de cada punto. Hasta que lleguen, cada categoría usa una foto de stock de
 * Unsplash (son las mismas que tenían los puntos de ejemplo); solo Molino Blanco tiene foto real.
 * Las fotos se muestran en blanco y negro (filtro CSS).
 */
const CATEGORY_PHOTOS: Record<Category, Photo> = {
  Ferias: unsplash("1764001032216-360a43576788", "Puesto de feria con verduras de hoja recién cosechadas", 640, 480),
  Huertas: unsplash(
    "1781785273371-a959f34bfab0",
    "Grupo de vecinos trabajando la tierra en una huerta comunitaria",
    640,
    480,
  ),
  CAR: unsplash(
    "1770982699024-31edd9a6d4d3",
    "Canteros con plantines y carteles escritos a mano dentro de un invernadero",
    640,
    480,
  ),
  "Parques huertas": unsplash("1788538812809-f22af3a6993a", "Dos personas trabajando entre canteros elevados de madera", 640, 480),
}

/** Foto real de Molino Blanco (del PDF de la diseñadora). TODO: pedir una versión de mayor resolución (mide 461 px). */
const MOLINO_BLANCO_PHOTO: Photo = {
  src: molinoBlanco,
  alt: "Canteros del Parque Huerta Molino Blanco con acelgas y arcos de invernáculo",
}

type Seed = Omit<Location, "id" | "type" | "photo"> & { photo?: Photo }

/** Una feria de `huertitas.pdf`: un solo día de la semana y el horario tal cual está publicado. */
const feria = (name: string, lat: number, lng: number, day: DayCode, dayName: string, hours: string): Seed => ({
  name,
  schedule: `${dayName} · ${hours}`,
  openDays: [day],
  lat,
  lng,
})

/** Un punto sin día ni horario en el PDF. */
const place = (name: string, lat: number, lng: number): Seed => ({ name, openDays: [], lat, lng })

/*
 * Coordenadas: las del pin de cada link de Google Maps del PDF (se leyeron una sola vez, en octubre
 * de 2026, del `!3d…!4d…` de la URL a la que redirige el link corto). No se geocodifica en tiempo
 * de ejecución. Donde el nombre de Google Maps no coincide con el del PDF, queda anotado.
 *
 * Los nombres de "Parque Huerta" llevan el prefijo porque el PDF los lista debajo de ese título.
 * "Huerta Los Horneritos" también está bajo "Parque Huerta" y se conserva como figura.
 */
const PARQUES_HUERTAS: Seed[] = [
  // Primero, porque arranca seleccionado (como en el diseño) y es el único con foto real.
  { ...place("Parque Huerta Molino Blanco", -33.0131684, -60.6363995), photo: MOLINO_BLANCO_PHOTO },
  place("Parque Huerta Tablada", -32.9946497, -60.6203391),
  place("Parque Huerta El Ceibo", -33.0148244, -60.6384362),
  place("Parque Huerta Hogar Español", -32.9940522, -60.6882288),
  place("Parque Huerta SudOeste", -32.9917561, -60.6873494),
  place("Parque Huerta Bosque de los Constituyentes", -32.9028288, -60.7358477),
  place("Parque Huerta Norte", -32.8945744, -60.7259483),
  // Google Maps: "Huerta Paihuen/Las dos Rosas".
  place("Parque Huerta Corredor Verde", -32.8927033, -60.6989027),
  // Google Maps: "Huerta el Hornero".
  place("Huerta Los Horneritos", -32.8928507, -60.7229624),
]

const HUERTAS: Seed[] = [
  // Google Maps: "Corredor Verde «Huerta Grande»".
  place("Corredor Vías Verdes", -32.8836158, -60.7021767),
  place("Plaza Suecia", -32.9317916, -60.6499382),
  // Google Maps: "Centro Cuidar CIC Cerámica".
  place("CIC Norte", -32.8869358, -60.7051197),
  // Google Maps: "Plaza Rageylo".
  place("El Obrador", -32.9799453, -60.698462),
  // Google Maps: "Hospital «Intendente Gabriel Carrasco»".
  place("Hospital Carrasco", -32.9464183, -60.6811664),
]

const CENTROS_AGROECOLOGICOS: Seed[] = [
  // Google Maps: "Centro Agroecológico Rosario - Vivero Agroecológico de Tablada".
  place("Centro Agroecológico de Rosario", -32.9959947, -60.6238383),
]

const FERIAS: Seed[] = [
  feria("Plaza San Martín", -32.9436573, -60.6496895, "LUN", "Lunes", "9:00 a 13:00 / 14:00 hs"),
  feria("Centro Municipal Distrito Centro", -32.9366083, -60.6414041, "MAR", "Martes", "9:00 a 14:00 hs"),
  // Google Maps: "Facultad de Ciencias Médicas - Universidad Nacional de Rosario".
  feria("Mercado Universitario", -32.9400117, -60.6651234, "MIÉ", "Miércoles", "9:00 a 14:00 hs"),
  // Google Maps: "Monumento a Ovidio Lagos".
  feria("Pellegrini y Ovidio Lagos", -32.9533282, -60.6645209, "MIÉ", "Miércoles", "9:30 a 13:00 hs"),
  feria("Plazoleta Alicia Moreau de Justo", -32.9455077, -60.6512817, "JUE", "Jueves", "9:00 a 14:00 hs"),
  feria("Plaza de la Cooperación", -32.9415429, -60.638259, "VIE", "Viernes", "9:00 a 14:00 hs"),
  feria("Plaza Alberdi", -32.8951918, -60.6921971, "VIE", "Viernes", "9:00 a 13:30 hs"),
  // Google Maps: "Av. Belgrano 658".
  feria("Monumento a la Bandera", -32.9460941, -60.6317628, "VIE", "Viernes", "11:00 a 13:30 hs"),
  // Google Maps: "Feria de Vegetales". Queda a ~25 m de la huerta "Plaza Suecia".
  feria("Plaza Suecia", -32.9319028, -60.6501213, "DOM", "Domingo", "8:30 a 13:00 hs"),
  // Google Maps: "Las 4 Plazas (Parque Mitre)". El PDF publica los dos horarios, sin aclarar cuándo rige cada uno.
  feria(
    "Cuatro Plazas",
    -32.9402421,
    -60.7126104,
    "DOM",
    "Domingo",
    "15:00 a 18:30 hs (en invierno/primavera) o 16:00 a 19:00 hs",
  ),
  // Google Maps: "Feria «La Pergola»".
  feria("La Pérgola", -32.9348447, -60.6419469, "DOM", "Domingo", "15:00 a 18:30 hs"),
  // Google Maps: "Rondó Bar".
  feria("Feria de Costa Alta", -32.8781452, -60.6975776, "DOM", "Domingo", "10:00 a 13:00 hs"),
]

const withType = (type: Category, seeds: Seed[]) =>
  seeds.map((seed) => ({ ...seed, type, photo: seed.photo ?? CATEGORY_PHOTOS[type] }))

/** El orden es el de las sugerencias sin ubicación del usuario; el primero arranca seleccionado. */
export const LOCATIONS: Location[] = [
  ...withType("Parques huertas", PARQUES_HUERTAS),
  ...withType("Huertas", HUERTAS),
  ...withType("CAR", CENTROS_AGROECOLOGICOS),
  ...withType("Ferias", FERIAS),
].map((location, index) => ({ ...location, id: index + 1 }))
