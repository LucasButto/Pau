# PAU Rosario: cambios v2 (rediseño "web nueva")

> **Para Claude Code.** Este documento es la especificación completa de la segunda ronda de cambios del sitio del Programa de Agricultura Urbana (PAU) de Rosario. Leelo entero antes de tocar código. Cuando llegues a cada sección, **abrí con la herramienta Read las imágenes que menciona** (están en `docs/cambios-v2/img/`): son la referencia visual obligatoria. Trabajá de forma autónoma; solo frená si algo de la sección "Decisiones abiertas" bloquea por completo una tarea (en ese caso usá el valor por defecto que se indica y seguí).

---

## 0. Reglas de juego

1. **El resultado es una MEZCLA del sitio actual y del diseño nuevo, más parecida al diseño nuevo.**
   - El **look & feel y la estructura** salen del PDF de la diseñadora (`docs/cambios-v2/web-nueva.pdf`, recortado por sección en `docs/cambios-v2/img/01…10`): paleta, tipografía, texturas, header, footer, orden de secciones y página "Sobre nosotros".
   - El **contenido y las funciones del sitio actual se conservan**: solo se cambia o se saca lo que este documento indica explícitamente. Si algo del sitio actual no aparece en el PDF y este documento no dice que se va, **se queda**, adaptado al estilo nuevo.
   - La sección 1.1 tiene la lista completa de qué se conserva, qué cambia y qué se agrega. Ante cualquier duda, gana esa tabla.
2. Las imágenes `13…15` ("eso me gusta") son agregados puntuales que el cliente pidió sumar. El resto son referencias de apoyo. Cuando el texto dice algo como `img/02b`, se refiere al archivo de `docs/cambios-v2/img/` que empieza con ese número (por ejemplo `img/02b-inicio-mapa-detalle.jpg`). Todas las rutas `assets/…` son relativas a `docs/cambios-v2/`.
3. **Fuente de verdad técnica:** el código actual de este repo. Ya tiene mapa real con MapLibre + OpenFreeMap, hooks de búsqueda y geolocalización, plugin de SEO, configuración de links, accesibilidad y responsive trabajados. **Se construye sobre esto. No se rehace de cero.**
4. **El mapa real se mantiene.** Ni el PDF ni el Figma tienen un mapa real: el PDF muestra una captura estática y el Figma un dibujo. **No reemplaces el mapa de MapLibre por ninguna imagen o ilustración.** Solo cambian su estilo visual y la disposición del módulo (sección 5.2).
5. **El Figma Make NO es la nueva versión de la página ni código para copiar.** La "Version 3" la generó la IA de Figma a partir del PDF, sobre el código viejo (mapa SVG dibujado, sin MapLibre). De ahí **solo** se toman las tres partes que al cliente le gustaron, ya capturadas en `img/13`, `img/14` y `img/15`. Ni su estructura, ni su código, ni sus textos (los institucionales los inventó la IA; los oficiales son los del PDF y están transcriptos en este documento).
6. **No inventes contenido**: ni URLs, ni datos de lugares, ni logos de auspiciantes, ni textos institucionales. Lo que falta va a un archivo de contenido centralizado, con `TODO` y un placeholder digno. La lista completa está en la sección 11.
7. **Antes de empezar:** este proyecto **no es un repositorio git**. Corré `git init`, revisá `.gitignore` (que excluya `node_modules`, `dist` y `.env*` salvo `.env.example`) y hacé un commit inicial `chore: estado previo a cambios v2`. Después trabajá en una rama `cambios-v2` con commits chicos por sección.
8. Respetá `AGENTS.md` y no toques `.figma/` ni los plugins de Figma Make en `vite.config.ts`.

---

## 1. Resumen: qué cambia

| Zona | Hoy | Después |
|---|---|---|
| Sitio | Una sola página (landing) | **Dos páginas** con navegación: "Raíces Vecinas" (mapa) y "Sobre nosotros" (institucional) |
| Header | Logo PAU + badge PLANTATE + 3 anclas + CTA "Encontrá tu huerta" | Barra verde oliva del PDF con el logo "Programa de AGRICULTURA URBANA", menú **Inicio / Sobre nosotros ▾ / Semillero digital** y **se mantiene el botón "Encontrá tu huerta"**. La lupa y el menú hamburguesa del PDF **no van en la barra en desktop** (sección 4.2) |
| Hero | "PLANTATE. No seas nabo." + collage viejo + buscador | Composición del PDF (texto a la izquierda, collage nuevo a la derecha, bajada y botón "Explorá el mapa"), pero **el titular grande sigue siendo "PLANTATE. No seas nabo."**. "Raíces Vecinas" queda como antetítulo |
| Mapa | Oscuro (cianotipia), directorio en lista + ficha flotante, pestañas Lista/Mapa en mobile | **El mismo mapa real**, ahora **claro** (crema/salvia/oliva) dentro de una tarjeta. Arriba: buscador "Buscá por nombre" + filtros. Izquierda: **la ficha completa del lugar seleccionado** (sin lista larga). Derecha: mapa. Pines nuevos con íconos nuevos |
| Categorías | Parques Huerta / Ferias Semanales / Centros Agroecológicos / Puntos de Compost | **Todo / Ferias / Huertas / CAR / Parques huertas / Compost**. Se suma "Huertas" y **Compost se mantiene** |
| Impacto | Grilla de 4 números | Banda amarilla "Sembramos futuro. Cosechamos comunidad." + **una plaquita que va rotando** entre los 4 números |
| Semillero digital | 3 tarjetas de recursos (guía, calendario, fanzine) | **Carrusel de posteos de Instagram** con flechas (al pasar el mouse la imagen se tiñe de amarillo) **+ las 3 tarjetas de recursos, que se mantienen** con el estilo nuevo |
| Sobre nosotros | No existe | Página nueva: hero con foto, Quiénes somos, Nuestras propuestas, Objetivos, franja de auspiciantes |
| Footer | Cianotipia/corteza | Visual del PDF (Marrón Corteza), **conservando todos los links y datos del footer actual** |
| Tipografía | Bricolage Grotesque + DM Sans | **Pacaembu** (Regular, Semibold, Bold, Extrabold) en todo el sitio |
| Paleta | Valores viejos | **Valores oficiales nuevos** (sección 3.1) |
| Textura | Grilla/puntos | **Textura topográfica** (líneas de nivel) en fondos de sección |

### 1.1 Qué se conserva, qué cambia y qué se agrega

| Elemento del sitio actual | Decisión | Detalle |
|---|---|---|
| Mapa real MapLibre (zoom, clusters, geolocalización, distancias, `fitBounds`, `flyTo`, errores, carga diferida) | ✅ **Se conserva** | Cambia solo el estilo (claro) y la disposición del módulo (5.2) |
| Logo + menú + botón "Encontrá tu huerta" del header | ✅ **Se conserva**, con el estilo del PDF | Menú: Inicio / Sobre nosotros ▾ / Semillero digital (4.2) |
| Titular "PLANTATE. No seas nabo." | ✅ **Se conserva grande** | Con el tratamiento tipográfico del PDF (5.1) |
| Ficha completa del lugar (categoría, abierto hoy, nombre, dirección, distancia, horario, huerteros, días de apertura, "Cómo llegar") | ✅ **Se conserva completa** | Pasa a la columna izquierda del módulo del mapa (5.2) |
| Categoría y filtro de Compost (y su punto en los datos) | ✅ **Se conserva** | Como 6.ª categoría, con pin propio (5.2) |
| Tarjetas de recursos (La Huerta del m², Estación × Estación, Basura Cero) | ✅ **Se conservan** | Dentro de "Semillero digital", debajo del carrusel, con el estilo nuevo (5.4) |
| Los 4 números de impacto | ✅ **Se conservan** | En formato plaquita que rota (5.3) |
| Newsletter (validación, estados, endpoint por `.env`) | ✅ **Se conserva** | Estilo del PDF (5.5) |
| Links del footer (Nuestra historia, Contacto, Privacidad, Accesibilidad) y línea "Municipalidad de Rosario · Cátedra Spiaggi / Garat FAPyD UNR" | ✅ **Se conservan** | Reacomodados en el footer del PDF (5.5) |
| Bajadas de texto actuales ("Una cartografía viva…", "Ideas, herramientas y saberes…") | ✅ **Se conservan** | Como bajadas de sus secciones |
| Temporada dinámica ("Temporada de primavera") | ✅ **Se conserva** | En la fila de frases superiores (4.3) |
| Directorio en lista larga + orden + pestañas Lista/Mapa | ❌ **Se va** (lo pidió el cliente) | La búsqueda con sugerencias lo reemplaza (5.2) |
| Buscador y filtros dentro del hero | 🔁 **Se mudan** | Viven en el módulo del mapa ("buscar arriba, con los filtros arriba", como pidió el cliente) |
| Collage viejo (fotos de stock, sol, grilla, sello "Cultivar es político", coordenadas) | 🔁 **Se reemplaza** | Por el collage nuevo que mandaron |
| Badge "PLANTATE" del header | 🔁 **Se reemplaza** | El eslogan ya está en el titular y en las frases superiores |
| Mapa oscuro cianotipia | 🔁 **Se reemplaza** | Por el estilo claro del PDF |
| Grilla de impacto | 🔁 **Se reemplaza** | Por la plaquita rotativa |
| — | ➕ **Se agrega** | Página "Sobre nosotros", carrusel de Instagram, frases superiores, banda "Más de dos décadas", CTA "Hay una huerta", franja de auspiciantes, textura, tipografía y paleta nuevas |

