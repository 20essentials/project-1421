import { expect, test } from "@playwright/test";

test.describe("CMS Single Item pages", () => {
  test("home renders the seeded section content", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(500);

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "STEFANO LUNARDI",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Un volto, una voce, un metodo" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dietro l'obiettivo" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "IL METODO Fusion" })).toBeVisible();
    await expect(
      page.getByText("L'eleganza della moda, la naturalezza del reportage."),
    ).toBeVisible();
    await expect(page.getByText("Una regia invisibile")).toBeVisible();
    await expect(page.getByText("Il tempo della pellicola")).toBeVisible();
    await expect(page.getByText("Pellicola e digitale, insieme")).toBeVisible();
    await expect(page.getByRole("link", { name: "Leggi tutto il metodo" })).toHaveAttribute(
      "href",
      "/it/il-mio-metodo",
    );
    await expect(page.getByRole("link", { name: "Guarda tutto il portfolio" })).toHaveAttribute(
      "href",
      "/it/portfolio",
    );
  });

  test("home renders the percorso section with its three steps", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(500);

    const section = page.locator("#il-percorso");
    await expect(section).toBeVisible();
    await expect(section.getByText("IL PERCORSO INSIEME")).toBeVisible();
    await expect(
      section.getByRole("heading", {
        level: 2,
        name: "CI VEDIAMO tre volte PRIMA DEL GRANDE GIORNO",
      }),
    ).toBeVisible();
    await expect(section.locator("ol > li")).toHaveCount(3);
    await expect(section.getByRole("heading", { name: "Ci conosciamo:" })).toBeVisible();
    await expect(section.getByRole("heading", { name: "Disegniamo la giornata:" })).toBeVisible();
    await expect(section.getByRole("heading", { name: "Gli ultimi dettagli:" })).toBeVisible();
  });

  test("il mio metodo renders the seeded page content", async ({ page }) => {
    const response = await page.goto("/il-mio-metodo", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(500);

    await expect(
      page.getByRole("heading", { level: 1, name: "Non più fotografie. Opere." }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Cos'è il Metodo Fusion" })).toBeVisible();
    await expect(page.getByText("Totale di dedizione")).toBeVisible();
    await expect(page.getByRole("link", { name: "Guarda l'investimento" })).toHaveAttribute(
      "href",
      "/it/investimento",
    );
  });

  test("legal page aligns its column and renders CMS lists as bullets", async ({ page }) => {
    const response = await page.goto("/legal/termini-e-condizioni", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBeLessThan(500);

    const header = page.locator("main header");
    const body = page.locator("main section.site-content-body");
    const note = page.locator("main section.site-content-body + p");

    const [headerBox, bodyBox, noteBox] = await Promise.all([
      header.boundingBox(),
      body.boundingBox(),
      note.boundingBox(),
    ]);
    expect(headerBox).not.toBeNull();
    expect(bodyBox).not.toBeNull();
    expect(noteBox).not.toBeNull();
    expect(Math.abs(headerBox!.x - bodyBox!.x)).toBeLessThan(1);
    expect(Math.abs(noteBox!.x - bodyBox!.x)).toBeLessThan(1);

    const list = body.locator("ul").first();
    await expect(list).toHaveCSS("list-style-type", "disc");
    await expect(list.locator("li").first()).toBeVisible();
  });

  test("chi sono renders the seeded page content", async ({ page }) => {
    const response = await page.goto("/chi-sono", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(500);

    await expect(
      page.getByRole("heading", { level: 1, name: "La tua storia, la sua visione" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Il fotoreporter che ha trovato l'arte nei matrimoni" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Curriculum" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Singulart", exact: true })).toHaveAttribute(
      "href",
      /singulart\.com/,
    );
  });

  test("home shows the awards wall with twelve seals and its CTA", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(500);

    const wall = page.locator("[data-awards-wall]");
    await expect(wall).toBeVisible();
    await expect(
      wall.getByRole("heading", { level: 2, name: "Oltre 100 premi internazionali" }),
    ).toBeVisible();
    await expect(wall.locator("img")).toHaveCount(12);
    await expect(wall.getByRole("link", { name: "Tutti i premi e le mostre" })).toHaveAttribute(
      "href",
      "/it/awards",
    );
  });
});
