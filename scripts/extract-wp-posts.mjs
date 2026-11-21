// Extract Stefano's old Wix-blog posts (saved SSR pages) into ordered blocks with runs.
// Old-blog SSR body = section[data-hook=post-description] > ... > div[rcv container] with
// children [div(rcv-block-first), div(all blocks), div(rcv-block-last)]; each block div wraps
// one block: figure=image, p=paragraph, h1-6=heading, blockquote=quote, ul/ol=list, span>br=spacer.
import fs from "node:fs";
import path from "node:path";
import { parse } from "parse5";

const DIR = "C:/Users/amoil/AppData/Local/Temp/opencode";

const FILES = [
  ["le-fotografie-importanti", "post-1.html"],
  ["il-bianco-nero-fine-art-nella-fotografia-di-matrimonio", "post-il-bianco-nero-fine-art-nella-fotografia-di-matrimonio.html"],
  ["il-paradosso-delle-candidfoto-quando-la-spontaneita-diventa-arte", "post-candid.html"],
  ["pre-wedding-o-post-wedding", "post-pre-wedding-o-post-wedding.html"],
  ["video-wedding-cinema-style-l-arte-nascosta-dietro-quei-10-minuti-che-ti-fanno-piangere", "post-video-wedding-cinema-style-l-arte-nascosta-dietro-quei-10-minuti-che-ti-fanno-piangere.html"],
];

const attrsOf = (n) => Object.fromEntries((n.attrs ?? []).map((a) => [a.name, a.value]));
const kids = (n) => n.childNodes ?? [];
const isTag = (n, t) => n.nodeName === t;
const findDesc = (n, pred) => {
  for (const c of kids(n)) {
    if (c.nodeName !== "#text" && pred(c)) return c;
    const f = findDesc(c, pred);
    if (f) return f;
  }
  return null;
};
const hasDesc = (n, pred) => !!findDesc(n, pred);

function findDataHook(n, hook) {
  if (n.childNodes && n.nodeName !== "#text" && attrsOf(n)["data-hook"] === hook) return n;
  for (const c of kids(n)) {
    const f = findDataHook(c, hook);
    if (f) return f;
  }
  return null;
}

// Inline walk -> runs {text, bold, link}
function runsOf(node, runs, ctx) {
  for (const c of kids(node)) {
    if (c.nodeName === "#text") {
      const t = c.value.replace(/\s+/g, " ");
      if (t) runs.push({ text: t, bold: ctx.bold, link: ctx.link });
      continue;
    }
    switch (c.nodeName) {
      case "strong":
      case "b":
        runsOf(c, runs, { ...ctx, bold: true });
        break;
      case "a": {
        const href = attrsOf(c).href || "";
        runsOf(c, runs, { ...ctx, link: href && !href.startsWith("#") ? href : ctx.link });
        break;
      }
      case "img":
      case "br":
      case "button":
        break;
      default:
        runsOf(c, runs, ctx);
    }
  }
}

const mergeRuns = (runs) => {
  const out = [];
  for (const r of runs) {
    const prev = out[out.length - 1];
    if (prev && prev.bold === r.bold && prev.link === r.link) prev.text += r.text;
    else out.push({ ...r });
  }
  return out.map((r) => ({ ...r, text: r.text.trim() })).filter((r) => r.text);
};

