## CLI Commands

All CLI instructions can be found at:
node_modules/@wix/cli/agents/instructions.md

# Notes
- NO python, just nodejs

## CMS Single Item field order

Every Wix collection with the `SINGLE_ITEM` plugin — including `SiteChrome` — must keep its fields in the same order in which their content appears in the UI. Derive that order from the `.astro`/component source that renders the fields, never from TypeScript field lists or the CMS schema itself. When adding a new page, section or CMS field, reorder the corresponding collection immediately with the documented full-replace `UpdateDataCollection` call: GET the collection first, send every non-system field from the GET in the new order, preserve all field metadata and collection metadata, then verify values/metadata are unchanged and the new order matches the rendered page.

## Wix platform issues — read before debugging oddities

`docs/wix-platform-issues.md` logs every Wix platform behavior that broke the
site (edge redirects caching, CDN variant poisoning, hydration failures,
by-slug API 404s, injected titles) with evidence, the fix applied and the
residual risk. Consult it before debugging a symptom that "should not happen",
and append new findings there instead of rediscovering them.

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
background branch and keeps the server in the foreground of the shell that started it. Start it
from bash as `npm run dev:fg > "<log>" 2>&1 &`, capture the shell PID, and wait for the
"ready in ... ms" banner in the log before polling; cold start on this machine takes ~25–70s,
warm start is faster. Stop it by killing the listening PID
(`netstat -ano | grep :4321` → `taskkill //PID <pid> //F`); `npx astro dev stop` only manages
background servers and does not stop a foreground one. If port 4321 is already busy, an orphan
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

This project works with local skills under `.agents/skills/`. `.agents/` is in `.gitignore`, so a fresh
clone does not include them: install them locally from the repo root before doing repo work. A Wix plugin
may keep its own copy, under the same names, in the client's skills folder.

Install the expected set with OpenCode selected as the agent:

```bash
npx skills add wix/skills --skill wix-headless-kit --skill wix-docs --skill wix-manage -y
npx skills add pbakaus/impeccable --skill impeccable -y
npx skills add anthropics/skills --skill frontend-design -y
npx skills add GoogleChrome/modern-web-guidance --skill modern-web-guidance -y
npx skills add shadcn-ui/ui --skill shadcn -y
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -y
npx skills add wheresryan22/anatomy --skill anatomy -y
```

**Every skill installed for this repo MUST be local, under `.agents/skills/`. Never install skills globally
(`-g`, `~/.agents/skills`, or any other user-level location): anyone else using this repo must get the same
skills from the repository. Run `npx skills add ... -y` from the repo root, verify the destination is
`.agents/skills/<skill>`, and remove any global copy created by mistake.**

- `wix-headless-kit` — the code in this app and how to extend it. The shipped code is the
  `wix-headless-templates` skill: `node .agents/skills/wix-headless-kit/install/templates.mjs` prints where it
  is (`.agents/skills/wix-headless-templates/` when installed beside this skill, else
  `.agents/skills/wix-headless-kit/templates/`, fetched once from the skill's repository and kept with this
  project at the commit it was built from, `templates/.source`) and fetches it when neither exists;
  `<templates>` below is that folder. Each business solution has a playbook at
  `<templates>/<solution>/INSTRUCTIONS.md`; `node .agents/skills/wix-headless-kit/install/deploy.mjs <solution> --stack astro`
  adds one; `node <templates>/<solution>/seed/read-site.mjs` reads what the
  site holds for it, with the documentation URL of every call it made. A code change NEVER
  auto-releases: deploy only when the user explicitly orders it (`.opencode/commands/deploy.md`
  or `.opencode/commands/commit-and-deploy.md`).
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
2. Start the dev server if not running (`npm run dev:fg`, default `http://localhost:4321`) and
   wait for the ready banner.
3. Dismiss the cookie banner in EVERY screenshot session before capturing anything: click
   `[data-sl-consent] [data-consent-reject]` and wait until `[data-sl-consent]` no longer has
   `data-open`. Never ship a screenshot with the banner covering the section.
