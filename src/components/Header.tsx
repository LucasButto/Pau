import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type PointerEvent } from "react"
import { useLocation } from "wouter"
import logoCrema from "../assets/brand/logo-horizontal-crema.webp"
import { MAP_CTA, NAV_ITEMS, type NavItem } from "../content/navegacion"
import { PAGES, type PageId } from "../content/site"
import AppLink from "../router/AppLink"
import { parseInternalHref, scrollToAnchor } from "../router/navigation"
import { useDirectoryContext } from "../state/DirectoryProvider"
import Icon from "./Icon"

/** Página actual según la ruta (sin barra final). */
function usePageId(): PageId | null {
  const [path] = useLocation()
  const clean = path.length > 1 ? path.replace(/\/+$/, "") : path
  return (Object.values(PAGES).find((page) => page.path === clean)?.id ?? null) as PageId | null
}

/**
 * Desplegable "Sobre nosotros" (escritorio). El ítem es un link a la página:
 * - con mouse, se abre al pasar por encima y el click navega;
 * - con touch, teclado (Enter / Espacio / ↓) o un click con el panel cerrado, la primera activación
 *   abre y la segunda navega;
 * - se cierra con Esc, click afuera, al perder el foco o al sacar el mouse.
 */
function NavDropdown({ item, current }: { item: NavItem; current: boolean }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const wrapRef = useRef<HTMLLIElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)

  const links = () => Array.from(wrapRef.current?.querySelectorAll<HTMLAnchorElement>(".nav-dropdown a") ?? [])
  const close = (returnFocus = false) => {
    setOpen(false)
    if (returnFocus) linkRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return
    closeTimer.current = window.setTimeout(() => setOpen(false), 160)
  }

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === " " || (event.key === "ArrowDown" && !open)) {
      event.preventDefault()
      setOpen(true)
      if (event.key === "ArrowDown") requestAnimationFrame(() => links()[0]?.focus())
    } else if (event.key === "ArrowDown" && open) {
      event.preventDefault()
      links()[0]?.focus()
    } else if (event.key === "Escape" && open) {
      event.preventDefault()
      close()
    }
  }

  const onPanelKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const items = links()
    const index = items.indexOf(document.activeElement as HTMLAnchorElement)
    const go = (next: number) => {
      event.preventDefault()
      items[(next + items.length) % items.length]?.focus()
    }
    if (event.key === "ArrowDown") go(index + 1)
    else if (event.key === "ArrowUp") go(index - 1)
    else if (event.key === "Home") go(0)
    else if (event.key === "End") go(items.length - 1)
    else if (event.key === "Escape") {
      event.preventDefault()
      close(true)
    }
  }

  return (
    <li
      ref={wrapRef}
      className={open ? "nav-item has-dropdown is-open" : "nav-item has-dropdown"}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onBlur={(event) => {
        if (!wrapRef.current?.contains(event.relatedTarget as Node)) setOpen(false)
      }}
    >
      <AppLink
        ref={linkRef}
        href={item.href}
        className="nav-link"
        aria-current={current ? "page" : undefined}
        aria-expanded={open}
        aria-controls={panelId}
        onKeyDown={onTriggerKeyDown}
        onClick={(event) => {
          // Primera activación (touch, teclado o click sin hover previo): solo abre.
          if (!open) {
            event.preventDefault()
            setOpen(true)
          } else setOpen(false)
        }}
      >
        {item.label}
        <Icon name="chevron" size={16} className="nav-chevron" />
      </AppLink>
      <ul id={panelId} className="nav-dropdown" hidden={!open} onKeyDown={onPanelKeyDown}>
        {item.children?.map((child) => (
          <li key={child.href}>
            <AppLink href={child.href} onClick={() => setOpen(false)}>
              {child.label}
            </AppLink>
          </li>
        ))}
      </ul>
    </li>
  )
}

/** Menú de mobile y tablet: buscador, links y "Sobre nosotros" como acordeón. */
interface MobileMenuProps {
  id: string
  hidden: boolean
  pageId: PageId | null
  onClose(): void
}

