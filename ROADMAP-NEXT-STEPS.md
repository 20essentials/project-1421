# Próximos pasos — Stefano Lunardi (Wix Headless)

Orden sugerido de ejecución. El registro de lo ya hecho (con sus keys) vive en
`ROADMAP-DONE.md`.

## 2. Multi-idioma (DE / EN)
- [ ] Decidir enfoque (rutas `/de/…`, `/en/…` con astro i18n, o réplicas por página) y qué páginas se traducen primero (home, portfolio, contatti, faq).
- [ ] Traducir contenido del KB: los textos fuente ya existen en la base de conocimiento (italiano) y el fotógrafo trabaja Italia + Austria.
- [ ] Actualizar `hreflang` y el JSON-LD si se añaden idiomas.

## 5. Contenido que depende del cliente
- [ ] Las 8 "Domande profonde" del KB no tienen respuesta todavía → no se sembraron. Pedirle a Stefano las respuestas y añadirlas a FAQ si quiere.
- [ ] Revisión humana de la asignación de fotos: los 4 proyectos (venezia, il-velo, hotel-excelsior-venezia, aeree) se agruparon por evidencia de filenames; confirmar que ninguna foto quedó en el proyecto/boda equivocado.
- [ ] Descargar PDFs referenciados en `stefano-lunardi-assets/pdfs/` si el plan incluye material descargable (menu/dossier).

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