4. Wait for every image in the affected section to be loaded and decoded before capturing: scroll
   it into view, then wait for each `<img>` (e.g. `[data-video-poster]`) to be `complete` with
   `naturalWidth > 0` and for `img.decode()` to resolve. Never ship a screenshot taken before its
   images finish loading.
5. Capture a SECTION-LEVEL screenshot: target the nearest meaningful section/card that contains
   the change, never the single mutated leaf (`<p>`, `<span>`, icon). Leaf-only crops are useless
   as proof: they lose layout, contrast context and surrounding content. A full-page screenshot
   of a long page is equally useless. If the section has no accessible name/uid, temporarily label
   it in the browser only (e.g. `el.setAttribute('role', 'region');
   el.setAttribute('aria-label', 'Screenshot target')`), take a fresh snapshot and screenshot that
   uid; do not change source markup for the screenshot. Scroll it into view (Playwright
   `locator.scrollIntoViewIfNeeded()` + `page.screenshot({ clip })` or element screenshot) with a
   normal viewport (e.g. 1280×800). Discard and retake any blank or text-node-only crop. Full page
   only when the change genuinely affects the entire page. Save it to
   `.screenshots/<feature>-<YYYYMMDD-HHmmss>.png`. Take one per affected section, page or viewport
   when relevant (e.g. mobile menu: capture closed and open states).
6. Report the saved file path(s) to the user and stop — never delete or overwrite previous screenshots.
7. ALWAYS stop the dev server afterwards by killing the listening PID (`netstat -ano | grep :4321`
   → `taskkill //PID <pid> //F`), before finishing the task. Leaving it running blocks the next
   session with "Another astro dev server is already running"; `npx astro dev stop` does not stop
   a foreground server.

## Browser console — zero warnings / zero errors (mandatory after complex work)

After implementing anything complex (data fetching, client scripts, iframes/embeds, forms,
images, layout changes — anything beyond trivial markup), ALWAYS verify the browser console has
NO warnings and NO errors before declaring the task done. Examples that must never appear:
`failed to load resource: net::ERR_CONNECTION_REFUSED`, 404s, CORS errors, hydration errors,
unhandled promise rejections. Workflow:

1. Start the dev server if not running (`npm run dev:fg`, default `http://localhost:4321`).
2. Visit every affected page (or all pages for a site-wide change) with Playwright:
   collect `page.on('console')` (type `error` AND `warning`) and `page.on('pageerror')` events
   while the page loads and after its client scripts settle.
3. Fix every reported warning/error in the same change, then re-verify. An empty console is
   the pass condition; "it renders fine" is not.
4. Report what was checked and the result to the user. Chrome DevTools `[issue]` messages are
   not `error`/`warning` console messages; do not "fix" them unless this change introduced them.

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

## Verification scope — proportional, not blanket

Choose checks from what changed; do not run every command "just in case".

- Static markup, CSS, copy or one section: `npx astro check`; add one focused Playwright test
  for the changed section when it has user-visible behaviour; check that page's console; take
  the screenshot. Do NOT run `npm run test` or the full `npm run test:e2e`.
- TypeScript logic/data layer/mapper: run its colocated Vitest tests and the focused E2E that
  exercises it. Full suite only when the change touches shared code used by many routes, or the
  user explicitly asks.
- The full `npm run test:e2e` uses 4 workers by default and has repeatedly tripped the Wix 429
  throttle documented in `docs/wix-platform-issues.md` §7, producing unrelated 500s and
  timeouts. Consult that section before debugging; if genuinely needed, use `--workers=1` once
  and do not retry in a loop.
- A focused test that passes is enough for that surface. Do not re-run it through the full suite
  to "confirm" it, and do not report unrelated throttled specs as results of the change.
- Report only the relevant commands and their real outcomes.

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
same change; do not leave test debt. Running the whole suite for a single section is over-verification,
not diligence: scope the tests as described above.

## Release — only on explicit order

Never deploy or release on your own initiative, not even to "finish" a change: a code change
ends verified (`astro check`, scoped tests, screenshots) — NOT released. Deploy/publish ONLY when the
user explicitly orders it with the commands `.opencode/commands/deploy.md` or
`.opencode/commands/commit-and-deploy.md`, and then follow the flow written in that command file.

