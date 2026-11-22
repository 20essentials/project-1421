// Poll the og image's Media Manager status until READY, then set the site-wide
// SEO tags (og:image + twitter:card=summary_large_image), preserving the existing tags.
import { makeCtx } from "../.agents/skills/wix-headless-kit/templates/blog/seed/seed-blog.mjs";

const ctx = makeCtx();
const API = "https://www.wixapis.com";
const FILE_ID = "600582_ca35dfe2713c4e36a885a070c2fb7871~mv2.jpg";
const OGBASE = `${API}/promote/seo/v1`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const read = async (path, opts) => {
  const res = await fetch(API + path, {
    headers: { Authorization: `Bearer ${ctx.token}`, "wix-site-id": ctx.siteId, ...(opts?.headers ?? {}) },
    signal: AbortSignal.timeout(30_000),
    ...opts,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${path} -> ${res.status}: ${JSON.stringify(json).slice(0, 400)}`);
  return json;
};

for (let i = 0; i < 10; i++) {
  const r = await read(`/site-media/v1/files/get-file-by-id?fileId=${encodeURIComponent(FILE_ID)}`);
  const f = r.file;
  if (f?.operationStatus === "READY") break;
  if (f?.operationStatus === "FAILED") throw new Error("og image failed processing");
  await sleep(3000);
}
const get = await read("/promote/seo/v1/site-seo-tags");
const existing = get.siteSeoTags.tags ?? [];
const tags = [
  ...existing.filter((t) => !(t.type === "meta" && (t.props?.property === "og:image" || t.props?.name === "twitter:card"))),
  { type: "meta", props: { property: "og:image", content: "https://static.wixstatic.com/media/600582_ca35dfe2713c4e36a885a070c2fb7871~mv2.jpg" } },
  { type: "meta", props: { name: "twitter:card", content: "summary_large_image" } },
];
const res = await fetch(`${OGBASE}/site-seo-tags`, {
  method: "PATCH",
  headers: { Authorization: `Bearer ${ctx.token}`, "wix-site-id": ctx.siteId, "Content-Type": "application/json" },
  body: JSON.stringify({ siteSeoTags: { tags }, fieldMask: "tags" }),
  signal: AbortSignal.timeout(30_000),
});
const body = await res.json().catch(() => ({}));
console.log(JSON.stringify({ status: res.status, body }, null, 2));
