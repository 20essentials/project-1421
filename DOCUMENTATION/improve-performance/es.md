# Cómo superar 90 en Lighthouse Performance

> Estado: 2026-11-27. Guía para el build publicado en `https://stefano-lunardi-d960960gm-0f09.wix-site-host.com`.
> La medición de referencia del mismo build en preview fue **Performance 68**, Accessibilidad 100, Best Practices 96, SEO 100 y Agentic Browsing 100.

## 1. Por qué el score es 68 y qué hace falta

Lighthouse mobile pondera así el apartado de Performance:

| Métrica     | Peso | Valor actual | Score actual | Objetivo aproximado |
| ----------- | ---- | ------------ | ------------ | ------------------- |
| FCP         | 10%  | 1.3 s        | 0.98         | mantener            |
| Speed Index | 10%  | 5.9 s        | 0.48         | < 3.4 s             |
| LCP         | 25%  | 1.3 s        | 1.00         | mantener            |
| TBT         | 30%  | 1,700 ms     | 0.11         | < 200 ms            |
| CLS         | 25%  | 0            | 1.00         | mantener            |

Casi todos los puntos perdidos vienen de **TBT** y **Speed Index**. LCP, FCP y CLS ya están bien: optimizar el banner o las imágenes de arriba no cambiará mucho el resultado. Para llegar a 90+ hay que bajar el tiempo de bloqueo del hilo principal, no tanto el peso de las fotos.

## 2. Lo que ya está hecho en el repo

Estas optimizaciones ya están aplicadas y publicadas; no las repitas:

- `src/app/layout.astro`: las tres lecturas Wix independientes (`getForm`, `fetchSiteInfo`, `getSiteChrome`) se ejecutan con `Promise.all`.
- `src/app/layout.astro`: `SchemaForm` usa `client:visible` en lugar de `client:load`.
- `src/app/layout.astro`: `mountRipple()` y `mountSmoothScroll()` se llaman en idle con `requestIdleCallback(..., { timeout: 1500 })` y fallback `setTimeout(..., 200)`.
- `src/features/consent/consent-banner.astro`: script `is:inline` abre el banner en el primer paint si no hay decisión guardada en `sl_consent_v1`.
- `src/features/home/artistic-parallax.astro`: imagen entrante con `fetchpriority="high"` y saliente con `fetchpriority="low"`.
- `src/shared/media.ts` y `src/wix/media.ts`: URLs Wix con `q_90`.

## 3. Donde están realmente los puntos que faltan

| Bloqueador                      | Evidencia                                                                                                                                                                   | Quién puede actuar        |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Scripts inyectados por Wix      | Long tasks: `document` 647 ms y 436 ms, `siteTags.bundle.min.js` 372 ms, `site-web-vitals.umd.min.js` 141 ms, `site-bi.umd.min.js` 99 ms, `site-analytics.umd.min.js` 78 ms | Dashboard de Wix          |
| TTFB del edge                   | Respuestas repetidas con `x-cache: MISS`, `x-cache-status: MISS`, `age: 0`; TTFB medido entre 1.4 s y 2.2 s                                                                 | Wix / plataforma          |
| Error de consola de una app Wix | `AppId 196175ca-0c1e-41ec-9f9a-ceafda45b2bd does not expose function correctly, error code: Client 404`                                                                     | Dashboard de Wix          |
| Peso de imágenes                | La home descarga ~850 KiB de imágenes Wix; `q_90` es conservador                                                                                                            | Repo, con decisión visual |

El error de consola de Wix explica por qué Best Practices es 96 y no 100. No es un fallo del código de Astro.

## 4. Plan de acción, en orden

### Paso 1 — Reducir los scripts inyectados por Wix

Es la única palanca con posibilidades reales de llegar a 90+.

