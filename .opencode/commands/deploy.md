---
description: Publica el trabajo local — tests primero, release a Wix solo si pasan, luego push a origin
---

Despliega y sube los commits locales. El despliegue a Wix NO ocurre con el push:
se hace con `wix release` (requiere sesión de `npx wix login` en esta máquina).

1. `git fetch origin` y `git status` para ver el estado real.
2. Si hay commits sin commitear o cambios pendientes, avisa primero y pregunta si se deben commitear antes (usa el comando `commit`).
3. Ejecuta los tests en orden; si cualquiera falla, DETENTE, muestra el error y no despliegues ni pushees:
   - `npm run check` (astro check)
   - `npm test` (vitest)
4. Solo si ambos pasan, despliega a Wix: `npm run build` y luego `npm run release` (= `wix release`). `wix release` publica el `dist/` existente, no reconstruye: sin el build previo se publica una versión obsoleta.
   Si falla la autenticación, pide al usuario ejecutar `npx wix login` y reintenta una vez.
5. Después de un release exitoso, sube los commits: si `main` está adelantada respecto a `origin/main`, haz `git push origin main`.
6. Si el push es rechazado (remoto adelantado), NO hagas force-push: avisa y pregunta cómo proceder (pull/rebase).
7. Al terminar, muestra: resultado de los tests, resultado del release (URL si el output la incluye), hash del último commit pusheado y estado de la rama.
