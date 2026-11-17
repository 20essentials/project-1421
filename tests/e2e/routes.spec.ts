import { expect, test } from "@playwright/test";

const routes = ["/", "/portfolio", "/il-mio-metodo", "/chi-sono", "/location", "/investimento", "/blog", "/faq", "/contatti", "/recensioni", "/awards", "/fine-art", "/impressum"];

test.describe("site routes", () => {
  for (const route of routes) {
    test(`renders ${route} without server error`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator("header").first()).toBeVisible();
      await expect(page.locator("main").first()).toBeVisible();
    });
  }
});

test.describe("header", () => {
  test.use({ viewport: { width: 1000, height: 900 } });

  test("floating pill header is fixed at the top", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header").first();
    await expect(header).toBeVisible();
    await expect(page.locator("nav[aria-label='Principale']")).toBeHidden();
  });

  test("menu toggle opens and closes the overlay", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator(".menu-toggle");
    await toggle.click();
    const menu = page.locator("#menu");
    await expect(menu).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(menu).not.toBeVisible();
  });
});
