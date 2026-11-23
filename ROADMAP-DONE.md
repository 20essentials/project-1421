# Done — Stefano Lunardi (Wix Headless)

Registro de trabajo terminado, tarea por tarea, con los keys/identificadores
importantes de cada una. Los valores de secretos NUNCA van aquí: solo nombres y
dónde viven. Los pasos siguientes viven en `ROADMAP-NEXT-STEPS.md`.

## Referencia permanente del proyecto

| Qué                        | Valor / dónde                                                              |
| -------------------------- | -------------------------------------------------------------------------- |
| Repositorio GitHub         | https://github.com/20essentials/project-1421 (rama `main`)                  |
| Cuenta GitHub              | `20essentials` (gh CLI autenticado)                                        |
| Live site                  | https://stefano-lunardi-d960960gm-0f09.wix-site-host.com                    |
| Dashboard Wix              | https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876       |
| `siteId` (wix.config.json) | `b24dc2d0-f24b-4d97-b733-550f7c321876`                                      |
| `appId` (wix.config.json)  | `8f9365b2-3cfc-480d-a2a7-305f65915cdc`                                      |
| API key Wix (CI)           | Secret `WIX_API_KEY` en GitHub → Settings > Secrets and variables > Actions |
| Gestor de API keys Wix     | https://manage.wix.com/account/api-keys (owner/co-owner)                    |
| Node version               | `.nvmrc` → 24 (local v24.22.3)                                             |
| Package manager            | npm (no pnpm/bun en este proyecto)                                         |
| Env vars locales           | `.env.local` (WIX_CLIENT_ID, WIX_CLIENT_INSTANCE_ID, WIX_CLIENT_PUBLIC_KEY) |
| Plantilla de referencia    | https://github.com/20essentials/project-1415                                |
| Comandos                   | `npm run dev` (cerrar puerto 4321 al terminar) · `npm run check` · `npm run build` · `npm run release` |

## Pasos cerrados del roadmap (trasladados desde ROADMAP-NEXT-STEPS.md)

### Paso 0 — Primera release desde CI
- Tag `v0.1.0` → workflow `Release` success (detalle en "Primera release vía tag v0.1.0", abajo).
- Verificación del live tras release: `v0.1.0` quedó obsoleta (11 commits después); con `v0.1.1` el live muestra favicon, header pill y logos de awards/prensa en home, `/awards` 200 (detalle en "Release v0.1.1 con el contenido actual").
- Keys: tags `v0.1.0` y `v0.1.1`, runs 44154953965 y 44191009760.

### Paso 1 — Logos de awards y prensa en Wix Media
- Logos servidos vía `static.wixstatic.com/media/600582_*~mv2` (las 12 URLs verificadas 200 el 2026-11-17).
- Grid de 10 seals en `src/pages/awards.astro` y banda "Riconoscimenti" en la homepage con logos de prensa (`src/pages/index.astro:146`).
- Regla del proyecto: todo asset de imagen en `.astro`/`.tsx` se llama con `baseUrl(...)` (el CSS puede usar rutas relativas).

### Paso 3 — Parches de node_modules
- Cerrado sin acción el 2026-11-17: con `@astrojs/cloudflare@14.3.2` no hay fixes para Windows en `dist/index.js` ni `dist/utils/wrangler-config.js` y los builds local (Windows) y de CI pasan igual. No aplicar `patch-package`; reabrir solo si un build limpio vuelve a fallar.

### Paso 4 — Formularios en vivo
- Envío real de "Heart to Heart" desde `/contatti` probado el 2026-11-17 (release v0.1.2): validación OK, mensaje de éxito mostrado y submission CONFIRMED en el sitio (id `c53729d2-9b53-42c4-ab15-e5dcf91ae228`). Screenshots en `.screenshots/h2h-live-*.png`.
- Form "Newsletter" wired: sección en el footer de todas las páginas (`src/app/layout.astro`), form id `99167414-c329-4e8f-8f02-db033652f376`, publicado en v0.1.2. Screenshots en `.screenshots/newsletter-footer-*`.
- Detalle completo en "Release v0.1.2" más abajo.