1. Abre el dashboard de Wix y revisa las apps y la configuración de scripts/analytics/tag manager.
2. Busca específicamente los scripts que aparecen en el trace: `siteTags.bundle.min.js`, `site-web-vitals.umd.min.js`, `site-bi.umd.min.js`, `site-analytics.umd.min.js`.
3. Desactívalos **uno por uno**, no todos a la vez, y vuelve a medir después de cada cambio.
4. Antes de dar instrucciones de ruta en el dashboard, consulta la skill `wix-manage` → recipe `dashboard-navigation`. Nunca inventes rutas `manage.wix.com`.
5. Si alguna app es necesaria para analítica o negocio, decide con el cliente qué se conserva. No la desactives por iniciativa propia.

Objetivo: que TBT baje de 1,700 ms a menos de 200 ms y Speed Index por debajo de 3.4 s.

### Paso 2 — Tratar el TTFB del edge

El HTML llega con `x-cache: MISS` incluso en peticiones repetidas. Eso no se arregla desde Astro:

- No intentes arreglarlo con más caché en el repo si la respuesta del edge sigue siendo `MISS`.
- Registra el header en cada medición.
- Si se cambia de dominio o se activa una capa CDN propia, vuelve a medir desde cero; no asumas que el `MISS` desaparecerá.
- Consulta `docs/wix-platform-issues.md` antes de depurar un síntoma que “no debería pasar”.

### Paso 3 — Bajar el peso de imágenes solo si aceptas el compromiso visual

Si el cliente acepta algo de pérdida de nitidez:

- En `src/shared/media.ts` y `src/wix/media.ts`, cambia `q_90` por `q_75` en las URLs `fill`.
- Haz capturas antes y después de la home y del grid de fotos; compara en pantalla real, no solo por bytes.
- Añade o ajusta tests si cambian las URLs esperadas.
- Vuelve a ejecutar `npm run check`, `npm test` y `npm run test:e2e`.

Esto puede ayudar al Speed Index, pero **no** resolverá el TBT dominado por Wix.

### Paso 4 — Diferir el resto de islands y scripts propios

Si todavía queda margen después de los pasos anteriores:

- Revisa los componentes con `client:load` y cámbialos a `client:visible` o `client:idle` cuando no afecten al primer paint.
- Mantén inmediatos solo el script de consentimiento, `localizeLinks` y lo que sea necesario para evitar layout shift.
- Amplía el patrón `whenIdle()` de `src/app/layout.astro` a otros enhancements no críticos.
- Nunca metas código de navegador en el frontmatter de un `.astro`: se ejecuta en SSR y puede romper con `HTMLElement is not defined`.

### Paso 5 — No romper lo que ya funciona

Después de cualquier cambio:

```bash
npm run check
npm test
npm run test:e2e
npm run build
```

Además:

- Usa `npm run dev:fg`, nunca `npm run dev`.
- Toma capturas solo de la sección modificada en `.screenshots/`.
- Verifica consola: cero warnings y cero errors propios. El error conocido de `AppId` de Wix debe documentarse, no silenciarse.
- `astro check` debe dar 0 errores, 0 warnings y 0 hints.

## 5. Cómo medir

El MCP `lighthouse_audit` no reporta performance; usa el CLI:

```bash
npx lighthouse "https://stefano-lunardi-d960960gm-0f09.wix-site-host.com/" \
  --only-categories=performance \
  --form-factor=mobile \
  --output=json \
  --output-path=./lighthouse-performance.json
```

Guarda también el trace para identificar long tasks:

```bash
npx lighthouse "https://stefano-lunardi-d960960gm-0f09.wix-site-host.com/" \
  --only-categories=performance \
  --form-factor=mobile \
  --save-assets \
  --output=json \
  --output-path=./lighthouse-trace.json
```

Repite la medición al menos tres veces. El edge de Wix varía; una sola corrida no es suficiente para decidir.

## 6. Reglas de publicación

- Un cambio de código termina verificado, **no publicado**.
- Publica solo con una orden explícita siguiendo `.opencode/commands/deploy.md` o `.opencode/commands/commit-and-deploy.md`.
- No hagas `git push --force` si el remoto está adelantado; pregunta cómo proceder.
- Si después de desactivar scripts Wix el score sigue por debajo de 90, documenta el bloqueo en `docs/wix-platform-issues.md` y acepta el número real en lugar de maquillar la medición.
