/**
 * Los 4 números de "Sembramos futuro. Cosechamos comunidad.". La plaquita los muestra de a uno y va
 * rotando; el lector de pantalla recibe la lista completa. Editá acá los valores.
 */
export interface DatoImpacto {
  valor: number
  /** Texto chico arriba del número (por ejemplo, "Más de"). */
  prefijo?: string
  rotulo: string
}

export const DATOS_IMPACTO: DatoImpacto[] = [
  { valor: 1, rotulo: "Centro agroecológico" },
  { valor: 9, rotulo: "Espacios huerta" },
  { valor: 7, rotulo: "Parques huertas" },
  { valor: 155, prefijo: "Más de", rotulo: "Huerteros y huerteras" },
]

/** Cada cuánto cambia la plaquita (ms). */
export const ROTACION_MS = 3500
