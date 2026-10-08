/**
 * Paleta oficial del PAU para el código que no puede leer CSS (pines dibujados en canvas y estilo
 * del mapa). Es la misma que los tokens `--color-*` de `@theme` en `src/index.css`: si cambia una,
 * cambiá la otra.
 */
export const PALETTE = {
  verdeCar: "#6A7332",
  amarillo6pm: "#F2A111",
  blancoAjito: "#F8F8E1",
  azulCianotipia: "#133E45",
  marronCorteza: "#4F2C15",
  /** Derivado: crema un poco más oscuro (chips, buscador, bloque de datos de la ficha). */
  cremaOscuro: "#E7E8D0",
} as const
