# How to get started on your own computer

Guide to cloning this project, connecting it to **your** Wix account and starting it up. Secrets and local data go into files ignored by Git; you must create `.opencode/opencode.json` from the template before using OpenCode. The site identifiers live in `wix.config.json` and are only changed if you are going to point the project at another site.

## 1. Requirements

- Node 24 (see `.nvmrc`) and npm.
- Git.
- Collaborator access to the Wix account that contains the site in `wix.config.json`.
- If you are going to use the code with your own Wix site: that site's `appId` and `siteId` values.
- Optional: Chrome/Chromium for OpenCode's DevTools MCP.

## 2. Install

```bash
git clone <URL-del-repo>
cd stefanolunardi-photographer
npm i
```

The Wix CLI is already in `devDependencies`, so it is used with `npx wix ...` from the project folder.

## 3. Review `wix.config.json`

This versioned file connects the code to the Wix site and app:

```json
{
  "appId": "<app-id>",
  "siteId": "<site-id>"
}
```

- If you are working on **this same site**, don't touch it: it already contains the correct identifiers.
- If you want to use the code with **your own Wix site**, replace `appId` and `siteId` with the ones from your project **before** `npx wix login` and `npx wix env pull`. Do it on your own branch: changing these values redirects the CLI, the variables and the release to another site.

## 4. Log in to Wix and pull the environment

```bash
npx wix login
npx wix env pull
```

`wix login` shows a code and opens the browser to authorize the CLI; follow the instructions in the terminal. `wix env pull` merges the project's variables into `.env.local` (ignored by Git). Do not copy real `.env` values or upload them to the repo: `.env.example` is only the template.

If you need to switch accounts: `npx wix logout` and run `npx wix login` again.

## 5. Create the OpenCode configuration

**You must create `.opencode/opencode.json`.** The repo only ships the template `.opencode/opencode.example.json`; OpenCode will not use the template. Copy it and fill in your own Wix token:

```bash
cp .opencode/opencode.example.json .opencode/opencode.json
# edit .opencode/opencode.json and paste your Wix MCP token into "Authorization"
```

The resulting structure is:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "wix-mcp": {
      "type": "remote",
      "url": "https://mcp.wix.com/mcp",
      "headers": {
        "Authorization": "<your-wix-mcp-token>",
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

- Leave `Authorization` empty only in the template; a real `opencode.json` must contain your token. Do not commit or share that token.
- The token must belong to the Wix account that owns the site and have SEO settings permissions; otherwise Wix SEO calls return `403 PERMISSION_DENIED`.
- Change `wix-account-id` only if you are pointing the MCP at a different Wix account.
- This structure does not use OAuth and does not read `.opencode/wix-account-id`; OpenCode does not load `.env.local`, so putting the ID there has no effect.

After creating the file:

1. Restart OpenCode (the configuration is not hot-reloaded).
2. Check with `opencode mcp list`: `cloudflare`, `wix-mcp` and `chrome-devtools` should appear.

## 6. Start the site

```bash
npm run dev:fg
```

Wait for the `astro ... ready in ... ms` banner and open `http://localhost:4321`. Use `dev:fg`, not `npm run dev`: the Wix fork of Astro forces background mode for agents and aborts on timeout. If port 4321 is busy, kill the process listening on it before starting (`netstat -ano | grep :4321` → `taskkill //PID <pid> //F`).

## 7. Checks and release

```bash
npm run check          # astro check: 0 errors, 0 warnings, 0 hints
npm run test           # Vitest (TypeScript logic)
npm run test:e2e       # Playwright (browser behaviour)
npm run format:check   # Prettier
```

A code change is NOT released automatically: it only ends verified (`astro check`, tests, screenshots). Deploy/publish ONLY on explicit order, with the commands `.opencode/commands/deploy.md` or `.opencode/commands/commit-and-deploy.md` — never on your own initiative.

## 8. Where the content lives

The content and commerce are owned by the Wix site, not by this repo: the blog, FAQ, portfolio, forms, SEO, etc. are managed from the dashboard. See [CLIENT-CAN-DO.md](../client-can-do/en.md) before touching anything there or giving the client instructions.

For code conventions, image rules, screenshots and the release flow, read `AGENTS.md`.

## Common problems

| Symptom                                       | Solution                                                                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `wix-mcp` does not connect                    | Check that `.opencode/opencode.json` exists and has a valid `Authorization` and `wix-account-id`, then restart OpenCode. |
| `needs authentication` in `opencode mcp list` | `Authorization` is empty or invalid; fill it in and restart OpenCode.                                                    |
| `403 PERMISSION_DENIED` from SEO tools        | The token lacks SEO settings permissions; regenerate it with the correct Wix account.                                    |
| `Dev server failed to start within 30s`       | Use `npm run dev:fg` and wait for the banner.                                                                            |
| `astro check` shows hints                     | Remove dead code (unused imports/declarations) before finishing.                                                         |
| The CLI works with the wrong site             | Check `appId` and `siteId` in `wix.config.json` before logging in.                                                       |
