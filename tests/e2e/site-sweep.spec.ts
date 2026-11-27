// Whole-site sweep against the LIVE site (SWEEP_BASE_URL overrides): every
// static route (+ one live blog post, one portfolio project, and the /projects
// redirect) must answer 200, render exactly ONE <title> and one non-empty
// <h1> — or, where the page defines a static H1, the exact expected text.
// CMS-driven H1s are checked for presence only, so dashboard edits by the
// owner don't break the sweep.
//
// Blog posts and portfolio projects are dynamic sub-routes where the Wix edge
// currently duplicates SEO tags (platform issue, reported — not fixable from
// the app): there the sweep asserts a non-empty title instead of exactly one.
import { expect, test } from "@playwright/test";

const BASE = process.env.SWEEP_BASE_URL ?? "https://stefano-lunardi-d960960gm-0f09.wix-site-host.com";
const TOLERANT_TITLE_ROUTES = ["/blog/", "/projects/"];

type Expected = { h1?: string };

const STATIC_ROUTES: Record<string, Expected> = {
  "/": {},
  "/portfolio": { h1: "Every frame is a painting" },
  "/il-mio-metodo": {},
  "/chi-sono": {},
  "/location": {},
  "/investimento": {},
  "/blog": { h1: "Storie, location e consigli" },
  "/faq": { h1: "Tutto quello che volete sapere" },
  "/contatti": {},
  "/recensioni": {},
  "/awards": {},
  "/fine-art": {},
  "/impressum": {},
  "/legal": {},
  "/legal/termini-e-condizioni": {},
  "/legal/termini-di-utilizzo": {},
  "/legal/privacy": {},
  "/legal/protezione-dati": {},
  "/legal/carta-accordo-privacy": {},
  "/legal/accordo-utente": {},
  "/legal/accessibilita": {},
  "/legal/avviso-legale": {},
  "/legal/cookie-policy": {},
  "/legal/resi-e-rimborsi": {},
  "/legal/manifesto-soberania-digitale": {},
};

function tolerantTitle(route: string) {
  return TOLERANT_TITLE_ROUTES.some((prefix) => route.includes(prefix));
}

async function sweep(page: import("@playwright/test").Page, route: string, expected: Expected) {
  const response = await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
  expect(response?.status(), route).toBe(200);

  const titles = page.locator("head title");
  if (tolerantTitle(route)) {
    const titleText = (await titles.first().textContent()) ?? "";
    expect(titleText.trim(), route).toBeTruthy();
  } else {
    await expect(titles, route).toHaveCount(1);
    const titleText = (await titles.first().textContent()) ?? "";
    expect(titleText.trim(), route).toBeTruthy();
  }

  if (expected.h1 !== undefined) {
    await expect(page.locator("h1"), route).toHaveCount(1);
    await expect(page.locator("h1"), route).toHaveText(expected.h1);
  } else {
    await expect(page.locator("h1"), route).toHaveCount(1);
    await expect(page.locator("h1"), route).not.toHaveText("");
  }
}

test.describe("whole-site sweep (live)", () => {
  const liveRequested = !!process.env.SWEEP_LIVE || !!process.env.CI || !!process.env.SWEEP_BASE_URL;
  test.skip(!liveRequested, "set SWEEP_LIVE=1 (or SWEEP_BASE_URL, or run in CI) to sweep the live site");

  for (const [route, expected] of Object.entries(STATIC_ROUTES)) {
    test(`sweep ${route}`, async ({ page }) => {
      await sweep(page, route, expected);
    });
  }

  test("/projects redirects to /portfolio", async ({ page }) => {
    const response = await page.goto(`${BASE}/projects`, { waitUntil: "domcontentloaded" });
    expect(new URL(page.url()).pathname.replace(/\/$/, "")).toBe("/portfolio");
    expect(response?.status()).toBe(200);
  });

  test("sweep one live blog post", async ({ page }) => {
    await page.goto(`${BASE}/blog`, { waitUntil: "domcontentloaded" });
    const postHref = (await page
      .locator('main a[href^="/blog/"]:not([href*="/category/"]):not([href*="/tag/"])')
      .first()
      .getAttribute("href")) ?? "";
    expect(postHref, "the blog listing must link at least one post").toBeTruthy();
    await sweep(page, postHref!, {});
  });

  test("sweep one live portfolio gallery", async ({ page }) => {
    await page.goto(`${BASE}/portfolio`, { waitUntil: "domcontentloaded" });
    const collectionHref = (await page.locator('a[href*="/portfolio/"]').first().getAttribute("href")) ?? "";
    expect(collectionHref, "the portfolio must link at least one collection").toBeTruthy();
    const response = await page.goto(`${BASE}${collectionHref}`, { waitUntil: "domcontentloaded" });
    expect(response?.status(), collectionHref).toBe(200);
    const images = page.locator("main img");
    await expect(images.first()).toBeVisible();
    expect(await images.count(), collectionHref).toBeGreaterThan(0);
    expect(await page.locator('a[href*="/projects/"]').count(), collectionHref).toBe(0);
    const titleText = (await page.locator("head title").first().textContent()) ?? "";
    expect(titleText.trim(), collectionHref).toBeTruthy();
  });
});
