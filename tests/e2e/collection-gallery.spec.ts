import { expect, test } from "@playwright/test";

const URL = "/it/portfolio/foto-artistiche-non-matrimoni";

test("la colección muestra la galería directamente, sin nivel de proyecto", async ({ page }) => {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") problems.push(`${message.type()}: ${message.text()}`);
  });

  await page.goto(URL, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Foto artistiche non matrimoni");

  const figures = page.locator("main figure");
  await expect(figures.first()).toBeVisible();
  expect(await figures.count()).toBeGreaterThanOrEqual(35);
  expect(await page.locator('a[href*="/projects/"]').count()).toBe(0);

  const layout = await figures.first().evaluate((el) => {
    const parent = el.parentElement!;
    return { columns: getComputedStyle(parent).columnCount, gap: getComputedStyle(parent).columnGap };
  });
  expect(layout).toEqual({ columns: "3", gap: "24px" });
  expect(problems).toEqual([]);
});

test("el click en una foto de la galería abre el mismo lightbox FLIP", async ({ page }) => {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") problems.push(`${message.type()}: ${message.text()}`);
  });

  await page.goto(URL, { waitUntil: "networkidle" });
  const tile = page.locator(".pg-gallery-tile").first();
  await tile.scrollIntoViewIfNeeded();
  await tile.click();

  const lightbox = page.locator(".pg-lightbox");
  await expect(lightbox).toBeVisible();
  await page.waitForFunction(
    () => {
      const img = document.querySelector<HTMLElement>(".pg-lightbox__img");
      if (!img) return false;
      const style = getComputedStyle(img);
      const identity = style.transform === "none" || style.transform === "matrix(1, 0, 0, 1, 0, 0)";
      return identity && ["none", "inset(0px)", "inset(0px 0px 0px 0px)"].includes(style.clipPath);
    },
    { timeout: 5000 },
  );

  const box = await page.locator(".pg-lightbox__img").boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  if (box && viewport) {
    expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThanOrEqual(viewport.width * 0.06);
    expect(Math.abs(box.y + box.height / 2 - viewport.height / 2)).toBeLessThanOrEqual(viewport.height * 0.08);
  }

  await page.waitForTimeout(300);
  await page.keyboard.press("Escape");
  await expect(lightbox).toBeHidden();
  await expect(tile).toBeFocused();
  expect(problems).toEqual([]);
});