Vista general del diseño completo (abrilas primero):

- `img/00-diseno-pagina-raices-vecinas-completa.jpg`
- `img/00-diseno-pagina-sobre-nosotros-completa.jpg`

---

## 2. Material entregado (en `docs/cambios-v2/`)

| Archivo | Qué es | Uso |
|---|---|---|
| `web-nueva.pdf` | Diseño original (Illustrator, 2 páginas de 1920 px de ancho) | Referencia de medidas, textos y colores |
| `img/01…10-*.jpg` | Recortes del PDF por sección | Referencia visual por sección |
| `img/02b-inicio-mapa-detalle.jpg` | Módulo del mapa en alta | Detalle de filtros, ficha y pines |
| `img/11-pines-referencia.jpg` | Los 4 pines del diseño ampliados | Forma, color e ícono de cada pin |
| `img/12-plaquitas-numeros-que-rotan.jpeg` | Las 4 plaquitas de números | Contenido y estilo del bloque que rota |
| `img/13-gusta-cta-hay-una-huerta.jpeg` | Bloque CTA que gustó (Figma V3) | Agregar (sección 6.8) |
| `img/14-gusta-banda-dos-decadas.jpeg` | Banda "Más de dos décadas…" que gustó | Agregar (sección 6.2) |
| `img/15-gusta-header-y-frases-superiores.jpeg` | Frases chicas arriba del hero (subrayadas en celeste) e indicador de página activa | Agregar (secciones 4.3 y 5.1) |
| `img/16-paleta-oficial.jpeg` | Paleta oficial con CMYK/RGB/HEX | Tokens de color |
| `img/17-referencia-estilo-mapa.jpg` | Mapa base que usó la diseñadora (en grises) | Referencia de densidad y jerarquía de calles del mapa claro |
| `assets/logos/logo-horizontal-crema.png` | Logo "Programa de / AGRICULTURA / URBANA 🌿" en crema | Header y footer (sobre fondos oscuros) |
| `assets/logos/logo-horizontal-verde.png` | Mismo logo en Verde CAR | Sobre fondos claros |
| `assets/logos/logo-vertical-crema.png` / `-verde.png` | Logo vertical (hoja arriba) | OG image, usos centrados |
| `assets/logos/logo-hoja-crema.png` / `-verde.png` | Isotipo (solo la hoja) | Favicon, íconos de app, decoración |
| `assets/collage/collage-hero.png` + `.webp` + `-600.webp` | Collage del hero (versión usada en el diseño) | Hero de "Raíces Vecinas" |
| `assets/collage/collage-hero-alto.png` + `.webp` + `-600.webp` | Collage con una fila extra abajo | Alternativa, por ejemplo para mobile |
| `assets/textura/textura-topografica-mascara.webp` / `.png` | Textura de líneas de nivel extraída del PDF, como **máscara** (blanco + alfa) | Fondo texturado de secciones (sección 3.4) |
| `assets/fotos/foto-huerta-sobre-nosotros.jpg` | Foto del hero de "Sobre nosotros" y de Objetivos (870×580, **baja resolución**) | Provisoria hasta tener la original |
| `assets/fotos/foto-molino-blanco.jpg` | Foto real del Parque Huerta Molino Blanco | Ficha de Molino Blanco en el mapa |
| `assets/semillero/ig-*.jpg` | 2 portadas de posteos de Instagram (del PDF, 609×761) | Carrusel Semillero digital (provisorias) |

Copiá a `src/assets/` (o `public/` si corresponde) **solo lo que uses**, optimizado: WebP/AVIF, tamaños responsive, `width`/`height` declarados. No dejes PNG de 2 MB en producción.

---

## 3. Sistema visual

### 3.1 Paleta oficial (reemplaza la anterior)

Abrí `img/16-paleta-oficial.jpeg`.

| Token | Nombre | HEX | RGB |
|---|---|---|---|
| `--color-verde-car` | Verde CAR | `#6A7332` | 106, 115, 50 |
| `--color-amarillo-6pm` | Amarillo 6PM | `#F2A111` | 242, 161, 17 |
| `--color-blanco-ajito` | Blanco Ajito | `#F8F8E1` | 248, 248, 225 |
| `--color-azul-cianotipia` | Azul Cianotipia | `#133E45` | 19, 62, 69 |
| `--color-marron-corteza` | Marrón Corteza | `#4F2C15` | 79, 44, 21 |

- Actualizá `@theme` en `src/index.css` y `src/lib/palette.ts` (que deben seguir coincidiendo).
- Podés derivar tonos con `color-mix()`: hover, bordes, fondos de chips (en el diseño, los chips y el buscador usan un crema un poco más oscuro, aprox. `#E7E8D0`), crema translúcido de la plaquita, etc.
- Eliminá los tokens que ya no corresponden: compost violeta, `cyan` viejo, `mustard` viejo, `sage`, etc. Buscá todos los usos antes de borrarlos.

**Contraste (WCAG AA), medido con los valores oficiales:**

| Texto / Fondo | Ratio | Uso permitido |
|---|---|---|
| Blanco Ajito sobre Verde CAR | 4,74 | ✅ texto normal y grande |
| Verde CAR sobre Blanco Ajito | 4,74 | ✅ texto normal y grande |
| Azul Cianotipia sobre Blanco Ajito | 10,8 | ✅ |
| Azul Cianotipia sobre Amarillo 6PM | 5,48 | ✅ |
| Marrón Corteza sobre Amarillo 6PM | 5,8 | ✅ |
| Amarillo 6PM sobre Marrón Corteza | 5,8 | ✅ (títulos del footer) |
| **Blanco Ajito sobre Amarillo 6PM** | **1,97** | ❌ **no pasa ni para títulos grandes** |
| Verde CAR sobre Amarillo 6PM | 2,4 | ❌ |

> En el diseño, "Sembramos futuro. Cosechamos comunidad." y la plaquita de números están en crema sobre amarillo, y eso no se lee bien. **Por defecto, usá Azul Cianotipia para el texto sobre amarillo**, como hace el propio diseño en "Nuestras propuestas". Dejalo como una variable fácil de cambiar y anotalo en el informe como desvío consciente.

### 3.2 Tipografía: Pacaembu

- El diseño usa **Pacaembu** en todo el sitio (confirmado en el PDF): **Regular, Semibold, Bold y Extrabold**. La diseñadora indicó Extrabold para títulos y Regular para texto.
- **Los archivos de la fuente todavía no están en el repo.** Prepará todo para que, al agregarlos, funcione sin tocar código:
  - Carpeta `public/fonts/pacaembu/` con `Pacaembu-Regular.woff2`, `Pacaembu-Semibold.woff2`, `Pacaembu-Bold.woff2` y `Pacaembu-Extrabold.woff2` (agregá un `README.md` en esa carpeta explicando qué archivos van y que requieren licencia web).
  - Declaraciones `@font-face` (400, 600, 700, 800) con `font-display: swap`.
  - `<link rel="preload">` de Regular y Extrabold **solo si los archivos existen**. Que no queden 404 en consola: hacelo condicional en el build o dejalo comentado con instrucciones.
- **Fallback mientras tanto: `Outfit`** (Google Fonts, 400/600/700/800). Es la que usó la versión del Figma que les gustó, así que lo que van a ver se parece a eso.
  - Pila: `"Pacaembu", "Outfit", ui-sans-serif, system-ui, sans-serif`.
  - Una sola familia para títulos y texto.
- Eliminá Bricolage Grotesque y DM Sans (imports, tokens y referencias).
- No uses `letter-spacing` negativo extremo. Títulos en mayúsculas con tracking ~0.01–0.02em; textos chicos en mayúsculas (kicker, metadatos) con ~0.08em.

### 3.3 Escala tipográfica

Medida sobre el PDF (artboard de 1920 px), con los tamaños que indicó la diseñadora (títulos ~60, texto ~25). Escalá con `clamp()`; los valores de 1920 son el máximo.

| Rol | Ejemplo | @1920 | Peso | `clamp()` sugerido |
|---|---|---|---|---|
| H1 hero Raíces Vecinas | "RAÍCES / VECINAS", como en el PDF (*corregido por la clienta: el eslogan pasó a ser el antetítulo*) | ~110 px, mayúsculas | 800 | `clamp(56px, 5.7vw, 110px)` |
| Antetítulo del hero | "PLANTATE. NO SEAS NABO." (el eslogan) | ~22 px, mayúsculas, tracking 0.12em | 800 | `clamp(14px, 1.15vw, 22px)` |
| H1 hero Sobre nosotros | "AGRICULTURA URBANA" | ~95 px ("Programa de" ~70 px, 400) | 800 | `clamp(48px, 5vw, 95px)` |
| H2 de sección | "El PAU está más cerca…", "Sembramos futuro…", "Semillero digital" | ~60 px | 700–800 | `clamp(34px, 3.125vw, 60px)` |
| H2 institucional | "QUIÉNES SOMOS", "NUESTRAS PROPUESTAS", "OBJETIVOS" | ~90 px, mayúsculas | 800 | `clamp(40px, 4.7vw, 90px)` |
| Bajada / cuerpo | párrafos de Quiénes somos, bajadas | ~25 px | 400 (con 600 para destacados) | `clamp(17px, 1.3vw, 25px)`, `line-height: 1.45` |
| Bajada del hero | "Soberanía alimentaria…" | ~22 px | 600 la primera frase, 400 el resto | `clamp(16px, 1.15vw, 22px)` |
| Nombre del lugar (ficha) | "Molino Blanco" | ~30 px | 700 | `clamp(20px, 1.6vw, 30px)` |
| Nav, botones, chips | "Inicio", "Explorá el mapa", "Ferias" | ~19 px | 600 | `clamp(15px, 1vw, 19px)` |
| Metadatos | dirección, horario, distancia | ~15–16 px | 400 / 700 mayúsculas en distancia | `clamp(13px, .85vw, 16px)` |
| Footer | textos y links | ~16 px; títulos de columna ~15 px 800 mayúsculas | | |
| Legal | "© 2026 PAU Rosario" | ~14 px | | |

