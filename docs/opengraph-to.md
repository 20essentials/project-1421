# OpenGraph.to context and improvement checklist

Purpose: keep everything learned about this site's Open Graph/Twitter Card state
in one place so the OpenGraph.to score can be improved without breaking the
live Wix metadata. Last verified 2026-11-26, after release `5228228`.

Site: `https://stefano-lunardi-d960960gm-0f09.wix-site-host.com`
(siteId `b24dc2d0-f24b-4d97-b733-550f7c321876`).

## What OpenGraph.to measures

OpenGraph.to is a link-preview checker, not a Google ranking factor. It fetches
a public URL, extracts Open Graph, Twitter Card and basic SEO tags, then returns
a 0-100 score plus issues and previews for Google, Facebook, X/Twitter,
LinkedIn, Discord, WhatsApp, Slack, and Telegram.

It explicitly checks:

- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`.
- OG image dimensions, HTTPS, file size, loadability and `og:image:alt`.
- Twitter Card fields, especially `twitter:card`.
- Canonical URL, response time and HTML size.

Its own docs recommend:

- OG image `1200 x 630` px, absolute HTTPS URL.
- File size under 5 MB, ideally under 1 MB and under 500 KB for WhatsApp.
- JPG for photos, PNG for graphics with text.
- `twitter:card: summary_large_image` for a wide image.
- Set both Open Graph and Twitter tags; X falls back to OG but needs
  `twitter:card` for a rich preview.

The exact internal score weights are not published on the pages reviewed. Do
not invent them. Work from the actual `analysis.issues` returned by the API.

Public API, no auth, 10 requests/hour, 5-minute cache:

```bash
curl "https://www.opengraph.to/api/v1/og?url=https://stefano-lunardi-d960960gm-0f09.wix-site-host.com"
```

API docs: `https://www.opengraph.to/api`.

## Current live homepage result

Verified from the API on 2026-11-26:

```json
{
  "url": "https://stefano-lunardi-d960960gm-0f09.wix-site-host.com",
  "title": "Stefano Lunardi | Fotografo Matrimoni Italia Austria",
  "description": "Matrimoni come opere d'arte, non come catene di montaggio. Destination wedding tra Italia e Austria: ogni scatto è un quadro d'arte.",
  "siteName": "Stefano Lunardi",
  "type": "website",
  "locale": "it_IT",
  "image": {
    "url": "https://static.wixstatic.com/media/600582_4c52a05bbf904a389af38932582dab78~mv2.jpg/v1/fill/w_1200,h_630,al_c/600582_4c52a05bbf904a389af38932582dab78~mv2.jpg",
    "width": 1200,
    "height": 630,
    "alt": "Fotografia di matrimonio con velo",
    "type": ""
  },
  "twitter": {
    "card": "summary_large_image",
    "site": "",
    "creator": "",
    "title": "Stefano Lunardi | Fotografo Matrimoni Italia Austria",
    "description": "Matrimoni come opere d'arte, non come catene di montaggio. Destination wedding tra Italia e Austria: ogni scatto è un quadro d'arte.",
    "image": "https://static.wixstatic.com/media/600582_4c52a05bbf904a389af38932582dab78~mv2.jpg/v1/fill/w_1200,h_630,al_c/600582_4c52a05bbf904a389af38932582dab78~mv2.jpg"
  },
  "favicon": "https://static.wixstatic.com/shapes/600582_b61128900f3b4f5da3e8d3fed66528e7.svg",
  "canonical": "https://stefano-lunardi-d960960gm-0f09.wix-site-host.com",
  "analysis": {
    "score": 89,
    "summary": "Good setup, but there are some improvements you can make.",
    "issues": [
      {
        "severity": "info",
        "category": "twitter",
        "slug": "missing-twitter-site",
        "title": "Missing twitter:site",
        "description": "Adding your X/Twitter @username helps attribute content to your account and improves brand visibility.",
        "fix": "<meta name=\"twitter:site\" content=\"@yourusername\" />"
      },
      {
        "severity": "warning",
        "category": "general",
        "slug": "slow-response-time",
        "title": "Slow response time (1.10s)",
        "description": "The server took 1.10 seconds to respond. Google recommends a server response time under 200ms. Aim for under 1 second to improve SEO and user experience."
      },
      {
        "severity": "info",
        "category": "general",
        "slug": "html-size-moderate",
        "title": "HTML size is moderate (128 KB)",
        "description": "The HTML document is 128 KB. While not critical, keeping HTML under 100 KB improves initial load performance."
      }
    ]
  }
}
```

