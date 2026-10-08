/**
 * Textos de la página "Sobre nosotros". Los de Quiénes somos, Nuestras propuestas y Objetivos son
 * los oficiales del PDF (con las erratas corregidas).
 */

export const HERO_SOBRE = {
  antetitulo: "Programa de",
  titulo: ["Agricultura", "Urbana"],
  /**
   * TODO: el texto del diseño está incompleto ("Surge en 2002, con el objetivo de..... para.....").
   * Mientras llega el definitivo se usa un texto ya aprobado en la otra página.
   */
  bajada: "Desde 2002, el PAU transforma terrenos vacantes en espacios productivos, verdes y compartidos.",
  boton: "Conocé nuestra historia",
  /** TODO: foto original en alta (≥ 1920 px de ancho); la actual mide 870 px. */
  fotoAlt: "Una huertera riega los canteros de un parque huerta mientras otra persona trabaja entre tutores de caña y plantas en flor.",
}

/** Banda verde debajo del hero. Es el destino de `#historia`. */
export const BANDA_DECADAS = {
  titulo: "Más de dos décadas echando raíces.",
  texto: "De los terrenos vacantes a los parques huerta: trabajo, alimentos sanos y una red que sigue creciendo.",
}

/**
 * Sección "Historia" completa (opcional). Se muestra debajo de la banda solo si tiene contenido.
 * TODO: completar si el cliente manda el texto de la historia.
 */
export const HISTORIA: { titulo: string; parrafos: string[] } | null = null

export const QUIENES_SOMOS = {
  titulo: "Quiénes somos",
  parrafos: [
    "Somos un grupo de Instituciones Públicas y Privadas, Agrupaciones y personas que consideramos que la Agricultura Urbana contribuye con propuestas concretas a la solución de algunos de los problemas generados en las ciudades por la creciente urbanización, la pobreza y la exclusión.",
    "La Agricultura Urbana promueve el desarrollo agroecológico, integrando a varones y mujeres en la generación de emprendimientos sociales de producción y elaboración de alimentos sanos mediante técnicas ecológicas.",
  ],
}

export const PROPUESTAS = {
  titulo: "Nuestras propuestas",
  items: [
    "Articulación de diferentes actores involucrados en estas problemáticas.",
    "Utilización de recursos locales y la aplicación de tecnologías ecológicas apropiadas y apropiables.",
    "Recuperación de lugares degradados transformándolos en nuevos espacios verdes productivos.",
    "Promoción de la integración de las actividades de Agricultura Urbana a la gestión urbana como propuesta integral de desarrollo urbano.",
  ],
}

export const OBJETIVOS = {
  titulo: "Objetivos",
  items: [
    "Concientizar, sensibilizar y darle visibilidad a los múltiples servicios que ofrece la Agricultura Urbana a la ciudad de Rosario.",
    "Dar a conocer, comunicar y promover las actividades de Agricultura Urbana en la ciudad de Rosario.",
  ],
  /** TODO: si hay otra foto para Objetivos, reemplazar (hoy es la misma del hero). */
  fotoAlt: "Huerteros trabajando entre tutores de caña y cajones de plantines en un parque huerta.",
}

export const CTA_HUERTA = {
  titulo: ["Hay una huerta.", "Hay un lugar para vos."],
  texto: "No hace falta saberlo todo. Las ganas de empezar también son una semilla.",
  boton: "Encontrá tu huerta",
}