**Mínimo absoluto: 13 px.** Hoy hay muchos textos de 11 px en el sitio; ninguno debería quedar así.

### 3.4 Textura topográfica

Todas las secciones del diseño tienen de fondo una textura de **líneas de nivel** del mismo tono, apenas más clara u oscura que el color de la sección: crema sobre crema, oliva claro sobre oliva, amarillo claro sobre amarillo. Abrí `img/01`, `img/03` y `img/07`.

- Usá **una sola imagen**, `assets/textura/textura-topografica-mascara.webp`. Es blanca con transparencia, pensada como máscara.
- Implementá una utilidad CSS (por ejemplo `.has-topo`) con un pseudo-elemento `::before`:
  - `background-color: var(--topo-color)`
  - `mask-image: url(...)` (con su versión `-webkit-mask-image`)
  - `mask-size: cover` o un tamaño fijo grande, `mask-repeat` según convenga
  - `opacity: var(--topo-opacity)`
  - `pointer-events: none` y `z-index` debajo del contenido
- Variables por sección. Valores de partida, ajustalos comparando con las capturas:
  - Crema: líneas `#FFFFF0`, opacidad ~0,6.
  - Oliva: líneas `#8A9446` (oliva más claro), opacidad ~0,7.
  - Amarillo: líneas `#F8BE45`, opacidad ~0,55.
- Variá la posición (`mask-position`) entre secciones para que no se note la repetición.
- Debe ser decorativa (`aria-hidden`), sin afectar el LCP; cargala con `image-set` o como recurso de baja prioridad.
- Probá que no haya problemas de rendimiento al hacer scroll en mobile (evitá `background-attachment: fixed`).
- Reemplaza la grilla/puntos actual de los fondos.

### 3.5 Layout, radios y espaciado

- Contenedor: `max-width: 1360px` (en el diseño el contenido arranca en x≈282 de 1920), con `padding-inline: clamp(20px, 5vw, 80px)`.
- Padding vertical de secciones: `clamp(56px, 6.25vw, 120px)`.
- Radios:
  - Tarjeta del mapa: 16–20 px.
  - Botones: 12 px (**rectángulo redondeado, no píldora**: mirá "Explorá el mapa").
  - Chips de filtro y buscador: 10–12 px.
  - Plaquita de números: 24 px.
  - Foto de Objetivos: radio grande (~80 px) en las esquinas izquierdas, pegada al borde derecho de la pantalla.
- Fotos de lugares y del collage en **blanco y negro** (como en el diseño). Usá `filter: grayscale(1)` donde la imagen original sea a color.
- Sin sombras duras ni bordes laterales de color (el informe `.impeccable` ya marcó esos patrones).

### 3.6 Logos y favicon

- Header y footer: `logo-horizontal-crema`. Alto aprox. 56–64 px en desktop y 40–44 px en mobile. Como link al inicio, con `aria-label`.
- Favicon, `apple-touch-icon` e íconos del `site.webmanifest`: regeneralos desde `logo-hoja-verde.png` (la hoja sola), con fondo Blanco Ajito para los que lo necesiten. Actualizá `theme_color` a Verde CAR.
- `og-image.png` (1200×630): regenerala con la nueva identidad (fondo crema con textura, logo vertical verde, "PLANTATE. No seas nabo."). Si no podés generarla bien, dejá un `TODO`.
- Si en algún momento llegan los logos en SVG, preferirlos (dejalo anotado).

---

## 4. Arquitectura: páginas, rutas y navegación

### 4.1 Rutas

Agregá ruteo del lado del cliente (`react-router` en modo declarativo, o `wouter` si preferís algo más liviano: justificalo). Configuración por defecto (**opción A**, la del PDF):

| Ruta | Página | Contenido |
|---|---|---|
| `/` | **Raíces Vecinas** (en el menú: "Inicio") | Hero, mapa, Sembramos futuro, Semillero digital |
| `/sobre-nosotros` | **Sobre nosotros** | Hero institucional, historia, Quiénes somos, Propuestas, Objetivos, auspiciantes |
| `*` | 404 con la identidad del sitio y link al inicio | |

> **Decisión abierta (el cliente lo está definiendo):** puede que quieran que la página institucional sea la principal (**opción B**: `/` = institucional y `/raices-vecinas` = mapa). Hacé que cambiar entre A y B sea **una sola constante** en `src/config/site.ts` (por ejemplo `HOME_PAGE: "raices-vecinas" | "institucional"`). De ahí deben salir las rutas, los textos del menú, los links del footer, el sitemap y los canonical. Dejá implementada y probada la opción A, y verificá que la B también compile y navegue.

Requisitos de ruteo:

- Anclas dentro de páginas: `#mapa`, `#semillero-digital`, `#que-es-el-pau`, `#historia`, `#labor`. Un link a `/#mapa` desde otra página debe navegar y luego hacer scroll al ancla, compensando el header sticky (`scroll-margin-top`).
- Al cambiar de página: scroll arriba, foco al `<h1>` o al `<main>`, y `document.title` + `meta description` propios de cada página.
- **Vercel**: el sitio se publica ahí. Agregá `vercel.json` con un rewrite de SPA a `/index.html` para que recargar `/sobre-nosotros` no dé 404.
- **SEO**: el plugin `vite-plugins/seo.ts` hoy genera un `sitemap.xml` solo con `/`. Hay que:
  - Agregar `/sobre-nosotros` (o las rutas que correspondan según A/B) al sitemap.
  - Generar en el build un `dist/sobre-nosotros/index.html` a partir de `index.html`, con su `<title>`, `description`, `canonical` y `og:*` propios, para que los buscadores y WhatsApp vean metadatos correctos sin ejecutar JS.
  - Mantener la regla actual de que no quede la palabra "figma" en lo publicado.
- El mapa (MapLibre) debe seguir cargándose de forma diferida y **solo en la página que lo usa**: no lo importes desde la página institucional.
- Al pasar a dos páginas, actualizá `config/links.ts`: "Nuestra historia" ahora tiene destino interno real (`/sobre-nosotros#historia`). "Contacto", "Privacidad" y "Accesibilidad" siguen pendientes, con el patrón "Próximamente" que ya existe.

### 4.2 Header (ambas páginas)

Abrí `img/01-inicio-header-hero.jpg`, `img/06-sobre-hero-y-dropdown.jpg` y `img/15-gusta-header-y-frases-superiores.jpeg`.

- Barra **Verde CAR**, sticky, alto ~72–80 px en desktop y ~64 px en mobile. Sin borde inferior marcado.
- Izquierda: `logo-horizontal-crema`.
- Derecha: menú en Blanco Ajito, peso 600:
  - **Inicio**
  - **Sobre nosotros** ▾ (desplegable): **¿Qué es el PAU?** → `/sobre-nosotros#que-es-el-pau` · **Historia** → `/sobre-nosotros#historia` · **Labor** → `/sobre-nosotros#labor`
  - **Semillero digital** → `/#semillero-digital`
- Al final, **el botón "Encontrá tu huerta" →** (se conserva del header actual; al cliente le gusta tener ese llamado a la acción arriba de todo).
  - Lleva a `/#mapa` desde cualquier página.
  - Estilo para que resalte sobre el oliva: fondo **Amarillo 6PM**, texto **Marrón Corteza** (contraste 5,8 ✅), peso 700, radio 12 px (mismo radio que los demás botones del PDF), flecha →. Hover: amarillo apenas más oscuro.
  - En pantallas chicas usá la etiqueta corta "Ver mapa", como ya hace el header actual.
- **La lupa y el menú hamburguesa del PDF NO van en la barra en desktop.** El cliente prefiere que el header quede limpio: logo, menú y botón. Esas dos funciones van a otro lado:
  - **Buscar**: la búsqueda principal es la del módulo del mapa ("Buscá por nombre", sección 5.2), a la que lleva el botón "Encontrá tu huerta". En mobile, además, el menú desplegable incluye arriba un campo "Buscá una huerta, feria o parque" que lleva a `/#mapa` con la búsqueda ya aplicada (reutilizá la lógica de `useDirectory`).
  - **Menú hamburguesa**: solo existe en mobile y tablet, donde el menú no entra en la barra.