The API's `suggestedTags` is generic. Do not paste it blindly: it omits useful
tags already present on the page (`og:image:width`, `og:image:height`,
`og:image:alt`, `og:locale`) and would add a placeholder `twitter:site`.

## What is already correct

- The homepage OG image is exactly `1200x630`: the URL uses Wix's
  `v1/fill/w_1200,h_630,al_c/` transform and the API parses width/height as
  `1200`/`630`.
- `og:image` is absolute HTTPS and loads from `static.wixstatic.com`.
- `og:image:alt` is `Fotografia di matrimonio con velo`.
- `canonical` and `og:url` match the live homepage URL.
- `og:title`, `twitter:title`, `og:description` and `twitter:description` match.
- `og:type=website`, `og:site_name=Stefano Lunardi`, `og:locale=it_IT`.
- `twitter:card=summary_large_image` with the same 1200x630 image.
- Favicon is the Wix-hosted SVG
  `https://static.wixstatic.com/shapes/600582_b61128900f3b4f5da3e8d3fed66528e7.svg`,
  which the API sees as `favicon`.

## Wix-specific state and gotchas

- Homepage SEO tags already live in the Wix dashboard. A previous dashboard
  write used `itemId=b24dc2d0-f24b-4d97-b733-550f7c321876_HOME`,
  `itemType=STATIC_PAGE`, `writeStatus=200`, `tagCount=8`, and added
  `og:image:alt` plus `og:locale`.
- Do not re-add default-locale title/description from app code. Commit
  `34af7b0 fix(seo): avoid duplicate default locale head tags` fixed duplicated
  titles caused by the Wix viewer injecting a locale-level title.
- `src/app/seo-head.ts` exports `shouldEmitSecondaryLocaleTitle()`; the layout
  uses it so secondary static pages can emit their own real `<title>` while the
  default locale keeps the dashboard title only.
- The layout fallback emits `twitter:card=summary` and OG tags without an image
  for pages that do not have dashboard SEO tags. The homepage is not in that
  fallback path; its live `twitter:card` is `summary_large_image`.
- Wix serves dashboard `/favicon.ico` bytes at `/favicon.svg` on the live edge.
  All head/manifest links therefore use Wix-hosted URLs, never local
  `/favicon.svg` or `/favicon.ico`.
- `twitter:site` is empty in the live snapshot above. The user confirmed the
  handle as `@stefanolunardiphoto` on 2026-11-27; add it through the Wix
  dashboard SEO flow that owns the other homepage tags, then re-check the API.

## Performance context behind the two general issues

OpenGraph.to measured response time `1.10s` and HTML size `128 KB`. Separate
Chrome DevTools trace facts from the same site:

- Conditions: CPU throttling `1x`, network throttling `none`, CrUX unavailable.
- `NAVIGATION_0`: LCP `2860 ms`; TTFB `1482 ms`; load delay `24 ms`; load
  duration `1272 ms`; render delay `82 ms`; CLS `0.00`.
- LCP element: `IMG class='sw-still__img'`, URL uses
  `600582_b7b6237f50864490822e1dd24cd9b0e0~mv2.avif` with
  `w_960,h_536,...q_90`.
- LCP request: queued `1506 ms`, sent `1533 ms`, download complete `2777 ms`,
  total `1273 ms`, `200`, `image/avif`, `h3`, priority `High`, non-render-blocking.
