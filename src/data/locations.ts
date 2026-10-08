import molinoBlanco from "../assets/lugares/molino-blanco.webp"
import type { IconName } from "../components/iconPaths"
import { PALETTE } from "../lib/palette"
import type { DayCode } from "../lib/schedule"

/*
 * ╔══════════════════════════════════════════════════════════════════════════════════════════╗
 * ║ TODO: reemplazar por la lista oficial del PAU (nombre, categoría, dirección, horario,       ║
 * ║ huerteros, días de apertura y foto). Los puntos de abajo son DATOS DE EJEMPLO.              ║
 * ║ Según los números del sitio hay 7 parques huerta, 9 espacios huerta y 1 CAR: la estructura  ║
 * ║ ya está lista para recibirlos (un objeto por punto en `LOCATIONS`). "Huertas" está vacía    ║
 * ║ hasta que llegue la lista real: no inventar puntos.                                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════════════════╝
 */

export type Category = "Ferias" | "Huertas" | "CAR" | "Parques huertas" | "Compost"
export type CategorySlug = "feria" | "huerta" | "car" | "parque" | "compost"

export interface CategoryMeta {
  slug: CategorySlug
  /** Rótulo del chip de filtro. */
  label: string
  /** Rótulo largo y accesible. */
  longLabel: string
  icon: IconName
  /** Relleno del pin y del círculo del ícono. */
  color: string
  /** Color del ícono dentro del pin. */
  iconColor: string
  /** Borde del pin (solo Compost, que es crema). */
  stroke?: string
}

/*
 * Colores e íconos según el PDF (a confirmar con la diseñadora). Compost no está en el PDF: va en
 * crema con borde e ícono Marrón Corteza para no salirse de la paleta de 5 colores.
 */
export const CATEGORIES: Record<Category, CategoryMeta> = {
  Ferias: {
    slug: "feria",
    label: "Ferias",
    longLabel: "Ferias",
    icon: "pinFeria",
    color: PALETTE.amarillo6pm,
    iconColor: PALETTE.blancoAjito,
  },
  Huertas: {
    slug: "huerta",
    label: "Huertas",
    longLabel: "Huertas",
    icon: "pinHuerta",
    color: PALETTE.marronCorteza,
    iconColor: PALETTE.blancoAjito,
  },
  CAR: {
    slug: "car",
    label: "CAR",
    longLabel: "Centro Agroecológico Rosario (CAR)",
    icon: "pinCar",
    color: PALETTE.azulCianotipia,
    iconColor: PALETTE.blancoAjito,
  },
  "Parques huertas": {
    slug: "parque",
    label: "Parques huertas",
    longLabel: "Parques huertas",
    icon: "pinParque",
    color: PALETTE.verdeCar,
    iconColor: PALETTE.blancoAjito,
  },
  Compost: {
    slug: "compost",
    label: "Compost",
    longLabel: "Puntos de compost",
    icon: "compost",
    color: PALETTE.blancoAjito,
    iconColor: PALETTE.marronCorteza,
    stroke: PALETTE.marronCorteza,
  },
}

/** Orden de los chips: Todo · Ferias · Huertas · CAR · Parques huertas · Compost. */
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
  district: string
  schedule: string
  address: string
  people: string
  openDays: DayCode[]
  lat: number
  lng: number
  photo: Photo
}

/*
 * Coordenadas fijas, obtenidas una sola vez en desarrollo (octubre de 2026) con Nominatim y
 * OpenStreetMap, y verificadas con geocodificación inversa. No se geocodifica en tiempo de ejecución.
 * TODO: fotos reales de cada punto (salvo Molino Blanco, las actuales son de stock de Unsplash).
 * Las fotos se muestran en blanco y negro (filtro CSS).
 */
