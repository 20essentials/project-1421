// Axe audit over the site's pages — dev server must be running on :4321.
// Run: node scripts/axe-audit.mjs
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const routes = process.argv[2]
  ? process.argv[2].split(",")
  : ["/", "/contatti", "/portfolio", "/blog", "/faq", "/chi-sono", "/recensioni", "/location", "/investimento", "/awards", "/fine-art", "/il-mio-metodo", "/legal", "/impressum"];

const axeSource = readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

let violations = 0;
for (const route of routes) {
  await page.goto(`http://localhost:4321${route}`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);
  await page.evaluate(axeSource);
  const results = await page.evaluate(async () => {
    const axe = window.axe;
    return await axe.run(document, {
      resultTypes: ["violations"],
      rules: { region: { enabled: false } },
    });
  });
  const v = results.violations;
  console.log(`\n=== ${route}: ${v.length} violation kinds ===`);
  for (const item of v) {
    violations += item.nodes.length;
    console.log(`  [${item.id}] ${item.impact} — ${item.help} (${item.nodes.length} nodes)`);
    for (const node of item.nodes.slice(0, 3)) {
      const target = node.target.join(" ") || "(no target)";
      console.log(`    -> ${target}`.slice(0, 220));
    }
  }
}
await browser.close();
console.log(`\nTOTAL violating nodes: ${violations}`);
process.exit(violations > 0 ? 1 : 0);
