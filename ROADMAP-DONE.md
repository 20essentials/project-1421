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
