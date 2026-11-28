# Mapa de features — Stefano Lunardi (Wix Headless)

> Estado actual: 2026-11-18. Rutas relativas al root del proyecto.
> Este mapa describe lo que el proyecto ya tiene implementado; lo pendiente está al final.

```text
stefanolunardi-photographer
│
├── Páginas y rutas (SSR con Astro)
│   ├── Home → src/pages/index.astro
│   ├── Portafolio
│   │   ├── Listado de colecciones → src/pages/portfolio.astro
│   │   ├── Colección por slug → src/pages/portfolio/[slug].astro
│   │   └── Detalle de proyecto → src/pages/projects/[slug].astro
│   ├── Blog
│   │   ├── Feed → src/pages/blog.astro
│   │   ├── Post → src/pages/blog/[...slug].astro
│   │   ├── Categoría → src/pages/blog/category/[slug].astro
│   │   └── Etiqueta → src/pages/blog/tag/[slug].astro
│   ├── FAQ → src/pages/faq.astro
│   ├── Contacto → src/pages/contatti.astro
│   ├── Chi sono → src/pages/chi-sono.astro
│   ├── Il mio metodo → src/pages/il-mio-metodo.astro
│   ├── Location → src/pages/location.astro
│   ├── Investimento → src/pages/investimento.astro
│   ├── Recensioni → src/pages/recensioni.astro
│   ├── Awards → src/pages/awards.astro
│   ├── Fine art → src/pages/fine-art.astro
│   └── Impressum → src/pages/impressum.astro
│
├── Navegación y layout
│   ├── Layout base → src/app/layout.astro
│   │   ├── <html lang="it">, favicons, manifest, theme-color
│   │   ├── Slot de SEO por página → <slot name="seo-tags">
│   │   ├── Bootstrap de cookies + banner de cookies
│   │   ├── <main id="contenido"> y skip link
│   │   └── Footer global
│   ├── Header → src/app/header.astro
│   │   ├── Píldora fija con blur/sombra al scroll
│   │   ├── Marca + nav desktop + indicador activo
│   │   ├── CTA a /contatti
│   │   └── Menú móvil: overlay, inert, Escape, cierre al navegar
│   └── Footer → src/app/layout.astro
│       ├── Newsletter (SchemaForm + fallback)
│       ├── Navegación secundaria y contacto
│       ├── Redes sociales + copyright
│       ├── "Preferenze cookie" → reapertura del panel
│       └── Enlace a /impressum
│
├── Home y secciones visuales
│   ├── Hero full-bleed + CTAs → src/pages/index.astro
│   ├── Manifiesto editorial → src/pages/index.astro
│   ├── Grid editorial de fotos → src/features/home/photo-grid.astro
│   ├── Scroll-world (sticky/wipe/parallax) → src/features/home/scroll-world.ts
│   ├── Colecciones + tipologías de disparo → src/pages/index.astro
│   ├── Foto + video (Metodo Fusion) → src/pages/index.astro
│   ├── Últimos artículos → src/pages/index.astro
│   ├── Banda de premios/prensa → src/pages/index.astro
│   ├── Testimonio + preview FAQ → src/pages/index.astro
│   └── CTA final "Cuéntame vuestra historia" / "Empezar" → src/pages/index.astro
│
├── Contenido Wix (features de dominio)
│   ├── Blog
│   │   ├── Posts y mapeo DTO → src/features/blog/posts.ts, posts-core.ts
│   │   ├── Categorías y etiquetas → src/features/blog/taxonomy.ts, taxonomy-core.ts
│   │   ├── Autores → src/features/blog/authors.ts, authors-core.ts
│   │   ├── Comentarios → src/features/blog/comments.ts, comments-core.ts
│   │   ├── Likes → src/features/blog/post-likes.ts, post-like-button.tsx
│   │   ├── Contenido enriquecido (Ricos) → src/features/blog/rich-content.tsx
│   │   ├── Feed / filtros / estados → src/features/blog/blog-feed-store.ts, feed.tsx
│   │   └── Tipos → src/features/blog/types.ts
│   ├── Portfolio
│   │   ├── Lectura Wix Portfolio → src/features/portfolio/portfolio.ts, portfolio-core.ts
│   │   ├── Colecciones → src/features/portfolio/collections-store.ts, collections-view.tsx
│   │   ├── Proyectos por colección → src/features/portfolio/collection-projects-store.ts, collection-page.tsx
│   │   ├── Detalle de proyecto → src/features/portfolio/project-detail-store.ts, project-page.tsx
│   │   ├── Galería → src/features/portfolio/gallery.tsx, gallery-media.tsx
│   │   └── Tipos → src/features/portfolio/types.ts
│   ├── FAQ
│   │   ├── Lectura Wix FAQ → src/features/faq/faq.ts, faq-core.ts
│   │   ├── Búsqueda con debounce → src/features/faq/faq-search.tsx
│   │   ├── Filtro por categorías → src/features/faq/faq-category-nav.tsx
│   │   ├── Acordeón accesible + deep-link → src/features/faq/faq-accordion.tsx
│   │   ├── Estado compartido → src/features/faq/faq-store.ts, use-faq.ts
│   │   └── Tipos → src/features/faq/types.ts
│   └── Forms
│       ├── Heart to Heart → src/pages/contatti.astro
│       ├── Newsletter en footer → src/app/layout.astro
│       ├── Render schema-driven → src/features/forms/schema-form.tsx
│       ├── Validación, reglas y pasos → src/features/forms/use-wix-form.ts
│       ├── Campos de dirección → src/features/forms/forms-address-core.ts, address-templates.generated.ts
│       ├── Envío de submissions → src/features/forms/submissions.ts, submissions-core.ts
│       ├── Estado → src/features/forms/form-store.ts
│       └── Tipos → src/features/forms/types.ts
│
├── Cookies y Track Events
│   ├── Cookies
│   │   ├── Banner accesible <aside> → src/features/consent/consent-banner.astro
│   │   ├── Aceptar / rechazar / preferencias → src/features/consent/consent-banner.astro
│   │   ├── Panel granular por categorías → src/features/consent/consent-banner.astro
│   │   ├── Reapertura desde footer → src/app/layout.astro
│   │   ├── Persistencia y policy Wix → src/shared/consent.ts
│   │   └── Reaplicación al cargar → src/features/consent/consent-bootstrap.astro
│   └── Track Events
│       ├── trackEvent con gate de consentimiento → src/shared/analytics.ts
│       ├── Helper de vistas cliente → src/shared/analytics-view.astro
│       ├── ArticleView → src/pages/blog/[...slug].astro
│       └── FormSubmit → src/features/forms/schema-form.tsx
│
├── SEO
│   ├── Título y descripción por defecto → src/app/layout.astro
│   ├── Canonical con PUBLIC_SITE_URL → src/app/layout.astro
│   ├── Open Graph + Twitter card → src/app/layout.astro
│   ├── JSON-LD Person base → src/app/layout.astro
│   ├── SEO por item de Wix → src/pages/blog/[...slug].astro, blog/category/[slug].astro
│   ├── JSON-LD FAQPage → src/pages/faq.astro
│   └── Sitemap y robots → gestionados por Wix (no hay archivos en public/)
│
├── Integraciones Wix y capa de datos
│   ├── Configuración del sitio → wix.config.json
│   ├── Modo de autenticación → src/shared/config.ts
│   ├── Seam único SDK/REST → src/shared/sdk.ts
│   ├── Paquetes → @wix/astro, @wix/astro-pages, @wix/astro-wix-hosting-adapter,
│   │              @wix/blog, @wix/dashboard, @wix/essentials, @wix/faq,
│   │              @wix/forms, @wix/portfolio, @wix/ricos, @wix/sdk,
│   │              @wix/seo, @wix/services-manager, @wix/site, @wix/cli
│   └── Planes de seed → seed/portfolio-plan.json, blog-plan.json, faq-plan.json, forms-plan.json
│
├── Media, diseño y accesibilidad
│   ├── Resolución de media Wix → src/shared/media.ts
│   ├── Ricos a HTML/texto seguro → src/shared/ricos.ts
│   ├── Fotos de boda alojadas en CMS → Home.gridImage01-16, NotFound.notFoundImage, src/features/home/photo-grid.astro
│   ├── Favicons e iconos → public/favicon*, public/apple-touch-icon.png, public/android-chrome-*.png
│   ├── Webmanifest → public/site.webmanifest
│   ├── Logos → public/logo.png, public/logo_QEP-copy-1.webp
│   ├── Tokens y estilos → src/styles/global.css, DESIGN.md
│   ├── Motion con prefers-reduced-motion → src/features/home/scroll-world.ts
│   └── Accesibilidad → skip link, aria-current, aria-expanded, focus/scroll lock, role="region"
│
├── Calidad y verificación
│   ├── Unit tests → tests/unit/money.test.ts, consent.test.ts, analytics.test.ts
│   ├── E2E tests → tests/e2e/routes.spec.ts, tests/e2e/consent.spec.ts
│   ├── Configuración unit → vitest.config.ts
│   ├── Configuración E2E → playwright.config.ts
│   ├── Capturas visuales → .screenshots/cookie-consent-*.png
│   └── Comandos → npm run check, npm test, npm run test:e2e, npm run build, npm run release
│
├── CI/CD y entorno
│   ├── CI push/PR → .github/workflows/ci.yml (npm ci, check, test)
│   ├── Release → .github/workflows/release.yml (workflow_dispatch / tag v*, Wix CLI)
│   ├── Variables de entorno → .env.example, src/shared/config.ts
│   ├── Esquema de env tipado → astro.config.mjs (PUBLIC_SITE_URL)
│   ├── Plantilla PR y contribución → .github/pull_request_template.md, CONTRIBUTING.md
│   └── Runtime → .nvmrc, .npmrc, .prettierrc, .prettierignore
│
├── Documentación y skills
│   ├── Instrucciones del repo → AGENTS.md, CLAUDE.md
│   ├── Sistema de diseño → DESIGN.md
│   ├── Histórico → ROADMAP-DONE.md
│   ├── Próximos pasos → ROADMAP-NEXT-STEPS.md
│   ├── Documentación → DOCUMENTATION/
│   │   ├── Cómo empezar → DOCUMENTATION/how-to-start/es.md
│   │   ├── Qué puede hacer el cliente → DOCUMENTATION/client-can-do/es.md
│   │   └── Todas las features → DOCUMENTATION/all-features/es.md
│   └── Skills instaladas → .agents/skills/wix-headless-kit/, .agents/skills/wix-docs/
│
└── Material fuente del cliente
    ├── Base de conocimiento → stefano-lunardi-assets/base-de-conocimiento.md
    ├── Estructura por secciones → stefano-lunardi-assets/sitemap/
    ├── Fotografías → stefano-lunardi-assets/foto/
    ├── Premios y prensa → stefano-lunardi-assets/awards logo/, loghi-home-page/
    └── PDFs → stefano-lunardi-assets/pdfs/

PENDIENTE (no implementado todavía)
├── Multi-idioma DE / EN → ROADMAP-NEXT-STEPS.md
├── Dominio propio + alta en Search Console → ROADMAP-NEXT-STEPS.md
├── Conexión de GA4 / GTM / Meta en el dashboard de Wix → ROADMAP-NEXT-STEPS.md
└── Revisión de titles/descriptions por página con el cliente → ROADMAP-NEXT-STEPS.md
```

> Nota: `DOCUMENTATION/all-features/es.md`, `DESIGN.md` y los roadmaps se actualizan cuando el mapa cambia.
