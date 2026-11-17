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
