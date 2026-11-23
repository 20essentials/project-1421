# Wix platform issues — observed on this site

Log of Wix platform behaviors that broke the site, with evidence, the fix
applied, and what to watch for if they come back. Each entry is grounded in
reproduction against the live edge / browser — not theory. Keep entries
append-only: update the status when behavior changes, never delete history.

Site: `https://stefano-lunardi-d960960gm-0f09.wix-site-host.com`
(siteId `b24dc2d0-f24b-4d97-b733-550f7c321876`).

---

## 1. Multilingual edge redirects bare asset requests → duplicated React → broken hydration

**Status:** fixed 2026-11-23 (`fix(i18n): keep the asset graph on one locale base per release`).

**Symptom.** On any page of a secondary locale (es/en/de), React islands died
during hydration with:

- `TypeError: Cannot read properties of null (reading 'useRef')` (×2)
- `Uncaught Error: Minified React error #423` (×2)

Islands (Wix Forms contact form, newsletter form) rendered but without
interactivity. Intermittent: some page loads were clean.

**Root cause chain (all steps reproduced):**

1. The `wixLanguage` cookie (set by Wix Multilingual on the first visit to any
   locale page) changes how the edge serves bare asset URLs:
   `GET /_astro/app.js` + cookie → **302** to `/es/_astro/app.js`; without the
   cookie → 200. Verified by curl with/without the cookie.
2. The edge CDN **caches some of those 302s**, while other requests for the
   same URL reach the SSR worker, whose middleware proxies them and answers
   **200 at the bare URL**. Browser network log showed the mix for one page
   load with one cookie state.
3. Astro resolves a module's relative imports against the module's own final
   URL. With some chunks living at `/_astro/…` and others at `/es/_astro/…`,
   the page's module graph spanned **two bases → React existed twice** → the
   second copy has no hooks dispatcher → `useRef` of null.

**Why cookies were involved:** the cookie flips the edge into redirect mode for
bare asset URLs. Clearing cookies "fixed" it for the user because Chrome
clears the (poisoned) HTTP cache along with the cookies — and without the
cookie the bare URLs stopped redirecting.

**Fix.** The SSR middleware (`src/middleware.ts` + `localeAssetRewriter` in
`src/app/static-assets.ts`) rewrites every `/_astro/…` URL in HTML responses to
the page's locale base (`/es/_astro/…`) for es/en/de pages — those URLs never
redirect (verified against the edge). Primary-locale (`it`) pages keep bare
URLs: the edge canonicalizes `/it/…` back to `/…`, so prefixing `it` would
redirect every asset again.

**Residual risk / what to watch:**

- Secondary-locale pages must show script/asset URLs prefixed with their locale
  in `view-source` (`/es/_astro/...`). If they ever show bare `/_astro/` again,
  the rewriter was bypassed (or Wix changed its injection behavior) and the
  hydration breakage will return.
- A visitor on an `it` page with a **stale `es` cookie** still gets bare asset
  redirects (all consistent, single base — safe) unless the edge mixes proxied
  and redirected answers again. Intermittent hydration errors on `it` pages →
  suspect this first.

## 2. CDN caches corrupt/stale compressed variants of same-hash assets → unstyled page

**Status:** mitigated 2026-11-23 (same commit: per-release `?v=` cache bust).

