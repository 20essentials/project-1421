# Feature map — Stefano Lunardi (Wix Headless)

> Current status: 2026-11-18. Paths relative to the project root.
> This map describes what the project has already implemented; what is pending is at the end.

```text
stefanolunardi-photographer
│
├── Pages and routes (SSR with Astro)
│   ├── Home → src/pages/index.astro
│   ├── Portfolio
│   │   ├── Collection list → src/pages/portfolio.astro
│   │   ├── Collection by slug → src/pages/portfolio/[slug].astro
│   │   └── Project detail → src/pages/projects/[slug].astro
│   ├── Blog
│   │   ├── Feed → src/pages/blog.astro
│   │   ├── Post → src/pages/blog/[...slug].astro
│   │   ├── Category → src/pages/blog/category/[slug].astro
│   │   └── Tag → src/pages/blog/tag/[slug].astro
│   ├── FAQ → src/pages/faq.astro
│   ├── Contact → src/pages/contatti.astro
│   ├── Chi sono → src/pages/chi-sono.astro
│   ├── Il mio metodo → src/pages/il-mio-metodo.astro
│   ├── Location → src/pages/location.astro
│   ├── Investimento → src/pages/investimento.astro
│   ├── Recensioni → src/pages/recensioni.astro
│   ├── Awards → src/pages/awards.astro
│   ├── Fine art → src/pages/fine-art.astro
│   └── Impressum → src/pages/impressum.astro
│
├── Navigation and layout
│   ├── Base layout → src/app/layout.astro
│   │   ├── <html lang="it">, favicons, manifest, theme-color
│   │   ├── Per-page SEO slot → <slot name="seo-tags">
│   │   ├── Cookie bootstrap + cookie banner
│   │   ├── <main id="contenido"> and skip link
│   │   └── Global footer
│   ├── Header → src/app/header.astro
│   │   ├── Fixed pill with blur/shadow on scroll
│   │   ├── Brand + desktop nav + active indicator
│   │   ├── CTA to /contatti
│   │   └── Mobile menu: overlay, inert, Escape, close on navigation
│   └── Footer → src/app/layout.astro
│       ├── Newsletter (SchemaForm + fallback)
│       ├── Secondary navigation and contact
│       ├── Social links + copyright
│       ├── "Preferenze cookie" → reopen the panel
│       └── Link to /impressum
│
├── Home and visual sections
│   ├── Full-bleed hero + CTAs → src/pages/index.astro
│   ├── Editorial manifesto → src/pages/index.astro
│   ├── Editorial photo grid → src/features/home/photo-grid.astro
│   ├── Scroll-world (sticky/wipe/parallax) → src/features/home/scroll-world.ts
│   ├── Collections + shooting types → src/pages/index.astro
│   ├── Photo + video (Metodo Fusion) → src/pages/index.astro
│   ├── Latest articles → src/pages/index.astro
│   ├── Awards/press band → src/pages/index.astro
│   ├── Testimonial + FAQ preview → src/pages/index.astro
│   └── Final "Tell me your story" / "Get started" CTA → src/pages/index.astro
│
├── Wix content (domain features)
│   ├── Blog
│   │   ├── Posts and DTO mapping → src/features/blog/posts.ts, posts-core.ts
│   │   ├── Categories and tags → src/features/blog/taxonomy.ts, taxonomy-core.ts
│   │   ├── Authors → src/features/blog/authors.ts, authors-core.ts
│   │   ├── Comments → src/features/blog/comments.ts, comments-core.ts
│   │   ├── Likes → src/features/blog/post-likes.ts, post-like-button.tsx
│   │   ├── Rich content (Ricos) → src/features/blog/rich-content.tsx
│   │   ├── Feed / filters / states → src/features/blog/blog-feed-store.ts, feed.tsx
│   │   └── Types → src/features/blog/types.ts
│   ├── Portfolio
│   │   ├── Wix Portfolio reading → src/features/portfolio/portfolio.ts, portfolio-core.ts
│   │   ├── Collections → src/features/portfolio/collections-store.ts, collections-view.tsx
│   │   ├── Projects by collection → src/features/portfolio/collection-projects-store.ts, collection-page.tsx
│   │   ├── Project detail → src/features/portfolio/project-detail-store.ts, project-page.tsx
│   │   ├── Gallery → src/features/portfolio/gallery.tsx, gallery-media.tsx
│   │   └── Types → src/features/portfolio/types.ts
│   ├── FAQ
│   │   ├── Wix FAQ reading → src/features/faq/faq.ts, faq-core.ts
│   │   ├── Debounced search → src/features/faq/faq-search.tsx
│   │   ├── Category filter → src/features/faq/faq-category-nav.tsx
│   │   ├── Accessible accordion + deep-link → src/features/faq/faq-accordion.tsx
│   │   ├── Shared state → src/features/faq/faq-store.ts, use-faq.ts
│   │   └── Types → src/features/faq/types.ts
│   └── Forms
│       ├── Heart to Heart → src/pages/contatti.astro
│       ├── Newsletter in footer → src/app/layout.astro
│       ├── Schema-driven rendering → src/features/forms/schema-form.tsx
│       ├── Validation, rules and steps → src/features/forms/use-wix-form.ts
│       ├── Address fields → src/features/forms/forms-address-core.ts, address-templates.generated.ts
│       ├── Submission sending → src/features/forms/submissions.ts, submissions-core.ts
│       ├── State → src/features/forms/form-store.ts
│       └── Types → src/features/forms/types.ts
│
├── Cookies and Track Events
│   ├── Cookies
│   │   ├── Accessible banner <aside> → src/features/consent/consent-banner.astro
│   │   ├── Accept / reject / preferences → src/features/consent/consent-banner.astro
│   │   ├── Granular panel by categories → src/features/consent/consent-banner.astro
│   │   ├── Reopening from footer → src/app/layout.astro
│   │   ├── Persistence and Wix policy → src/shared/consent.ts
│   │   └── Reapply on load → src/features/consent/consent-bootstrap.astro
│   └── Track Events
│       ├── trackEvent with consent gate → src/shared/analytics.ts
│       ├── Client view helper → src/shared/analytics-view.astro
│       ├── ArticleView → src/pages/blog/[...slug].astro
│       └── FormSubmit → src/features/forms/schema-form.tsx
│
├── SEO
│   ├── Default title and description → src/app/layout.astro
│   ├── Canonical with PUBLIC_SITE_URL → src/app/layout.astro
│   ├── Open Graph + Twitter card → src/app/layout.astro
│   ├── Base JSON-LD Person → src/app/layout.astro
│   ├── Per-item SEO from Wix → src/pages/blog/[...slug].astro, blog/category/[slug].astro
│   ├── JSON-LD FAQPage → src/pages/faq.astro
│   └── Sitemap and robots → managed by Wix (no files in public/)
│
├── Wix integrations and data layer
│   ├── Site configuration → wix.config.json
│   ├── Authentication mode → src/shared/config.ts
│   ├── Single SDK/REST seam → src/shared/sdk.ts
│   ├── Packages → @wix/astro, @wix/astro-pages, @wix/astro-wix-hosting-adapter,
│   │              @wix/blog, @wix/dashboard, @wix/essentials, @wix/faq,
│   │              @wix/forms, @wix/portfolio, @wix/ricos, @wix/sdk,
│   │              @wix/seo, @wix/services-manager, @wix/site, @wix/cli
│   └── Seed plans → seed/portfolio-plan.json, blog-plan.json, faq-plan.json, forms-plan.json
│
├── Media, design and accessibility
│   ├── Wix media resolution → src/shared/media.ts
│   ├── Ricos to safe HTML/text → src/shared/ricos.ts
│   ├── Optimized local images → src/assets/photos/*.webp, src/features/home/photo-grid.astro
│   ├── Favicons and icons → public/favicon*, public/apple-touch-icon.png, public/android-chrome-*.png
│   ├── Webmanifest → public/site.webmanifest
│   ├── Logos → public/logo.png, public/logo_QEP-copy-1.webp
│   ├── Tokens and styles → src/styles/global.css, DESIGN.md
│   ├── Motion with prefers-reduced-motion → src/features/home/scroll-world.ts
│   └── Accessibility → skip link, aria-current, aria-expanded, focus/scroll lock, role="region"
│
├── Quality and verification
│   ├── Unit tests → tests/unit/money.test.ts, consent.test.ts, analytics.test.ts
│   ├── E2E tests → tests/e2e/routes.spec.ts, tests/e2e/consent.spec.ts
│   ├── Unit config → vitest.config.ts
│   ├── E2E config → playwright.config.ts
│   ├── Visual screenshots → .screenshots/cookie-consent-*.png
│   └── Commands → npm run check, npm test, npm run test:e2e, npm run build, npm run release
│
├── CI/CD and environment
│   ├── Push/PR CI → .github/workflows/ci.yml (npm ci, check, test)
│   ├── Release → .github/workflows/release.yml (workflow_dispatch / tag v*, Wix CLI)
│   ├── Environment variables → .env.example, src/shared/config.ts
│   ├── Typed env schema → astro.config.mjs (PUBLIC_SITE_URL)
│   ├── PR template and contribution → .github/pull_request_template.md, CONTRIBUTING.md
│   └── Runtime → .nvmrc, .npmrc, .prettierrc, .prettierignore
│
├── Documentation and skills
│   ├── Repo instructions → AGENTS.md, CLAUDE.md
│   ├── Design system → DESIGN.md
│   ├── History → ROADMAP-DONE.md
│   ├── Next steps → ROADMAP-NEXT-STEPS.md
│   ├── Documentation tree → DOCUMENTATION/
│   │   ├── How to start → DOCUMENTATION/how-to-start/en.md
│   │   ├── What the client can do → DOCUMENTATION/client-can-do/en.md
│   │   └── All features → DOCUMENTATION/all-features/en.md
│   └── Installed skills → .agents/skills/wix-headless-kit/, .agents/skills/wix-docs/
│
└── Client source material
    ├── Knowledge base → stefano-lunardi-assets/base-de-conocimiento.md
    ├── Section structure → stefano-lunardi-assets/sitemap/
    ├── Photographs → stefano-lunardi-assets/foto/
    ├── Awards and press → stefano-lunardi-assets/awards logo/, loghi-home-page/
    └── PDFs → stefano-lunardi-assets/pdfs/

PENDING (not implemented yet)
├── Multi-language DE / EN → ROADMAP-NEXT-STEPS.md
├── Own domain + Search Console signup → ROADMAP-NEXT-STEPS.md
├── Connecting GA4 / GTM / Meta in the Wix dashboard → ROADMAP-NEXT-STEPS.md
└── Review of per-page titles/descriptions with the client → ROADMAP-NEXT-STEPS.md
```

> Note: `DOCUMENTATION/all-features/en.md`, `DESIGN.md` and the roadmaps are updated when the map changes.
