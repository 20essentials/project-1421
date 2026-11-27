import { expect, test } from "@playwright/test";

const STORY = "[data-wedding-film]";
const STORY_VIDEO = "[data-wedding-film-video]";
const FEATURED = "#video-in-evidenza";
const LIGHTBOX = "[data-video-lightbox]";

const CAPTIONS = [
  "Video reel wedding 2026",
  "Wedding video V+L",
  "Cristina e Nicolo wedding movie",
] as const;

const HEADINGS = {
  it: { story: "Creazione di un video di matrimonio personalizzato", featured: "VIDEO IN EVIDENZA", cta: "Richiedi un wedding film" },
  es: { story: "La creación de un vídeo de boda personalizado", featured: "VÍDEOS DESTACADOS", cta: "Solicitar un wedding film" },
  en: { story: "Creating a personalized wedding video", featured: "FEATURED VIDEOS", cta: "Request a wedding film" },
  de: { story: "Die Erstellung eines individuellen Hochzeitsvideos", featured: "VIDEOS IM FOKUS", cta: "Ein Hochzeitsvideo anfragen" },
} as const;

const PLAYER = {
  it: { play: "Riproduci video", close: "Chiudi il video" },
  es: { play: "Reproducir vídeo", close: "Cerrar vídeo" },
  en: { play: "Play video", close: "Close video" },
  de: { play: "Video abspielen", close: "Video schließen" },
} as const;

test("wedding film story keeps its copy on the left and loads video lazily", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/it/", { waitUntil: "domcontentloaded" });

  const story = page.locator(STORY);
  await story.scrollIntoViewIfNeeded();

  await expect(story.getByRole("heading", { level: 2, name: HEADINGS.it.story })).toBeVisible();
  await expect(story.getByRole("link", { name: HEADINGS.it.cta })).toHaveAttribute("href", "/it/contatti");

  const video = story.locator(STORY_VIDEO);
  await expect(video).toHaveAttribute("loading", "lazy");
  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).toHaveAttribute("poster", /static\.wixstatic\.com\/media\//);
  await expect(video).toHaveAttribute("src", /video\.wixstatic\.com\/video\//);
  await expect(video).toHaveAttribute("width", "1920");
  await expect(video).toHaveAttribute("height", "1080");

  const storyBox = await story.boundingBox();
  const copyBox = await story.locator(".wf-story__copy-inner").boundingBox();
  expect(storyBox).not.toBeNull();
  expect(copyBox).not.toBeNull();
  expect(copyBox!.x + copyBox!.width / 2).toBeLessThan((storyBox!.x + storyBox!.width / 2) - 100);

  const timeline = await story
    .locator(".wf-story__layer")
    .evaluate((element) => getComputedStyle(element).animationTimeline);
  expect(timeline).toContain("--wedding-film");

  expect(await story.evaluate((element) => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(0);
});

test("featured videos are three minimal columns with a centered play affordance", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/it/", { waitUntil: "domcontentloaded" });

  const featured = page.locator(FEATURED);
  await featured.scrollIntoViewIfNeeded();

  await expect(featured.getByRole("heading", { level: 2, name: HEADINGS.it.featured })).toBeVisible();

  const cards = featured.locator("[data-video-card]");
  const items = featured.locator(".wf-featured__item");
  await expect(cards).toHaveCount(3);
  expect(await featured.locator(".wf-featured__list").evaluate((element) => getComputedStyle(element).flexDirection)).toBe("row");

  for (let index = 0; index < CAPTIONS.length; index += 1) {
    const card = cards.nth(index);
    await expect(items.nth(index).locator("figcaption")).toHaveText(CAPTIONS[index]);
    await expect(card.locator("[data-video-poster]")).toHaveAttribute(
      "src",
      index === 0
        ? "https://static.wixstatic.com/media/600582_23fb48b239e34239a43036bee7d20c85~mv2.avif"
        : /static\.wixstatic\.com\/media\//,
    );
    await expect(card.locator("[data-video-open]")).toHaveAttribute(
      "aria-label",
      `${PLAYER.it.play}: ${CAPTIONS[index]}`,
    );
    await expect(card.locator("[data-video-open]")).toHaveAttribute("aria-haspopup", "dialog");
    await expect(card.locator(".wf-featured__play")).toBeVisible();
    await expect(card.locator("video")).toHaveCount(0);
  }

  await expect(
    featured.locator("[data-video-controls], [data-video-toggle], [data-video-seek], [data-video-mute], [data-video-fullscreen]"),
  ).toHaveCount(0);
});

test("clicking a featured video opens a centered lightbox and Escape closes it", async ({ page }) => {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      problems.push(`${message.type()}: ${message.text()}`);
    }
  });

  await page.addInitScript(() => {
    const playing = new WeakSet<HTMLMediaElement>();
    Object.defineProperty(HTMLMediaElement.prototype, "paused", {
      configurable: true,
      get() {
        return !playing.has(this);
      },
    });
    HTMLMediaElement.prototype.play = function () {
      playing.add(this);
      this.dispatchEvent(new Event("play"));
      return Promise.resolve();
    };
    HTMLMediaElement.prototype.pause = function () {
      playing.delete(this);
      this.dispatchEvent(new Event("pause"));
    };
  });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/it/", { waitUntil: "domcontentloaded" });

  const trigger = page.locator(FEATURED).locator("[data-video-open]").first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();

  const dialog = page.locator(LIGHTBOX);
  await expect(dialog).toHaveAttribute("open", "");
  await expect(dialog).toHaveAttribute("data-flip-ready", "");
  await expect(dialog.locator("[data-video-lightbox-title]")).toHaveText(CAPTIONS[0]);

  const video = dialog.locator("video");
  await expect(video).toHaveAttribute("src", /video\.wixstatic\.com\/video\//);
  await expect(video).toHaveAttribute("controls", "");
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);

  const close = dialog.locator("[data-video-close]");
  await expect(close).toBeVisible();
  await expect(close).toHaveAttribute("aria-label", PLAYER.it.close);
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).not.toHaveAttribute("open", "");
  await expect(dialog).not.toHaveAttribute("data-flip-ready", "");
  expect(await trigger.evaluate((element) => element === document.activeElement)).toBe(true);
  expect(problems).toEqual([]);
});