- **Página activa**: indicador como en `img/15` (subrayado/píldora corta debajo del item activo y peso más fuerte). Usá `aria-current="page"`.
- **Desplegable "Sobre nosotros"**: como en `img/06`, un panel oliva más oscuro, con algo de transparencia, debajo del item y con los 3 links centrados.
  - Se abre con hover (mouse) **y** con click/Enter/Espacio. Se cierra con Esc, click afuera o al perder el foco.
  - `aria-expanded` y `aria-controls`; flechas ↑↓ para moverse entre opciones.
  - En touch, el primer toque abre y el segundo navega.
  - Agregá un chevron ▾ que rote al abrir (como en `img/15`).
- **Header en mobile y tablet (<1024 px)**: logo + botón corto "Ver mapa" + ícono de hamburguesa (líneas finas, crema).
  - La hamburguesa abre un panel desplegable con: el campo de búsqueda, Inicio, Sobre nosotros (como acordeón con sus 3 sub-links) y Semillero digital.
  - Se cierra con Esc, click afuera y al navegar (la lógica de cierre del `Header.tsx` actual sirve).
  - Si a 360 px no entran logo + botón + hamburguesa, el botón pasa a ser solo ícono, con `aria-label`.
- Eliminá del header: el badge "PLANTATE" (el eslogan ya está en el titular y en las frases superiores).

### 4.3 Frases superiores (agregado que gustó)

Abrí `img/15` (lo subrayado en celeste es lo que les gustó).

- Una fila fina **debajo del header y arriba del hero de Raíces Vecinas**:
  - A la izquierda: **"ROSARIO, UNA CIUDAD QUE CULTIVA"**.
  - A la derecha: en `img/15` dice "PLANTATE. NO SEAS NABO.", pero como ese eslogan ahora es el titular grande del hero, acá no se repite. Va la temporada dinámica que ya existe en el hero actual (`seasonInRosario()` en `lib/schedule.ts`): **"TEMPORADA DE PRIMAVERA · ROSARIO, SANTA FE"**, con la estación del momento.
- Mayúsculas, ~13–14 px, peso 700, tracking ~0.08em, color Azul Cianotipia o Verde CAR, con una línea fina debajo de todo el ancho del contenedor.
- En mobile, si no entran, mostrá solo la frase de la izquierda o apilalas centradas.

---

## 5. Página "Raíces Vecinas" (`/` en la opción A)

### 5.1 Hero

Abrí `img/01-inicio-header-hero.jpg`.

- Fondo **Blanco Ajito con textura topográfica crema**. Ocupa aproximadamente la primera pantalla en desktop.
- Columna izquierda. Composición y estilo exactos del PDF, pero **con el titular del sitio actual** (el cliente quiere conservar "PLANTATE. No seas nabo." grande):
  - Antetítulo **"RAÍCES VECINAS"** (Extrabold, mayúsculas, tracking amplio, Verde CAR, con un trazo corto delante). Así se conserva el nombre de la sección que el PDF usaba como titular.
  - `<h1>` en dos líneas, con el tratamiento tipográfico de "RAÍCES / VECINAS" del PDF:
    - **"PLANTATE."** en Blanco Ajito dentro de un **bloque rectangular Verde CAR**. El bloque sobresale un poco hacia la izquierda respecto del texto, como el de "VECINAS" en el diseño.
    - **"NO SEAS NABO."** en Verde CAR, Extrabold, mayúsculas.
    - Si en algún ancho "NO SEAS NABO." no entra en una línea, que corte entre palabras sin achicar el texto por debajo del mínimo de la escala.
  - Bajada en Verde CAR: **"Soberanía alimentaria a la vuelta de tu casa:"** (peso 600) + " descubrí la red de huertas, parques agroecológicos y ferias de Rosario." (peso 400).
  - Botón **"Explorá el mapa"**: fondo Verde CAR, texto crema, radio 12 px. Lleva a `#mapa` con scroll suave (respetando `prefers-reduced-motion`).
- Columna derecha: **collage** (`assets/collage/collage-hero.webp`, con transparencia).
  - Es la imagen LCP: `fetchpriority="high"`, sin `loading="lazy"`, con `width`/`height`.
  - Usá `<picture>` con la versión `-600` para pantallas chicas.
- **El collage ya trae fondo beige propio dentro del PNG.** Verificá cómo queda sobre el Blanco Ajito con textura. Si se ve un recuadro de otro tono, consultá el PNG (puede que el fondo sea transparente y lo beige sea parte de la ilustración) y ajustá; no lo tapes con otro fondo.
- Debajo del hero: una **banda Verde CAR con textura oliva** (alto ~ `clamp(56px, 6.5vw, 125px)`) que funciona como transición hacia la sección del mapa (también oliva).
- Mobile: texto arriba y collage abajo (ancho completo, máx. ~520 px). "PLANTATE." con su bloque no debe desbordar a 320 px.
- Del hero viejo se reemplazan el collage armado con fotos de stock (sol, grilla, hojas, sello "Cultivar es político", coordenadas y caption), que se cambia por el collage nuevo, y el buscador con filtros, que se muda al módulo del mapa (5.2). **El titular se conserva**, como se describió arriba.

### 5.2 Mapa: "El PAU está más cerca de lo que pensás"

Abrí `img/02-inicio-mapa.jpg`, `img/02b-inicio-mapa-detalle.jpg`, `img/11-pines-referencia.jpg` y `img/17-referencia-estilo-mapa.jpg`.

**Lo que pidió el cliente, textual:** que no haya dos partes (lista larga de un lado y ficha del otro). Que quede **solo el panel del lado izquierdo**, y que **al hacer click en los iconitos (pines) aparezca la info en ese lado**. Que se pueda **buscar por nombre arriba** y que **arriba estén los botones de filtro**.

#### Estructura

- Sección con fondo **Verde CAR + textura oliva**, `id="mapa"`.
- Título H2 en Blanco Ajito: **"El PAU está más cerca de lo que pensás"**. Ojo: el PDF dice "de lo qué pensas", es un error; va **"de lo que pensás"**.
- Debajo del título, se conserva la bajada actual del mapa, en Blanco Ajito, peso 400, tamaño de bajada: "Una cartografía viva para encontrar alimentos sanos, proyectos colectivos y manos que cultivan otra ciudad posible."
- Debajo, una **tarjeta Blanco Ajito** (radio 16–20 px) con:
  1. **Barra superior**, dentro de la tarjeta:
     - A la izquierda, el buscador **"Buscá por nombre"** con ícono de lupa (fondo crema oscuro `~#E7E8D0`, radio 10–12 px).
     - A la derecha, los chips **Todo · Ferias · Huertas · CAR · Parques huertas · Compost**: los 5 del PDF más Compost, que se conserva del sitio actual. Chip activo: Verde CAR con texto crema. Inactivos: crema oscuro con texto Verde CAR.
     - Sugerencia (opcional, anotala si la hacés): un punto de 8 px del color de la categoría dentro de cada chip, para que los chips funcionen además como leyenda de los pines.
  2. **Cuerpo en dos columnas:**
     - **Izquierda (~30%, mín. 300 px, máx. 380 px): solo la ficha del lugar seleccionado**, sin lista.
     - **Derecha: el mapa**, ocupando todo el resto. Alto ~ `clamp(480px, 40vw, 680px)` (un poco más que en el PDF, porque la ficha completa tiene más datos).

#### Ficha (columna izquierda)

Es la **ficha completa actual** (`PlaceDetail.tsx`), con **todos sus datos**, rearmada con el estilo del PDF y ubicada en la columna izquierda en vez de flotar sobre el mapa. De arriba hacia abajo:

- **Foto del lugar** en blanco y negro, a todo el ancho de la columna. En el PDF es vertical (3:4); como ahora la ficha tiene más datos, usá aprox. 4:3 para que todo entre.
- Fila con la **etiqueta de categoría** y el estado **"Abierto hoy" / "Abre el {día}"** (ya existe en `lib/schedule.ts`).
- Ícono redondo de la categoría (círculo del color de la categoría con el ícono en crema) + **nombre** (Bold, Verde CAR). Es el estilo del PDF ("Molino Blanco").
- Bloque de datos con fondo crema un poco más oscuro, como en el PDF:
  - 📍 dirección
  - **DISTANCIA DESDE EL CENTRO** en mayúsculas y bold, o "desde tu ubicación" si hay geolocalización (ya implementado)
  - 🕐 horario
- **Huerteros**: el dato `people` ("Marta, Luis y 18 familias huerteras").
- **Días de apertura**: fila LUN–SÁB con los días abiertos marcados y el día de hoy destacado, con su texto accesible (ya implementado). Restilizala con la paleta nueva: abiertos en Verde CAR con texto crema, cerrados con borde fino.
- Botón **"Cómo llegar"** (abre Google Maps en otra pestaña con `rel="noreferrer"`, como ya funciona), **fijo al pie de la columna**, para que se vea aunque el contenido scrollee. Mismo criterio que hoy: área con scroll + acción afuera.
- Si el contenido no entra en el alto del mapa, la columna scrollea por dentro (scroll fino con los colores de la paleta), nunca la página.
- El botón "Cerrar ficha" actual se va: en este diseño siempre hay un lugar seleccionado y la ficha es parte fija del módulo.
- **Estado inicial:** al cargar, queda seleccionado el primer resultado (en el diseño, Molino Blanco), o el más cercano si el usuario compartió su ubicación.
- Al cambiar filtro o búsqueda: si el seleccionado sigue en los resultados, se mantiene; si no, se selecciona el primero.
- Sin resultados: la ficha muestra un estado vacío amable ("No encontramos lugares con ese nombre. Probá con otro o elegí 'Todo'.") con botón para limpiar.
- Al cambiar de lugar, transición suave de la ficha (fade corto). Sin animación con `prefers-reduced-motion`.
- La ficha es una región con `aria-live="polite"` y un título accesible, para que los lectores de pantalla anuncien el lugar seleccionado.

