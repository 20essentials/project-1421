# Come iniziare sul proprio computer

Guida per clonare questo progetto, collegarlo al **tuo** account Wix e avviarlo. I segreti e i dati locali vanno in file ignorati da Git; gli identificatori del sito risiedono in `wix.config.json` e si cambiano solo se intendi puntare il progetto a un altro sito.

## 1. Requisiti

- Node 24 (vedi `.nvmrc`) e npm.
- Git.
- Accesso come collaboratore all'account Wix che contiene il sito di `wix.config.json`.
- Se intendi usare il codice con un sito Wix tuo: i valori `appId` e `siteId` di quel sito.
- Opzionale: Chrome/Chromium per l'MCP DevTools di OpenCode.

## 2. Installazione

```bash
git clone <URL-del-repo>
cd stefanolunardi-photographer
npm i
```

Il CLI di Wix è già in `devDependencies`, quindi si usa con `npx wix ...` dalla cartella del progetto.

## 3. Esaminare `wix.config.json`

Questo file versionato collega il codice al sito e all'app Wix:

```json
{
  "appId": "<app-id>",
  "siteId": "<site-id>"
}
```

- Se lavori **su questo stesso sito**, non toccarlo: contiene già gli identificatori corretti.
- Se vuoi usare il codice con **il tuo sito Wix**, sostituisci `appId` e `siteId` con quelli del tuo progetto **prima** di `npx wix login` e `npx wix env pull`. Fallo in un branch tuo: cambiare questi valori reindirizza la CLI, le variabili e il release a un altro sito.

## 4. Accedere a Wix e scaricare l'ambiente

```bash
npx wix login
npx wix env pull
```

`wix login` mostra un codice e apre il browser per autorizzare la CLI; segui le istruzioni nel terminale. `wix env pull` unisce le variabili del progetto in `.env.local` (ignorato da Git). Non copiare valori reali da `.env` né caricarli nel repo: `.env.example` è solo il modello.

Se serve cambiare account: `npx wix logout` e poi esegui di nuovo `npx wix login`.

## 5. Configurare gli MCP di OpenCode

Il repo include `.opencode/opencode.json` con due server: `wix-mcp` (OAuth, nessun token nel repo) e `chrome-devtools`. L'unico dato locale è l'account ID di Wix:

```bash
cp .opencode/wix-account-id.example .opencode/wix-account-id
# modifica .opencode/wix-account-id e inserisci qui il tuo Wix account ID (un UUID)
```

Questo file è in `.gitignore`; la config lo legge con `{file:wix-account-id}`. OpenCode **non** carica `.env.local`, quindi non serve mettere l'ID là. Se il file manca, l'header resta vuoto e `wix-mcp` non si connette.

Dopo:

1. Riavvia OpenCode (la configurazione non viene ricaricata a caldo).
2. Esegui `/mcps` → `wix-mcp` → accedi con OAuth nel browser.
3. Verifica con `opencode mcp list`: devono comparire `cloudflare`, `wix-mcp` e `chrome-devtools`.

L'account ID è l'UUID dell'account Wix a cui appartiene il sito. Se non ce l'hai, chiedilo al proprietario dell'account o copialo da un computer in cui l'MCP è già configurato.

## 6. Avviare il sito

```bash
npm run dev:fg
```

Attendi il banner `astro ... ready in ... ms` e apri `http://localhost:4321`. Usa `dev:fg`, non `npm run dev`: il fork Wix di Astro forza la modalità background per gli agenti e abortisce per timeout. Se la porta 4321 è occupata, uccidi il processo che l'ascolta prima di avviare (`netstat -ano | grep :4321` → `taskkill //PID <pid> //F`).

## 7. Verifiche e release

```bash
npm run check          # astro check: 0 errori, 0 warning, 0 hint
npm run test           # Vitest (logica TypeScript)
npm run test:e2e       # Playwright (comportamento nel browser)
npm run format:check   # Prettier
```

Una modifica al codice termina con `npm run release` (Wix CLI); il server di sviluppo non è la versione live. Fallo solo se hai il permesso di pubblicare su quel sito.

## 8. Dove si trova il contenuto

Il contenuto e il commerce appartengono al sito Wix, non a questo repo: blog, FAQ, portfolio, formulari, SEO, ecc. si gestiscono dalla dashboard. Consulta [CLIENT-CAN-DO.md](../client-can-do/it.md) prima di toccare qualsiasi cosa lì o di dare istruzioni al cliente.

Per le convenzioni di codice, le regole sulle immagini, gli screenshot e il flusso di release, leggi `AGENTS.md`.

## Problemi comuni

| Sintomo                                       | Soluzione                                                                          |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| `wix-mcp` non si connette                     | Controlla `.opencode/wix-account-id`, riavvia OpenCode ed esegui OAuth in `/mcps`. |
| `needs authentication` in `opencode mcp list` | È il passaggio OAuth ancora da fare; non è un errore della configurazione.         |
| `Dev server failed to start within 30s`       | Usa `npm run dev:fg` e attendi il banner.                                          |
| `astro check` mostra hint                     | Rimuovi il codice morto (import/dichiarazioni non usati) prima di terminare.       |
| La CLI lavora con il sito sbagliato           | Controlla `appId` e `siteId` in `wix.config.json` prima di accedere.               |
