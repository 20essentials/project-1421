# Roadmap — Stefano Lunardi (Wix Headless)

Keys e identificadores importantes del proyecto. Los secretos NUNCA van aquí ni en
ningún archivo: solo sus nombres y dónde viven.

## Identificadores

| Qué                          | Valor / dónde                                                              |
| ---------------------------- | -------------------------------------------------------------------------- |
| Repositorio GitHub           | https://github.com/20essentials/project-1421 (rama `main`)                  |
| Cuenta GitHub                | `20essentials` (gh CLI autenticado)                                        |
| Live site                    | https://stefano-lunardi-d960960gm-0f09.wix-site-host.com                    |
| Dashboard Wix                | https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876       |
| `siteId` (wix.config.json)   | `b24dc2d0-f24b-4d97-b733-550f7c321876`                                      |
| `appId` (wix.config.json)    | `8f9365b2-3cfc-480d-a2a7-305f65915cdc`                                      |
| API key Wix (CI)             | Secret `WIX_API_KEY` en GitHub → Settings > Secrets and variables > Actions |
| Gestor de API keys Wix       | https://manage.wix.com/account/api-keys (owner/co-owner)                    |
| Node version                 | `.nvmrc` → 24 (local v24.22.3)                                             |
| Package manager              | npm (no pnpm/bun en este proyecto)                                         |
| Env vars locales             | `.env.local` (WIX_CLIENT_ID, WIX_CLIENT_INSTANCE_ID, WIX_CLIENT_PUBLIC_KEY) |
| Plantilla de referencia      | https://github.com/20essentials/project-1415                                |

## Comandos clave

- `npm run dev` — dev server en http://localhost:4321 (cerrar y liberar el puerto al terminar).
- `npm run check` — typecheck (`astro check`), 0 errores/0 warnings exigido.
- `npm run build` — build vía Wix CLI.
- `npm run release` — release a Wix hosting.
- `git tag v<version> && git push --tags` — dispara el workflow `Release` (deploy a producción).
- `npx @wix/cli env pull` — restaura `.env.local` desde el sitio (lo hace CI automáticamente).

## Estado actual (2026-11-17)

- Git inicializado; remote `origin` apuntando a project-1421; todo pusheado a `main`.
- CI verde: https://github.com/20essentials/project-1421/actions (npm ci → login Wix → env pull → check → build).
- Fix aplicado: peer dep `@wix/services-manager@1.0.7` añadido como dependencia exacta (con `legacy-peer-deps` npm no lo instala).
- Stack: Wix-managed Astro · verticales portfolio, blog, faq, forms · idioma actual: italiano.
- Seeds completos (portfolio 4 proyectos/18 items, blog 3 posts, FAQ 13 preguntas reales, forms Heart to Heart + Newsletter).
- Capa de marca completa (crema/serif, italiano) en home, portfolio, blog, faq, contatti y páginas estáticas.
- FAQ del sitio limpiada: 1 categoría + 13 preguntas.
- Build y release verificados en vivo: las 16 rutas responden 200 y la homepage renderiza SSR con contenido real.
- Los pasos sucesivos viven en `ROADMAP-NEXT-STEPS.md`.