**Symptom.** A visitor saw the home page completely unstyled ("el home está
roto"); deleting browser cookies+cache fixed it. Browser console:
`Failed to load resource: net::ERR_CONTENT_DECODING_FAILED` against
`/es/_astro/index.CAOXZTkl.css` (transfer 3345 B, decoded 0 B).

**Root cause.** The edge's compressed variant caches (gzip/brotli) held entries
from earlier releases / poisoned redirect responses under the same hashed
filename: curl showed the gzip variant decoding to 2095 B (an old, partial CSS)
while the raw variant served the correct 9157 B. Browsers request brotli first
and store the response under `cache-control: public,max-age=3600,immutable`
(injected by the Wix hosting adapter into `_headers` for `/_astro/*`), so a
poisoned entry survives in the visitor's disk cache indefinitely.

**Fix.** The rewriter appends `?v=<BUILD_ID>` (build timestamp, defined in
`astro.config.mjs`) to every rewritten asset URL. Each release produces fresh
cache keys, so a poisoned browser cache entry is abandoned on the next deploy.

**Residual risk / what to watch:**

- Unstyled pages with `ERR_CONTENT_DECODING_FAILED` on `/_astro/*` resources →
  a stale variant cache again. Check whether the failing URL carries the
  current `?v=`; if the HTML still emits the old version, the release didn't
  rebuild (`wix release` does NOT rebuild — always run `npm run build` first).
- Per-release re-download of all assets: expected cost of the cache bust.

## 3. Wix platform script noise in the console (not ours, harmless today)

**Status:** open / noise. Do not "fix" in our code; ignore or filter in e2e.

- `AppId 196175ca-0c1e-41ec-9f9a-ceafda45b2bd does not expose function
  correctly, error code: Client 404` — a script Wix injects on every page
  (webmcp/embedded-scripts layer; also loads from
  `*.wix-host.com/_wix_*-embedded-scripts/`). Present on every page, every
  load, including clean loads. Already filtered in the Playwright e2e config
  (see commits `test(e2e): stop filtering the webmcp appid console error`,
  `fix(dev): hide wix context globals from the mcp embed script`).
- `[ConsentPolicy] setConsentPolicy is not available` — Wix consent bootstrap
  warning in the browser. **Fixed 2026-11-23:** the headless site never injects
  the viewer consent manager (`globals.$ns["wix-window"].consentPolicy` /
  `window.consentPolicyManager` are both absent), so the SDK wrapper always
  warned and no-oped. `src/shared/consent.ts` now resolves the same targets the
  SDK does and skips the call when none exists — the local-storage policy was
  and remains the effective gate (`applyConsentPolicy` is best-effort). Unit
  tests cover all three branches (manager present / viewer globals only /
  neither).
- Manifest icon warning for `static.wixstatic.com/...61952383…png` — **fixed
  2026-11-23.** The docs previously recorded the PNG as "valid, verified": that
  is no longer true. The media item at that URL was re-uploaded/corrupted
  (Last-Modified 2026-11-23 13:26): its IDAT chunk declares 4746 B but the file
  is 4530 B with no IEND — a truncated upload, so Chrome's manifest icon decode
  failed ("Download error or resource isn't a valid image"; confirmed with
  `createImageBitmap` in the page: "source image could not be decoded").
  `public/site.webmanifest` now points at a freshly rendered 192×192 PNG
  (rasterized from `public/favicon.svg` via Chromium canvas, two-step Media
  Manager upload, `READY`): `600582_0246be52d6fe4016bddd36f014a0979a~mv2.png`.
  The corrupt media item `600582_61952383…` is no longer referenced anywhere
  (see `docs/images-sitemap.txt`); it can be deleted from the dashboard.
  Related discovery while verifying: the Wix edge hijacks `/favicon.svg` on the
  live site and serves the dashboard favicon's **ICO bytes** there (our
  `public/favicon.svg` is real SVG and works in dev/preview builds) — when
  testing SVG favicon behavior, verify against the actual served bytes.

**Residual risk / what to watch:** if the AppId error ever becomes an
"expose function" error naming one of OUR app IDs, an embedded-script or
app-extension of ours is failing — then it's ours and goes to the Wix app
skills for diagnosis.

## 4. `getCategoryBySlug` / `getTagBySlug` return 404 for slugs the query endpoint returns

**Status:** fixed 2026-11-23 (`fix(blog): resolve category and tag slugs via
the query endpoint`).

**Symptom.** Every blog category and tag page 404'd on the live site
(`/es/blog/category/consigli`, `/es/blog/tag/wedding-film`), while the slugs
came straight from the blog feed links.