## 2026-11-17

### Scaffold Astro + verticales + seeds + marca
- Scaffold con Wix CLI (Astro managed), deploy de verticales portfolio, blog, faq, forms.
- Seeds completos: portfolio 4 proyectos/18 items, blog 3 posts, FAQ 13 preguntas reales, forms Heart to Heart + Newsletter.
- Capa de marca completa (crema/serif, italiano) en home, portfolio, blog, faq, contatti y páginas estáticas.
- FAQ del sitio limpiada: borradas 2 categorías de ejemplo de Wix y sus 6 preguntas (quedan 1 categoría + 13 preguntas).
- Build y release verificados en vivo: las 16 rutas responden 200 y la homepage renderiza SSR con contenido real.
- Keys: live site y dashboard arriba; `.env.local` con las credenciales del OAuth client del proyecto.

### Scaffolding de project-1415 (adaptado a npm)
- Añadidos: `.nvmrc` (24), `.gitattributes` (LF, binarios), `.npmrc` (`save-exact`, `legacy-peer-deps`), `.prettierrc` + `.prettierignore` + `prettier@3.8.1`, `.vscode/`, `.env.example`, `LICENSE.md` (MIT), `CONTRIBUTING.md`, PR template, workflows `ci.yml` y `release.yml`.
- Scripts nuevos en package.json: `check` (astro check), `format`, `format:check`.
- Todo con npm (decisión del proyecto: pnpm rompería el tooling de Wix).

### Git + GitHub + CI verde
- Git inicializado, remote `origin` → github.com/20essentials/project-1421, commits agrupados (scaffold, config, docs, ci) y pusheados.
- Secret `WIX_API_KEY` configurado por el usuario en GitHub Actions; workflows en npm (login Wix CLI + `env pull` + check + build).
- Fix de build: peer dep `@wix/services-manager` faltaba (con `legacy-peer-deps` npm no instala peers) → añadido exacto `1.0.7` como dependencia directa.
- CI: success → https://github.com/20essentials/project-1421/actions
- Keys: secret `WIX_API_KEY` (GitHub), remote `origin/main`, run verde del workflow CI.
- Commits clave: `fa81f58` scaffold · `ffe660c` ci auth · `771adbf` peer dep fix · `4d1e3ac` roadmaps.

### Primera release vía tag v0.1.0
- Tag `v0.1.0` → workflow `Release`: login Wix CLI + `env pull` + build + `wix release`.
- Fix del workflow: faltaba `wix env pull` en release.yml (fallaba con `Missing environment variable WIX_CLIENT_ID`) → añadido, commit `83fda95`.
- Release: success → https://github.com/20essentials/project-1421/actions
- Keys: tag `v0.1.0` (fuerza re-release: `git tag -f v<ver> && git push -f origin v<ver>`), workflow `Release` (manual o por tags `v*`).

### Release v0.1.1 con el contenido actual
- El live seguía sirviendo `v0.1.0` (tag en `83fda95`, 11 commits atrás: header pill, favicon set, logos de awards/prensa, rename kebab-case + alias `@`, tests vitest/playwright, restructura `app/features/shared`).
- Verificación previa: `astro check` 0 errores, `vitest` 6/6, `wix build` OK → push `main` + tag `v0.1.1` → workflow `Release` success (run 44191009760).
- Live verificado: homepage 200 con favicon nuevo, logos Vogue Sposa/Wezoree y menciones de awards; `/awards` 200.
- Keys: tag `v0.1.1`, release run https://github.com/20essentials/project-1421/actions/runs/44191009760.

