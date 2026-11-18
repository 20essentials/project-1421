# Próximos pasos — Stefano Lunardi (Wix Headless)

Orden sugerido de ejecución. El registro de lo ya hecho (con sus keys) vive en
`ROADMAP-DONE.md`.


## 5. Contenido que depende del cliente — cerrado 2026-11-18 (ver ROADMAP-DONE.md)
- Queda solo el seguimiento con Stefano: confirmar los textos de las respuestas "Domande profonde" (sobre todo los números de la respuesta 6) y las 3 fotos marcadas en la revisión del portfolio.


### FUTURO (YO TE DIRE CUANDO)

## 2. Multi-idioma (DE / EN)
- [ ] Decidir enfoque (rutas `/de/…`, `/en/…` con astro i18n, o réplicas por página) y qué páginas se traducen primero (home, portfolio, contatti, faq).
- [ ] Traducir contenido del KB: los textos fuente ya existen en la base de conocimiento (italiano) y el fotógrafo trabaja Italia + Austria.
- [ ] Actualizar `hreflang` y el JSON-LD si se añaden idiomas.

## 6. Dominio y SEO
- [ ] Conectar el dominio propio (ahora es el subdominio `wix-site-host.com`).
- [ ] Alta en Google Search Console + enviar sitemap generado por Wix (el sitemap/robots ya están activos y cubren todas las rutas).
- [x] Analytics + consentimiento en código: `trackEvent` con gate de consentimiento, banner granular y eventos `FormSubmit` / `ArticleView`.
- [ ] Conectar GA4 / GTM / Meta desde el dashboard de Wix si el cliente quiere medir (no añadir SDKs al repo).
- [x] Canonical, OG/Twitter y JSON-LD de persona en el layout (los posts y FAQs siguen usando el servicio de SEO de Wix).
- [ ] Revisar titles/descriptions por página con el cliente.

## Hecho (referencia)
Ver el detalle completo en `ROADMAP-DONE.md`, sección "Pasos cerrados del roadmap".
- Paso 0 — Primera release desde CI: cerrado con `v0.1.0` y verificado en vivo con `v0.1.1`.
- Paso 1 — Logos de awards y prensa en Wix Media: cerrado (12 URLs en `static.wixstatic.com`, grid en `/awards` + banda en home).
- Paso 3 — Parches de node_modules: cerrado (innecesarios con `@astrojs/cloudflare@14.3.2`).
- Paso 4 — Formularios en vivo: cerrado (Heart to Heart probado end-to-end, Newsletter wired en el footer; release `v0.1.2`).
- Paso 7 — Analytics/consentimiento, SEO base, tests y CI: cerrado en código (14 unitarios + 17 E2E, `astro check` y build OK; CI en `.github/workflows/ci.yml`).
