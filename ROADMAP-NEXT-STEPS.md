# Próximos pasos — Stefano Lunardi (Wix Headless)

Orden sugerido de ejecución. El registro de lo ya hecho (con sus keys) vive en
`ROADMAP-DONE.md`.

## 0. Primera release desde CI (listo para ejecutar)
- [x] Etiquetar y pushear para disparar el workflow `Release`: hecho con `v0.1.0`, success.
- [x] Verificar que el sitio live queda actualizado tras la release: `v0.1.0` quedó obsoleta (11 commits después); con `v0.1.1` (2026-11-17) el live muestra favicon, header pill y logos de awards/prensa en home; `/awards` 200.

## 1. Logos de awards y prensa en Wix Media (listo)
- [x] Subir a Wix Media los logos que están solo en local: ya servidos vía `static.wixstatic.com/media/600582_*~mv2` (las 12 URLs verificadas 200 el 2026-11-17).
- [x] Mostrarlos en `/awards` (grid de 10 seals en `src/pages/awards.astro`) y banda "Riconoscimenti" en la homepage con logos de prensa (`src/pages/index.astro:146`).
- [x] Regla del proyecto: todo asset de imagen en `.astro`/`.tsx` se llama con `baseUrl(...)` (el CSS puede usar rutas relativas).

## 2. Multi-idioma (DE / EN)
- [ ] Decidir enfoque (rutas `/de/…`, `/en/…` con astro i18n, o réplicas por página) y qué páginas se traducen primero (home, portfolio, contatti, faq).
- [ ] Traducir contenido del KB: los textos fuente ya existen en la base de conocimiento (italiano) y el fotógrafo trabaja Italia + Austria.
- [ ] Actualizar `hreflang` y el JSON-LD si se añaden idiomas.

## 3. Parches de node_modules (resuelto — no son necesarios)
- [x] Confirmado el 2026-11-17 con `@astrojs/cloudflare@14.3.2`: `node_modules` recién instalado (sin rastro de fixes para Windows en `dist/index.js` ni `dist/utils/wrangler-config.js`) y el build local en Windows (`wix build`) y el de CI pasan igual. No aplicar `patch-package`; reabrir solo si un build limpio vuelve a fallar.

## 4. Formularios en vivo
- [ ] Probar el envío real de "Heart to Heart" desde `/contatti` (validación, otros-valores, mensaje de éxito) y confirmar que la submission llega al dashboard.
- [ ] Integrar el form "Newsletter" (está sembrado en el sitio pero no está wired en ninguna página): sección en el footer o al final del blog.

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
Ver el detalle completo en `ROADMAP-DONE.md`.
