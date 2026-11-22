## CLI Commands

All CLI instructions can be found at:
node_modules/@wix/cli/agents/instructions.md

## Tools catalog — source of truth for ideas & libraries

Use **[20essentials/tools-catalog](https://github.com/20essentials/tools-catalog)** as the curated, project-focused source of truth for reusable tools, libraries, patterns, components, services, and implementation ideas. It is a specific, maintained catalog for this workflow — not a generic “awesome list” to browse at random.

- **When user asks for "next steps", ideas, inspiration, or "what can I add"**: consult `20essentials/tools-catalog` first (browse relevant categories/files) and propose options grounded in it.
- **When unsure which library/component/pattern to implement**: check the matching category in `20essentials/tools-catalog` before guessing or defaulting to generic suggestions.
- **How to use it**: inspect the repo structure/categories on GitHub; prefer entries with clear URL, use case, and caveats. Treat it as curated guidance, then validate fit for this project.
- **Maintenance**: if adding/updating catalog entries, keep them factual and concise, with URL, use case, and caveats. No secrets/tokens, no author promotion.

### User-facing documentation — `DOCUMENTATION/<doc>/<lang>.md`

Docs meant for humans other than the coding agent live under `DOCUMENTATION/`: one folder per
document, one file per language (`en.md`, `it.md`, `es.md`). Current documents are `how-to-start`,
`client-can-do` and `all-features`; `DOCUMENTATION/README.md` is the index.

- Agent-only docs (`AGENTS.md`, `CLAUDE.md`, `DESIGN.md`, `ROADMAP-*.md`) stay at the repo root and
  are not translated.
- Any change to a user-facing doc must be applied to all three language files in the same session.
  Update `DOCUMENTATION/README.md` when a document is added or removed. Never add a new
  user-facing markdown file at the repo root.
- Keep paths, commands, URLs and identifiers identical across translations; translate prose only.
- The client dashboard guide (`DOCUMENTATION/client-can-do/{en,it,es}.md`) lists everything the
  client can manage themselves from the Wix dashboard (blog posts/categories/tags/comments, FAQ,
  portfolio, form submissions, SEO, invoices…). Rules:
  - Any change that touches or reveals a dashboard-managed capability (a new app installed on the
    site, a new collection/app surfaced by the frontend, a changed authoring flow) must be reflected
    in all three language files in the same session — one short section with the direct dashboard
    links.
  - When the client asks how to do something in the dashboard, answer from the file matching their
    language; if the answer isn't there, verify the route with the wix-manage `dashboard-navigation`
    recipe (or the app-ID fallback `…/dashboard/{siteId}/app/{appDefId}`) and add it to all three
    files before finishing. Routes are recipe data — never invent `manage.wix.com` paths from memory.
  - When you hand the client any "you can do this yourself" instruction, add it to all three files
    too.
  - Never put secrets, tokens or member emails in the files; they may be shared as-is with the client.

### Dev server — use `npm run dev:fg`, never `npm run dev`

`wix dev` (and plain `astro dev`) aborts when run by an agent: the Wix fork of Astro
(`node_modules/astro/dist/cli/dev/index.js`) detects the agent via `am-i-vibing` and forces
background mode with a hardcoded 30s readiness timeout. Cold starts on this machine take
~25s, so it is a coin flip: the parent gives up ("Dev server failed to start within 30s."),
kills nothing reliably, and leaves an orphaned server holding port 4321. The aborts are
expected behavior, not a bug in the project.

The fix: `npm run dev:fg` = `astro dev --ignore-lock`, which short-circuits the forced
background branch and runs the server in the foreground of the calling shell (use the bash
tool's `background: true`), output streaming directly to the session. Wait for the
"ready in ... ms" banner before polling; cold start is slow (~25s), warm start is fast.
Stop it by killing the listening PID (`netstat -ano | grep :4321` → `taskkill //PID <pid> //F`);
`npx astro dev stop` only manages background servers. If port 4321 is already busy, an orphan
from an aborted attempt is holding it — kill that PID first instead of letting Vite drift to
another port.

## This app

A Wix Headless app built on the live Wix site named in `wix.config.json`. The site owns the
content and commerce.

### opencode MCP setup

`.opencode/opencode.json` keeps no token and no account ID: `wix-mcp` signs in with OAuth and
sends `wix-account-id: {file:wix-account-id}`, read from the gitignored `.opencode/wix-account-id`
next to the config. OpenCode does not load `.env.local`; to use this repo, copy
`.opencode/wix-account-id.example` to `.opencode/wix-account-id`, put your own account ID in it,
then sign in once via `/mcps` → `wix-mcp`. A missing file becomes an empty header and the Wix MCP
will not connect. `chrome-devtools` needs no configuration.

**Never work from training data or memory about the Wix APIs.** Not a URL, a path, a header, a
field name or a body. Every Wix call you write comes from the official Wix skills installed here,
the code they deployed first, or, when they do not cover the call, from the official Wix
documentation through `wix-docs`. Read it there first, then write the call: the exact path and
body copied from the output you read in this session. A call built by analogy from another
call is memory, and an empty or error reply to it says nothing about the site.

## Skills

Installed at `.agents/skills/` by
`npx skills add wix/skills --skill wix-headless-kit --skill wix-docs --skill wix-manage`; a Wix plugin keeps
its copy, under the same names, in the client's own skills folder.

- `wix-headless-kit` — the code in this app and how to extend it. The shipped code is the
  `wix-headless-templates` skill: `node .agents/skills/wix-headless-kit/install/templates.mjs` prints where it
  is (`.agents/skills/wix-headless-templates/` when installed beside this skill, else
  `.agents/skills/wix-headless-kit/templates/`, fetched once from the skill's repository and kept with this
  project at the commit it was built from, `templates/.source`) and fetches it when neither exists;
  `<templates>` below is that folder. Each business solution has a playbook at
  `<templates>/<solution>/INSTRUCTIONS.md`; `node .agents/skills/wix-headless-kit/install/deploy.mjs <solution> --stack astro`
  adds one; `node <templates>/<solution>/seed/read-site.mjs` reads what the
  site holds for it, with the documentation URL of every call it made. A code change ends with a release; the live URL shows it, the dev server does not count.
  `node .agents/skills/wix-headless-kit/install/check.mjs` says whether the skill or its templates have a newer
  version and prints the update commands; an update touches the skill folder or `templates/`, never `src/`.
  When Wix gets in the way of a change here (a confusing error, a doc gap, a workaround you had to
  invent), offer to relay it to Wix per `.agents/skills/wix-headless-kit/guides/feedback.md`; send only after
  an explicit yes.
- `wix-docs` — how to discover the Wix APIs and their docs: search first, then read only the page
  you need. Every endpoint, body, field and enum you did not get from the deployed code or a recipe
  is confirmed there before you write it.
- `wix-manage` — recipes for the live site itself (content, prices, settings), run from the shell
  with `npx -y @wix/cli@latest token --site <siteId>`, minted inline in each command; the token
  never lands in a file anywhere (not the project, not `/tmp`) nor in client code.

## Images — always Wix Media Manager, never public/

Every image used by the site MUST be uploaded to the Wix Media Manager (per
`.agents/skills/wix-manage/references/media/upload-media-to-wix.md`, two-step local upload:
`generate-upload-url` then PUT the bytes) and served from the returned `static.wixstatic.com`
URL. Never reference files from `public/` in `src/` — `public/` files are slow to serve from the
site host. Workflow for any image:

1. Convert the image to **AVIF before uploading** (mimeType `image/avif`). Never upload a
   JPEG/PNG original when an AVIF version will do: Wix Media Manager stores whatever bytes
   are uploaded, so a 2.2 MB JPEG stays a 2.2 MB JPEG forever. Losslessly (or with an
   acceptable quality, e.g. quality ~55-70 for photos) convert first, then upload the AVIF
   and reference the `.avif` wixstatic URL. Only fall back to JPEG/PNG when AVIF encoding
   is genuinely unavailable, and note it in `docs/images-sitemap.txt`.

1. Upload it to the Media Manager and wait for `operationStatus: READY`.
2. Record the mapping `public/<path> -> <wixstatic URL>` in `docs/images-sitemap.txt` (the log
   of every uploaded URL).
3. Use the wixstatic URL in the code in place of the `public/` path.
4. Delete the file from `public/` — once uploaded, it must not remain there.

Never ship a site (release) with `public/` images still referenced in `src/`.

## Visual features — mandatory screenshot

Whenever the user requests a visual/UI feature (layout, component, styling, animation, page change),
after implementing it take a screenshot as proof of the result and store it in `.screenshots/` inside
this project. Workflow:

1. Implement the feature and verify it compiles (`npx astro check`).
2. Start the dev server if not running (`npm run dev`, default `http://localhost:4321`).
3. Capture a screenshot of ONLY what you modified — the affected component/section, not the
   whole page. A full-page screenshot of a long page is useless as proof: scroll to the changed
   section (Playwright `locator.scrollIntoViewIfNeeded()` + `page.screenshot({ clip })` or
   element screenshot) with a normal viewport (e.g. 1280×800). Full page only when the change
   genuinely affects the entire page. Save it to `.screenshots/<feature>-<YYYYMMDD-HHmmss>.png`.
   Take one per affected section, page or viewport when relevant (e.g. mobile menu: capture
   closed and open states).
4. Report the saved file path(s) to the user and stop — never delete or overwrite previous screenshots.
5. ALWAYS stop the dev server afterwards (`npx astro dev stop`), before finishing the task.
   Leaving it running blocks the next session's `npm run dev` with "Another astro dev server is
   already running".

## Browser console — zero warnings / zero errors (mandatory after complex work)

After implementing anything complex (data fetching, client scripts, iframes/embeds, forms,
images, layout changes — anything beyond trivial markup), ALWAYS verify the browser console has
NO warnings and NO errors before declaring the task done. Examples that must never appear:
`failed to load resource: net::ERR_CONNECTION_REFUSED`, 404s, CORS errors, hydration errors,
unhandled promise rejections. Workflow:

1. Start the dev server if not running (`npm run dev`, default `http://localhost:4321`).
2. Visit every affected page (or all pages for a site-wide change) with Playwright:
   collect `page.on('console')` (type `error` AND `warning`) and `page.on('pageerror')` events
   while the page loads and after its client scripts settle.
3. Fix every reported warning/error in the same change, then re-verify. An empty console is
   the pass condition; "it renders fine" is not.
4. Report what was checked and the result to the user.

## Tailwind moderno (v4, 2026) — siempre clases canónicas

El proyecto usa Tailwind CSS v4. Escribe siempre la forma canónica moderna; nunca la sintaxis
arbitraria vieja cuando existe un equivalente canónico (el editor los marca con la alerta
`tailwindcss(suggestCanonicalClasses)`):

- `aspect-[4/5]` → `aspect-4/5` (las fracciones van sin corchetes)
- `scale-[1.03]` → `scale-103` (número bare = porcentaje)
- `data-[open]:visible` → `data-open:visible` (variantes booleanas `data-*` sin corchetes)
- `aria-[current=true]:text-accent` → `aria-current:text-accent` (aria booleano `true` sin corchetes)
- `w-[50%]`/`h-[33.333%]` → `w-1/2`/`h-1/3`, `gap-[10px]` → `gap-2.5`, `p-[20px]` → `p-5`

Los valores arbitrarios sin equivalente en la escala (`text-[15px]`, `tracking-[0.22em]`,
`max-h-[45vh]`, `grid-cols-[3fr_4fr]`, `transition-[opacity,visibility]`, `align-[-2px]`,
`text-[clamp(...)]`) SÍ son válidos y se quedan así. Antes de escribir un valor arbitrario,
comprueba si la escala o un bare value de v4 lo cubre; si no, usa corchetes.

## Layout rule — mobile horizontal padding

Every full-width page header/hero (the `<section>`/`<header>` that sits directly under `<main>`
and holds the eyebrow, `h1` and intro paragraph, typically `border-b border-border pb-* text-center`)
MUST include horizontal padding, e.g. `px-6`, or its text touches the viewport edges on mobile.
Never rely on an inner `max-w-*` alone for breathing room. Content sections below the hero follow
the convention `mx-auto max-w-* px-6`. The only exception is a full-bleed hero, which opts out via
`[data-bleed]` (see `src/styles/global.css`).

## Astro rule — no client code in the frontmatter

The frontmatter (`---` block) of every `.astro` file runs on the server during SSR (a Cloudflare
worker, where browser globals like `HTMLElement` do not exist). Never import browser-only code
there — web components (e.g. `@justinribeiro/lite-youtube`, `import "@justinribeiro/lite-youtube"`)
or anything that touches `document`/`window` crash the SSR render with "HTMLElement is not defined".
Client-side JS goes in a `<script>` tag in the template instead, where Astro bundles it as a
browser module that is never executed during SSR:

```astro
---
// server code only: data fetching, props
---
<script>
  import "@justinribeiro/lite-youtube"; // browser-only: upgrades the custom element on the client
</script>
```

## Checks — zero hints allowed

`npx astro check` (or `npm run check`) must report **0 errors, 0 warnings AND 0 hints**. Hints are
not noise to ignore: they are dead code (unused imports, unused declarations) and they must be
removed before finishing a task, not left as "pre-existing" debt. If a check reports hints, fix
them in the same change — e.g. delete the unused import instead of leaving it behind.

## Tests — Vitest + Playwright for every TypeScript logic

Everything that contains TypeScript logic (features, data layers, mappers, stores, parsers —
anything beyond a straight markup template) MUST have tests. Two layers, both already configured:

- **Vitest** (unit/integration, `npm run test`): pure logic — mappers, parsers, stores, core rules,
  DTO assembly. colocate as `<file>.test.ts` next to the source.
- **Playwright** (E2E, `npm run test:e2e`): user-visible behaviour — the page renders, interaction
  works (e.g. an accordion expands, a form submits), data reaches the DOM.

A change to TypeScript logic is not done until its tests pass. New logic ships with its tests in the
same change; do not leave test debt.

## Release

A code change ends with a release; the live URL shows it, the dev server does not count.
(Use the wix-headless-kit skill's deploy/release flow.)