const imageBlock = (figure) => {
  const wow = findDesc(figure, (n) => isTag(n, "wow-image"));
  const img = findDesc(figure, (n) => isTag(n, "img"));
  const dimsNode = wow ?? img;
  const srcNode = img ?? wow;
  if (!dimsNode || !srcNode) return null;
  const info = attrsOf(dimsNode)["data-image-info"];
  let dims = null;
  if (info) {
    try {
      const j = JSON.parse(info.replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
      if (j.imageData) dims = { width: j.imageData.width, height: j.imageData.height };
    } catch { /* fall through */ }
  }
  const srcAttr = attrsOf(srcNode).src || "";
  const m = srcAttr.match(/https:\/\/static\.wixstatic\.com\/media\/[^?"' ]+/);
  const uri = m ? m[0] : null;
  if (!uri) return null;
  const alt = attrsOf(srcNode).alt || "";
  return { type: "image", src: uri, alt, ...dims };
};

const runsInBlock = (blockDiv) => {
  const runs = [];
  runsOf(blockDiv, runs, { bold: false, link: null });
  return mergeRuns(runs);
};

function blockFrom(childDiv) {
  if (hasDesc(childDiv, (n) => isTag(n, "figure"))) {
    const fig = findDesc(childDiv, (n) => isTag(n, "figure"));
    return imageBlock(fig);
  }
  const heading = findDesc(childDiv, (n) => /^h[1-6]$/.test(n.nodeName));
  if (heading) {
    const runs = runsInBlock(heading);
    if (runs.length) return { type: "heading", runs, level: Number(heading.nodeName[1]) };
  }
  if (hasDesc(childDiv, (n) => isTag(n, "blockquote"))) {
    const bq = findDesc(childDiv, (n) => isTag(n, "blockquote"));
    const runs = runsInBlock(bq);
    if (runs.length) return { type: "quote", runs };
  }
  const list = findDesc(childDiv, (n) => isTag(n, "ul") || isTag(n, "ol"));
  if (list) {
    const items = kids(list).filter((li) => isTag(li, "li")).map((li) => runsInBlock(li)).filter((r) => r.length);
    if (items.length) return { type: list.nodeName === "ul" ? "bulleted" : "ordered", items };
  }
  const p = findDesc(childDiv, (n) => isTag(n, "p"));
  if (p) {
    const runs = runsInBlock(p);
    if (runs.length) return { type: "paragraph", runs };
  }
  // only br/whitespace -> spacer
  const textContent = (function flat(n) {
    return kids(n).map((c) => (c.nodeName === "#text" ? c.value : flat(c))).join("");
  })(childDiv);
  if (!textContent.trim()) return { type: "spacer" };
  const runs = runsInBlock(childDiv);
  if (runs.length) return { type: "paragraph", runs };
  return { type: "spacer" };
}

function extractBlocks(bodySection) {
  const first = findDataHook(bodySection, "rcv-block-first");
  if (!first) return [];
  const container = first.parentNode;
  const middle = container.childNodes.find((n) => n.nodeName === "div" && attrsOf(n)["data-hook"] !== "rcv-block-first" && attrsOf(n)["data-hook"] !== "rcv-block-last");
  const blockDivs = middle ? kids(middle).filter((n) => n.nodeName === "div") : [];
  return blockDivs.map(blockFrom).filter(Boolean);
}

const out = [];
for (const [slug, file] of FILES) {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const dom = parse(raw);
  const ld = raw.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  const meta = ld ? JSON.parse(ld[1]) : null;
  const posting = meta?.["@graph"]?.find((x) => x["@type"] === "BlogPosting") ?? meta;

  const body = findDataHook(dom, "post-description");
  const blocks = extractBlocks(body);

  out.push({
    slug,
    title: posting?.headline,
    date: posting?.datePublished,
    excerpt: (posting?.description ?? "").slice(0, 300),
    coverUrl: posting?.image?.url ?? null,
    coverWidth: posting?.image?.width ?? null,
    coverHeight: posting?.image?.height ?? null,
    blocks,
  });
  const images = blocks.filter((b) => b.type === "image");
  const spacers = blocks.filter((b) => b.type === "spacer");
  console.error(`${slug}: ${blocks.length} blocks, ${images.length} images, ${spacers.length} spacers`);
}

fs.writeFileSync(path.join(DIR, "posts-extracted.json"), JSON.stringify(out, null, 2));
console.log("written posts-extracted.json");