### Release v0.1.2 — Newsletter en el footer + form Heart to Heart verificado
- Newsletter form (`99167414-c329-4e8f-8f02-db033652f376`) wired en el footer de todas las páginas (`src/app/layout.astro`), con fallback si el form no carga.
- Fix CI: `astro check` fallaba en `playwright.config.ts`/`vitest.config.ts` sin `@types/node` declarado → devDependency exacta `@types/node@16.9.1`.
- Form "Heart to Heart" probado end-to-end en el live: mensaje de éxito mostrado y submission CONFIRMED en el sitio (id `c53729d2-9b53-42c4-ab15-e5dcf91ae228`, consulta vía `/form-submission-service/v4/submissions/namespace/query`).
- Verificado paso 1 del roadmap: 12 logos de seals/prensa ya servidos vía `static.wixstatic.com/media/600582_*~mv2` (todas 200), grid en `/awards` y banda en home.
- Paso 3 cerrado: los parches de Windows en `@astrojs/cloudflare` ya no hacen falta (`14.3.2`, build local Windows + CI pasan sin ellos).
- Keys: tag `v0.1.2`, form Newsletter id `99167414-…`, form Heart to Heart id `9ab7aa27-14c9-4278-a9e5-c530df27d1ac`, screenshots `.screenshots/newsletter-footer-*` y `.screenshots/h2h-live-*`.

## 2026-11-18

### FAQ "Domande profonde" sembrada
- Categoría nueva "Domande profonde" (dallo Storybrand, según `stefano-lunardi-assets/sitemap/10-faq.md`): 8 preguntas con respuestas redactadas desde el KB (secciones 6, 7, 11, 12).
- Seed ejecutado con `node .agents/skills/wix-headless-kit/templates/faq/seed/seed-faq.mjs seed/faq-plan.json`: 8 creadas, 0 fallidas, 21 preguntas en el sitio; plan actualizado en `seed/faq-plan.json`.
- Live verificado: `https://stefanolunardi…/faq` renderiza "Domande profonde" (el FAQ se sirve desde Wix, no requiere release).
- Keys: categoría id `56b08ebe-a5b6-4b76-91e8-e284b6842de4`, preguntas: quanti-incontri `5d866e67…`, conoscerai-le `37911dd5…`, hai-fatto-un `417fec1e…`, come-gestisci-i `e5226a7b…`, scatti-anche-in `dc406d92…`, quante-foto `587fd137…`, posso-vedere-una `cb7c5485…`, hai-un-piano-b-per `c3a9dc82…`.
- Pendiente: confirmar textos con Stefano (números de la respuesta "Quante foto…").

### Revisión visual de la asignación de fotos (portfolio)
- Las 18 imágenes de los 4 proyectos miradas una por una con los ficheros originales. Resultado: 15 asignaciones OK, 3 banderas para confirmar con Stefano:
  1. **Venezia** ← `weddingemotions_sipa2016.jpg` (foto de emociones en ceremonia, B&N): sin evidencia visual de Venezia (posible boda austriaca; es una foto premiada SIPA 2016). Confirmar proyecto.
  2. **Il velo** ← `Z8D_6299.jpg` (pareja decorando la torta, color): sin velo ni tema del proyecto. Candidata a "Autentiche e naturali" general o a otro proyecto.
  3. **Hotel Excelsior** ← `…Excelsior_D8D4547.jpg` (primer plano de manos entrelazadas): estilo candid, no retrato editorial; encajaría mejor en "Autentiche e naturali".
- Notas menores OK: `_212.jpg` ( filename Excelsior) muestra el puente de Rialto; `01_veillow.jpg` (Il velo) es también Venezia; `Z8D_4743_1.jpg` parece interior de castillo austriaco. Todo coherente como "boda con base en Excelsior".
- Las 3 aéreas DJI ✓, los retratos editoriales de Excelsior ✓, los velos 04/05/11/7106 ✓.

### PDFs de stefano-lunardi-assets/pdfs/ — decisión
- Cerrado el 2026-11-18: no habrá material descargable (dossier/menú) por ahora. Los PDFs quedan como fuente local y la brochure ya está volcada como secciones web (método, inversión). Reabrir solo si Stefano pide un dossier descargable.

