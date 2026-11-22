# Come iniziare sul proprio computer

Guida per clonare questo progetto, collegarlo al **tuo** account Wix e avviarlo. I segreti e i dati locali vanno in file ignorati da Git; devi creare `.opencode/opencode.json` dal modello prima di usare OpenCode. Gli identificatori del sito risiedono in `wix.config.json` e si cambiano solo se intendi puntare il progetto a un altro sito.

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

## 5. Creare la configurazione di OpenCode

**Devi creare `.opencode/opencode.json`.** Il repo contiene solo il modello `.opencode/opencode.example.json`; OpenCode non userà il modello. Copialo e inserisci il tuo token Wix:

```bash
cp .opencode/opencode.example.json .opencode/opencode.json
# modifica .opencode/opencode.json e incolla il tuo token MCP Wix in "Authorization"
```

La struttura risultante è:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "wix-mcp": {
      "type": "remote",
      "url": "https://mcp.wix.com/mcp",
      "headers": {
        "Authorization": "<il-tuo-token-mcp-wix>",
        "wix-account-id": "60058239-f2bd-408b-89a2-6d464dff6e8a"
      }
    },
    "chrome-devtools": {
      "type": "local",
      "command": ["npx", "-y", "chrome-devtools-mcp@1.10.1"],
      "timeout": {
        "startup": 60000
      }
    }
  }
}
```

- Lascia `Authorization` vuoto solo nel modello; un `opencode.json` reale deve contenere il tuo token. Non committare né condividere quel token.
- Il token deve appartenere all'account Wix a cui appartiene il sito e avere i permessi SEO Settings; altrimenti le chiamate SEO di Wix restituiscono `403 PERMISSION_DENIED`.
- Cambia `wix-account-id` solo se stai puntando l'MCP a un altro account Wix.
- Questa struttura non usa OAuth e non legge `.opencode/wix-account-id`; OpenCode non carica `.env.local`, quindi mettere l'ID là non serve.

Dopo aver creato il file:

1. Riavvia OpenCode (la configurazione non viene ricaricata a caldo).
2. Verifica con `opencode mcp list`: devono comparire `cloudflare`, `wix-mcp` e `chrome-devtools`.

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

| Sintomo                                       | Soluzione                                                                                                                       |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `wix-mcp` non si connette                     | Controlla che `.opencode/opencode.json` esista e contenga un `Authorization` valido e l'`wix-account-id`, poi riavvia OpenCode. |
| `needs authentication` in `opencode mcp list` | `Authorization` è vuoto o non valido; compilalo e riavvia OpenCode.                                                             |
| `403 PERMISSION_DENIED` negli strumenti SEO   | Il token non ha i permessi SEO Settings; rigeneralo con l'account Wix corretto.                                                 |
| `Dev server failed to start within 30s`       | Usa `npm run dev:fg` e attendi il banner.                                                                                       |
| `astro check` mostra hint                     | Rimuovi il codice morto (import/dichiarazioni non usati) prima di terminare.                                                    |
| La CLI lavora con il sito sbagliato           | Controlla `appId` e `siteId` in `wix.config.json` prima di accedere.                                                            |
