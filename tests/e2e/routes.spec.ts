import { expect, test } from "@playwright/test";

const routes = ["/", "/portfolio", "/examples", "/il-mio-metodo", "/chi-sono", "/location", "/investimento", "/blog", "/faq", "/contatti", "/recensioni", "/awards", "/fine-art", "/impressum", "/legal", "/legal/termini-e-condizioni", "/legal/privacy", "/legal/accessibilita", "/legal/avviso-legale"];

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
    await expect(page.locator("header nav")).toBeHidden();
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

test.describe("header indicator follower", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  const read = async (page: import("@playwright/test").Page) =>
    page.locator(".nav-indicator").evaluate(el => ({
      x: parseFloat(getComputedStyle(el).getPropertyValue("--x")),
      w: parseFloat(getComputedStyle(el).getPropertyValue("--w")),
    }));

  test("indicator follows hovered nav link and returns to the active one", async ({ page }) => {
    await page.goto("/blog");
    const nav = page.locator("header nav");
    const links = page.locator("[data-nav-link]");
    const count = await links.count();
    test.expect(count).toBeGreaterThan(1);

    await expect(nav).toBeVisible();
    await page.locator(".nav-indicator").waitFor({ state: "attached" });

    const rest = await read(page);

    const last = links.nth(count - 1);
    await last.hover();
    await page.waitForTimeout(50);
    const hovered = await read(page);
    test.expect(Math.abs(hovered.x - rest.x)).toBeGreaterThan(1);
    test.expect(hovered.w).toBeGreaterThan(0);

    await page.mouse.move(0, 500);
    await page.waitForTimeout(50);
    const back = await read(page);
    test.expect(Math.abs(back.x - rest.x)).toBeLessThan(1);
  });
});
