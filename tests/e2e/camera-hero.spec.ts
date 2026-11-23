import { expect, test } from "@playwright/test";

const SECTION = "[data-camera-hero]";
const VIDEO = "[data-camera-hero-video]";

async function openHero(page: import("@playwright/test").Page) {
  await page.goto("/il-mio-metodo");
  await page.locator(SECTION).scrollIntoViewIfNeeded();
  await page.waitForFunction(
    (selector) => {
      const video = document.querySelector<HTMLVideoElement>(selector);
      return !!video && Number.isFinite(video.duration) && video.duration > 0;
    },
    VIDEO,
  );
}

async function movePointerTo(page: import("@playwright/test").Page, ratio: number, y: number) {
  const width = page.viewportSize()?.width ?? 1280;
  await page.mouse.move(width * ratio, y);
  await page.waitForTimeout(900);
}

test("el hero sigue el eje horizontal y respeta el centro", async ({ page }) => {
  await openHero(page);
  const source = await page.locator(VIDEO).evaluate((el: HTMLVideoElement) => el.currentSrc);
  expect(source).toMatch(/^blob:|^https:\/\/video\.wixstatic\.com\//);

  const duration = await page.locator(VIDEO).evaluate((el: HTMLVideoElement) => el.duration);
  const current = () =>
    page.locator(VIDEO).evaluate((el: HTMLVideoElement) => el.currentTime);

  await movePointerTo(page, 0.1, 300);
  expect(await current()).toBeLessThan(duration * 0.1);

  await movePointerTo(page, 0.5, 300);
  expect(Math.abs((await current()) - duration / 2)).toBeLessThan(duration * 0.05);

  await movePointerTo(page, 0.5, 700);
  expect(Math.abs((await current()) - duration / 2)).toBeLessThan(duration * 0.05);

  const settled = await current();
  await page.waitForTimeout(500);
  expect(Math.abs((await current()) - settled)).toBeLessThan(0.01);

  await movePointerTo(page, 0.9, 300);
  expect(await current()).toBeGreaterThan(duration * 0.9);
});

test("sin movimiento automático y sin consola con errores", async ({ page }) => {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      problems.push(`${message.type()}: ${message.text()}`);
    }
  });

  await openHero(page);
  await movePointerTo(page, 0.75, 400);
  await page.waitForTimeout(600);

  expect(problems).toEqual([]);
});

test("mobile mantiene el encuadre sin desbordamiento", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openHero(page);

  const layout = await page.locator(SECTION).evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const video = el.querySelector("video") as HTMLVideoElement;
    return {
      width: rect.width,
      height: rect.height,
      objectFit: getComputedStyle(video).objectFit,
      background: getComputedStyle(el).backgroundColor,
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    };
  });

  expect(layout.width).toBe(390);
  expect(layout.height).toBeLessThanOrEqual(844);
  expect(layout.objectFit).toBe("contain");
  expect(layout.background).toBe("rgb(255, 255, 255)");
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewport);
});

test("prefers-reduced-motion muestra solo el poster", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/il-mio-metodo");

  const video = page.locator(VIDEO);
  await expect(video).toHaveAttribute("poster", /static\.wixstatic\.com\/media\//);
  expect(await video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBe(0);
  expect(await video.getAttribute("src")).toBeNull();
});
