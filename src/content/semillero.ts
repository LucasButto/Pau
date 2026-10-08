import poderElegir400 from "../assets/semillero/ig-el-poder-de-elegir-400.webp"
import poderElegir609 from "../assets/semillero/ig-el-poder-de-elegir-609.webp"
import queNecesitas400 from "../assets/semillero/ig-que-necesitas-para-hacerla-400.webp"
import queNecesitas609 from "../assets/semillero/ig-que-necesitas-para-hacerla-609.webp"

/**
 * Posteos de Instagram del carrusel "Semillero digital". Imágenes estáticas + link al posteo (sin
 * embeds ni scripts de Instagram).
 *
 * - `imagen: null` → se muestra una portada armada con la identidad del sitio (placeholder).
 * - `href: null` → la tarjeta se muestra solo como imagen: sin link, sin badge y con cursor normal (el
 *   tinte amarillo del hover se mantiene). Con `href` se vuelve link y muestra "Ver en Instagram".
 *
 * TODO: portadas en 1080×1350 y el link de cada posteo (las actuales salen del PDF, en baja).
 * A futuro se podría automatizar con la Instagram Graph API (cuenta profesional + token).
 */
export interface ImagenPosteo {
  src: string
  srcSet: string
  width: number
  height: number
}

export interface Posteo {
  id: string
  titulo: string
  imagen: ImagenPosteo | null
  alt: string
  href: string | null
}

export const POSTEOS: Posteo[] = [
  {
    id: "que-es-el-pau",
    titulo: "¿Qué es el PAU?",
    // TODO: portada real del posteo "¿Qué es el PAU?" (no vino suelta en el material).
    imagen: null,
    alt: "Portada del posteo ¿Qué es el PAU?, Programa de Agricultura Urbana.",
    // TODO: link al posteo.
    href: null,
  },
  {
    id: "que-necesitas",
    titulo: "¿Qué necesitás para hacerla?",
    imagen: {
      src: queNecesitas609,
      srcSet: `${queNecesitas400} 400w, ${queNecesitas609} 609w`,
      width: 609,
      height: 761,
    },
    alt: "Portada del posteo: Querés tener tu huerta pero… ¿qué necesitás para hacerla? Sobre la foto de una compostera de madera llena de restos de verdura.",
    // TODO: link al posteo.
    href: null,
  },
  {
    id: "el-poder-de-elegir",
    titulo: "El poder de elegir",
    imagen: {
      src: poderElegir609,
      srcSet: `${poderElegir400} 400w, ${poderElegir609} 609w`,
      width: 609,
      height: 761,
    },
    alt: "Portada del posteo El poder de elegir y no consumir en automático: los beneficios de ejercer la soberanía alimentaria y el derecho a decidir lo que comés.",
    // TODO: link al posteo.
    href: null,
  },
]
