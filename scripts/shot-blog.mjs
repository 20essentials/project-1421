// Screenshot + console sweep of the migrated blog pages (dev server must be on :4321).
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:4321";
const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 15);
fs.mkdirSync(".screenshots", { recursive: true });

const shots = [];
const problems = [];

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") problems.push(`${page.url()} [${m.type()}] ${m.text().slice(0, 200)}`);
  });
  page.on("pageerror", (e) => problems.push(`${page.url()} [pageerror] ${String(e).slice(0, 200)}`));

  // 1. blog collection page (desktop)
  await page.goto(`${BASE}/blog`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `.screenshots/blog-feed-${stamp}.png` });
  shots.push(`blog-feed-${stamp}.png`);

  // cards section screenshot
  const grid = page.locator("a[href*='/blog/']").first();
  await grid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `.screenshots/blog-cards-${stamp}.png` });
  shots.push(`blog-cards-${stamp}.png`);

  // 2. post page (desktop)
  await page.goto(`${BASE}/blog/le-fotografie-importanti`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `.screenshots/blog-post-top-${stamp}.png` });
  shots.push(`blog-post-top-${stamp}.png`);
  await page.keyboard.press("End");
  await page.waitForTimeout(800);
  await page.screenshot({ path: `.screenshots/blog-post-bottom-${stamp}.png` });
  shots.push(`blog-post-bottom-${stamp}.png`);

  // 3. category page
  await page.goto(`${BASE}/blog/category/consigli`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `.screenshots/blog-category-${stamp}.png` });
  shots.push(`blog-category-${stamp}.png`);

  // 4. mobile first screen
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  mob.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") problems.push(`mobile ${mob.url()} [${m.type()}] ${m.text().slice(0, 200)}`);
  });
  mob.on("pageerror", (e) => problems.push(`mobile ${mob.url()} [pageerror] ${String(e).slice(0, 200)}`));
  await mob.goto(`${BASE}/blog`, { waitUntil: "networkidle", timeout: 60000 });
  await mob.waitForTimeout(1200);
  await mob.screenshot({ path: `.screenshots/blog-mobile-${stamp}.png` });
  shots.push(`blog-mobile-${stamp}.png`);

  await browser.close();
};

run()
  .then(() => {
    console.log("SHOTS:", shots.join(", "));
    console.log("PROBLEMS:", problems.length ? "\n" + problems.join("\n") : "none");
  })
  .catch((e) => {
    console.error("FAILED:", e.message);
    process.exit(1);
  });
