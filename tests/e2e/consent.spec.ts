import { expect, test } from "@playwright/test";

const STORAGE_KEY = "sl_consent_v1";

test.describe("cookie consent", () => {
  test("shows the banner and persists rejection", async ({ page }) => {
    await page.goto("/");
    const banner = page.locator("[data-sl-consent]");

    await expect(banner).toBeVisible();
    await banner.locator("[data-consent-reject]").click();
    await expect(banner).toBeHidden();

    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe("rejected");

    await page.reload();
    await expect(banner).toBeHidden();
  });

  test("accepts and reopens preferences from the footer", async ({ page }) => {
    await page.goto("/");
    const banner = page.locator("[data-sl-consent]");

    await banner.locator("[data-consent-accept]").click();
    await expect(banner).toBeHidden();
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe("accepted");

    await page.locator("footer [data-consent-settings]").click();
    await expect(banner).toBeVisible();
    await expect(banner.locator("[data-consent-panel]")).toBeVisible();

    await banner.locator("[data-consent-save]").click();
    await expect(banner).toBeHidden();
  });
});
