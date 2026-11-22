import { expect, test } from "@playwright/test";

test.describe("CMS Single Item pages", () => {
  test("home renders the seeded section content", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(500);

    await expect(
      page.getByRole("heading", { level: 1, name: "Matrimoni come opere d'arte, non come catene di montaggio" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Un volto, una voce, un metodo" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dietro l'obiettivo" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Guarda tutto il portfolio" }),
    ).toHaveAttribute("href", "/portfolio");
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
      "/investimento",
    );
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
});