**Root cause.** `GET /blog/v3/categories/slugs/{slug}` answered
404 "No entity was found" for every slug — with and without the `language`
query parameter, across it/en/es/de — while `POST /blog/v3/categories/query`
with a `slug` filter returned the categories fine. The by-slug endpoints are
unreliable on this site (categories exist only under `language: "en"` in the
blog app; the site's primary language is `it`).

**Fix.** `src/features/blog/taxonomy.ts` resolves categories and tags through
`queryCategories().eq("slug", slug)` / `queryTags().eq("slug", slug)`.

**Residual risk / what to watch:** new 404s on blog category/tag pages → check
whether the query-filter path still resolves, and whether Wix fixed (or broke)
the by-slug endpoints.

## 5. Wix viewer injects one locale-level title for every page of a secondary locale

**Status:** mitigated 2026-11-23 (`fix(head): emit per-page titles for static
pages`).

**Symptom.** Every page under `/es` carried `<title>Es | Stefano Lunardi`
(same for `/en`, `/de`), injected by the viewer as `wix-seo-tag` after our SSR
head, and the title did not update across the viewer's client-side (soft)
navigations. Primary-locale pages got no `<title>` from the viewer at all.

**Root cause.** Our layout emitted `<title>` only in dev (`emitFallbackHead =
DEV || headFallback`), delegating to Wix's server-side head injection — but the
injection only knows per-locale defaults ("Es" = locale page name), never our
per-page content. The viewer reuses that tag on soft navigation.

**Fix.** Static pages emit their own `<title>` + description from the page data
(shipped-templates model); blog item pages keep `<SEO.Tags>`. Verified live:
browsers use our first `<title>`, and soft navigation now updates the title
per page.

**Residual risk / what to watch:**

- `view-source` still shows a **second** `<title wix-seo-tag="true">Es | …`
  after ours. Browsers and Google use the first; the duplicate is invalid HTML
  and could confuse other consumers. If it ever matters, options: ask Wix to
  suppress the default when the page provides its own title, or move page SEO
  into the dashboard's per-page settings.
- SEO titles/descriptions for search are OUR emitted tags — keep them
  meaningful per page (they come from each page's content/CMS).

## 6. `wixLanguage` cookie forces the visitor's locale on every navigation

**Status:** closed 2026-11-23. Two changes:

1. **`autoSwitch: false`** via the Locale Settings API
   (`PATCH /locale-settings/v2/settings`, revision 5 → 6). Before: the edge
   redirected `/`, `/it/…` (and bare assets) by the visitor's
   `Accept-Language`/cookie, so bots fell back to `/en` and stale cookies
   hijacked navigation. After: `/`, `/es`, `/en`, `/de` all answer 200 with
   their own locale regardless of cookies; `/it/…` canonically 301s to the
   bare path (serves Italian). Note the docs' own caution agrees: auto-switch
   harms SEO (duplicate content, indexing limits).

2. **The language menu writes the cookie before navigating**
   (`fix(i18n): write the locale cookie when switching languages`). Even with
   autoSwitch off, the `wixLanguage` cookie still decides the language of
   bare paths (the primary locale's canonical home): `/` + cookie `de` served
   the German site, so choosing Italiano from `/de` bounced back to German.
   The header menu (desktop + mobile) now carries `data-locale-switch={l}`
   and a delegated capture-phase click listener sets
   `wixLanguage=<locale>; path=/; max-age=1y` before the navigation, so the
   request arrives in the chosen language. Locale-prefixed pages ignore the
   cookie, so this is safe for es/en/de too. Verified in a real browser:
   `/de` with cookie `de` → click Italiano → lands on the Italian site.

**Original symptom (for the record).** A visitor whose browser language was
Italian got redirected to `/es` on every visit, because a `wixLanguage=es`
cookie from an earlier visit won over `Accept-Language`; bots (no
Accept-Language) fell back to `/en`.

**Residual risk / what to watch:**

- If Wix re-enables autoSwitch (dashboard toggle "open the site in the
  visitor's language"), the hijack returns — re-check
  `GET /locale-settings/v2/settings` → `autoSwitch`.
- The menu's cookie write relies on `wixLanguage` being non-HttpOnly (it is
  today). If Wix ever makes it HttpOnly, the write fails silently and the
  primary-locale switch breaks again — symptom: switching to Italian from a
  secondary-locale page lands on the previous language.
- Bare assets under a foreign `wixLanguage` cookie no longer redirect since
  autoSwitch is off (bare asset + cookie = 200), but keep an eye on the
  hydration/caching entries (§1, §2) if the edge behavior changes.
- Bots hitting `/` now always get Italian. The sitemap gap is fixed — see §5.

## Historical note

`wix release` publishes the existing `dist/` and does **not** rebuild. Three
consecutive "✔ Uploaded successfully" releases shipped a stale build before we
noticed (fixed 2026-11-23: `npm run release` now runs `npm run build && wix
release`, so a bare `wix release` is still dangerous — use the npm script).

---

## 5. Wix hosting owns the SEO root files (`/robots.txt`, `/llms.txt`, `/sitemap.xml`) — Astro routes there are unreachable

**Status:** fixed 2026-11-23 (workaround shipped; Wix has no supported override
for `/sitemap.xml` on managed headless).

**Symptom.** Astro endpoints at `src/pages/llms.txt.ts` and
`src/pages/sitemap.xml.ts` deployed fine but were never served: `curl` against
the live site returned Wix's auto-generated files, not ours — while other new
routes in the same build (e.g. the `lang-trigger` aria-label fix) were live.

**Evidence.**

- After a verified-fresh release (`aria-label="Lingua: IT"` present on live
  pages), `/llms.txt` still served Wix's generic MCP page and `/sitemap.xml`
  Wix's `generatedBy="WIX"` sitemap index. The endpoints only answer at
  unreserved paths.
- Wix's `blog-posts-sitemap.xml` listed every post as the literal route
  pattern (`/blog/[...slug]`, 4 entries) instead of real slugs, and item pages
  of custom dynamic routes (`/portfolio/[slug]`, `/projects/[slug]`,
  `/blog/category/[slug]`, `/blog/tag/[slug]`) appeared nowhere. Wix's
  generator only knows the site's page registry; Astro rest params stay opaque
  to it.

**Fix.**

- **Sitemap** → `src/pages/sitemap-full.xml.ts` serves the full urlset with
  real URLs (static pages + blog posts/categories/tags + portfolio
  collections/projects, each fetcher failing open) at the unreserved path
  `/sitemap-full.xml`. robots.txt gained a `Sitemap: …/sitemap-full.xml` line
  via the TXT-file-server API (`PUT /promote-seo-robots-server/v2/robots`,
  Wix's own sections and sitemap lines preserved).
- **llms.txt** → Wix owns the route, and the **Llms Txt API** is the supported
  override: the curated summary (pages, portfolio, blog, FAQ, contacts —
  generated by `src/pages/llms.txt.ts`) is PUT to
  `https://www.wixapis.com/promote-seo-robots-server/v2/llms`
  (`manuallyEdited: true`), keeping Wix's generated MCP section appended. The
  Astro file stays as the canonical generator to re-run that sync from.
- **robots.txt** stays dashboard/API-managed (SEO Tools > Robots.txt Editor,
  or the same API).

**Residual risk / what to watch:**

- The llms.txt Wix serves is a **snapshot**: new posts/projects/FAQ edits do
  not appear until the sync is re-run (regenerate `src/pages/llms.txt.ts`'s
  output and PUT it again). The sitemap-full endpoint, by contrast, is live
  SSR and always current.
- If Wix ever starts reserving more paths at the edge (it already owns
  `/robots.txt`, `/llms.txt`, `/sitemap.xml`, `*-sitemap.xml`), move the
  sitemap route again and update the robots.txt line.
- The curated llms.txt content and Wix's MCP section are two sources in one
  file; a Wix-side dashboard edit of llms.txt (SEO Tools) would diverge from
  the generator — re-PUT after any manual dashboard edit.
