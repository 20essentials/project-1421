# DESIGN.md — Stefano Lunardi

Design system del sitio. Cualquier cambio visual debe respetar estas reglas y
actualizar este documento.

## Principios

- **Monocromo premium**: blanco + gris oscuro frío. El color lo ponen las fotos.
- **Menú flotante fijo**: píldora centrada con blur, siempre visible; agrega sombra
  al hacer scroll (`.nav-pill[data-scrolled]`).
- **Ritmo editorial**: mucho aire, tipografía serif display, textos de apoyo en
  gris (`text-muted-foreground`).

## Paleta (src/styles/global.css → @theme)

| Token                    | Valor               | Uso                                    |
| ------------------------ | ------------------- | -------------------------------------- |
| `--color-background`     | `hsl(0 0% 100%)`    | Fondo de página (blanco)               |
| `--color-foreground`     | `hsl(220 15% 12%)`  | Tinta principal (`#1a1d23`)            |
| `--color-primary`        | `hsl(220 15% 12%)`  | Bloques oscuros (hero, footer CTA)     |
| `--color-primary-foreground` | `hsl(0 0% 99%)` | Texto sobre bloques oscuros            |
| `--color-secondary`      | `hsl(220 13% 95%)`  | Superficies suaves / skeleton          |
| `--color-secondary-foreground` | `hsl(220 15% 12%)` | Texto sobre secondary           |
| `--color-muted-foreground` | `hsl(220 8% 45%)` | Texto de apoyo                         |
| `--color-border`         | `hsl(220 12% 88%)`  | Separadores (1px, sutiles)             |
| `--color-accent`         | `hsl(220 15% 14%)`  | Botones CTA (gris oscuro)              |
| `--color-accent-foreground` | `hsl(0 0% 100%)` | Texto sobre accent                     |
| `--color-destructive`    | `hsl(8 62% 42%)`    | Errores (único color no neutro)        |

Reglas de color: no introducir colores nuevos; usar grises con un toque frío
(H≈220). Fotografía = único elemento a color.

## Tipografía

- **Display**: `Cormorant Garamond` — títulos H1/H2, frases destacadas
  (`.font-display`).
- **Sans**: `Inter` — cuerpo, UI, navegación.
- **Eyebrow**: `.eyebrow` — 12px, uppercase, `letter-spacing: 0.22em`,
  `text-muted-foreground`; etiqueta sobre cada título de sección.
- Escalas: H1 `text-4xl → md:text-6xl`, H2 `text-3xl`, cuerpo `text-sm/base`
  con `leading-relaxed`.

## Navegación (src/app/header.astro)

- `position: fixed`, píldora flotante centrada, `backdrop-blur-xl`,
  `bg-background/70`.
- Al scroll > 12px: `.nav-pill[data-scrolled]` → fondo más sólido (90%) +
  sombra suave.
- Items con indicador deslizante (`.nav-indicator`) animado con `--ease-fluid`.
- Breakpoint: nav horizontal completo solo en `xl`; abajo, botón hamburguesa
  con overlay de pantalla completa (menú indexado 01…n).

## Layout / espaciado

- `--header-offset: 8.5rem` (global.css): clearance bajo el menú fijo.
- Regla base `main > :first-child:not([data-bleed])`: todo primer bloque de
  página recibe `padding-top: var(--header-offset)`; **no** se usan `mt-*` en
  el primer bloque (evita el doble hueco bajo el menú).
- `data-bleed` en el primer bloque: hero full-bleed (pasa por debajo del menú;
  lleva su propio `pt-*` interno, p. ej. `pt-40`).
- **Contenedor estándar para islas y grids**: `mx-auto max-w-7xl px-6` (grids
  de tarjetas: portfolio, blog) o `mx-auto max-w-3xl px-6` (texto largo).
  Ningún texto o caption toca el borde del viewport.
- Excepciones full-bleed intencionales: hero de home (`data-bleed`), escenas
  scroll-world (`sw-*`), y la galería de imágenes de un proyecto
  (`project-page.tsx` — solo el header lleva `max-w-3xl px-6`).
- Contenido: `max-w-7xl` (grids), `max-w-3xl` (texto largo), `px-6` lateral.
- Separador estándar entre secciones: `border-b border-border` +
  `pb-12/10` en el bloque de título.
- Footer: `border-t border-border`, newsletter centrada, grid 3 columnas.

## Componentes

- **Botón primario**: `rounded-full bg-accent text-accent-foreground px-4 h-9`,
  hover `bg-foreground`.
- **Formularios**: `src/features/forms/schema-form` — inputs sobre
  `background`, borde `border`, foco `outline-accent`.
- **Skeletons**: `animate-pulse bg-secondary`.
- **Iconos**: inline SVG, `stroke-width 1.5`, `size-4`.

## Motion

- Easing global: `--ease-fluid: cubic-bezier(0.32, 0.72, 0, 1)`.
- Duraciones: micro 300–500ms, transiciones de menú/indicador 600–700ms.
- Respetar `prefers-reduced-motion: reduce`.

## Accesibilidad

- Skip link "Salta al contenido" (visible al foco).
- `aria-current="true"` en el enlace activo del nav y del menú.
- Menú móvil: `inert` en main/footer cuando está abierto, cierre con Escape.

## Screenshots de referencia

Capturas por feature en `.screenshots/` (nunca borrar ni sobrescribir).
