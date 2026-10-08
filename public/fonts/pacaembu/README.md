# Pacaembu

Tipografía del diseño del sitio. Copiá acá los cuatro archivos `.woff2`, con estos nombres exactos:

| Archivo | Peso | Uso |
|---|---|---|
| `Pacaembu-Regular.woff2` | 400 | Texto |
| `Pacaembu-Semibold.woff2` | 600 | Menú, botones, destacados |
| `Pacaembu-Bold.woff2` | 700 | Nombres de lugares, subtítulos |
| `Pacaembu-Extrabold.woff2` | 800 | Títulos |

**Licencia:** hace falta una licencia que permita usarla en la web (*web font license*). Sin esa licencia no se pueden publicar los archivos.

No hay que tocar código. Al hacer el build, `vite-plugins/fonts.ts` detecta los archivos que estén en esta carpeta y agrega los `@font-face` (con `font-display: swap`) y la precarga de Regular y Extrabold. Mientras falten, el sitio usa **Outfit** (Google Fonts), que es parecida.

En desarrollo, después de copiar los archivos, reiniciá el servidor (`pnpm dev`).
