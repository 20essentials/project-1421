---
description: Commitea los cambios pendientes, pasa tests, publica en Wix y pushea origin/main
---

Commitea todo el trabajo pendiente, verifica, despliega en Wix y sube los commits locales. El despliegue NO ocurre con el push: se hace con `wix release` (requiere sesión de `npx wix login` en esta máquina).

## Fase 1 — Commits

1. `git status` + `git diff` (staged y unstaged) + `git log --oneline -10` para entender qué cambió y el estilo vigente.
2. Ignora archivos con contenido sensible (`.env`, keys, tokens). Si aparecen, ni los stagees: avisa de una vez y detente.
3. Si hay trabajo ya staged, commítalo primero tal cual está.
4. Agrupa el resto en **commits lógicos** por unidad de cambio (feature, bugfix, refactor…). Cada commit debe poder compilarse/funcionar por sí solo. Los archivos sueltos que apuntan al mismo cambio van juntos; no hagas un commit gigante con todo.
5. Stagea los archivos de cada grupo, revisa `git diff --cached` y commitea uno por uno, sin atajos y sin mezclar pasos.

### Estilo de los mensajes (Conventional Commits)

Formato: `type(scope): descripción`

- `type` uno de: `feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `chore`, `ci`, `build`, `style`.
- `scope` (opcional) = el área tocada, kebab-case corto y en singular: `cart`, `events`, `donations`, `dining`, `blog`, `nav`, `analytics`. Sin scope si es global (`chore: update dependencies`).
- Descripción: **inglés**, lowercase, imperativo de positiva ("add", "avoid", "align", "fix"), sin punto final, ≤ 72 caracteres.
- Si el cambio toca varios scopes para una misma unidad (p. ej. feat + su test), un solo commit: `feat(cart): add quantity stepper to cart line items` — los tests van dentro del mismo commit, no separados.
- Preferir 1 commit cohesivo por unidad antes que 5 commits granulares del mismo cambio.

### Cuerpo del commit (opcional)

Solo cuando el commit no se explica en una línea: línea en blanco tras el subject, wrapped ~72 cols, explica el **por qué** (gotcha de API, decisión de diseño), no el qué. Nunca narres la acción ("esto cambia el archivo X").

### Reglas duras de commits

- Nada de `git commit -i`, force-push, ni enmendar commits fallidos: si un hook rechaza, arregla y crea un commit nuevo.
- Antes de commitear revisa el diff efectivo que vas a stageear (`git diff --cached`): no commitees archivos ajenos al grupo ni touches accidentales (`package-lock.json` por `patch-package` solo entra si el grupo toca deps).
- NO commitear nunca: `.wix/`, `.tmp/`, `node_modules/`, nada en `.gitignore`.

## Fase 2 — Verificación, release y push

6. Ejecuta los tests en orden; si cualquiera falla, DETENTE, muestra el error y no despliegues ni pushees:
   - `npm run check` (astro check)
   - `npm test` (vitest)
7. Solo si ambos pasan, despliega a Wix: `npm run build` y luego `npm run release` (= `wix release`). `wix release` publica el `dist/` existente, no reconstruye: sin el build previo se publica una versión obsoleta. Si falla la autenticación, pide al usuario ejecutar `npx wix login` y reintenta una vez.
8. Después de un release exitoso, `git fetch origin` y, si `main` está adelantada respecto a `origin/main`, haz `git push origin main`.
9. Si el push es rechazado (remoto adelantado), NO hagas force-push: avisa y pregunta cómo proceder (pull/rebase).

Al terminar, muestra: hashes de los commits creados (uno por línea), resultado de los tests, resultado del release (URL si el output la incluye), hash del último commit pusheado y estado de la rama.
