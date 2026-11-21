// Migrate the old blog's images (covers + inline, from posts-extracted.json) to this site's
// Media Manager as AVIF. Downloads the ORIGINAL wixstatic media, resizes (max 1800x2400),
// encodes AVIF, uploads via the seed helper (generate-upload-url + PUT), writes
// C:/Users/amoil/AppData/Local/Temp/opencode/media-map.json and appends docs/images-sitemap.txt.
// Re-runs are idempotent per source URI via the existing map.
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import sharp from "sharp";
import { makeCtx } from "../.agents/skills/wix-headless-kit/templates/blog/seed/seed-blog.mjs";
import { uploadImage } from "../.agents/skills/wix-headless-kit/templates/shared/seed/images.mjs";

const TMP = "C:/Users/amoil/AppData/Local/Temp/opencode";
const MAP_PATH = path.join(TMP, "media-map.json");
const SITEMAP = "C:/Users/amoil/Desktop/stefanolunardi-photographer/docs/images-sitemap.txt";

const posts = JSON.parse(fs.readFileSync(path.join(TMP, "posts-extracted.json"), "utf8"));

// Unique originals: inline images + covers (strip the /v1/... transform segment).
const origOf = (url) => {
  const m = url.match(/^(https:\/\/static\.wixstatic\.com\/media\/[^/]+)/);
  return m ? m[1] : url;
};
const sources = new Map(); // orig url -> {uri, ext, width, height}
const addSource = (url, width, height) => {
  const orig = origOf(url);
  if (!orig) return;
  if (!sources.has(orig)) {
    const ext = orig.toLowerCase().endsWith(".png") ? "png" : "jpg";
    sources.set(orig, { url: orig, ext, width, height });
  }
};
for (const p of posts) {
  for (const b of p.blocks) if (b.type === "image") addSource(b.src, b.width, b.height);
  if (p.coverUrl) addSource(p.coverUrl, p.coverWidth, p.coverHeight);
}

const map = fs.existsSync(MAP_PATH) ? JSON.parse(fs.readFileSync(MAP_PATH, "utf8")) : {};
let uploaded = 0, reused = 0, failed = 0;
const workdir = mkdtempSync(path.join(tmpdir(), "blogmedia-"));

const sourcesArr = [...sources.values()];
console.log(`unique sources: ${sourcesArr.length}`);

// process in small waves
const WAVE = 4;
for (let i = 0; i < sourcesArr.length; i += WAVE) {
  const wave = sourcesArr.slice(i, i + WAVE);
  await Promise.all(wave.map(async (s) => {
    if (map[s.url]) { reused++; return; }
    try {
      const res = await fetch(s.url, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`download ${res.status}`);
      const bytes = Buffer.from(await res.arrayBuffer());
      const quality = s.ext === "png" ? 80 : 62;
      const avif = await sharp(bytes)
        .resize(1800, 2400, { fit: "inside", withoutEnlargement: true })
        .avif({ quality })
        .toBuffer();
      const file = path.join(workdir, `img-${createHash("sha1").update(s.url).digest("hex").slice(0, 10)}.avif`);
      fs.writeFileSync(file, avif);
      const displayName = `blog-${createHash("sha1").update(s.url).digest("hex").slice(0, 8)}.avif`;
      const ctx = makeCtx();
      const up = await uploadImage(ctx, file, displayName);
      if (up && up.id) {
        map[s.url] = { id: up.id, url: up.url, bytes: avif.length };
        uploaded++;
      } else throw new Error("no id");
    } catch (e) {
      failed++;
      console.error(`FAIL ${s.url}: ${e.message}`);
    }
  }));
}

fs.writeFileSync(MAP_PATH, JSON.stringify(map, null, 2));
console.log(JSON.stringify({ uploaded, reused, failed, total: Object.keys(map).length }));

// append sitemap
if (uploaded > 0) {
  const lines = [`# ${new Date().toISOString()} — migrated Stefano's old blog images (AVIF)`];
  for (const [src, v] of Object.entries(map)) lines.push(`${src} -> ${v.url}`);
  fs.appendFileSync(SITEMAP, lines.join("\n") + "\n");
}
