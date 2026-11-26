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

- **Display**: `Jost` — títulos H1/H2, frases destacadas (`.font-display`);
  sans-serif geométrico y elegante, con itálica para las citas.
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
- **Consentimiento**: `src/features/consent/consent-banner.astro` — `<aside data-sl-consent>` fijo abajo con `role="region"`; botones `Accetta` / `Rifiuta` / `Preferenze` y panel granular `data-consent-panel`. Usa solo tokens monocromos; se reabre desde el footer (`Preferenze cookie`).
- **Muro de Riconoscimientos (home)**: sección en `--color-primary` con `.dot-grid-light`, titular Jost amplio, cifra `100+` decorativa (`aria-hidden`) y una rejilla de 12 placas claras (`--color-secondary`): 6 logotipos editables del CMS `Home` y 6 sigillos fijos compartidos con `/awards` (`src/shared/award-seals.ts`). Las imágenes usan `mix-blend-mode: multiply` para integrar los fondos blancos; hover eleva la placa, sin movimiento bajo `prefers-reduced-motion`.
- **Cifre chi siamo (home)**: banda en `--color-primary` con `.dot-grid-light` bajo `Chi è Stefano`, para separar del blanco de `Arte` y del gris de la sección anterior. `dl.stats-grid` de celdas `aspect-square` (2 columnas en móvil, 4 desde `md`): valor en display bold blanco y etiqueta sans uppercase translúcida con una regla fina encima, agrupados centrados. Font del valor `clamp(1.75rem, 3.6vw, 3rem)` con `text-wrap: balance`, tracking de la etiqueta `0.14em` (evita overflow en `Reconocimientos internacionales`) y gap valor/etiqueta `0.375rem`. Solo bordes horizontales (`border-block-start` por celda y `border-block-end` en la rejilla), sin bordes laterales. Entrada escalonada con scroll-driven animation y count-up de `40+` / `25`, sin movimiento bajo `prefers-reduced-motion`.
- **COSA RICEVETE (home)**: sección entre `Il mio metodo` y `Dove fotografo`. `ol.delivery-list` de tres columnas desde `md` (una en móvil), sin bordes ni tarjetas: número en display regular, unidad sans uppercase, título display 22–28px y copia 15px en `--color-muted-foreground`. Jerarquía por tamaño y peso, sin cursiva, desplazamientos ni animación; separación 32–48px entre columnas y 48px bajo el titular.
- **Recensioni in home (bento editoriale)**: sección propia `#recensioni-home` entre `Chi è Stefano` y `Numeri`, con seis citas reales y CTA a `/recensioni`. Encabezado a la izquierda: título display a `2.25rem` en móvil y `3rem` desde 48rem, intro a `1rem` debajo y CTA inmediatamente después; sin etiqueta superior ni texto alineado a la derecha. `.reviews-archive__grid` es un mosaico denso con `gap: 0.875rem` móvil / `1rem` desde 40rem y todas las tarjetas blancas con borde de `--color-border`: no hay fondos negros, grises ni paneles de color, sin `min-block-size`. Container queries: móvil de una columna; tablet de 6 columnas con filas `featured 3 + second 3` y `third/fourth/fifth 2+2+2`; desktop de 12 columnas con `featured 5 + second 4 + third 3` arriba y `fourth/fifth/sixth 4+4+4` abajo. Sin bloque de estadísticas, números ni estrellas decorativas: jerarquía por ancho del mosaico. La cita usa `font-sans` regular (`1rem` móvil, `1.0625rem` desde 40rem, `1.125rem` desktop, `1.25rem` en la destacada), el nombre y la meta usan uppercase sans en dos tamaños coherentes, el pie lleva una regla fina de `--color-border`, y no hay hover ni movimiento.

## Motion

- Easing global: `--ease-fluid: cubic-bezier(0.32, 0.72, 0, 1)`.
- Duraciones: micro 300–500ms, transiciones de menú/indicador 600–700ms.
- Cifre: entrada `view()` con `animation-range: entry 0% entry 65%` y count-up de 1400ms escalonado 110ms; `40+` y `25` cuentan, `QEP` y `Dal 2012` permanecen estáticos.
- Respetar `prefers-reduced-motion: reduce`.

## Accesibilidad

- Skip link "Salta al contenido" (visible al foco).
- `aria-current="true"` en el enlace activo del nav y del menú.
- Menú móvil: `inert` en main/footer cuando está abierto, cierre con Escape.

## Screenshots de referencia

Capturas por feature en `.screenshots/` (nunca borrar ni sobrescribir).

- Cookie consent: `.screenshots/cookie-consent-banner-20261118-155621.png` y `.screenshots/cookie-consent-panel-20261118-155621.png`.
- Muro de Riconoscimientos: `.screenshots/awards-wall-20261123-234454.png` (desktop) y `.screenshots/awards-wall-mobile-20261123-234602.png` (mobile 390px).
- Cifre chi siamo: `.screenshots/stats-grid-desktop-20261125231243.png` (desktop 1280px), `.screenshots/stats-grid-mobile-20261125231243.png` (mobile 390px), `.screenshots/stats-es-before-20261126-011339.png` (overflow previo en `/es/`), `.screenshots/stats-es-after-desktop-20261126-011813.png` (desktop 1280px) y `.screenshots/stats-es-after-mobile-20261126-011813.png` (mobile 390px).
- COSA RICEVETE: `.screenshots/cosa-ricevete-timeline-desktop-20261126-001628.png` (desktop 1280px), `.screenshots/cosa-ricevete-timeline-mobile-20261126-001628.png` (mobile 390px) y `.screenshots/cosa-ricevete-timeline-mobile-bottom-20261126-001628.png` (móvil 390px, parte baja).
- Recensioni in home (bento real, sin stats): `.screenshots/reviews-true-bento-desktop-20261126-151901.png` (desktop 1280px) y `.screenshots/reviews-true-bento-mobile-20261126-151929.png` (mobile 390px). Versiones previas conservadas: `.screenshots/reviews-bento-only-reviews-desktop-20261126-150659.png`, `.screenshots/reviews-bento-only-reviews-mobile-20261126-150733.png`, `.screenshots/reviews-bento-desktop-20261126-145702.png` y `.screenshots/reviews-bento-mobile-20261126-145729.png`.
- Recensioni in home (bento editorial corregido, tipografía fija y una sola superficie blanca): `.screenshots/reviews-fixed-type-colors-desktop-20261126-163819.png` (desktop 1280px) y `.screenshots/reviews-fixed-type-colors-mobile-20261126-163900.png` (mobile 390px). Versiones intermedias conservadas: `.screenshots/reviews-archive-desktop-20261126-161849.png` y `.screenshots/reviews-editorial-bento-desktop-20261126-162727.png`.
- Recensioni in home (mosaico denso, sans coherente y sin huecos): `.screenshots/reviews-dense-mosaic-desktop-20261126-164954.png` (desktop 1280px) y `.screenshots/reviews-dense-mosaic-mobile-20261126-165017.png` (mobile 390px).
