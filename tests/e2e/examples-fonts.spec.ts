import { expect, test } from "@playwright/test";

const pairings = [
  { id: "originale", heading: "Jost", body: "Inter" },
  { id: "cormorant-inter", heading: "Cormorant", body: "Inter" },
  { id: "playfair-source", heading: "Playfair", body: "Source Sans" },
  { id: "bodoni-jost", heading: "Bodoni", body: "Jost" },
  { id: "lora-inter", heading: "Lora", body: "Inter" },
  { id: "libre-nunito", heading: "Baskerville", body: "Nunito" },
  { id: "cinzel-raleway", heading: "Cinzel", body: "Raleway" },
  { id: "dm-serif-dm-sans", heading: "DM Serif", body: "DM Sans" },
  { id: "fraunces-inter", heading: "Fraunces", body: "Inter" },
  { id: "fraunces-instrument-sans", heading: "Fraunces", body: "Instrument Sans" },
  { id: "instrument-serif-instrument-sans", heading: "Instrument Serif", body: "Instrument Sans" },
  { id: "gloock-inter", heading: "Gloock", body: "Inter" },
  { id: "young-serif-inter", heading: "Young Serif", body: "Inter" },
  { id: "ovo-mulish", heading: "Ovo", body: "Mulish" },
  { id: "playfair-figtree", heading: "Playfair", body: "Figtree" },
  { id: "bodoni-mulish", heading: "Bodoni", body: "Mulish" },
  { id: "epilogue-inter", heading: "Epilogue", body: "Inter" },
  { id: "space-grotesk-inter", heading: "Space Grotesk", body: "Inter" },
  { id: "syne-dm-sans", heading: "Syne", body: "DM Sans" },
  { id: "bricolage-inter", heading: "Bricolage", body: "Inter" },
];

test.describe("/examples typography specimens", () => {
  test("renders every dot-grid combination with its own font stack", async ({ page }) => {
    const messages: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") {
        messages.push(`${message.type()}: ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => messages.push(`pageerror: ${error.message}`));

    const response = await page.goto("/examples", { waitUntil: "networkidle" });
    expect(response?.status()).toBeLessThan(500);
    await page.evaluate(() => document.fonts.ready);

    const specimens = page.locator("[data-specimen]");
    await expect(specimens).toHaveCount(pairings.length);

    for (const pairing of pairings) {
      const header = page.locator(`[data-specimen="${pairing.id}"] header`);
      await expect(header).toHaveClass(/dot-grid/);
      await expect(header.locator("p").first()).toHaveText(
        "Fotografo di matrimoni | Fine Art | Fotoreporter",
      );
      await expect(header.locator("h2")).toHaveText("Every frame is a painting");

      const headingFont = await header
        .locator("h2")
        .evaluate((element) => getComputedStyle(element).fontFamily);
      const bodyFont = await header
        .locator("p")
        .last()
        .evaluate((element) => getComputedStyle(element).fontFamily);

      expect(headingFont, `${pairing.id} heading`).toContain(pairing.heading);
      expect(bodyFont, `${pairing.id} body`).toContain(pairing.body);
      expect(bodyFont, `${pairing.id} body fallback`).toContain("sans-serif");
    }

    expect(messages, messages.join("\n")).toEqual([]);
  });
});
