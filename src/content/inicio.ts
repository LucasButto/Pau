/** Textos de la página "Raíces Vecinas" (hero, mapa, impacto y Semillero digital). */

export const FRASES_SUPERIORES = {
  izquierda: "Rosario, una ciudad que cultiva",
  /** Se completa con la estación del momento (`seasonInRosario()`). */
  derecha: (estacion: string) => `Temporada de ${estacion} · Rosario, Santa Fe`,
}

export const HERO = {
  /** Eslogan de la campaña: antetítulo chico arriba del titular. */
  antetitulo: "Plantate. No seas nabo.",
  /** Titular (<h1>), como en el PDF: "RAÍCES" en Verde CAR y "VECINAS" en crema dentro del bloque verde. */
  titulo: { arriba: "Raíces", bloque: "Vecinas" },
  bajadaDestacada: "Soberanía alimentaria a la vuelta de tu casa:",
  bajada: " descubrí la red de huertas, parques agroecológicos y ferias de Rosario.",
  boton: "Explorá el mapa",
  collageAlt:
    "Collage en blanco y negro con toques de color: vecinos trabajando en canteros elevados, un invernadero, un puesto de feria con verduras y un camión que carga cajas de cosecha.",
}

export const MAPA = {
  titulo: "El PAU está más cerca de lo que pensás",
  bajada:
    "Una cartografía viva para encontrar alimentos sanos, proyectos colectivos y manos que cultivan otra ciudad posible.",
}

export const IMPACTO = {
  titulo: ["Sembramos futuro.", "Cosechamos comunidad."],
  bajada: "Desde 2002, el PAU transforma terrenos vacantes en espacios productivos, verdes y compartidos.",
}

export const SEMILLERO = {
  titulo: "Semillero digital",
  bajada: "Conocé lo que se está germinando.",
  recursosTitulo: "Guías para empezar hoy",
  recursosBajada:
    "Ideas, herramientas y saberes para empezar hoy. Leé, guardá, compartí y hacé circular el conocimiento.",
}
