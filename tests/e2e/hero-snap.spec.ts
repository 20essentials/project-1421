import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function openHome(page: Page) {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      problems.push(`${message.type()}: ${message.text()}`);
    }
  });
  await page.goto("/");
  await page.waitForSelector("[data-scroll-world][data-ready]");
  await page.waitForFunction(() => document.documentElement.classList.contains("lenis"));
  await page.waitForTimeout(800);
  return problems;
}

async function heroStops(page: Page): Promise<number[]> {
  return page.evaluate(() => {
    const root = document.querySelector<HTMLElement>("[data-scroll-world]")!;
    const viewport = root.querySelector<HTMLElement>(".sw-viewport")!;
    const height = parseFloat(root.style.height);
    const vh = parseFloat(getComputedStyle(viewport).height);
    const sceneCount = root.querySelectorAll(".sw-scene").length;
    const segment = (height - vh) / sceneCount;
    return [0, segment + segment / 2, (sceneCount - 1) * segment + segment / 2, height];
  });
}

async function wheelTo(page: Page, delta: number, target: number) {
  await page.mouse.wheel(0, delta);
  await page.waitForFunction((value) => Math.abs(window.scrollY - value) < 5, target, {
    timeout: 5000,
  });
  await page.waitForTimeout(900);
}

test("un solo gesto de wheel avanza un slide y retrocede al anterior", async ({ page }) => {
  const problems = await openHome(page);
  const [start, second, third, exit] = await heroStops(page);
  await page.mouse.move(640, 400);
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(5);

  await wheelTo(page, 120, second);
  await wheelTo(page, 120, third);
  const thirdViewport = await page.locator(".sw-viewport").evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, innerHeight: window.innerHeight };
  });
  expect(Math.abs(thirdViewport.top)).toBeLessThan(2);
  expect(Math.abs(thirdViewport.bottom - thirdViewport.innerHeight)).toBeLessThan(2);

  await wheelTo(page, 120, exit);
  expect(start).toBeLessThan(second);

  await page.mouse.wheel(0, 120);
  await page.waitForFunction((value) => window.scrollY > value + 5, exit, { timeout: 5000 });
  await wheelTo(page, -120, exit);
  await wheelTo(page, -120, third);
  await wheelTo(page, -120, second);

  expect(problems).toEqual([]);
});
