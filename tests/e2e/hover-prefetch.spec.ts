import { expect, test } from "@playwright/test";

type PrefetchRule = {
  eagerness?: string;
  where?: {
    and?: Array<{ href_matches?: string; not?: { selector_matches?: string[] } }>;
  };
};

test("hovering an internal link prefetches its destination", async ({ page }) => {
  const prefetched: string[] = [];
  page.on("request", (request) => {
    if (request.headers()["sec-purpose"]?.includes("prefetch")) {
      prefetched.push(new URL(request.url()).pathname);
    }
  });

  await page.goto("/blog", { waitUntil: "domcontentloaded" });
  const link = page.locator("[data-nav-link]").first();
  const href = await link.getAttribute("href");
  expect(href).toMatch(/^\/it\//);

  await link.hover();
  await expect.poll(() => prefetched).toContain(href);
});

test("speculation rules exclude non-navigating links", async ({ page }) => {
  await page.goto("/blog", { waitUntil: "domcontentloaded" });

  const ruleText = await page.locator('script[type="speculationrules"]').textContent();
  const rules = JSON.parse(ruleText ?? "{}") as { prefetch?: PrefetchRule[] };
  const rule = rules.prefetch?.[0];

  expect(rule?.eagerness).toBe("moderate");
  expect(rule?.where?.and?.[0]).toEqual({ href_matches: "/*" });
  expect(rule?.where?.and?.[1]?.not?.selector_matches).toEqual([
    "[href^='#']",
    "[href^='mailto:']",
    "[href^='tel:']",
    "[target='_blank']",
    "[download]",
    "[data-locale-switch]",
  ]);
});
