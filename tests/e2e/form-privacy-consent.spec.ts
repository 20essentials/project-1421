import { expect, test } from "@playwright/test";

test("il modulo di contatti richiede il consenso privacy", async ({ page }) => {
  await page.goto("/contatti");
  const consent = page.getByRole("checkbox", { name: /Ho letto l'informativa privacy/ });
  await expect(consent).toBeVisible();
  await expect(consent).not.toBeChecked();
  await expect(page.getByRole("link", { name: "informativa privacy" })).toHaveAttribute(
    "href",
    "/it/legal/privacy",
  );

  await page.getByRole("button", { name: "Invia" }).click();
  await expect(page.locator("#err-privacy-consent")).toHaveText(
    "Devi accettare l'informativa privacy per inviare la richiesta.",
  );

  await consent.check();
  await expect(consent).toBeChecked();
  await expect(page.locator("#err-privacy-consent")).toHaveCount(0);
});
