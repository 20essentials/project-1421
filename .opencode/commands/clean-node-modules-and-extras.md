---
description: Limpia el proyecto Astro de artefactos generados (node_modules, dist, .astro, caches) conservando el código fuente y los .env
---

Limpia TODO lo generado por `pnpm install` y `pnpm build` en el proyecto ubicado en `$ARGUMENTS` (si no se pasa ruta, usa el directorio de trabajo actual).

## Regla de supervivencia (nunca se borran)

Antes de borrar nada, verifica que estos elementos sigan intactos. Si alguno no existe, NO lo recrees ni lo toques:

- `.env`, `.env.*`, `.env.example`, `.env.sample`, `.env.template`
- `src/**` (todo el código)
- `public/**` (assets estáticos)
- `astro.config.mjs` / `astro.config.ts`
- `package.json`, `tsconfig.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`
- `.gitignore`, `AGENTS.md`, `README.md`, `license.txt`
- `.git/**`, `.opencode/commands/**`, `.opencode/package.json`
- `preview/**` (material de referencia del proyecto)

## Qué se elimina

Ejecuta la eliminación de todo lo que sea regenerable:

```
node_modules/
dist/
.astro/
.cache/
.vite/
.turbo/
.parcel-cache/
.tsbuildinfo y *.tsbuildinfo
*.log (npm-debug.log*, yarn-*.log*, pnpm-debug.log*)
.DS_Store
.opencode/node_modules/
```

## Procedimiento

1. Confirma con `pwd` (o la ruta pasada en `$ARGUMENTS`) que estás en el proyecto correcto.
2. Haz un **dry run**: lista con `ls -a` / `du -sh` las carpetas que vas a borrar y muéstralas al usuario en una línea cada una con su tamaño, para que vea qué se pierde.
3. Pide confirmación al usuario antes de borrar. Si el usuario dice que sí, ejecuta la eliminación.
4. Borra con `rm -rf` solo las rutas listadas arriba, una por una desde la raíz del proyecto. NO uses comodines amplios como `rm -rf *` ni `rm -rf .*`.
5. Verificación final: vuelve a listar la raíz y confirma que `.env*`, `src/`, `public/`, `astro.config.mjs`, `package.json` y `pnpm-lock.yaml` siguen presentes.
6. Reporta en una sola línea: tamaño liberado y qué quedó.

## Notas

- `pnpm-lock.yaml` se conserva: es parte de la definición del proyecto, no un descartable.
- No ejecutes `pnpm install` después de limpiar, salvo que el usuario lo pida explícitamente.
- Si el proyecto no es Astro (aparece `vite.config.*` o `next.config.*`), aplica la misma lógica con las carpetas equivalentes: `dist/`, `node_modules/`, `.next/`, `.output/`.
- En Windows (git bash / powershell) usa `Remove-Item -Recurse -Force` si `rm -rf` no está disponible.