test("featured videos keep a native player without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("/it/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("[data-video-fallback]").first()).toBeVisible();
  await expect(page.locator("[data-video-fallback]").first()).toHaveAttribute("controls", "");
  await expect(page.locator("[data-video-open]").first()).toBeHidden();
  await context.close();
});

test("featured videos stack on mobile without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/it/", { waitUntil: "domcontentloaded" });

  const featured = page.locator(FEATURED);
  await featured.scrollIntoViewIfNeeded();

  expect(await featured.locator(".wf-featured__list").evaluate((element) => getComputedStyle(element).flexDirection)).toBe("column");
  await expect(featured.locator("[data-video-open]").first()).toBeVisible();
  expect(await featured.evaluate((element) => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(0);
  expect(await page.locator(STORY).evaluate((element) => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(0);
});

for (const locale of ["es", "en", "de"] as const) {
  test(`wedding film sections are localized in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}/`, { waitUntil: "domcontentloaded" });

    const story = page.locator(STORY);
    await story.scrollIntoViewIfNeeded();
    await expect(story.getByRole("heading", { level: 2, name: HEADINGS[locale].story })).toBeVisible();
    await expect(story.getByRole("link", { name: HEADINGS[locale].cta })).toHaveAttribute("href", `/${locale}/contatti`);

    const featured = page.locator(FEATURED);
    await featured.scrollIntoViewIfNeeded();
    await expect(featured.getByRole("heading", { level: 2, name: HEADINGS[locale].featured })).toBeVisible();
    await expect(featured.locator("[data-video-open]").first()).toHaveAttribute(
      "aria-label",
      `${PLAYER[locale].play}: ${CAPTIONS[0]}`,
    );
    await expect(page.locator(LIGHTBOX).locator("[data-video-close]")).toHaveAttribute(
      "aria-label",
      PLAYER[locale].close,
    );
  });
}

test("reduced motion pauses the background video and keeps the console clean", async ({ page }) => {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      problems.push(`${message.type()}: ${message.text()}`);
    }
  });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/it/", { waitUntil: "domcontentloaded" });

  const story = page.locator(STORY);
  await story.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await expect(story.locator(STORY_VIDEO)).not.toHaveAttribute("autoplay", "");
  expect(await story.locator(STORY_VIDEO).evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  expect(await story.locator(".wf-story__layer").evaluate((element) => getComputedStyle(element).animationName)).toBe("none");

  const trigger = page.locator(FEATURED).locator("[data-video-open]").first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.locator(LIGHTBOX);
  await expect(dialog).toHaveAttribute("open", "");
  const transform = await dialog.locator("video").evaluate((element) => getComputedStyle(element).transform);
  expect(transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
  await dialog.locator("[data-video-close]").click();
  await expect(dialog).not.toHaveAttribute("open", "");
  expect(problems).toEqual([]);
});
