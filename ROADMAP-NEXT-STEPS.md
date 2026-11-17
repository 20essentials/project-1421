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
- [ ] Alta en Google Search Console + enviar sitemap generado por Wix.
- [ ] Analytics/píxel si el cliente quiere medir.
- [ ] Revisar titles/descriptions por página (el layout ya soporta SEO por página; los posts y FAQs usan el servicio de SEO de Wix).

## Hecho (referencia)
Ver el detalle completo en `ROADMAP-DONE.md`, sección "Pasos cerrados del roadmap".
- Paso 0 — Primera release desde CI: cerrado con `v0.1.0` y verificado en vivo con `v0.1.1`.
- Paso 1 — Logos de awards y prensa en Wix Media: cerrado (12 URLs en `static.wixstatic.com`, grid en `/awards` + banda en home).
- Paso 3 — Parches de node_modules: cerrado (innecesarios con `@astrojs/cloudflare@14.3.2`).
- Paso 4 — Formularios en vivo: cerrado (Heart to Heart probado end-to-end, Newsletter wired en el footer; release `v0.1.2`).
