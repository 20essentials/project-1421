## CLI Commands

All CLI instructions can be found at:
node_modules/@wix/cli/agents/instructions.md

## This app

A Wix Headless app built on the live Wix site named in `wix.config.json`. The site owns the
content and commerce.

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
3. Capture a full-page screenshot of the affected page(s) with Playwright (Chromium, already used by
   this project) and save it to `.screenshots/<feature>-<YYYYMMDD-HHmmss>.png`. Take one per affected
   page or viewport when relevant (e.g. mobile menu: capture closed and open states).
4. Report the saved file path(s) to the user and stop — never delete or overwrite previous screenshots.
5. ALWAYS stop the dev server afterwards (`npx astro dev stop`), before finishing the task.
   Leaving it running blocks the next session's `npm run dev` with "Another astro dev server is
   already running".

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

