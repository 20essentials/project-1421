import { expect, test, type Locator } from "@playwright/test";

/**
 * In dev the islands hydrate after first paint; a click fired before React attaches is
 * lost. Click, verify the state flipped, and re-click once if a pre-hydration click got
 * swallowed.
 */
async function clickToggling(button: Locator, attr: string, expected: string) {
  await button.click();
  try {
    await expect(button).toHaveAttribute(attr, expected, { timeout: 3000 });
  } catch {
    await button.click();
    await expect(button).toHaveAttribute(attr, expected);
  }
}

test("FAQ page renders questions server-side (SEO: answers visible in the HTML)", async ({ page }) => {
  await page.goto("/faq");
  // SSR guarantees the first question's button is in the HTML before hydration.
  await expect(page.locator("h3 button[id$='-button']").first()).toBeVisible();
  // Every answer is in the DOM and visible by default.
  expect(await page.locator("h3 button[aria-expanded='true']").count()).toBeGreaterThan(5);
  const html = await page.content();
  expect(html).toContain("<h3");
  expect(html).toContain('"@type":"FAQPage"');
});

test("FAQ shows 'Chi è Stefano Lunardi?' with its answer", async ({ page }) => {
  await page.goto("/faq");
  const identity = page.locator("h3 button[id$='-button']", { hasText: "Chi è Stefano Lunardi?" });
  await expect(identity).toBeVisible();
  await expect(identity).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText(/Fotografo con oltre trent/)).toBeVisible();
});

test("accordion collapses and reopens a question", async ({ page }) => {
  await page.goto("/faq");
  const button = page.locator("h3 button[id$='-button']").first();
  const panel = page.locator("div[id$='-panel']").first();

  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toBeVisible();
  await clickToggling(button, "aria-expanded", "false");
  await expect(panel).toBeHidden();
  await clickToggling(button, "aria-expanded", "true");
  // The answer text is reachable inside the expanded region.
  await expect(panel).toBeVisible();
  await expect(panel.locator("p").first()).toContainText(/.+/);
});

test("search filters questions and can be cleared", async ({ page }) => {
  await page.goto("/faq");
  await page.waitForLoadState("load");
  const firstQuestion = (await page.locator("h3 button span").first().textContent())!.trim();
  await page.fill("#faq-search", firstQuestion.slice(0, 8));
  await page.waitForTimeout(600); // debounce 250 ms
  await expect(page.getByText(/risultat/i)).toBeVisible();
  await page.fill("#faq-search", "");
  await page.waitForTimeout(600);
  expect(await page.locator("h3 button[id$='-button']").count()).toBeGreaterThanOrEqual(2);
});

test("category tabs filter the visible questions", async ({ page }) => {
  await page.goto("/faq");
  const tabs = page.locator("nav[aria-label='Categorie'] button");
  const tabsCount = await tabs.count();
  if (tabsCount < 2) test.skip(true, "single-category FAQ has no tab nav");
  const before = await page.locator("h3 button[id$='-button']").count();
  await clickToggling(tabs.nth(1), "aria-pressed", "true");
  const after = await page.locator("h3 button[id$='-button']").count();
  expect(after).toBeGreaterThan(0);
  expect(after).toBeLessThanOrEqual(before);
});

test("deep link pre-selects the category server-side", async ({ page }) => {
  const tabs = page.locator("nav[aria-label='Categorie'] button");
  await page.goto("/faq");
  await page.waitForLoadState("load");
  if ((await tabs.count()) < 2) test.skip(true, "single-category FAQ has no tab nav");
  const labelledBy = await page.locator("section[aria-labelledby^='faq-cat-']").first().getAttribute("aria-labelledby");
  await page.goto(`/faq?category=${labelledBy!.replace("faq-cat-", "")}`);
  await page.waitForLoadState("load");
  await expect(tabs.nth(1)).toHaveAttribute("aria-pressed", "true");
});
