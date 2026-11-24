import { expect, test } from "@playwright/test";

const LIGHTBOX = ".pg-lightbox";
const LIGHTBOX_IMG = ".pg-lightbox__img";

async function openFirstTile(page: import("@playwright/test").Page) {
  const tile = page.locator(".bento-tile").first();
  await tile.scrollIntoViewIfNeeded();
  await tile.click();
  const lightbox = page.locator(LIGHTBOX);
  await expect(lightbox).toBeVisible();
  return { tile, lightbox };
}

test("la grid es masonry y cada foto conserva su proporción natural", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator(".bento-grid").evaluate((el) => getComputedStyle(el).columnCount)).toBe("4");

  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll<HTMLImageElement>(".bento-tile img"))
      .slice(0, 3)
      .every((img) => img.naturalWidth > 0 && img.naturalHeight > 0),
  );

  const ratios = await page.locator(".bento-tile img").evaluateAll((nodes) =>
    nodes.slice(0, 3).map((node) => {
      const img = node as HTMLImageElement;
      const box = img.getBoundingClientRect();
      return {
        rendered: box.width / box.height,
        natural: img.naturalWidth / img.naturalHeight,
        objectFit: getComputedStyle(img).objectFit,
      };
    }),
  );

  for (const ratio of ratios) {
    expect(ratio.natural).toBeGreaterThan(0);
    expect(Math.abs(ratio.rendered - ratio.natural)).toBeLessThan(0.02);
    expect(ratio.objectFit).not.toBe("cover");
  }
});

test("el click en un tile abre el lightbox con la imagen centrada y sin recorte", async ({ page }) => {
  await page.goto("/");
  const { lightbox } = await openFirstTile(page);

  // Al terminar la animación el FLIP queda en identidad (sin transform) y sin clip.
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

  const box = await page.locator(LIGHTBOX_IMG).boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  if (!box || !viewport) return;

  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  expect(Math.abs(centerX - viewport.width / 2)).toBeLessThanOrEqual(viewport.width * 0.06);
  expect(Math.abs(centerY - viewport.height / 2)).toBeLessThanOrEqual(viewport.height * 0.08);

  // El velo de fondo y el cierre por click en cualquier parte.
  const backdrop = await lightbox.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(backdrop).toContain("0.94");
  await lightbox.click({ position: { x: 4, y: 4 } });
  await expect(lightbox).toBeHidden();
});

test("Escape cierra, devuelve el foco al tile y libera el scroll", async ({ page }) => {
  await page.goto("/");
  const { tile, lightbox } = await openFirstTile(page);

  await page.waitForTimeout(1200);
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");

  await page.keyboard.press("Escape");
  await expect(lightbox).toBeHidden();
  await expect(tile).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
});

test("prefers-reduced-motion abre y cierra sin animación", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const { lightbox, tile } = await openFirstTile(page);

  const state = await page.locator(LIGHTBOX_IMG).evaluate((el) => {
    const style = getComputedStyle(el);
    return { transform: style.transform, clipPath: style.clipPath, opacity: style.opacity };
  });
  expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(state.transform);
  expect(["none", "inset(0px)", "inset(0px 0px 0px 0px)"]).toContain(state.clipPath);

  await page.keyboard.press("Escape");
  await expect(lightbox).toBeHidden();
  await expect(tile).toBeFocused();
});

test("la sección del portfolio no ensucia la consola", async ({ page }) => {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      problems.push(`${message.type()}: ${message.text()}`);
    }
  });

  await page.goto("/");
  const { lightbox } = await openFirstTile(page);
  await page.waitForTimeout(1200);
  await page.keyboard.press("Escape");
  await expect(lightbox).toBeHidden();
  await page.waitForTimeout(600);

  expect(problems).toEqual([]);
});