export const LOCATIONS: Location[] = [
  {
    id: 1,
    name: "Parque Huerta Molino Blanco",
    type: "Parques huertas",
    district: "Distrito Sur · Barrio Molino Blanco",
    schedule: "Mar a sáb · 8:00 a 13:00",
    address: "Ayacucho 4800, Rosario",
    people: "Marta, Luis y 18 familias huerteras",
    openDays: ["MAR", "MIÉ", "JUE", "VIE", "SÁB"],
    // Centro del área "Parque Huerta Molino Blanco" en OSM, sobre Ayacucho. OSM ubica el predio
    // en el barrio Pte. Roque Sáenz Peña (zona Molino Blanco), Distrito Sur.
    lat: -33.0133587,
    lng: -60.6366421,
    // Foto real (del PDF). TODO: pedir una versión de mayor resolución (la actual mide 461 px).
    photo: {
      src: molinoBlanco,
      alt: "Canteros del Parque Huerta Molino Blanco con acelgas y arcos de invernáculo",
    },
  },
  {
    id: 2,
    name: "Feria Plaza Alberdi",
    type: "Ferias",
    district: "Distrito Norte · Alberdi",
    schedule: "Sábados · 9:00 a 13:00",
    address: "Bv. Rondeau y Puccio, Rosario",
    people: "Productores de la red norte",
    openDays: ["SÁB"],
    // Plaza Alberdi (OSM), junto a la esquina de Bv. Rondeau y Puccio. Barrio Alberdi, Distrito Norte.
    lat: -32.895002,
    lng: -60.6930895,
    photo: unsplash("1764001032216-360a43576788", "Puesto de feria con verduras de hoja recién cosechadas", 640, 480),
  },
  {
    id: 3,
    name: "Centro Agroecológico Rosario",
    type: "CAR",
    district: "Distrito Oeste · Godoy",
    schedule: "Lun a vie · 8:30 a 16:00",
    address: "Pte. Perón 8000, Rosario",
    people: "Semillas, talleres y producción",
    openDays: ["LUN", "MAR", "MIÉ", "JUE", "VIE"],
    // TODO: verificar coordenada. Es la altura 8000 de Av. Pte. Perón, interpolada a partir de las
    // direcciones 7800 y 7900 cargadas en OSM (barrio Godoy, Distrito Oeste), pero en OSM no hay
    // ningún "Centro Agroecológico" en esa cuadra que confirme la ubicación.
    lat: -32.9773726,
    lng: -60.7304003,
    photo: unsplash(
      "1770982699024-31edd9a6d4d3",
      "Canteros con plantines y carteles escritos a mano dentro de un invernadero",
      640,
      480,
    ),
  },
  {
    id: 4,
    name: "Parque Huerta La Tablada",
    type: "Parques huertas",
    district: "Distrito Sur · Tablada",
    schedule: "Lun a vie · 8:00 a 12:30",
    address: "Gutiérrez y Cepeda, Rosario",
    people: "Cooperativa La Tablada",
    openDays: ["LUN", "MAR", "MIÉ", "JUE", "VIE"],
    // Centro del área "Parque Huerta La Tablada" en OSM (barrio Esteban Echeverría, Distrito Sur).
    // Ojo: la esquina Gutiérrez y Cepeda no existe como cruce en OSM; el predio queda ~450 m al
    // este de Cepeda, a la altura de Gutiérrez. Conviene revisar la dirección publicada.
    lat: -32.99451,
    lng: -60.6200792,
    photo: unsplash("1788538812809-f22af3a6993a", "Dos personas trabajando entre canteros elevados de madera", 640, 480),
  },
  {
    id: 5,
    name: "Compost Comunitario Ludueña",
    type: "Compost",
    district: "Distrito Noroeste · Ludueña",
    schedule: "Mié y vie · 16:00 a 19:00",
    address: "Vélez Sarsfield 6100, Rosario",
    people: "Red de compostaje barrial",
    openDays: ["MIÉ", "VIE"],
    // TODO: verificar coordenada. La dirección existe en OSM (Vélez Sarsfield 6100, Distrito
    // Noroeste), pero cae en el barrio Empalme Graneros, a ~1,6 km del centro de Ludueña.
    lat: -32.9257726,
    lng: -60.7063867,
    photo: unsplash(
      "1781785273371-a959f34bfab0",
      "Grupo de vecinos trabajando la tierra en una huerta comunitaria",
      640,
      480,
    ),
  },
]
