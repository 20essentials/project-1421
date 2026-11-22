# Cómo empezar en tu propio ordenador

Guía para clonar este proyecto, conectarlo a **tu** cuenta Wix y arrancarlo. Los secretos y datos locales van en archivos ignorados por Git; los identificadores del sitio viven en `wix.config.json` y solo se cambian si vas a apuntar el proyecto a otro sitio.

## 1. Requisitos

- Node 24 (ver `.nvmrc`) y npm.
- Git.
- Acceso de colaborador a la cuenta Wix que contiene el sitio de `wix.config.json`.
- Si vas a usar el código con un sitio Wix propio: los valores de `appId` y `siteId` de ese sitio.
- Opcional: Chrome/Chromium para el MCP de DevTools de OpenCode.

## 2. Instalar

```bash
git clone <URL-del-repo>
cd stefanolunardi-photographer
npm i
```

El CLI de Wix ya está en `devDependencies`, así que se usa con `npx wix ...` desde la carpeta del proyecto.

## 3. Revisar `wix.config.json`

Este archivo versionado conecta el código con el sitio y la app de Wix:

```json
{
  "appId": "<app-id>",
  "siteId": "<site-id>"
}
```

- Si trabajas en **este mismo sitio**, no lo toques: ya contiene los identificadores correctos.
- Si quieres usar el código con **tu propio sitio Wix**, sustituye `appId` y `siteId` por los de tu proyecto **antes** de `npx wix login` y `npx wix env pull`. Hazlo en una rama propia: cambiar estos valores redirige el CLI, las variables y el release a otro sitio.

## 4. Iniciar sesión en Wix y bajar el entorno

```bash
npx wix login
npx wix env pull
```

`wix login` muestra un código y abre el navegador para autorizar el CLI; sigue las instrucciones de la terminal. `wix env pull` fusiona las variables del proyecto en `.env.local` (ignorado por Git). No copies valores reales de `.env` ni los subas al repo: `.env.example` solo es la plantilla.

Si hace falta cambiar de cuenta: `npx wix logout` y vuelve a ejecutar `npx wix login`.

## 5. Configurar los MCP de OpenCode

El repo trae `.opencode/opencode.json` con dos servidores: `wix-mcp` (OAuth, sin tokens en el repo) y `chrome-devtools`. El único dato local es el account ID de Wix:

```bash
cp .opencode/wix-account-id.example .opencode/wix-account-id
# edita .opencode/wix-account-id y pon ahí tu Wix account ID (un UUID)
```

Ese archivo está en `.gitignore`; la config lo lee con `{file:wix-account-id}`. OpenCode **no** carga `.env.local`, así que no sirve poner el ID ahí. Si el archivo falta, el header queda vacío y `wix-mcp` no conecta.

Después:

1. Reinicia OpenCode (la configuración no se recarga en caliente).
2. Ejecuta `/mcps` → `wix-mcp` → inicia sesión con OAuth en el navegador.
3. Comprueba con `opencode mcp list`: deben aparecer `cloudflare`, `wix-mcp` y `chrome-devtools`.

El account ID es el UUID de la cuenta Wix a la que pertenece el sitio. Si no lo tienes, pídelo al dueño de la cuenta o cópialo de un ordenador donde el MCP ya esté configurado.

## 6. Arrancar la web

```bash
npm run dev:fg
```

Espera el banner `astro ... ready in ... ms` y abre `http://localhost:4321`. Usa `dev:fg`, no `npm run dev`: el Wix fork de Astro obliga a modo background para agentes y aborta por timeout. Si el puerto 4321 está ocupado, mata el proceso que lo escucha antes de arrancar (`netstat -ano | grep :4321` → `taskkill //PID <pid> //F`).

## 7. Verificaciones y release

```bash
npm run check          # astro check: 0 errores, 0 warnings, 0 hints
npm run test           # Vitest (lógica TypeScript)
npm run test:e2e       # Playwright (comportamiento en navegador)
npm run format:check   # Prettier
```

Un cambio de código termina con `npm run release` (Wix CLI); el servidor de desarrollo no es la versión live. Hazlo solo si tienes permiso para publicar en ese sitio.

## 8. Dónde está el contenido

El contenido y el commerce los posee el sitio Wix, no este repo: blog, FAQ, portfolio, formularios, SEO, etc. se gestionan desde el dashboard. Consulta [CLIENT-CAN-DO.md](../client-can-do/es.md) antes de tocar nada ahí o de dar instrucciones al cliente.

Para convenciones de código, reglas de imágenes, screenshots y flujo de release, lee `AGENTS.md`.

## Problemas habituales

| Síntoma                                       | Solución                                                                     |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| `wix-mcp` no conecta                          | Revisa `.opencode/wix-account-id`, reinicia OpenCode y haz OAuth en `/mcps`. |
| `needs authentication` en `opencode mcp list` | Es el paso OAuth pendiente; no es un error de la config.                     |
| `Dev server failed to start within 30s`       | Usa `npm run dev:fg` y espera el banner.                                     |
| `astro check` muestra hints                   | Elimina el código muerto (imports/declaraciones sin usar) antes de terminar. |
| El CLI trabaja con el sitio equivocado        | Revisa `appId` y `siteId` en `wix.config.json` antes de iniciar sesión.      |
