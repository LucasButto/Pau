/**
 * Instituciones que acompañan al PAU (franja de círculos de "Sobre nosotros").
 *
 * - Lista vacía: en producción la franja no se muestra; en desarrollo se ven 5 círculos con
 *   "Logo" para revisar el diseño.
 * - `logo`: ruta a un SVG (ideal) o PNG, idealmente monocromo. Se muestra en Azul Cianotipia y a
 *   color al pasar el mouse si tiene `href`.
 *
 * TODO: cargar los logos reales (nombre, archivo y link de cada institución). No inventar.
 */
export interface Auspiciante {
  nombre: string
  logo: string
  href: string | null
}

export const AUSPICIANTES: Auspiciante[] = []
