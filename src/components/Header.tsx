import { useEffect, useRef, useState } from "react"
import Brand from "./Brand"
import Icon from "./Icon"

const NAV_ITEMS = [
  { href: "#mapa", label: "Raíces Vecinas" },
  { href: "#impacto", label: "El PAU" },
  { href: "#recursos", label: "Semillero Digital" },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // Menú móvil: se cierra con Esc (devolviendo el foco al botón) y con un click afuera.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (
        !navRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      )
        setMenuOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          className="brand-link"
          href="#inicio"
          aria-label="PAU Rosario, Programa de Agricultura Urbana: ir al inicio"
        >
          <Brand />
        </a>
        <span className="campaign-badge">
          <span aria-hidden="true" /> PLANTATE
        </span>
        <nav
          id="main-nav"
          ref={navRef}
          className={menuOpen ? "main-nav is-open" : "main-nav"}
          aria-label="Navegación principal"
        >
          {NAV_ITEMS.map((item) => (
            <a
              href={item.href}
              key={item.label}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#mapa">
          <span className="header-cta-label">Encontrá tu huerta</span>
          <span className="header-cta-short" aria-hidden="true">
            Ver mapa
          </span>
          <Icon name="arrow" size={18} />
        </a>
        <button
          ref={buttonRef}
          className="menu-button"
          type="button"
          aria-controls="main-nav"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={24} />
        </button>
      </div>
    </header>
  )
}
