/**
 * Paleta PAU para el código que no puede leer CSS (pines dibujados en canvas y estilo del mapa).
 * Es la misma que los tokens `--color-*` de `@theme` en `src/index.css`: si cambia una, cambiá la otra.
 */
export const PALETTE = {
  /** Verde CAR */
  forest: "#6C733B",
  /** Amarillo 6PM */
  mustard: "#E7A63D",
  /** Blanco Ajito */
  paper: "#F7F6F0",
  /** Azul Cianotipia */
  cyan: "#1F383D",
  /** Marrón Corteza */
  bark: "#4A281E",
  /** Marrón Corteza profundo (texto) */
  ink: "#2D1A14",
  /** Violeta de los puntos de compost: se distingue sobre el fondo cianotipia del mapa */
  compost: "#6D5B88",
} as const