#### Buscador del módulo

- Filtra los pines en vivo mientras se escribe (como hoy).
- Además, muestra un **desplegable de sugerencias** (patrón ARIA *combobox* + *listbox*) con nombre, categoría y barrio de cada coincidencia. ↑↓ para moverse, Enter para elegir, Esc para cerrar. Al elegir: se selecciona el lugar, el mapa vuela al pin y la ficha se actualiza.
- Esto **reemplaza a la lista larga** como forma accesible de recorrer los lugares con teclado: no puede faltar.
- Botón "×" para limpiar.

#### Qué se elimina del módulo actual

Solo lo que el cliente pidió sacar (la lista larga) y lo que dependía de ella:

- El directorio en lista (`Directory.tsx` y `LocationCard.tsx`, o lo que quede sin uso).
- Las pestañas "Lista | Mapa" de mobile.
- El selector de orden (solo servía para la lista).
- El contador grande de resultados (podés dejar uno chico y accesible si suma).
- La **posición** flotante de la ficha encima del mapa y su bottom sheet en mobile. **La ficha y su contenido se conservan**; solo cambian de lugar, a la columna izquierda.

#### Qué se conserva

Geolocalización y aviso de fuera de área, cálculo de distancia, `fitBounds` a los resultados, `flyTo` al seleccionar, agrupación (clusters), carga diferida del mapa, manejo de errores y ausencia de WebGL, `cooperativeGestures` en mobile, atribución de OpenFreeMap/OpenMapTiles/OSM y limpieza al desmontar.

#### Estilo del mapa: ahora es CLARO

El mapa del diseño es claro: fondo crema, calles en salvia/oliva claro, avenidas un poco más marcadas, la zona del río y el puerto en oliva-salvia, y etiquetas de calles en oliva oscuro. Mirá `img/02b` y la referencia de densidad en `img/17`.

- Cambiá el estilo base de OpenFreeMap **`dark` → `positron`**:
  - Actualizá `DEFAULT_STYLE_URL`, `.env.example` y `src/map/base-style.json` (bajá la copia nueva y revisala).
  - Rehacé la recoloración en `src/map/pauStyle.ts`.
- Colores de partida (muestreados del diseño; ajustalos comparando con `img/02b`):

| Capa | Color |
|---|---|
| Fondo / tierra | `#F6F7EE` (o Blanco Ajito `#F8F8E1`) |
| Manzanas / landuse residencial | `#EFF0D9` (muy sutil) |
| Edificios | ocultos, o `#ECEDD5` sin borde |
| Calles menores | `#DCDEC2` |
| Calles secundarias | `#CACEA3` |
| Avenidas y bulevares | `#B6BA86`, con casing `#9B9F67` |
| Autopistas / Circunvalación | `#9B9F67` |
| Vías de tren | línea punteada `#9B9F67` |
| Agua (río Paraná, puerto) | `#A1A869` (oliva-salvia, como el diseño) |
| Parques y verde | `#D9DDB4` |
| Etiquetas de calles | `#6A7332` (Verde CAR) con halo `#F8F8E1` |
| Barrios | Azul Cianotipia en mayúsculas chicas, con halo crema |
| POIs comerciales y de transporte | ocultos |

- Nombres en español (`name:es` con fallback a `name`), como ya está.
- Revisá el contraste de las etiquetas y que el mapa no compita con los pines.

#### Pines nuevos

Abrí `img/11-pines-referencia.jpg`.

- Forma: **gota clásica**, con cabeza redonda y punta abajo, **sin borde blanco**, del color de la categoría, con el **ícono lineal en Blanco Ajito** adentro. Sombra suave para despegarla del mapa.
- Asignación de categoría, color e ícono (**a confirmar con la diseñadora**, ver sección 12):

| Categoría (chip) | Color del pin | Ícono (según el diseño) |
|---|---|---|
| Parques huertas | Verde CAR `#6A7332` | brote con dos hojas sobre la tierra (el de "Molino Blanco" en la ficha) |
| Ferias | Amarillo 6PM `#F2A111` | puesto de feria con toldo y una persona |
| CAR (Centro Agroecológico Rosario) | Azul Cianotipia `#133E45` | tres hojas (como el isotipo) |
| Huertas | Marrón Corteza `#4F2C15` | planta saliendo de una maceta/cuenco de tierra |
| Compost (se conserva del sitio actual; no está en el PDF) | **Blanco Ajito** con borde Marrón Corteza de 2,5 px | ícono de compost actual (`compost` en `iconPaths.ts`) en Marrón Corteza, redibujado con el mismo trazo que los otros 4 |

- La paleta tiene 5 colores y 4 ya se usan en los pines del PDF. Por eso Compost va en crema con borde e ícono marrón: se distingue sin salirse de la paleta. Anotalo como decisión a confirmar con la diseñadora.
- **Los 4 íconos del PDF los va a mandar la diseñadora en SVG** (todavía no están). Mientras tanto:
  - Dibujalos en SVG lo más parecido posible a `img/11` (trazo ~1.5 px, puntas redondeadas) en `src/components/iconPaths.ts`.
  - Dejá un `TODO` en cada uno indicando que se reemplaza por el SVG oficial.
  - Que el reemplazo sea cambiar el path y nada más.
- **Pin seleccionado**: un poco más grande (×1,2) y con un halo crema y oliva. Siempre por encima de los demás.
- **Clusters**: círculo Verde CAR con anillo crema de 3 px y el número en crema (Bold). El tamaño crece con la cantidad. Click: zoom para abrirlo (ya implementado; solo cambia el estilo).
- Los mismos íconos se usan en el círculo de la ficha y en las sugerencias del buscador.

#### Categorías y datos

- Nuevo modelo de categorías: `"Ferias" | "Huertas" | "CAR" | "Parques huertas" | "Compost"`.
  - Rótulos largos accesibles: "Centro Agroecológico Rosario (CAR)" y "Puntos de compost".
- Migración de `src/data/locations.ts`:
  - `Parques Huerta` → `Parques huertas`
  - `Ferias Semanales` → `Ferias`
  - `Centros Agroecológicos` → `CAR`
  - `Puntos de Compost` → `Compost` (**el punto "Compost Comunitario Ludueña" se conserva**)
  - Los metadatos de SEO que mencionan compost (`index.html`) se conservan.
- "Huertas" queda **sin datos** hasta que el cliente mande la lista real. Su filtro tiene que funcionar y mostrar el estado vacío; no inventes huertas.
- **Los datos actuales de lugares son de ejemplo** (salieron del Figma). Agregá en `locations.ts` un comentario bien visible:
  - `TODO: reemplazar por la lista oficial del PAU (nombre, categoría, dirección, horario, foto)`.
  - Mantené la estructura lista para recibir más puntos (hay 7 parques huerta, 9 espacios huerta y 1 CAR según los números del sitio).
- Foto real de **Molino Blanco**: `assets/fotos/foto-molino-blanco.jpg`. El resto sigue con las fotos actuales, en blanco y negro, con `TODO`.

#### Responsive del módulo

| Ancho | Comportamiento |
|---|---|
| ≥1024 px | Como el diseño: barra arriba, ficha a la izquierda y mapa a la derecha |
| 768–1023 px | Barra con el buscador en una fila y los chips debajo (scroll horizontal si no entran). Ficha a la izquierda más angosta (~280 px), con la foto más baja |
| <768 px | Buscador a lo ancho, chips en fila con scroll horizontal (sin cortarse, con indicio de que hay más). Abajo **el mapa (alto ~60vh, mín. 360 px)** y **debajo del mapa la ficha completa**: foto apaisada (16:9) arriba, datos abajo y "Cómo llegar" a todo el ancho. Al tocar un pin, la ficha se actualiza y aparece arriba un aviso chico y accesible ("Ver ficha de {lugar} ↓") que lleva hasta ella con scroll suave. No se hace scroll automático, para no sacar al usuario del mapa |

Objetivos táctiles de al menos 44×44 px en chips, pines y controles.

### 5.3 "Sembramos futuro. Cosechamos comunidad." (plaquitas que rotan)

Abrí `img/03-inicio-sembramos-futuro.jpg` y `img/12-plaquitas-numeros-que-rotan.jpeg`.

- Banda **Amarillo 6PM con textura amarilla**.
- A la izquierda:
  - H2 **"Sembramos futuro. / Cosechamos comunidad."**
  - Bajada **"Desde 2002, el PAU transforma terrenos vacantes en espacios productivos, verdes y compartidos."** (el PDF dice "trerrenos": corregí a "terrenos").
  - Color del texto según la sección 3.1: Azul Cianotipia por defecto.
