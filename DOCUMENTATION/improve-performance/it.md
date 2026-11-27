# Come superare 90 in Lighthouse Performance

> Stato: 2026-11-27. Guida per il build pubblicato su `https://stefano-lunardi-d960960gm-0f09.wix-site-host.com`.
> La misurazione di riferimento dello stesso build in preview è stata **Performance 68**, Accessibilità 100, Best Practices 96, SEO 100 e Agentic Browsing 100.

## 1. Perché il punteggio è 68 e cosa serve

Lighthouse mobile pesa così la categoria Performance:

| Metrica     | Peso | Valore attuale | Punteggio attuale | Obiettivo indicativo |
| ----------- | ---- | -------------- | ----------------- | -------------------- |
| FCP         | 10%  | 1.3 s          | 0.98              | mantenere            |
| Speed Index | 10%  | 5.9 s          | 0.48              | < 3.4 s              |
| LCP         | 25%  | 1.3 s          | 1.00              | mantenere            |
| TBT         | 30%  | 1,700 ms       | 0.11              | < 200 ms             |
| CLS         | 25%  | 0              | 1.00              | mantenere            |

Quasi tutti i punti persi vengono da **TBT** e **Speed Index**. LCP, FCP e CLS sono già buoni: ottimizzare il banner o le immagini above-the-fold non cambierà molto. Per raggiungere 90+ bisogna ridurre il tempo di blocco del main thread, non tanto il peso delle foto.

## 2. Cosa è già stato fatto nel repo

Queste ottimizzazioni sono già applicate e pubblicate; non ripeterle:

- `src/app/layout.astro`: le tre letture Wix indipendenti (`getForm`, `fetchSiteInfo`, `getSiteChrome`) girano con `Promise.all`.
- `src/app/layout.astro`: `SchemaForm` usa `client:visible` invece di `client:load`.
- `src/app/layout.astro`: `mountRipple()` e `mountSmoothScroll()` vengono chiamati in idle con `requestIdleCallback(..., { timeout: 1500 })` e fallback `setTimeout(..., 200)`.
- `src/features/consent/consent-banner.astro`: uno script `is:inline` apre il banner al primo paint se non c'è una decisione salvata in `sl_consent_v1`.
- `src/features/home/artistic-parallax.astro`: immagine in entrata con `fetchpriority="high"` e immagine in uscita con `fetchpriority="low"`.
- `src/shared/media.ts` e `src/wix/media.ts`: URL Wix con `q_90`.

## 3. Dove stanno davvero i punti mancanti

| Blocco                          | Evidenza                                                                                                                                                                   | Chi può agire                  |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Script iniettati da Wix         | Long task: `document` 647 ms e 436 ms, `siteTags.bundle.min.js` 372 ms, `site-web-vitals.umd.min.js` 141 ms, `site-bi.umd.min.js` 99 ms, `site-analytics.umd.min.js` 78 ms | Dashboard di Wix               |
| TTFB dell'edge                  | Risposte ripetute con `x-cache: MISS`, `x-cache-status: MISS`, `age: 0`; TTFB misurato tra 1.4 s e 2.2 s                                                                   | Wix / piattaforma              |
| Errore in console di un'app Wix | `AppId 196175ca-0c1e-41ec-9f9a-ceafda45b2bd does not expose function correctly, error code: Client 404`                                                                    | Dashboard di Wix               |
| Peso delle immagini             | La home scarica circa 850 KiB di immagini Wix; `q_90` è conservativo                                                                                                       | Repo, con una decisione visiva |

L'errore in console di Wix spiega perché Best Practices è 96 e non 100. Non è un difetto del codice Astro.

## 4. Piano d'azione, in ordine

### Passo 1 — Ridurre gli script iniettati da Wix

È l'unica leva con una possibilità reale di raggiungere 90+.

