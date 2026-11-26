import { expect, test } from "@playwright/test";

test("le cifre contano entrando in vista e finiscono sul valore finale", async ({ page }) => {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      problems.push(`${message.type()}: ${message.text()}`);
    }
  });

  await page.goto("/");
  const section = page.locator("#numeri");
  await section.scrollIntoViewIfNeeded();

  await page.waitForFunction(
    () => document.querySelector("#numeri .stat__value")?.textContent !== "40+",
    null,
    { timeout: 5000 },
  );
  await expect(section.locator(".stat__value").first()).toHaveText("40+", { timeout: 5000 });
  await expect(section.locator(".stat__value").nth(1)).toHaveText("QEP");
  await expect(section.locator(".stat__value").nth(2)).toHaveText("Dal 2012");
  await expect(section.locator(".stat__value").nth(3)).toHaveText("25");

  const surface = await section.evaluate((el) => {
    const style = getComputedStyle(el);
    return { background: style.backgroundColor, dots: style.backgroundImage };
  });
  expect(surface.background).not.toBe("rgb(255, 255, 255)");
  expect(surface.dots).toContain("radial-gradient");
  expect(problems).toEqual([]);
});

test("con reduced motion le cifre restano ferme", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const section = page.locator("#numeri");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await expect(section.locator(".stat__value")).toHaveText(["40+", "QEP", "Dal 2012", "25"]);
});