- A la derecha, **una plaquita** cuadrada (radio 24 px, fondo Blanco Ajito translúcido ~40%) que muestra **un dato por vez** y **va rotando** entre los 4:
  1. **1**: CENTRO AGROECOLÓGICO
  2. **9**: ESPACIOS HUERTA
  3. **7**: PARQUES HUERTAS
  4. **MÁS DE 155**: HUERTEROS Y HUERTERAS ("MÁS DE" chiquito arriba del número)
- Diseño de cada plaquita (ver `img/12`): número enorme en Extrabold, una **línea horizontal** debajo y el rótulo en mayúsculas Extrabold chico, centrado. Texto en Azul Cianotipia (por contraste; en el diseño está en crema).
- **Hacelo en HTML/CSS, no con un GIF ni con imágenes.** Queda nítido, pesa nada, es accesible, se puede editar el número y se adapta a cualquier pantalla. El cliente preguntó esto: la respuesta es que no hace falta que manden GIF ni imágenes.
- Comportamiento:
  - Cambia cada ~3,5 s con un fundido cruzado y un leve desplazamiento vertical (300–400 ms).
  - Pausa con hover y con foco, y cuando la sección no está en pantalla (IntersectionObserver) o la pestaña está oculta.
  - 4 indicadores (puntitos) clickeables debajo o al costado, con `aria-label` ("Ver dato 2 de 4") y botón pausa/reproducir (requisito WCAG 2.2.2 para contenido que se mueve solo).
  - Opcional: el número cuenta de 0 al valor la primera vez que aparece (solo sin reduced-motion).
  - `prefers-reduced-motion`: sin autoplay; se cambia con los puntitos.
  - Accesibilidad: el carrusel visual va con `aria-hidden="true"` y al lado hay una lista visualmente oculta con los 4 datos completos, para que el lector de pantalla los lea todos de una vez.
- Mobile (<640 px): el texto arriba y la plaquita abajo, centrada, más chica. Alternativa válida: las 4 plaquitas en grilla 2×2 sin rotar. Elegí la que se vea mejor y justificalo.
- Los datos en un array en `src/content/` (ver sección 10), fácil de editar.
- Es la nueva forma de `ImpactStats.tsx`: mismos 4 datos, nuevo formato.

### 5.4 Semillero digital: carrusel de posteos de Instagram

Abrí `img/04-inicio-semillero-digital.jpg`.

Lo que pidió el cliente: **cada imagen es un carrusel (posteo) de Instagram**. Al pasar el mouse **se pone amarilla** (la primera tarjeta del diseño muestra ese estado). Con **las flechitas se pasa para un lado y para el otro** a más posteos.

- Sección con fondo **Blanco Ajito con textura crema** y `id="semillero-digital"`.
- H2 **"Semillero digital"** en Azul Cianotipia y bajada **"Conocé lo que se está germinando."** (Azul Cianotipia, 600).
- **Carril horizontal** de tarjetas con proporción **4:5** (formato de posteo vertical de Instagram, 1080×1350):
  - Desktop: 3 visibles, separación ~16 px. Tablet: 2. Mobile: 1 y un pedacito de la siguiente.
  - Flechas **‹ ›** a los costados, fuera del carril, en Verde CAR. Se deshabilitan en los extremos y avanzan de a una tarjeta.
  - En touch se desliza con el dedo (`scroll-snap-type: x mandatory`).
- Cada tarjeta es un **link al posteo** (`target="_blank"`, `rel="noreferrer"`), con `aria-label` que diga el título del posteo y "(se abre Instagram)".
- **Hover y foco**: la imagen pasa a blanco y negro y se tiñe de **Amarillo 6PM** (capa amarilla con `mix-blend-mode: multiply` o un `filter` equivalente). Transición de ~250 ms. Que se vea como la tarjeta "¿Qué es el PAU?" del diseño.
  - Opcional: un ícono chico de Instagram o "Ver en Instagram ↗" que aparece en hover.
  - Sin `prefers-reduced-motion`, la transición puede incluir un leve zoom de la imagen.
- Datos en `src/content/semillero.ts`: `{ id, titulo, imagen, alt, href }`.
  - Hoy hay **2 portadas reales** (del PDF, en baja resolución): `ig-el-poder-de-elegir.jpg` y `ig-que-necesitas-para-hacerla.jpg`.
  - La de "¿Qué es el PAU?" no viene suelta. Armá un placeholder con la identidad (fondo verde con textura y el título) y su `TODO`.
  - Faltan las URLs de los posteos (`href: null` → la tarjeta no es link y muestra "Próximamente", siguiendo el patrón que ya existe en `config/links.ts`).
- **No uses embeds ni scripts de Instagram** (pesados, rastrean y son frágiles). Imágenes estáticas + link. Dejá anotado en el informe que, a futuro, se podría automatizar con la Instagram Graph API (requiere cuenta profesional y token).
- Imágenes con `loading="lazy"`, `decoding="async"`, `width`/`height` y `srcset` si hay tamaños.

#### Recursos (se conservan del sitio actual)

Las 3 tarjetas actuales de `Resources.tsx` (**La Huerta del m²**, **Estación × Estación** y **Basura Cero**) se conservan dentro de la misma sección "Semillero digital", **debajo del carrusel**. El carrusel muestra lo que se publica en Instagram; las tarjetas son las guías descargables.

- Subtítulo del bloque (H3, Azul Cianotipia, tamaño intermedio): por ejemplo "Guías para empezar hoy". Debajo, la bajada actual: "Ideas, herramientas y saberes para empezar hoy. Leé, guardá, compartí y hacé circular el conocimiento."
- Se conservan el contenido de cada tarjeta (formato, título, descripción, link) y la lógica actual de `SiteLink` y `ResourceStatus` ("Próximamente" / "Avisame cuando salga" mientras no haya URL).
- Se rehace el **estilo**, para que sean parientes visuales de las secciones del PDF:
  - Tarjetas con radio 16–20 px, sin sombras duras, con tipografía Pacaembu.
  - Fondos con la paleta nueva: Amarillo 6PM con textura amarilla, Verde CAR con textura oliva y Blanco Ajito oscurecido con textura crema.
  - Textos con el contraste correcto según la tabla de la sección 3.1 (Azul Cianotipia o Marrón sobre amarillo; crema sobre verde).
- Las ilustraciones CSS actuales (macetas, rueda de estaciones, anillo de compost) se pueden conservar recoloreadas, o reemplazar por los íconos lineales del sitio en grande (mismo trazo que los pines). Elegí lo que quede más coherente con el PDF y justificalo.
- Responsive: 3 columnas en desktop, 1 columna en mobile (o un carril horizontal si queda mejor).
- El ancla `#recursos` sigue existiendo (apunta a este bloque) para no romper links viejos.

### 5.5 Footer (ambas páginas)

Abrí `img/05-footer.jpg` y `img/10-sobre-sponsors-y-footer.jpg`.

- Fondo **Marrón Corteza**, textos en Blanco Ajito y títulos de columna en **Amarillo 6PM**.
- Columna 1:
  - `logo-horizontal-crema`
  - "Cultivando soberanía alimentaria, trabajo digno y paisaje urbano."
  - Ícono de Instagram + **@semillero.digital** (link existente en `config/links.ts`)
- Columna 2, **EXPLORAR** (lo del PDF + lo actual): Raíces Vecinas (`/#mapa`), Semillero Digital (`/#semillero-digital`), Guías y recursos (`/#recursos`).
- Columna 3, **CONOCER** (lo del PDF + lo actual): El programa (`/sobre-nosotros`), Nuestra historia (`/sobre-nosotros#historia`), Contacto (pendiente, "Próximamente" como hoy).
- Columna 4: "Que la próxima temporada te encuentre." + campo "Tu correo electrónico" con ícono de sobre, línea inferior y botón cuadrado con flecha. **Mantené toda la lógica actual de `Newsletter.tsx`** (validación, estados, endpoint por `.env` y nota de "cero spam" si existe); solo cambia el estilo.
- Línea divisoria y, abajo, la fila final, **conservando lo que tiene hoy el footer**:
  - A la izquierda: "Municipalidad de Rosario · Cátedra Spiaggi / Garat FAPyD UNR".
  - Al centro: **"© {año actual} PAU Rosario"**, como en el PDF.
  - A la derecha: "Privacidad · Accesibilidad" (siguen pendientes, con el patrón "Próximamente").
  - Todo en tamaño chico (14 px), Blanco Ajito con opacidad o un crema apagado que pase AA sobre el marrón.
- Mobile: columnas apiladas; el newsletter a ancho completo; la fila final apilada y centrada.

---

## 6. Página "Sobre nosotros" (`/sobre-nosotros` en la opción A)

### 6.1 Hero institucional

Abrí `img/06-sobre-hero-y-dropdown.jpg`.

