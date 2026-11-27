import { expect, test } from "@playwright/test";

const EXPECTED = {
  es: {
    methodEyebrow: "Mi método",
    methodTitle: "EL MÉTODO Fusion",
    methodStep: "El tiempo de la película",
    methodCta: "Lee todo sobre el método",
    percorsoEyebrow: "EL CAMINO JUNTOS",
    percorsoIntro: "El día de la boda no seré un proveedor que acaba de llegar",
    percorsoStep: "Diseñamos el día:",
    percorsoWord: "tres",
    deliveryTitle: "VUESTRAS FOTOGRAFÍAS, con los plazos adecuados",
    deliveryUnit: "DÍAS",
    deliveryStep: "La historia completa",
    gridTitle: "MOMENTOS REALES, compuestos con elegancia",
    reviewsTitle: "Las reseñas, una por una",
    reviewsIntro: "Historias reales, contadas con las palabras de quienes las vivieron.",
    reviewsNewlyweds: "Novios",
    reviewsCta: "Ver todas las reseñas",
  },
  en: {
    methodEyebrow: "My method",
    methodTitle: "THE Fusion METHOD",
    methodStep: "The pace of film",
    methodCta: "Read the whole method",
    percorsoEyebrow: "THE JOURNEY TOGETHER",
    percorsoIntro: "On your wedding day I won't be a supplier who has just arrived",
    percorsoStep: "We design the day:",
    percorsoWord: "three",
    deliveryTitle: "YOUR PHOTOGRAPHS, on the right timeline",
    deliveryUnit: "DAYS",
    deliveryStep: "The full story",
    gridTitle: "REAL MOMENTS, composed with elegance",
    reviewsTitle: "The reviews, one by one",
    reviewsIntro: "Real stories, told in the words of the people who lived them.",
    reviewsNewlyweds: "Newlyweds",
    reviewsCta: "Read all reviews",
  },
  de: {
    methodEyebrow: "Meine Methode",
    methodTitle: "DIE Fusion-METHODE",
    methodStep: "Die Zeit des Films",
    methodCta: "Die ganze Methode lesen",
    percorsoEyebrow: "DER WEG ZUSAMMEN",
    percorsoIntro: "Am Hochzeitstag bin ich kein gerade angekommener Dienstleister",
    percorsoStep: "Wir gestalten den Tag:",
    percorsoWord: "dreimal",
    deliveryTitle: "IHRE FOTOS, im richtigen Tempo",
    deliveryUnit: "TAGE",
    deliveryStep: "Die ganze Geschichte",
    gridTitle: "ECHTE MOMENTE, mit Eleganz komponiert",
    reviewsTitle: "Die Rezensionen, eine nach der anderen",
    reviewsIntro: "Echte Geschichten, erzählt mit den Worten derer, die sie erlebt haben.",
    reviewsNewlyweds: "Brautpaar",
    reviewsCta: "Alle Rezensionen lesen",
  },
} as const;

