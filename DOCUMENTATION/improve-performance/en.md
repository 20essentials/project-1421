# How to exceed 90 in Lighthouse Performance

> Status: 2026-11-27. Guide for the build published at `https://stefano-lunardi-d960960gm-0f09.wix-site-host.com`.
> The reference measurement of the same build in preview was **Performance 68**, Accessibility 100, Best Practices 96, SEO 100 and Agentic Browsing 100.

## 1. Why the score is 68 and what is needed

Mobile Lighthouse weights the Performance category as follows:

| Metric      | Weight | Current value | Current score | Approximate target |
| ----------- | ------ | ------------- | ------------- | ------------------ |
| FCP         | 10%    | 1.3 s         | 0.98          | keep               |
| Speed Index | 10%    | 5.9 s         | 0.48          | < 3.4 s            |
| LCP         | 25%    | 1.3 s         | 1.00          | keep               |
| TBT         | 30%    | 1,700 ms      | 0.11          | < 200 ms           |
| CLS         | 25%    | 0             | 1.00          | keep               |

Almost all the lost points come from **TBT** and **Speed Index**. LCP, FCP and CLS are already good: optimizing the banner or the above-the-fold images will not change much. To reach 90+ you need to reduce main-thread blocking time, not so much the photo weight.

## 2. What is already done in the repo

These optimizations are already applied and published; do not repeat them:

- `src/app/layout.astro`: the three independent Wix reads (`getForm`, `fetchSiteInfo`, `getSiteChrome`) run with `Promise.all`.
- `src/app/layout.astro`: `SchemaForm` uses `client:visible` instead of `client:load`.
- `src/app/layout.astro`: `mountRipple()` and `mountSmoothScroll()` are called on idle with `requestIdleCallback(..., { timeout: 1500 })` and a `setTimeout(..., 200)` fallback.
- `src/features/consent/consent-banner.astro`: an `is:inline` script opens the banner on first paint when there is no decision saved in `sl_consent_v1`.
- `src/features/home/artistic-parallax.astro`: incoming image with `fetchpriority="high"` and outgoing image with `fetchpriority="low"`.
- `src/shared/media.ts` and `src/wix/media.ts`: Wix URLs with `q_90`.

## 3. Where the missing points really are

| Blocker                      | Evidence                                                                                                                                                                      | Who can act                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Wix-injected scripts         | Long tasks: `document` 647 ms and 436 ms, `siteTags.bundle.min.js` 372 ms, `site-web-vitals.umd.min.js` 141 ms, `site-bi.umd.min.js` 99 ms, `site-analytics.umd.min.js` 78 ms | Wix dashboard                |
| Edge TTFB                    | Repeated responses with `x-cache: MISS`, `x-cache-status: MISS`, `age: 0`; measured TTFB between 1.4 s and 2.2 s                                                              | Wix / platform               |
| Console error from a Wix app | `AppId 196175ca-0c1e-41ec-9f9a-ceafda45b2bd does not expose function correctly, error code: Client 404`                                                                       | Wix dashboard                |
| Image weight                 | The home downloads about 850 KiB of Wix images; `q_90` is conservative                                                                                                        | Repo, with a visual decision |

The Wix console error explains why Best Practices is 96 and not 100. It is not a failure of the Astro code.

## 4. Action plan, in order

### Step 1 — Reduce the scripts injected by Wix

This is the only lever with a realistic chance of reaching 90+.

1. Open the Wix dashboard and review apps and script/analytics/tag manager settings.
2. Look specifically for the scripts that appear in the trace: `siteTags.bundle.min.js`, `site-web-vitals.umd.min.js`, `site-bi.umd.min.js`, `site-analytics.umd.min.js`.
3. Disable them **one at a time**, not all at once, and measure again after each change.
4. Before giving dashboard route instructions, consult the `wix-manage` skill → `dashboard-navigation` recipe. Never invent `manage.wix.com` routes.
5. If an app is needed for analytics or business, decide with the client what to keep. Do not disable it on your own initiative.

Goal: bring TBT below 200 ms and Speed Index below 3.4 s.

### Step 2 — Deal with the edge TTFB

HTML arrives with `x-cache: MISS` even on repeated requests. This cannot be fixed from Astro:

- Do not try to fix it with more cache in the repo if the edge response still says `MISS`.
- Record the header in every measurement.
- If you change domain or enable your own CDN layer, measure again from scratch; do not assume the `MISS` will disappear.
- Consult `docs/wix-platform-issues.md` before debugging a symptom that “should not happen”.

### Step 3 — Reduce image weight only if the visual trade-off is accepted

If the client accepts some loss of sharpness:

- In `src/shared/media.ts` and `src/wix/media.ts`, change `q_90` to `q_75` in the `fill` URLs.
- Take before and after screenshots of the home and the photo grid; compare on a real screen, not only by bytes.
- Add or adjust tests if the expected URLs change.
- Run `npm run check`, `npm test` and `npm run test:e2e` again.

This can help Speed Index, but it **will not** fix TBT dominated by Wix.

### Step 4 — Defer remaining islands and scripts in the repo

If there is still room after the previous steps:

- Review components using `client:load` and switch them to `client:visible` or `client:idle` when they do not affect the first paint.
- Keep only the consent script, `localizeLinks` and whatever is needed to avoid layout shift immediate.
- Extend the `whenIdle()` pattern in `src/app/layout.astro` to other non-critical enhancements.
- Never put browser code in a `.astro` frontmatter: it runs during SSR and can fail with `HTMLElement is not defined`.

### Step 5 — Do not break what already works

After any change:

```bash
npm run check
npm test
npm run test:e2e
npm run build
```

Also:

- Use `npm run dev:fg`, never `npm run dev`.
- Take screenshots only of the modified section in `.screenshots/`.
- Check the console: zero warnings and zero project-owned errors. The known Wix `AppId` error must be documented, not silenced.
- `astro check` must report 0 errors, 0 warnings and 0 hints.

## 5. How to measure

The `lighthouse_audit` MCP tool does not report performance; use the CLI:

```bash
npx lighthouse "https://stefano-lunardi-d960960gm-0f09.wix-site-host.com/" \
  --only-categories=performance \
  --form-factor=mobile \
  --output=json \
  --output-path=./lighthouse-performance.json
```

Save the trace too, to identify long tasks:

```bash
npx lighthouse "https://stefano-lunardi-d960960gm-0f09.wix-site-host.com/" \
  --only-categories=performance \
  --form-factor=mobile \
  --save-assets \
  --output=json \
  --output-path=./lighthouse-trace.json
```

Repeat the measurement at least three times. The Wix edge varies; a single run is not enough to decide.

## 6. Publishing rules

- A code change ends verified, **not published**.
- Publish only with an explicit order, following `.opencode/commands/deploy.md` or `.opencode/commands/commit-and-deploy.md`.
- Do not run `git push --force` if the remote is ahead; ask how to proceed.
- If the score is still below 90 after disabling Wix scripts, document the blocker in `docs/wix-platform-issues.md` and accept the real number instead of massaging the measurement.