- `DocumentLatency` estimated FCP/LCP savings: `1376 ms`.
- `ImageDelivery` potential savings: `1.8 MB`. Top offenders:
  `600582_645c3b2069924c4d9d22c831960610bc~mv2.avif` `753 kB`,
  `600582_952517e626b944c595faaae8305e3e3a~mv2.avif` `383.9 kB`,
  `600582_d6196421a6164916a081fe5ffd20de27~mv2.avif` `281.6 kB`,
  LCP AVIF `194.3 kB`.
- `Cache`: hashed `/_astro/*` assets observed with
  `max-age=3600`; wasted bytes included `02-autentiche.BPuK9tDV.webp`
  `167.5 kB`, `schema-form.BcFp3vEQ.js` `39.9 kB`,
  `03-autentiche.B4hmXiCh.webp` `121.4 kB`, `react-dom.CwsjTuFM.js`
  `33.2 kB`, `01-autentiche.PIc0RAQa.webp` `63.9 kB`,
  `photo-grid-zoom.CshkGorL.js` `22.8 kB`, `nav.B_fEWIVP.css` `9.9 kB`,
  `fonts/2640269fc0017342.woff2` `58.4 kB`.
- `DOMSize`: `702` elements, depth `11`; estimated savings `none`. Do not make
  DOM size the first priority.
- Network: `62` requests, including two Wix consent bundles from
  `static.parastorage.com`.

## Prioritized plan to raise the score

1. **Add the confirmed `twitter:site`.** The user confirmed
   `@stefanolunardiphoto` on 2026-11-27. Add `<meta name="twitter:site"
   content="@stefanolunardiphoto" />` through the Wix dashboard SEO flow that
   owns the other homepage tags. Do not use a placeholder.
2. **Reduce response time.** The API warning triggers above `1s`; aim under
   `1s`, ideally well below. Investigate Wix SSR/document latency before touching
   metadata. The Chrome trace points at document latency as the largest
   measurable opportunity (`1376 ms` estimated savings).
3. **Reduce HTML under `100 KB`.** OpenGraph.to measured `128 KB`. Audit what is
   being server-rendered/inlined; avoid adding more inline JSON, scripts or
   duplicate tags. Do not strip required structured data blindly.
4. **Do not regress the image.** Keep the 1200x630 Wix transform, absolute HTTPS
   URL, width/height metadata and alt text. OpenGraph.to did not flag the image.
5. **Recheck after release.** The API is cached for 5 minutes and limited to
   10 requests/hour. Run one check, wait if needed, and do not hammer the API.

## Verification recipe

After any metadata or performance change:

```bash
npm run check
npm test
npm run build
npm run release
curl "https://www.opengraph.to/api/v1/og?url=https://stefano-lunardi-d960960gm-0f09.wix-site-host.com"
```

Before declaring success, confirm all of these from the API response:

- `score` increased and `analysis.issues` no longer contains the fixed slug.
- `image.width === 1200` and `image.height === 630`.
- `image.alt` is still `Fotografia di matrimonio con velo`.
- `twitter.card === "summary_large_image"`.
- `canonical === "https://stefano-lunardi-d960960gm-0f09.wix-site-host.com"`.
- No duplicate `<title>` appeared on the default locale.

## Do not do

- Do not invent an X/Twitter handle.
- Do not copy OpenGraph.to's generated `suggestedTags` verbatim; it drops useful
  tags.
- Do not change the OG image away from the current 1200x630 Wix transform
  without a measured reason.
- Do not add browser-only code to Astro frontmatter; Wix SSR will crash on
  `HTMLElement`/`window`/`document`.
- Do not reference local `public/` images for OG/favicon; use Wix Media Manager
  URLs from `docs/images-sitemap.txt`.
- Do not treat OpenGraph.to score as Google search ranking; it measures social
  preview quality and page-fetch characteristics.
