---
description: Configura Prettier profesional (Astro + Tailwind CSS v4) con format-on-save y scripts
agent: build
---

Configura en este proyecto el formateo "profesional 2026" para Astro 7 + Tailwind CSS v4, igual que en un proyecto Astro moderno con Prettier, `prettier-plugin-astro` y `prettier-plugin-tailwindcss`. Ejecuta los pasos y deja el repo formateado y verificado.

## Reglas

- No inventes rutas ni asumas estructura: inspecciona antes de cambiar.
- Respeta el gestor de paquetes del proyecto (`pnpm-lock.yaml` -> `pnpm`, `package-lock.json` -> `npm`, `yarn.lock` -> `yarn`, `bun.lock`/`bun.lockb` -> `bun`). Si no hay lock, usa `pnpm` si existe `pnpm-workspace.yaml` o el usuario lo pide, si no `npm`.
- Instala dependencias de formato como devDependencies **exactas** (sin `^`), igual que el resto de deps exactas del repo si ese es el estilo.
- No sobrescribas configuraciones existentes a ciegas: fusiona/ajusta con criterio. Conserva opciones ya presentes salvo conflicto.
- No formatees ni toques `node_modules/`, `.git/`, `dist/`, `.astro/`, `.wrangler/`, `coverage/`, artefactos de build o archivos generados/lock.
- Si el proyecto no usa Astro o no usa Tailwind, adapta: omite el plugin/ajuste que no aplique y explica brevemente qué omitiste.

## 1) Inspección

1. Lee `package.json`, locks y estructura (`src/`, `styles`, `.vscode/`, configs existentes).
2. Detecta si usa Astro (`astro` en deps o `astro.config.*`) y Tailwind v4 (dep `tailwindcss`/`@tailwindcss/*` o `@import "tailwindcss"` en CSS).
3. Localiza el/los archivos CSS que importan Tailwind (busca `@import "tailwindcss"`). Elige el **entry stylesheet** principal del proyecto (p. ej. `./src/styles/global.css`) para `tailwindStylesheet`.
4. Revisa si ya existen `.prettierrc*`, `prettier.config.*`, `.prettierignore`, `.editorconfig`, `.vscode/settings.json`, `.vscode/extensions.json` y scripts `format`/`format:check`.

## 2) Dependencias

Instala/actualiza como devDependencies exactas:

- `prettier`
- `prettier-plugin-astro` (solo si el proyecto usa Astro)
- `prettier-plugin-tailwindcss` (solo si el proyecto usa Tailwind; debe ser el **último** plugin)

Usa versiones estables y compatibles entre sí. Referencia validada (Astro 7 / Tailwind v4): `prettier@3.10.1`, `prettier-plugin-astro@1.1.2`, `prettier-plugin-tailwindcss@0.8.1` (ajusta si el proyecto ya fijó otras o si hay incompatibilidad conocida; prioriza estabilidad y que `format:check` pase).

Ejemplo (pnpm): `pnpm add -D -E prettier@3.10.1 prettier-plugin-astro@1.1.2 prettier-plugin-tailwindcss@0.8.1`

## 3) Configuración de Prettier

Crea o actualiza `.prettierrc.json` (o el formato de config que ya use el proyecto) con:

- `plugins`: incluye `prettier-plugin-astro` y/o `prettier-plugin-tailwindcss` según aplique. **`prettier-plugin-tailwindcss` siempre va al final** del array.
- `overrides`: para Astro, fuerza el parser:
  ```json
  [{ "files": "*.astro", "options": { "parser": "astro" } }]
  ```
- `tailwindStylesheet`: ruta relativa al entry CSS con `@import "tailwindcss"` (p. ej. `"./src/styles/global.css"`), solo si usa Tailwind v4.
- Mantén el resto de opciones de estilo que el proyecto ya tenga; no impongas tabs/quotes/semis si ya hay convención, salvo que falte config.

## 4) `.prettierignore`

Crea o amplía `.prettierignore` para excluir al menos (ajusta a lo que exista):

```
dist/
.astro/
node_modules/
.wrangler/
.output/
coverage/
pnpm-lock.yaml
package-lock.json
yarn.lock
bun.lockb
test-results/
playwright-report/
```

No ignores código fuente del proyecto (`src/`, `public/` salvo assets binarios grandes si aplica) ni configs que deban formatearse.

## 5) Scripts en `package.json`

Añade si faltan (sin romper scripts existentes):

- `"format": "prettier . --write"`
- `"format:check": "prettier . --check"`

## 6) VS Code (format-on-save)

Crea o fusiona `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[astro]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "prettier.documentSelectors": ["**/*.astro"],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

Crea o fusiona `.vscode/extensions.json` recomendando al menos:

- `astro-build.astro-vscode` (si es proyecto Astro)
- `esbenp.prettier-vscode`

No elimines recomendaciones existentes.

## 7) Formatear y verificar

1. Ejecuta el script de formato del proyecto (`format`) sobre el repo.
2. Ejecuta `format:check` y confirma que termina sin errores.
3. Si `format:check` falla, corrige la causa (rutas/ignore/plugins) y repite hasta que pase.
4. Resume los archivos de configuración creados/modificados, versiones instaladas, stylesheet elegido para Tailwind y el resultado de `format:check`.

## Notas

- En Tailwind v4 el orden correcto de clases depende de `tailwindStylesheet`; si el orden no cambia, revisa que la ruta apunte al CSS que contiene `@import "tailwindcss"`.
- El flujo esperado es: escribir código ya formateado + format-on-save + `format`/`format:check` al cerrar una tanda de cambios (no tras cada micro-edición).