### Cierre de "5. Contenido que depende del cliente"
- Los 3 ítems de la sección 5 de `ROADMAP-NEXT-STEPS.md` quedan cerrados aquí; la sección queda solo con el seguimiento con Stefano (textos de las respuestas + 3 fotos marcadas).

## 2026-11-19 → 2026-11-21

### Rediseño visual y nuevas páginas
- Home: bio de Stefano con retrato (`9ba4464`), hero de cinco escenas color/B&N (`d1aaf69`), parallax fine-art con 10 slides y enlaces a Singulart/Luna Gallery (`c601b3d`, `99b82b0`, `42b900d`), sección "mi presento" con vídeo (`2554bff`), galería de arte (`6f485ea`), loop de pintura en la sección foto-e-video (`14a4c43`) y lightbox flip-zoom en la grid (`8ae8043`).
- Portfolio: showcase coil con three.js (`ea6c6c2`, `71afc2b`) movido de home a portfolio y retitulado "Ogni scatto un'opera" (`807d868`, `287a0ce`).
- Vídeo: página `/video` con films y grid de canales (`e790e45`), enlace YouTube en header/footer (`39542ac`), autoplay muted del vídeo destacado (`8d07693`).
- 404 interactiva con lente de marea (`40ffe4c`) + nav flotante y panel legible (`679e559`); se retiró la tarjeta 404 hardcoded del overlay (`38036fb`); redirect `/projects` → `/portfolio` (`244c2cc`).
- FAQ rediseñada con componentes editoriales y tests (`f65f291`); nav: indicador sigue hover/focus (`979fc96`), CTA preventivo en el pill mobile (`4b3b258`), offset del header movido a `main` (`6cffa61`).
- Consent: banner rediseñado con panel granular animado (`45eb496`).
- Estilos: smooth scroll con Lenis (`db73184`), textura dot-grid (`5d7d018`), clases canónicas Tailwind v4 (`1d2cda8`), padding horizontal en heroes full-width (`0a22863`), ripple de feedback en controles (`ade2ea8`).

### Media, formularios y calidad
- Todas las imágenes del sitio servidas desde Wix Media Manager (`0835be8`) y re-subidas en AVIF (`f679f83`); dimensiones intrínsecas en imágenes lazy (`d9cf6cb`) y logos (`7eb23fa`); fallback si falla el avatar del autor (`daa69e5`); logos de marca servidos desde wixstatic (`62615af`).
- Formularios: country picker buscable en "Location" (`ed5cc1f`), spam gate (`spam-core.ts` + tests) y ring focus-visible (`9ec9b7a`), limpieza de imports (`b57144b`).
- Reglas de agentes añadidas: tests Vitest/Playwright obligatorios para lógica TS (`1330570`), cero hints en `astro check` (`5860276`), consola sin warnings/errors (`7fc5f77`), Tailwind v4 canónico (`530bfd8`), catálogo de herramientas (`528fc2e`), skill `no-invented-code` (`cb94fca`), script `dev:fg` para foreground (`687c4d5`).
- CI/CD: deploy automático de `main` tras CI verde (`d7f7889`), comando local de deploy con tests antes de release (`fae049b`), `npm run release` = `build && wix release` (evita releases de `dist/` stale; historical note en `docs/wix-platform-issues.md`).
- Guía del dashboard del cliente (`bd8ba0f`) y guías de usuario en `DOCUMENTATION/` traducidas a en/it/es (`b23d092`, `0fae273`).

## 2026-11-22

### Contenido editable por el cliente desde Wix
- Capa de datos `site-content` + planes de seed (`a353f16`, `ca2f7b9`, `ea5b7b6`); home con todo texto/media por sección editable desde colecciones single-item (`61f4e8c`, plan `seed/single-item-pages-plan.json`), imágenes como URLs de media planas para arreglar srcset (`194f0e2`), campos de las colecciones ordenados según el flujo de página (`1e4d352`, `1d47949`).
- Labels del chrome (header/footer) desde colección single-item (`51fc46d`); info del negocio desde Wix site properties (`c28e337`).
- Scripts para OG image global (`6ccf178`), post-migration de posts del sitio antiguo (`f9334a5`), reviews reales en lugar de placeholders (`57b690a`), enlace a reseñas de matrimonio.com en el footer (`cc972c9`), ghost buttons en la home (`15f016c`), alineación legal y viñetas CMS restauradas (`967e36e`).
- E2E: sweep en vivo de titles/headings/redirects (`b42b52f`).

