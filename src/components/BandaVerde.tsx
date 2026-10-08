import type { ReactNode } from "react"

interface BandaVerdeProps {
  /** Sin contenido es solo la transición decorativa entre secciones. */
  children?: ReactNode
  id?: string
  labelledBy?: string
}

/** Banda Verde CAR con textura oliva que separa el hero de lo que sigue (ambas páginas). */
export default function BandaVerde({ children, id, labelledBy }: BandaVerdeProps) {
  if (!children) return <div className="banda-verde has-topo topo-oliva-fuerte" aria-hidden="true" />
  return (
    <section id={id} className="banda-verde has-content has-topo topo-oliva-fuerte" aria-labelledby={labelledBy}>
      <div className="container">{children}</div>
    </section>
  )
}