- **Foto a sangre** de ancho completo y alto ~90vh en desktop (mín. 520 px). Hoy la foto es `assets/fotos/foto-huerta-sobre-nosotros.jpg`, que tiene **baja resolución** (870 px): `TODO` pedir la original en alta.
- Capa encima para legibilidad. En el diseño la foto está lavada con crema, pero el texto crema sobre foto clara no se lee bien. Usá un degradado oscuro de Verde CAR o Azul Cianotipia (~50–60%) desde la izquierda y verificá contraste ≥ 4,5:1 sobre la zona del texto.
- Texto en Blanco Ajito, alineado a la izquierda del contenedor:
  - "Programa de" (Regular, grande)
  - **"AGRICULTURA / URBANA"** (Extrabold) + la **hoja** del isotipo al final, como en el logo. Es el `<h1>`: poné el texto real; la hoja es decorativa.
  - Bajada (600): **"Surge en 2002, con el objetivo de..... para....."**. **El texto está incompleto en el diseño**: dejalo en `src/content/` como `TODO` y mostrá un placeholder neutro ("Desde 2002, el PAU transforma terrenos vacantes en espacios productivos, verdes y compartidos.", que es un texto ya aprobado en la otra página) hasta que manden el real.
  - Botón **"Conocé nuestra historia"**: fondo Blanco Ajito, texto Verde CAR, radio 12 px. Lleva a `#historia`.
- `<img>` real (no `background-image`) con `object-fit: cover`, `fetchpriority="high"` y `alt` descriptivo.

### 6.2 Banda verde: "Más de dos décadas echando raíces." (agregado que gustó)

Abrí `img/14-gusta-banda-dos-decadas.jpeg`.

- Debajo del hero va la **banda Verde CAR con textura** (igual a la de la otra página).
- En esta página, la banda lleva el contenido de `img/14`:
  - Ícono de brote (Blanco Ajito) + **"Más de dos décadas echando raíces."** (Bold).
  - Debajo: "De los terrenos vacantes a los parques huerta: trabajo, alimentos sanos y una red que sigue creciendo."
- Textos en Blanco Ajito sobre oliva (contraste 4,74 ✅).
- Esta banda es el destino de `#historia`. Si más adelante mandan una sección de historia completa, se agrega acá debajo: dejá preparado un bloque opcional `historia` en `src/content/` que se renderiza solo si tiene contenido.

### 6.3 Quiénes somos (`id="que-es-el-pau"`)

Abrí `img/07-sobre-quienes-somos.jpg`.

- Fondo Blanco Ajito con textura crema.
- Título **"QUIÉNES SOMOS"** (con tilde: en el PDF falta), Extrabold, Azul Cianotipia.
- Texto oficial, **literal**, en Azul Cianotipia peso 500–600:

> Somos un grupo de Instituciones Públicas y Privadas, Agrupaciones y personas que consideramos que la Agricultura Urbana contribuye con propuestas concretas a la solución de algunos de los problemas generados en las ciudades por la creciente urbanización, la pobreza y la exclusión.
>
> La Agricultura Urbana promueve el desarrollo agroecológico, integrando a varones y mujeres en la generación de emprendimientos sociales de producción y elaboración de alimentos sanos mediante técnicas ecológicas.

- Ancho de lectura máximo ~70ch.

### 6.4 Nuestras propuestas (`id="labor"`)

Abrí `img/08-sobre-nuestras-propuestas.jpg`.

- Fondo **Amarillo 6PM con textura amarilla**.
- Título **"NUESTRAS PROPUESTAS"**, Extrabold, Azul Cianotipia.
- Lista (`<ul>` real, viñeta "•" en Azul Cianotipia), textos literales:
  - Articulación de diferentes actores involucrados en estas problemáticas.
  - Utilización de recursos locales y la aplicación de tecnologías ecológicas apropiadas y apropiables.
  - Recuperación de lugares degradados transformándolos en nuevos espacios verdes productivos.
  - Promoción de la integración de las actividades de Agricultura Urbana a la gestión urbana como propuesta integral de desarrollo urbano.

### 6.5 Objetivos

Abrí `img/09-sobre-objetivos.jpg`.

- Fondo **Verde CAR** (sin textura, o muy sutil).
- Dos columnas:
  - Izquierda: título **"OBJETIVOS"** (Extrabold, Blanco Ajito) + lista literal:
    - Concientizar, sensibilizar y darle visibilidad a los múltiples servicios que ofrece la Agricultura Urbana a la ciudad de Rosario.
    - Dar a conocer, comunicar y promover las actividades de Agricultura Urbana en la ciudad de Rosario.
  - Derecha: **foto** (por ahora la misma del hero) **pegada al borde derecho de la pantalla**, con esquinas izquierdas muy redondeadas (~80 px) y las derechas rectas.
- Mobile: título y lista arriba; foto abajo a ancho completo, con radio en las 4 esquinas más chico (24 px) o manteniendo el recurso de sangrar hacia la derecha.

### 6.6 Franja de auspiciantes

Abrí `img/10-sobre-sponsors-y-footer.jpg`.

- Fondo Blanco Ajito.
- **5 círculos** de contorno fino Azul Cianotipia (diámetro ~150 px @1920) **separados por líneas verticales** finas del mismo color ("círculo, palito, círculo, palito"). Adentro de cada círculo va el **logo de una institución que auspicia**.
- Los logos **todavía no están**. Datos en `src/content/auspiciantes.ts` con `{ nombre, logo, href }`:
  - Si la lista está vacía, en producción la franja **no se muestra**.
  - En desarrollo (`import.meta.env.DEV`) se ven los círculos vacíos con el texto "Logo" para revisar el diseño.
- Logos en monocromo (Azul Cianotipia) para que la franja quede uniforme. A color en hover si son links.
- Responsive: en tablet, 5 en fila más chicos o 3 + 2. En mobile, carril horizontal con scroll o grilla 2 columnas, sin las líneas verticales.
- Es `<ul>` con `aria-label="Instituciones que acompañan al PAU"`.

### 6.7 Orden de la página

Hero → banda "Más de dos décadas" (`#historia`) → Quiénes somos (`#que-es-el-pau`) → Nuestras propuestas (`#labor`) → Objetivos → CTA "Hay una huerta" (6.8) → Auspiciantes → Footer.

### 6.8 CTA "Hay una huerta. Hay un lugar para vos." (agregado que gustó)

Abrí `img/13-gusta-cta-hay-una-huerta.jpeg`.

- Bloque de ancho completo **antes de los auspiciantes** en "Sobre nosotros". Une la parte institucional con el mapa.
- Fondo: en la referencia es un verde muy oscuro que no está en la paleta. Usá **Azul Cianotipia** (o un Verde CAR oscurecido con `color-mix`, elegí uno y justificalo).
- Contenido centrado:
  - **"Hay una huerta. / Hay un lugar para vos."** (Extrabold, Blanco Ajito, tamaño H2)
  - "No hace falta saberlo todo. Las ganas de empezar también son una semilla."
  - Botón **"Encontrá tu huerta →"** (fondo Blanco Ajito, texto oscuro, radio 12 px; en la referencia es píldora, pero usá el mismo radio que el resto de los botones del sitio) → `/#mapa`.

---

## 7. Cómo queda cada archivo del código actual

Regla: **se conserva todo lo que no esté listado como "se va"**. Verificá cada ítem con búsquedas antes de borrar. Que no queden imports, estilos ni tokens huérfanos.

**Se adaptan (mismo contenido y funciones, estilo nuevo):**

- `Header.tsx`: estilo del PDF, menú Inicio / Sobre nosotros ▾ / Semillero digital, botón "Encontrá tu huerta" que se conserva, desplegable y menú mobile con buscador (4.2). Se va el badge "PLANTATE".
- `Hero.tsx`: composición del PDF con el titular "PLANTATE. No seas nabo." que se conserva y el collage nuevo (5.1). El buscador y los filtros se mudan al módulo del mapa.
- `PlaceDetail.tsx`: **mismo contenido completo**, en la columna izquierda del módulo; se va el botón de cerrar (5.2).
- `SearchAndFilters.tsx`: barra dentro de la tarjeta del mapa + combobox de sugerencias + chip Compost (5.2).
- `Resources.tsx`: **se conserva**, debajo del carrusel de Instagram, con el estilo nuevo (5.4).
- `ImpactStats.tsx`: mismos 4 datos, en formato banda amarilla + plaquita rotativa (5.3).
- `Footer.tsx`: estilo del PDF **conservando todos sus links, la línea institucional y los legales** (5.5).
- `Newsletter.tsx`: solo cambia el estilo.
- `pauStyle.ts`, `pins.ts`, `clusters.ts`: el mismo mapa con estilo claro, pines y clusters nuevos (5.2).
- `data/locations.ts`: categorías renombradas y Compost conservado (5.2).
- `index.html`: se conservan título y descripción actuales (ajustá la redacción si hace falta para sumar "Huertas" y "CAR"); se agregan los metadatos de la página institucional (4.1).

**Se agregan:** ruteo y páginas (4.1), `SobreNosotros` con sus secciones (6), carrusel Semillero digital (5.4), frases superiores (4.3), banda "Más de dos décadas" (6.2), CTA "Hay una huerta" (6.8), auspiciantes (6.6), `src/content/` (10), textura (3.4), fuentes (3.2).

**Se van (solo esto):**

- `Directory.tsx`, `LocationCard.tsx`, pestañas Lista/Mapa y selector de orden (lo pidió el cliente; 5.2).
- Collage viejo hecho con fotos de stock y sus adornos (sol, grilla, hojas, sello, coordenadas, caption) (5.1).
- Badge "PLANTATE" del header (4.2).
- Estilo oscuro cianotipia del mapa (5.2).
- Tokens de color viejos, fuentes Bricolage/DM Sans y fondos de grilla/puntos (sección 3). El violeta de compost se reemplaza por el tratamiento crema+marrón de la sección 5.2.

