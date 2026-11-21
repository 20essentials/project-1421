// Build plan.json for seed-blog.mjs from posts-extracted.json + media-map.json.
// Ricos per the authoring recipe: TEXT inside PARAGRAPH; BOLD/LINK decorations on TEXT runs;
// IMAGE nodes reference this site's Media Manager ids; original spacer rhythm preserved
// (trimmed at the edges, capped at 3, one guaranteed between distinct blocks).
import fs from "node:fs";
import path from "node:path";

const TMP = "C:/Users/amoil/AppData/Local/Temp/opencode";
const posts = JSON.parse(fs.readFileSync(path.join(TMP, "posts-extracted.json"), "utf8"));
const media = JSON.parse(fs.readFileSync(path.join(TMP, "media-map.json"), "utf8"));

const origOf = (url) => {
  const m = url.match(/^(https:\/\/static\.wixstatic\.com\/media\/[^/]+)/);
  return m ? m[1] : url;
};
const mediaOf = (url) => media[origOf(url)] ?? media[url];
const validLink = (href) => /^https?:\/\/[^\s"]+\.[a-z]{2,}([/?#].*)?$/i.test(href) || /^mailto:[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(href);

let n = 0;
const nid = () => `mig-${n++}`;
const mkText = (r) => {
  const decorations = [];
  if (r.bold) decorations.push({ type: "BOLD", fontWeightValue: 700 });
  if (r.link && validLink(r.link)) decorations.push({ type: "LINK", linkData: { link: { url: r.link, target: "BLANK" } } });
  return { type: "TEXT", id: "", nodes: [], textData: { text: r.text, decorations } };
};
const mkParagraph = (runs) => ({
  type: "PARAGRAPH",
  id: nid(),
  nodes: runs.map(mkText),
  paragraphData: { textStyle: { textAlignment: "AUTO" } },
});
const spacer = () => ({ type: "PARAGRAPH", id: nid(), nodes: [] });

const blocksToNodes = (blocks, postTitle) => {
  const nodes = [];
  for (const b of blocks) {
    switch (b.type) {
      case "spacer":
        nodes.push(spacer());
        break;
      case "paragraph":
        nodes.push(mkParagraph(b.runs));
        break;
      case "heading":
        nodes.push({
          type: "HEADING",
          id: nid(),
          nodes: b.runs.map(mkText),
          headingData: { level: b.level ?? 2, textStyle: { textAlignment: "AUTO" } },
        });
        break;
      case "quote":
        nodes.push({
          type: "BLOCKQUOTE",
          id: nid(),
          nodes: [mkParagraph(b.runs)],
          blockquoteData: { indentation: 1 },
        });
        break;
      case "bulleted":
      case "ordered": {
        const listType = b.type === "bulleted" ? "BULLETED_LIST" : "ORDERED_LIST";
        nodes.push({
          type: listType,
          id: nid(),
          nodes: b.items.map((runs) => ({ type: "LIST_ITEM", id: nid(), nodes: [mkParagraph(runs)] })),
          ...(b.type === "bulleted" ? { bulletedListData: { indentation: 0 } } : { orderedListData: { indentation: 0 } }),
        });
        break;
      }
      case "image": {
        const m = mediaOf(b.src);
        if (!m) break;
        nodes.push({
          type: "IMAGE",
          id: nid(),
          nodes: [],
          imageData: {
            containerData: { width: { size: "CONTENT" }, alignment: "CENTER" },
            image: { src: { id: m.id }, width: b.width ?? 1200, height: b.height ?? 800 },
            altText: b.alt || postTitle,
          },
        });
        break;
      }
    }
  }
  // spacing normalization: trim edges, cap runs of spacers at 3, guarantee separation
  const isSp = (nd) => nd.type === "PARAGRAPH" && nd.nodes.length === 0;
  let start = 0;
  while (start < nodes.length && isSp(nodes[start])) start++;
  let end = nodes.length;
  while (end > start && isSp(nodes[end - 1])) end--;
  const out = [];
  let spRun = 0;
  let prevContent = false;
  for (const nd of nodes.slice(start, end)) {
    if (isSp(nd)) {
      spRun++;
      if (spRun <= 3) out.push(nd);
    } else {
      if (prevContent && spRun === 0) out.push(spacer());
      spRun = 0;
      prevContent = true;
      out.push(nd);
    }
  }
  return out;
};

const CATEGORY = {
  "le-fotografie-importanti": "Consigli",
  "il-bianco-nero-fine-art-nella-fotografia-di-matrimonio": "Metodo & Filosofia",
  "il-paradosso-delle-candidfoto-quando-la-spontaneita-diventa-arte": "Metodo & Filosofia",
  "pre-wedding-o-post-wedding": "Consigli",
  "video-wedding-cinema-style-l-arte-nascosta-dietro-quei-10-minuti-che-ti-fanno-piangere": "Video",
};

const TAGS = {
  "le-fotografie-importanti": ["foto di gruppo", "fotografo di matrimonio"],
  "il-bianco-nero-fine-art-nella-fotografia-di-matrimonio": ["bianco e nero", "fine art"],
  "il-paradosso-delle-candidfoto-quando-la-spontaneita-diventa-arte": ["fotografia candid", "stile editoriale"],
  "pre-wedding-o-post-wedding": ["pre-wedding", "post-wedding"],
  "video-wedding-cinema-style-l-arte-nascosta-dietro-quei-10-minuti-che-ti-fanno-piangere": ["video wedding", "wedding film"],
};

// Real old slug (with the accented char) for the seoSlug pass:
const OLD_SLUG = {
  "il-paradosso-delle-candidfoto-quando-la-spontaneita-diventa-arte": "il-paradosso-delle-candidfoto-quando-la-spontaneità-diventa-arte",
};

const plan = { categories: [], posts: [] };
const missing = [];
for (const p of posts) {
  const nodes = blocksToNodes(p.blocks, p.title);
  const cover = p.coverUrl ? mediaOf(p.coverUrl) : null;
  if (p.coverUrl && !cover) missing.push(`${p.slug} cover`);
  const firstPara = (p.blocks.find((b) => b.type === "paragraph")?.runs ?? []).map((r) => r.text).join(" ").trim();
  const slug = OLD_SLUG[p.slug] ?? p.slug;
  plan.posts.push({
    title: p.title,
    category: CATEGORY[p.slug],
    tags: TAGS[p.slug] ?? [],
    ...(cover ? { coverImageMediaId: cover.id } : {}),
    richContent: { nodes },
    // metadata for the post-seed pass (seed-blog ignores unknown keys):
    _oldSlug: slug,
    _dateISO: p.date,
    _excerpt: firstPara.length > 400 ? firstPara.slice(0, 397).replace(/\s+\S*$/, "") + "…" : firstPara,
    _language: "it",
  });
}
plan.categories = [...new Set(plan.posts.map((p) => p.category))];
if (missing.length) console.error("MISSING MEDIA:", missing.join(", "));
fs.writeFileSync(path.join(TMP, "plan.json"), JSON.stringify(plan, null, 2));
const stat = plan.posts.map((p) => `${p.title.slice(0, 30)}: ${p.richContent.nodes.length} nodes, cover=${p.coverImageMediaId ? "yes" : "NO"}`);
console.error(stat.join("\n"));
console.log("written plan.json");
