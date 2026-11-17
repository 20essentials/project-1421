# Próximos pasos — Stefano Lunardi (Wix Headless)

Orden sugerido de ejecución. Los keys/identificadores viven en `ROADMAP-CURRENT.md`.

## 0. Primera release desde CI (listo para ejecutar)
- [ ] Etiquetar y pushear para disparar el workflow `Release`:
  `git tag v0.1.0 && git push origin v0.1.0` (o dispararlo manual desde Actions).
- [ ] Verificar que el sitio live queda actualizado tras la release.

## 1. Logos de awards y prensa en Wix Media
- [ ] Subir a Wix Media los logos que están solo en local:
  - `stefano-lunardi-assets/awards logo/` (seals IPA, QEP, winner/hmention, colormaster…)
  - `stefano-lunardi-assets/loghi-home-page/` (Vogue Sposa, Wezoree, color-awards, mifa…)
- [ ] Mostrarlos en `/awards` (hoy es solo texto) y considerar una banda de "featured in" en la homepage con los logos de `loghi-home-page`.
- [ ] Recordar regla del proyecto: todo asset de imagen en `.astro`/`.tsx` se llama con `baseUrl(...)` (el CSS puede usar rutas relativas).

## 2. Multi-idioma (DE / EN)
- [ ] Decidir enfoque (rutas `/de/…`, `/en/…` con astro i18n, o réplicas por página) y qué páginas se traducen primero (home, portfolio, contatti, faq).
- [ ] Traducir contenido del KB: los textos fuente ya existen en la base de conocimiento (italiano) y el fotógrafo trabaja Italia + Austria.
- [ ] Actualizar `hreflang` y el JSON-LD si se añaden idiomas.

## 3. Persistir los parches de node_modules
- [ ] Los fixes para Windows en `node_modules/@astrojs/cloudflare/dist/index.js`, `dist/utils/wrangler-config.js` se pierden con un `npm install` limpio → aplicar `patch-package` (o reponerlos antes del próximo build/release). Nota: CI build ya pasa sin ellos, confirmar si siguen siendo necesarios.

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
- Scaffold Astro + deploy de verticales, seeds completos, capa de marca, FAQ limpiada, build/release verificados en vivo.
- Git inicializado y pusheado a GitHub (20essentials/project-1421), CI verde con login Wix + env pull + check + build.
- Fix de peer dep `@wix/services-manager` para que el build pase también en CI.
- Scaffolding de project-1415 adaptado: .nvmrc, .gitattributes, .npmrc, prettier, CONTRIBUTING, LICENSE, .vscode, .env.example, PR template, workflows CI/Release (todo en npm).
