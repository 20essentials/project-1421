# Mappa delle feature — Stefano Lunardi (Wix Headless)

> Stato attuale: 2026-11-18. Percorsi relativi alla root del progetto.
> Questa mappa descrive ciò che il progetto ha già implementato; ciò che resta da fare è alla fine.

```text
stefanolunardi-photographer
│
├── Pagine e percorsi (SSR con Astro)
│   ├── Home → src/pages/index.astro
│   ├── Portfolio
│   │   ├── Elenco delle collezioni → src/pages/portfolio.astro
│   │   ├── Collezione per slug → src/pages/portfolio/[slug].astro
│   │   └── Dettaglio di progetto → src/pages/projects/[slug].astro
│   ├── Blog
│   │   ├── Feed → src/pages/blog.astro
│   │   ├── Post → src/pages/blog/[...slug].astro
│   │   ├── Categoria → src/pages/blog/category/[slug].astro
│   │   └── Tag → src/pages/blog/tag/[slug].astro
│   ├── FAQ → src/pages/faq.astro
│   ├── Contatti → src/pages/contatti.astro
│   ├── Chi sono → src/pages/chi-sono.astro
│   ├── Il mio metodo → src/pages/il-mio-metodo.astro
│   ├── Location → src/pages/location.astro
│   ├── Investimento → src/pages/investimento.astro
│   ├── Recensioni → src/pages/recensioni.astro
│   ├── Awards → src/pages/awards.astro
│   ├── Fine art → src/pages/fine-art.astro
│   └── Impressum → src/pages/impressum.astro
│
├── Navigazione e layout
│   ├── Layout base → src/app/layout.astro
│   │   ├── <html lang="it">, favicon, manifest, theme-color
│   │   ├── Slot SEO per pagina → <slot name="seo-tags">
│   │   ├── Bootstrap dei cookie + banner cookie
│   │   ├── <main id="contenido"> e skip link
│   │   └── Footer globale
│   ├── Header → src/app/header.astro
│   │   ├── Pill fissa con blur/ombra allo scroll
│   │   ├── Marchio + nav desktop + indicatore attivo
│   │   ├── CTA a /contatti
│   │   └── Menu mobile: overlay, inert, Escape, chiusura alla navigazione
│   └── Footer → src/app/layout.astro
│       ├── Newsletter (SchemaForm + fallback)
│       ├── Navigazione secondaria e contatti
│       ├── Social + copyright
│       ├── "Preferenze cookie" → riapertura del pannello
│       └── Link a /impressum
│
├── Home e sezioni visive
│   ├── Hero full-bleed + CTAs → src/pages/index.astro
│   ├── Manifesto editoriale → src/pages/index.astro
│   ├── Griglia editoriale di foto → src/features/home/photo-grid.astro
│   ├── Scroll-world (sticky/wipe/parallax) → src/features/home/scroll-world.ts
│   ├── Collezioni + tipologie di scatto → src/pages/index.astro
│   ├── Foto + video (Metodo Fusion) → src/pages/index.astro
│   ├── Ultimi articoli → src/pages/index.astro
│   ├── Fascia di premi/stampa → src/pages/index.astro
│   ├── Testimonianza + anteprima FAQ → src/pages/index.astro
│   └── CTA finale "Raccontami la vostra storia" / "Inizia" → src/pages/index.astro
│
├── Contenuto Wix (feature di dominio)
│   ├── Blog
│   │   ├── Post e mappatura DTO → src/features/blog/posts.ts, posts-core.ts
│   │   ├── Categorie e tag → src/features/blog/taxonomy.ts, taxonomy-core.ts
│   │   ├── Autori → src/features/blog/authors.ts, authors-core.ts
│   │   ├── Commenti → src/features/blog/comments.ts, comments-core.ts
│   │   ├── Likes → src/features/blog/post-likes.ts, post-like-button.tsx
│   │   ├── Contenuto arricchito (Ricos) → src/features/blog/rich-content.tsx
│   │   ├── Feed / filtri / stati → src/features/blog/blog-feed-store.ts, feed.tsx
│   │   └── Tipi → src/features/blog/types.ts
│   ├── Portfolio
│   │   ├── Lettura Wix Portfolio → src/features/portfolio/portfolio.ts, portfolio-core.ts
│   │   ├── Collezioni → src/features/portfolio/collections-store.ts, collections-view.tsx
│   │   ├── Progetti per collezione → src/features/portfolio/collection-projects-store.ts, collection-page.tsx
│   │   ├── Dettaglio di progetto → src/features/portfolio/project-detail-store.ts, project-page.tsx
│   │   ├── Galleria → src/features/portfolio/gallery.tsx, gallery-media.tsx
│   │   └── Tipi → src/features/portfolio/types.ts
│   ├── FAQ
│   │   ├── Lettura Wix FAQ → src/features/faq/faq.ts, faq-core.ts
│   │   ├── Ricerca con debounce → src/features/faq/faq-search.tsx
│   │   ├── Filtro per categorie → src/features/faq/faq-category-nav.tsx
│   │   ├── Accordion accessibile + deep-link → src/features/faq/faq-accordion.tsx
│   │   ├── Stato condiviso → src/features/faq/faq-store.ts, use-faq.ts
│   │   └── Tipi → src/features/faq/types.ts
│   └── Forms
│       ├── Heart to Heart → src/pages/contatti.astro
│       ├── Newsletter nel footer → src/app/layout.astro
│       ├── Render schema-driven → src/features/forms/schema-form.tsx
│       ├── Validazione, regole e passaggi → src/features/forms/use-wix-form.ts
│       ├── Campi di indirizzo → src/features/forms/forms-address-core.ts, address-templates.generated.ts
│       ├── Invio delle submissions → src/features/forms/submissions.ts, submissions-core.ts
│       ├── Stato → src/features/forms/form-store.ts
│       └── Tipi → src/features/forms/types.ts
│
├── Cookie e Track Events
│   ├── Cookie
│   │   ├── Banner accessibile <aside> → src/features/consent/consent-banner.astro
│   │   ├── Accetta / rifiuta / preferenze → src/features/consent/consent-banner.astro
│   │   ├── Pannello granulare per categorie → src/features/consent/consent-banner.astro
│   │   ├── Riapertura dal footer → src/app/layout.astro
│   │   ├── Persistenza e policy Wix → src/shared/consent.ts
│   │   └── Riapplicazione al caricamento → src/features/consent/consent-bootstrap.astro
│   └── Track Events
│       ├── trackEvent con gate di consenso → src/shared/analytics.ts
│       ├── Helper delle viste client → src/shared/analytics-view.astro
│       ├── ArticleView → src/pages/blog/[...slug].astro
│       └── FormSubmit → src/features/forms/schema-form.tsx
│
├── SEO
│   ├── Titolo e descrizione predefiniti → src/app/layout.astro
│   ├── Canonical con PUBLIC_SITE_URL → src/app/layout.astro
│   ├── Open Graph + Twitter card → src/app/layout.astro
│   ├── JSON-LD Person base → src/app/layout.astro
│   ├── SEO per item di Wix → src/pages/blog/[...slug].astro, blog/category/[slug].astro
│   ├── JSON-LD FAQPage → src/pages/faq.astro
│   └── Sitemap e robots → gestiti da Wix (nessun file in public/)
│
├── Integrazioni Wix e livello dati
│   ├── Configurazione del sito → wix.config.json
│   ├── Modalità di autenticazione → src/shared/config.ts
│   ├── Seam unico SDK/REST → src/shared/sdk.ts
│   ├── Pacchetti → @wix/astro, @wix/astro-pages, @wix/astro-wix-hosting-adapter,
│   │              @wix/blog, @wix/dashboard, @wix/essentials, @wix/faq,
│   │              @wix/forms, @wix/portfolio, @wix/ricos, @wix/sdk,
│   │              @wix/seo, @wix/services-manager, @wix/site, @wix/cli
│   └── Piani di seed → seed/portfolio-plan.json, blog-plan.json, faq-plan.json, forms-plan.json
│
├── Media, design e accessibilità
│   ├── Risoluzione dei media Wix → src/shared/media.ts
│   ├── Ricos in HTML/testo sicuro → src/shared/ricos.ts
│   ├── Immagini locali ottimizzate → src/assets/photos/*.webp, src/features/home/photo-grid.astro
│   ├── Favicon e icone → public/favicon*, public/apple-touch-icon.png, public/android-chrome-*.png
│   ├── Webmanifest → public/site.webmanifest
│   ├── Loghi → public/logo.png, public/logo_QEP-copy-1.webp
│   ├── Token e stili → src/styles/global.css, DESIGN.md
│   ├── Motion con prefers-reduced-motion → src/features/home/scroll-world.ts
│   └── Accessibilità → skip link, aria-current, aria-expanded, focus/scroll lock, role="region"
│
├── Qualità e verifica
│   ├── Unit test → tests/unit/money.test.ts, consent.test.ts, analytics.test.ts
│   ├── Test E2E → tests/e2e/routes.spec.ts, tests/e2e/consent.spec.ts
│   ├── Configurazione unit → vitest.config.ts
│   ├── Configurazione E2E → playwright.config.ts
│   ├── Screenshot → .screenshots/cookie-consent-*.png
│   └── Comandi → npm run check, npm test, npm run test:e2e, npm run build, npm run release
│
├── CI/CD e ambiente
│   ├── CI push/PR → .github/workflows/ci.yml (npm ci, check, test)
│   ├── Release → .github/workflows/release.yml (workflow_dispatch / tag v*, Wix CLI)
│   ├── Variabili d'ambiente → .env.example, src/shared/config.ts
│   ├── Schema env tipizzato → astro.config.mjs (PUBLIC_SITE_URL)
│   ├── Template PR e contributo → .github/pull_request_template.md, CONTRIBUTING.md
│   └── Runtime → .nvmrc, .npmrc, .prettierrc, .prettierignore
│
├── Documentazione e skill
│   ├── Istruzioni del repo → AGENTS.md, CLAUDE.md
│   ├── Sistema di design → DESIGN.md
│   ├── Storico → ROADMAP-DONE.md
│   ├── Prossimi passi → ROADMAP-NEXT-STEPS.md
│   ├── Documentazione → DOCUMENTATION/
│   │   ├── Come iniziare → DOCUMENTATION/how-to-start/it.md
│   │   ├── Cosa può fare il cliente → DOCUMENTATION/client-can-do/it.md
│   │   └── Tutte le feature → DOCUMENTATION/all-features/it.md
│   └── Skill installate → .agents/skills/wix-headless-kit/, .agents/skills/wix-docs/
│
└── Materiale sorgente del cliente
    ├── Base di conoscenza → stefano-lunardi-assets/base-de-conocimiento.md
    ├── Struttura per sezioni → stefano-lunardi-assets/sitemap/
    ├── Fotografie → stefano-lunardi-assets/foto/
    ├── Premi e stampa → stefano-lunardi-assets/awards logo/, loghi-home-page/
    └── PDF → stefano-lunardi-assets/pdfs/

IN SOSPESO (non ancora implementato)
├── Multilingua DE / EN → ROADMAP-NEXT-STEPS.md
├── Dominio proprio + registrazione in Search Console → ROADMAP-NEXT-STEPS.md
├── Collegamento di GA4 / GTM / Meta nella dashboard di Wix → ROADMAP-NEXT-STEPS.md
└── Revisione di title/description pagina per pagina con il cliente → ROADMAP-NEXT-STEPS.md
```

> Nota: `DOCUMENTATION/all-features/it.md`, `DESIGN.md` e le roadmap vengono aggiornati quando la mappa cambia.