function MobileMenu({ id, hidden, onClose, pageId }: MobileMenuProps) {
  const { directory } = useDirectoryContext()
  const [path, navigate] = useLocation()
  const [value, setValue] = useState(directory.query)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const inputId = useId()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    directory.setFilters(value.trim(), "all")
    onClose()
    const target = parseInternalHref(MAP_CTA.href)
    if (!target) return
    if (target.path === path) {
      // Misma página: no cambia la ruta, así que el scroll al mapa se hace acá.
      window.history.pushState(null, "", MAP_CTA.href)
      scrollToAnchor(target.hash)
    } else navigate(MAP_CTA.href) // RouteEffects hace el scroll al llegar
  }

  return (
    <div id={id} className="mobile-menu" hidden={hidden}>
      <form className="mobile-search" role="search" onSubmit={submit}>
        <label className="sr-only" htmlFor={inputId}>
          Buscá una huerta, feria o parque
        </label>
        <Icon name="search" size={20} />
        <input
          id={inputId}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder="Buscá una huerta, feria o parque"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button type="submit" aria-label="Buscar en el mapa">
          <Icon name="arrow" size={20} />
        </button>
      </form>
      <nav aria-label="Navegación principal">
        <ul className="mobile-nav">
          {NAV_ITEMS.map((item) => {
            const current = item.activeOn !== undefined && item.activeOn === pageId
            if (!item.children) {
              return (
                <li key={item.label}>
                  <AppLink href={item.href} aria-current={current ? "page" : undefined} onClick={onClose}>
                    {item.label}
                  </AppLink>
                </li>
              )
            }
            const expanded = openSection === item.label
            const subId = `${id}-${item.label.replace(/\s+/g, "-").toLowerCase()}`
            return (
              <li key={item.label} className={expanded ? "is-expanded" : undefined}>
                <div className="mobile-nav-row">
                  <AppLink href={item.href} aria-current={current ? "page" : undefined} onClick={onClose}>
                    {item.label}
                  </AppLink>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={subId}
                    aria-label={`${expanded ? "Ocultar" : "Mostrar"} secciones de ${item.label}`}
                    onClick={() => setOpenSection(expanded ? null : item.label)}
                  >
                    <Icon name="chevron" size={20} />
                  </button>
                </div>
                <ul id={subId} hidden={!expanded}>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <AppLink href={child.href} onClick={onClose}>
                        {child.label}
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pageId = usePageId()
  const [path] = useLocation()
  const menuId = useId()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  // Menú mobile: se cierra con Esc (devolviendo el foco al botón), con un click afuera y al navegar.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [menuOpen])

  useEffect(() => setMenuOpen(false), [path])

  return (
    <header className="site-header" ref={headerRef}>
      <div className="header-inner">
        <AppLink className="brand-link" href="/" aria-label="Programa de Agricultura Urbana de Rosario: ir al inicio">
          <img src={logoCrema} alt="" width={174} height={60} />
        </AppLink>
        <nav className="main-nav" aria-label="Navegación principal">
          <ul>
            {NAV_ITEMS.map((item) => {
              const current = item.activeOn !== undefined && item.activeOn === pageId
              return item.children ? (
                <NavDropdown key={item.label} item={item} current={current} />
              ) : (
                <li key={item.label} className="nav-item">
                  <AppLink className="nav-link" href={item.href} aria-current={current ? "page" : undefined}>
                    {item.label}
                  </AppLink>
                </li>
              )
            })}
          </ul>
        </nav>
        <AppLink className="header-cta" href={MAP_CTA.href}>
          <span className="header-cta-long">{MAP_CTA.label}</span>
          <span className="header-cta-short">{MAP_CTA.shortLabel}</span>
          <Icon name="arrow" size={18} className="header-cta-arrow" />
          <Icon name="location" size={20} className="header-cta-pin" />
        </AppLink>
        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-controls={menuId}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={26} strokeWidth={1.4} />
        </button>
      </div>
      {/* `key`: al abrirse, el buscador toma la búsqueda actual del mapa. */}
      <MobileMenu
        key={menuOpen ? "open" : "closed"}
        id={menuId}
        hidden={!menuOpen}
        pageId={pageId}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  )
}