test("localized home pages load without console errors or warnings", async ({ page }) => {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      problems.push(`${message.type()}: ${message.text()}`);
    }
  });

  for (const locale of ["it", "es", "en", "de"]) {
    await page.goto(`/${locale}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
  }

  expect(problems).toEqual([]);
});

for (const [locale, expected] of Object.entries(EXPECTED)) {
  test(`home hero and hand-written sections are localized in ${locale}`, async ({ page }) => {
    const response = await page.goto(`/${locale}/`, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(500);

    const method = page.locator("#metodo-fusion");
    await expect(method.getByText(expected.methodEyebrow)).toBeVisible();
    await expect(method.getByRole("heading", { level: 2, name: expected.methodTitle })).toBeVisible();
    await expect(method.getByText(expected.methodStep)).toBeVisible();
    await expect(method.getByRole("link", { name: expected.methodCta })).toHaveAttribute(
      "href",
      `/${locale}/il-mio-metodo`,
    );

    const percorso = page.locator("#il-percorso");
    await expect(percorso.getByText(expected.percorsoEyebrow)).toBeVisible();
    await expect(percorso.locator("#percorso-title")).toContainText(expected.percorsoWord);
    await expect(percorso.getByText(expected.percorsoIntro, { exact: false })).toBeVisible();
    await expect(percorso.getByRole("heading", { name: expected.percorsoStep })).toBeVisible();
    await expect(percorso.locator("ol > li")).toHaveCount(3);

    const delivery = page.locator("#cosa-ricevete");
    await expect(delivery.getByRole("heading", { level: 2, name: expected.deliveryTitle })).toBeVisible();
    await expect(delivery.getByText(expected.deliveryUnit).first()).toBeVisible();
    await expect(delivery.getByRole("heading", { name: expected.deliveryStep })).toBeVisible();

    await expect(page.locator("#dove-fotografo")).toHaveCount(0);
    await expect(page.locator("#foto-e-video")).toHaveCount(0);

    await expect(page.locator("#photo-grid-title")).toHaveText(expected.gridTitle);

    const reviews = page.locator("#recensioni-home");
    await expect(reviews.getByRole("heading", { level: 2, name: expected.reviewsTitle })).toBeVisible();
    await expect(reviews.getByText(expected.reviewsIntro)).toBeVisible();
    await expect(reviews.locator(".reviews-archive__card")).toHaveCount(6);
    await expect(reviews.locator(".reviews-archive__index, .reviews-archive__stars")).toHaveCount(0);
    await expect(reviews.getByText(expected.reviewsNewlyweds).first()).toBeVisible();
    await expect(reviews.getByRole("link", { name: expected.reviewsCta })).toHaveAttribute(
      "href",
      `/${locale}/recensioni`,
    );
  });
}

test("reviews bento fills a dense editorial mosaic on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/it/", { waitUntil: "domcontentloaded" });
  const grid = page.locator("#recensioni-home .reviews-archive__grid");
  await expect(grid.locator(":scope > article")).toHaveCount(6);

  const areas = await grid.evaluate((element) => getComputedStyle(element).gridTemplateAreas);
  expect(areas).toContain(
    '"featured featured featured featured featured second second second second third third third"',
  );
  expect(await grid.evaluate((element) => getComputedStyle(element).gap)).toBe("16px");

  const featuredBox = await grid.locator('[data-plate="featured"]').boundingBox();
  const thirdBox = await grid.locator('[data-plate="third"]').boundingBox();
  expect(featuredBox).not.toBeNull();
  expect(thirdBox).not.toBeNull();
  expect(featuredBox!.width).toBeGreaterThan(thirdBox!.width * 1.5);
});

test("reviews bento keeps review text inside every tile on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/it/", { waitUntil: "domcontentloaded" });
  const section = page.locator("#recensioni-home");
  await section.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.fonts.status === "loaded");

  const overflows = await section.locator(".reviews-archive__card").evaluateAll((cards) =>
    cards
      .map((card) => ({
        text: card.textContent?.trim().slice(0, 32) ?? "",
        overflowPx: card.scrollHeight - card.clientHeight,
      }))
      .filter((card) => card.overflowPx > 0),
  );
  const horizontalOverflow = await section.evaluate((element) => element.scrollWidth - element.clientWidth);

  expect(overflows).toEqual([]);
  expect(horizontalOverflow).toBeLessThanOrEqual(0);
});

test("home FAQ is a centered list of six expandable questions", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/it/", { waitUntil: "domcontentloaded" });

  const section = page.locator(".home-faq");
  const items = section.locator(".home-faq__item");
  await expect(items).toHaveCount(6);
  await expect(section.locator(".home-faq__card, .home-faq__num, .home-faq__more")).toHaveCount(0);

  const sectionBox = await section.boundingBox();
  expect(sectionBox).not.toBeNull();
  const sectionCenter = sectionBox!.x + sectionBox!.width / 2;
  for (const selector of [".home-faq__title", ".home-faq__intro", ".home-faq__list"]) {
    const box = await section.locator(selector).boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.x + box!.width / 2 - sectionCenter)).toBeLessThan(2);
  }

  const first = items.first();
  await expect(first).not.toHaveAttribute("open", "");
  await first.locator("summary").click();
  await expect(first).toHaveAttribute("open", "");
});

test("Stefano section links to the curriculum PDF in every locale", async ({ page }) => {
  const labels = {
    it: "Leggi il curriculum (PDF)",
    es: "Ver el currículum (PDF)",
    en: "View CV (PDF)",
    de: "Lebenslauf ansehen (PDF)",
  } as const;
  const pdfUrl =
    "https://b24dc2d0-f24b-4d97-b733-550f7c321876.usrfiles.com/ugd/600582_87e7a91d884146588e5c7172eae587be.pdf";

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    for (const [locale, label] of Object.entries(labels)) {
      await page.goto(`/${locale}/`, { waitUntil: "domcontentloaded" });
      const section = page.locator("#chi-e-stefano");
      await section.scrollIntoViewIfNeeded();
      const link = section.getByRole("link", { name: label });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", pdfUrl);
      expect(await section.evaluate((element) => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(0);
    }
  }
});

test("stats values and labels never overflow in any locale", async ({ page }) => {
  test.setTimeout(120000);

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);

    for (const locale of ["it", "es", "en", "de"]) {
      await page.goto(`/${locale}/`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => document.fonts.status === "loaded");

      const overflows = await page
        .locator("#numeri .stat")
        .evaluateAll(
          (cells, meta) =>
            cells.flatMap((cell) => {
              const pieces = [cell.querySelector(".stat__value"), cell.querySelector(".stat__label")];
              return pieces
                .filter((piece): piece is HTMLElement => piece instanceof HTMLElement)
                .map((piece) => ({
                  locale: meta.locale,
                  width: meta.width,
                  text: piece.textContent?.trim() ?? "",
                  overflowPx: piece.scrollWidth - piece.clientWidth,
                }))
                .filter((piece) => piece.overflowPx > 0);
            }),
          { locale, width: viewport.width },
        );

      expect(overflows).toEqual([]);
    }
  }
});