## 2026-11-23

### Multi-idioma (paso 2 del roadmap) — cerrado
- Núcleo de locales (`5f40e45`): `LOCALES = ["it", "es", "en", "de"]`, `DEFAULT_LOCALE = "it"`, resolución desde request/cookie `wixLanguage` (`src/features/i18n/`).
- Chrome, páginas y capas de datos en el idioma del visitante (`f120c9d`), CTAs internos hardcoded localizados (`07a314f`), menú de idiomas escribe la cookie antes de navegar (`9f8db7e`), SEO pide a Google no traducir (`40a5a84`).
- `hreflang` por locale + `x-default` en `src/app/layout.astro:173-176`; titles por página en páginas estáticas (§5 del log de plataforma).
- Estabilidad multilingual: assets de cada página servidos desde una sola base locale y con `?v=BUILD_ID` (`a7d86d6`), proxy de assets localizados para sortear el edge (`24a4d7f`), `autoSwitch: false` vía Locale Settings (cambio de configuración, registrado en §6; `3400c3c` cierra el hallazgo en el log). Detalle y evidencia en `docs/wix-platform-issues.md` §1, §2 y §6.

### SEO real y consistencia
- `src/pages/sitemap-full.xml.ts` con URLs reales de estáticas, posts, categorías/tags y portfolio; `/robots.txt` apunta a él; `llms.txt` curado subido por la API de Wix (`manuallyEdited: true`) — §5 del log de plataforma (`9ec9b7a`).
- Blog: categorías/tags resueltos por endpoint de query en vez de by-slug (`2254e98`), párrafos vacíos eliminados antes del viewer de Ricos (`cfe99be`).
- `docs/wix-platform-issues.md` creado y enlazado desde `AGENTS.md` (`4c7dfc7`, `c8df7af`): 6 hallazgos con evidencia, fix y riesgo residual (redirecciones de edge, caché variante, ruido de scripts Wix, 404s by-slug, título inyectado, cookie de locale).
- Ajustes en E2E para el error `AppId … Client 404` inyectado por Wix (`7c8eaa7` lo filtra en dev, `4c20982` lo retira del filtro); globals de contexto Wix ocultos al script MCP (`cb7db3a`).

### Cierre de warnings de consola (trabajo de hoy, releaseado)
- `[ConsentPolicy] setConsentPolicy is not available`: `src/shared/consent.ts` resuelve los mismos targets que el SDK (`globals.$ns["wix-window"].consentPolicy`, `window.consentPolicyManager`) y omite la llamada si no existe — en headless el wrapper solo avisaba y no hacía nada. Tests unitarios actualizados + 3 casos nuevos del guard.
- Icono 192×192 del manifest: el media item `600582_61952383…` quedó truncado en el Media Manager (IDAT declarado 4746 B, archivo 4530 B sin IEND; `createImageBitmap` fallaba). Regenerado desde `public/favicon.svg`, subido en dos pasos y marcado `READY`: `600582_0246be52d6fe4016bddd36f014a0979a~mv2.png`. `public/site.webmanifest` y `docs/images-sitemap.txt` actualizados; `docs/wix-platform-issues.md` §3 corregido (antes decía que el PNG era válido) y ampliado con el hallazgo de que el edge sirve bytes ICO en `/favicon.svg`.
- Enviados dos reportes a Wix (subida truncada servida como READY; reserva undocumented de `/favicon.svg`), previo OK explícito del cliente.
- Keys: `npm run check` 0/0/0, 112 tests unitarios en verde, release hecha y consola del live sin los dos warnings (queda solo el `AppId` inyectado por Wix, documentado como ruido).