Se **conservan sin cambios de lógica**: `useDirectory`, `useGeolocation`, `useMediaQuery`, `lib/geo.ts`, `lib/schedule.ts`, `lib/newsletter.ts`, `SafeImage`, `SiteLink`, `config/links.ts`, `map/controller.ts`, `map/useMap.ts`, `MapView.tsx` y el plugin de SEO.

`src/index.css` hoy tiene ~820 líneas. Aprovechá para organizarlo:
- Opción A: un archivo por componente (CSS importado en cada componente).
- Opción B: secciones claras dentro de `index.css`.

Lo importante es que no queden reglas muertas.

---

## 8. Responsive: checklist

Probá y sacá capturas en **1920, 1440, 1280, 1024, 768, 390 y 360 px**, en ambas páginas, y también con un celular en horizontal.

- [ ] Sin scroll horizontal en ningún ancho (la foto de Objetivos sangra a propósito, pero no debe generar scroll).
- [ ] Header: logo, menú y botón "Encontrá tu huerta" no se pisan. En <1024 px el menú pasa a la hamburguesa y el botón muestra "Ver mapa".
- [ ] Desplegable "Sobre nosotros" usable con mouse, teclado y touch.
- [ ] Hero: "PLANTATE." con su bloque no desborda a 320 px; "NO SEAS NABO." corta bien; el collage no se corta feo.
- [ ] Ficha completa del mapa: entra o scrollea por dentro sin que "Cómo llegar" se pierda.
- [ ] Tarjetas de recursos debajo del carrusel, ordenadas en todos los anchos.
- [ ] Módulo del mapa según la tabla de la sección 5.2.
- [ ] Plaquita rotativa legible y centrada en mobile.
- [ ] Carrusel Semillero: flechas visibles y usables; swipe en touch; la tarjeta parcial indica que hay más.
- [ ] Sobre nosotros: hero legible en mobile (texto sobre foto con buen contraste); auspiciantes ordenados.
- [ ] Footer apilado y prolijo.
- [ ] Objetivos táctiles ≥ 44×44 px; textos ≥ 13 px.

---

## 9. Accesibilidad y rendimiento

- Contraste AA en todo (sección 3.1). Foco visible con color que contraste en cada fondo: cian sobre claros y amarillo sobre oscuros, como ya está.
- Landmarks (`header`, `nav`, `main`, `footer`), un solo `<h1>` por página y jerarquía de títulos correcta.
- Skip link "Saltar al contenido".
- Todo lo que se mueve solo (plaquita) tiene pausa. Todo respeta `prefers-reduced-motion`.
- Carrusel y combobox con los patrones ARIA correctos y operables por teclado.
- `alt` reales en fotos; las imágenes decorativas (textura, hojas) con `alt=""` o `aria-hidden`.
- Rendimiento:
  - Collage como LCP optimizado.
  - Pacaembu/Outfit con `font-display: swap`.
  - Textura en una sola imagen reutilizada.
  - Mapa diferido y solo en su página.
  - Imágenes del Semillero lazy.
  - Objetivo: Lighthouse ≥ 90 en Performance, Accessibility, Best Practices y SEO en ambas páginas (mobile). Si no llegás, explicá por qué.
- Que no haya errores ni warnings en la consola (incluidos 404 de fuentes que todavía no existen).

---

## 10. Contenido centralizado

Creá `src/content/` con un archivo por bloque. **Todo texto o dato que el cliente pueda cambiar vive ahí**, no en los componentes.

- `site.ts`: `HOME_PAGE` (A/B), nombres de páginas, títulos y descripciones SEO por página.
- `navegacion.ts`: ítems del menú y sub-ítems.
- `inicio.ts`: frases superiores, hero, títulos de secciones y bajadas.
- `impacto.ts`: los 4 datos de la plaquita.
- `semillero.ts`: posteos de Instagram.
- `sobre-nosotros.ts`: hero (con el `TODO` del texto "Surge en 2002…"), historia, Quiénes somos, Propuestas, Objetivos y CTA.
- `auspiciantes.ts`: logos.
- (y `data/locations.ts` para los lugares, como ya está).

Corregí estas erratas del PDF:
- "trerrenos" → "terrenos"
- "de lo qué pensas" → "de lo que pensás"
- "QUIENES" → "QUIÉNES"
- Punto final faltante en el segundo objetivo.

---

## 11. Pendientes que necesitan material del cliente

Dejá cada uno con `TODO` en código y un placeholder prolijo. **Listalos todos en el informe final.**

1. **Archivos de la fuente Pacaembu** en `.woff2` (Regular, Semibold, Bold, Extrabold) con licencia web.
2. **Los 4 íconos de categoría en SVG** (Ferias, Huertas, CAR, Parques huertas), y confirmar qué ícono y color corresponde a cada categoría. Además, confirmar el tratamiento del pin de **Compost** (crema con borde marrón), o que la diseñadora mande su ícono.
3. **Lista oficial de lugares**: nombre, categoría, dirección, horario, huerteros, días de apertura y foto. Hoy son datos de ejemplo y "Huertas" está vacía.
4. **URLs de los 3 recursos** (guía La Huerta del m², calendario Estación × Estación y fanzine Basura Cero): siguen pendientes de antes.
5. **Posteos de Instagram del Semillero digital**: portadas en 1080×1350 + link de cada posteo (incluido "¿Qué es el PAU?").
6. **Logos de los auspiciantes**: idealmente SVG, con nombre y link.
7. **Texto del hero de "Sobre nosotros"** ("Surge en 2002, con el objetivo de… para…") y, si quieren, contenido para "Historia".
8. **Foto del hero de "Sobre nosotros" en alta resolución** (≥ 1920 px de ancho) y, si hay, otra distinta para "Objetivos".
9. **Logos en SVG**: opcional, mejora la nitidez.
10. **Endpoint del newsletter** (pendiente de antes, `VITE_NEWSLETTER_ENDPOINT`).
11. Confirmar que la cuenta de Instagram es `@semillero.digital`.

---

## 12. Decisiones abiertas (implementá el valor por defecto)

| Tema | Por defecto | Alternativa |
|---|---|---|
| Página principal | **A**: `/` = Raíces Vecinas (mapa) | **B**: `/` = institucional, `/raices-vecinas` = mapa. Una constante en `src/content/site.ts` |
| Texto sobre amarillo | Azul Cianotipia (pasa AA) | Crema, como el PDF (no pasa contraste) |
| Íconos y colores por categoría | Tabla de la sección 5.2 | Lo que confirme la diseñadora |
| Titular del hero | "PLANTATE. / NO SEAS NABO." con el tratamiento del PDF y "Raíces Vecinas" como antetítulo | "RAÍCES VECINAS" como titular (PDF) y PLANTATE como antetítulo |
| Lupa y hamburguesa del PDF | Fuera de la barra en desktop; búsqueda en el módulo del mapa y en el menú mobile; hamburguesa solo en mobile | Ícono de lupa en la fila de frases superiores |
| Pin de Compost | Crema con borde e ícono marrón | El color/ícono que defina la diseñadora |
| Recursos (guía, calendario, fanzine) | Debajo del carrusel de Instagram, en la misma sección | Sección propia antes del footer |
| Plaquitas en mobile | Una que rota | Grilla 2×2 estática |
| Fondo del CTA "Hay una huerta" | Azul Cianotipia | Verde CAR oscurecido |

---

## 13. Verificación y entrega

1. `pnpm build` sin errores ni warnings. `pnpm exec tsc --noEmit` limpio. Consola del navegador sin errores en ambas páginas.
2. Recorré con Playwright (Chromium con WebGL por software si hace falta, como la vez anterior) estos flujos:
   - Navegar entre páginas.
   - Abrir el desplegable con mouse y con teclado.
   - Ir a `/sobre-nosotros#labor` directo por URL.
   - Recargar `/sobre-nosotros`.
   - Buscar un lugar en el módulo del mapa y desde el buscador del menú mobile.
   - Usar el botón "Encontrá tu huerta" del header desde las dos páginas.
   - Filtrar por cada chip (incluidos "Huertas" vacío y "Compost").
   - Tocar un pin y un cluster.
   - Ver la ficha completa actualizarse (días de apertura, huerteros, "Cómo llegar").
   - Pausar la plaquita.
   - Pasar el carrusel con flechas y con teclado.
   - Abrir un recurso (o ver su estado "Próximamente").
   - Enviar el newsletter (estado de error sin endpoint).
   - Menú mobile.
3. Sacá capturas de **ambas páginas completas** en 1440 y 390 px, y de cada sección en 1920 px. Guardalas en `docs/cambios-v2/resultado/` con los mismos nombres que las referencias de `img/`, para comparar lado a lado.
4. Compará cada captura con su referencia. Corregí diferencias de color, tamaño, espaciado y alineación hasta que estén lo más cerca posible del diseño, sin romper lo pedido en accesibilidad.
5. **Informe final**, corto y en castellano:
   - (a) qué se hizo, por sección;
   - (b) desvíos respecto del PDF y por qué, incluyendo los elementos del sitio actual que se conservaron (tabla 1.1) y cómo se integraron;
   - (c) lista de pendientes de la sección 11 con dónde se completa cada uno (archivo y campo);
   - (d) cómo cambiar entre la opción A y la B;
   - (e) comandos para correr y publicar.
