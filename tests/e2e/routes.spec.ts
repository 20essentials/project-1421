import { expect, test } from "@playwright/test";

const routes = ["/", "/portfolio", "/il-mio-metodo", "/chi-sono", "/location", "/investimento", "/blog", "/faq", "/contatti", "/recensioni", "/awards", "/fine-art", "/impressum", "/legal", "/legal/termini-e-condizioni", "/legal/privacy", "/legal/accessibilita", "/legal/avviso-legale"];
const iconSvgUrl = "https://static.wixstatic.com/shapes/600582_b61128900f3b4f5da3e8d3fed66528e7.svg";
const icon16Url = "https://static.wixstatic.com/media/600582_2ae8b80b777540379b8366b38a897034~mv2.png";
const icon32Url = "https://static.wixstatic.com/media/600582_8da5d525d72249298e640322b076e8f3~mv2.png";

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

test.describe("favicon", () => {
  test("uses Wix-hosted icons and a legible small-size variant", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const hrefs = await page.locator("head link[rel='icon']").evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("href")),
    );
    expect(hrefs).toContain(iconSvgUrl);
    expect(hrefs).toContain(icon16Url);
    expect(hrefs).toContain(icon32Url);
    expect(hrefs).not.toContain("/favicon.ico");

    const manifest = await page.request.get("/site.webmanifest");
    const json = await manifest.json();
    expect(json.icons).toEqual(
      expect.arrayContaining([expect.objectContaining({ src: iconSvgUrl, type: "image/svg+xml" })]),
    );

    await page.goto("/this-route-does-not-exist", { waitUntil: "domcontentloaded" });
    const notFoundHrefs = await page.locator("head link[rel='icon']").evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("href")),
    );
    expect(notFoundHrefs).toContain(icon16Url);
    expect(notFoundHrefs).not.toContain("/favicon.ico");
  });
});

test.describe("typography", () => {
  test("homepage uses the editorial display face and structured heading weight", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(500);
    await page.evaluate(() => document.fonts.ready);

    const heading = await page.locator("main h1").first().evaluate((element) => {
      const style = getComputedStyle(element);
      return { family: style.fontFamily, weight: style.fontWeight };
    });
    const bodyFamily = await page.locator("body").evaluate((element) => getComputedStyle(element).fontFamily);

    expect(heading.family).toContain("Cormorant");
    expect(heading.weight).toBe("600");
    expect(bodyFamily).toContain("Inter");
  });
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
