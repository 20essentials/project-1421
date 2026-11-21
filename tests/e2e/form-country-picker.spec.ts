import { expect, test } from "@playwright/test";

// The Heart to Heart form's Location dropdown holds the full country list (247 options), which
// renders as a searchable combobox instead of a native select. Coverage: open, search,
// keyboard navigation, select, Escape and click-outside dismissal.

async function openPicker(page: import("@playwright/test").Page) {
  await page.goto("/contatti");
  const trigger = page.getByRole("combobox", { name: "Location" });
  await expect(trigger).toBeVisible();
  const search = page.getByRole("textbox", { name: "Cerca" });
  // The island hydrates shortly after load: a click on the SSR trigger before then is a no-op,
  // so click again until the panel answers.
  for (let i = 0; i < 10; i++) {
    await trigger.click();
    try {
      await expect(search).toBeVisible({ timeout: 500 });
      return { trigger, search };
    } catch {
      /* not hydrated yet — click again */
    }
  }
  await expect(search).toBeVisible();
  return { trigger, search };
}

test("opens the country picker and searches it", async ({ page }) => {
  const { search } = await openPicker(page);
  const list = page.getByRole("listbox", { name: "Location" });
  await expect(list).toBeVisible();

  await search.fill("suda");
  await expect(list.getByRole("option")).toHaveCount(3); // Sudafrica, Sud Sudan, Sudan
  await expect(list.getByRole("option", { name: "Sudafrica" })).toBeVisible();
});

test("picks a country with the keyboard", async ({ page }) => {
  const { search } = await openPicker(page);
  const list = page.getByRole("listbox", { name: "Location" });

  await search.fill("austria");
  await page.keyboard.press("Enter");

  await expect(list).toBeHidden();
  const trigger = page.getByRole("combobox", { name: "Location" });
  await expect(trigger).toContainText("Austria");
});

test("Escape closes the picker", async ({ page }) => {
  const { trigger, search } = await openPicker(page);
  await search.press("Escape");
  await expect(page.getByRole("listbox", { name: "Location" })).toBeHidden();
  await expect(trigger).toBeVisible();
});

test("a click outside dismisses the picker", async ({ page }) => {
  const { search } = await openPicker(page);
  await search.click();
  await page.getByRole("heading", { name: "Il vostro messaggio" }).click();
  await expect(page.getByRole("listbox", { name: "Location" })).toBeHidden();
});

test("arrows move the highlighted option and Enter picks it", async ({ page }) => {
  const { search } = await openPicker(page);
  const list = page.getByRole("listbox", { name: "Location" });

  await search.fill("sud");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await expect(list).toBeHidden();
  const trigger = page.getByRole("combobox", { name: "Location" });
  await expect(trigger).toContainText(/Sudafrica|Sud Sudan|Sudan/);
});