1. Apri la dashboard di Wix e controlla le app e le impostazioni di script/analytics/tag manager.
2. Cerca specificamente gli script che compaiono nel trace: `siteTags.bundle.min.js`, `site-web-vitals.umd.min.js`, `site-bi.umd.min.js`, `site-analytics.umd.min.js`.
3. Disabilitali **uno alla volta**, non tutti insieme, e rimisura dopo ogni modifica.
4. Prima di dare indicazioni sulle rotte della dashboard, consulta la skill `wix-manage` → recipe `dashboard-navigation`. Non inventare mai rotte `manage.wix.com`.
5. Se un'app serve per analytics o per il business, decidi con il cliente cosa mantenere. Non disabilitarla di tua iniziativa.

Obiettivo: portare TBT sotto 200 ms e Speed Index sotto 3.4 s.

### Passo 2 — Gestire il TTFB dell'edge

L'HTML arriva con `x-cache: MISS` anche su richieste ripetute. Questo non si risolve da Astro:

- Non provare a risolverlo con altra cache nel repo se la risposta dell'edge dice ancora `MISS`.
- Registra l'header in ogni misurazione.
- Se cambi dominio o attivi un livello CDN proprio, rimisura da zero; non dare per scontato che il `MISS` sparisca.
- Consulta `docs/wix-platform-issues.md` prima di debuggare un sintomo che "non dovrebbe succedere".

### Passo 3 — Ridurre il peso delle immagini solo se accetti il compromesso visivo

Se il cliente accetta una leggera perdita di nitidezza:

- In `src/shared/media.ts` e `src/wix/media.ts`, cambia `q_90` in `q_75` negli URL `fill`.
- Fai screenshot prima e dopo della home e della griglia foto; confronta su uno schermo reale, non solo per byte.
- Aggiungi o adatta i test se cambiano gli URL attesi.
- Esegui di nuovo `npm run check`, `npm test` e `npm run test:e2e`.

Questo può aiutare Speed Index, ma **non** risolverà il TBT dominato da Wix.

### Passo 4 — Differire le rimanenti island e gli script del repo

Se c'è ancora margine dopo i passi precedenti:

- Controlla i componenti che usano `client:load` e passali a `client:visible` o `client:idle` quando non influenzano il primo paint.
- Lascia immediati solo lo script del consenso, `localizeLinks` e ciò che serve a evitare layout shift.
- Estendi il pattern `whenIdle()` in `src/app/layout.astro` ad altri enhancement non critici.
- Non mettere mai codice browser nel frontmatter di un `.astro`: viene eseguito in SSR e può fallire con `HTMLElement is not defined`.

### Passo 5 — Non rompere ciò che già funziona

Dopo ogni modifica:

```bash
npm run check
npm test
npm run test:e2e
npm run build
```

Inoltre:

- Usa `npm run dev:fg`, mai `npm run dev`.
- Fai screenshot solo della sezione modificata in `.screenshots/`.
- Controlla la console: zero warning e zero errori di competenza del progetto. L'errore noto di Wix `AppId` va documentato, non silenziato.
- `astro check` deve riportare 0 errori, 0 warning e 0 hint.

## 5. Come misurare

Lo strumento MCP `lighthouse_audit` non riporta performance; usa la CLI:

```bash
npx lighthouse "https://stefano-lunardi-d960960gm-0f09.wix-site-host.com/" \
  --only-categories=performance \
  --form-factor=mobile \
  --output=json \
  --output-path=./lighthouse-performance.json
```

Salva anche il trace, per identificare i long task:

```bash
npx lighthouse "https://stefano-lunardi-d960960gm-0f09.wix-site-host.com/" \
  --only-categories=performance \
  --form-factor=mobile \
  --save-assets \
  --output=json \
  --output-path=./lighthouse-trace.json
```

Ripeti la misurazione almeno tre volte. L'edge di Wix varia; una singola corsa non basta per decidere.

## 6. Regole di pubblicazione

- Una modifica al codice finisce verificata, **non pubblicata**.
- Pubblica solo con un ordine esplicito, seguendo `.opencode/commands/deploy.md` o `.opencode/commands/commit-and-deploy.md`.
- Non eseguire `git push --force` se il remoto è avanti; chiedi come procedere.
- Se dopo aver disabilitato gli script Wix il punteggio resta sotto 90, documenta il blocco in `docs/wix-platform-issues.md` e accetta il numero reale invece di alterare la misurazione.
