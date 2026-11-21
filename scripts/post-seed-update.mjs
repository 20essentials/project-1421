// Post-seed pass on the migrated posts:
//  1. PATCH bulk update (UPDATE_PUBLISH): original seoSlug, excerpt, language "it",
//     firstPublishedDate = the old post's publish date.
//  2. Delete the 3 demo posts (revert to draft, then bulk delete to trash).
// Endpoint shapes per the Find-and-Update recipe (verified bodies sent as shown).
import { readFileSync } from "node:fs";
import path from "node:path";
import { makeCtx } from "../.agents/skills/wix-headless-kit/templates/blog/seed/seed-blog.mjs";

const TMP = "C:/Users/amoil/AppData/Local/Temp/opencode";
const API = "https://www.wixapis.com";

const ctx = makeCtx();
const req = async (p, { method = "POST", body } = {}) => {
  const res = await fetch(API + p, {
    method,
    headers: { Authorization: `Bearer ${ctx.token}`, "wix-site-id": ctx.siteId, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} ${p} -> ${res.status}: ${JSON.stringify(json).slice(0, 400)}`);
  return json;
};

// created post id (index) -> plan post
const CREATED = [
  ["a825707f-5ae3-4886-b198-2a520341e242", 0],
  ["731b6337-a874-4e2c-8ffa-18845f11b7ef", 1],
  ["50d795e2-feca-49a8-819e-51f28afca1bd", 2],
  ["ae86c2c3-a2bf-4782-b423-cf4b4ebfb6ec", 3],
  ["a663f313-cc75-462a-9751-4fbff13a2803", 4],
];
const plan = JSON.parse(readFileSync(path.join(TMP, "plan.json"), "utf8"));

// 1) author memberId from the first migrated draft
const draft0 = await req(`/blog/v3/draft-posts/${CREATED[0][0]}`, { method: "GET" });
const memberId = draft0.draftPost?.memberId;
if (!memberId) throw new Error(`no memberId on draft: ${JSON.stringify(draft0).slice(0, 300)}`);

// bulk update: slug + excerpt + language + original publish date
const items = CREATED.map(([id, i]) => {
  const p = plan.posts[i];
  return {
    draftPost: {
      id,
      memberId,
      seoSlug: p._oldSlug,
      excerpt: p._excerpt,
      language: p._language,
      firstPublishedDate: p._dateISO,
    },
  };
});
let updateResult;
try {
  updateResult = await req("/blog/v3/draft-posts/update", { method: "PATCH", body: { draftPosts: items, action: "UPDATE_PUBLISH" } });
} catch (e) {
  // retry once without firstPublishedDate (in case the API enforces it read-only)
  console.error("bulk update failed, retrying without firstPublishedDate:", e.message);
  updateResult = await req("/blog/v3/draft-posts/update", {
    method: "PATCH",
    body: {
      draftPosts: items.map((it) => {
        const { firstPublishedDate, ...rest } = it.draftPost;
        return { draftPost: rest };
      }),
      action: "UPDATE_PUBLISH",
    },
  });
}
const upd = updateResult.results?.map((r) => ({
  id: r.itemMetadata?.id,
  success: !!r.itemMetadata?.success,
  error: r.itemMetadata?.error?.message ?? null,
})) ?? [];
console.log("update:", JSON.stringify(upd, null, 2));

// 2) delete the 3 demo posts
const DEMO_TITLES = [
  "Il grande inganno della fotografia natural style",
  "Dietro l'obiettivo: i 3 pilastri del Metodo Lunardi",
  "La scelta che cambia tutto: le 8 domande da porre al tuo fotografo",
];
const q = await req("/blog/v3/posts/query", {
  body: { query: { filter: { title: { $in: DEMO_TITLES } }, paging: { limit: 100 } } },
});
const demoPosts = (q.posts ?? []).filter((p) => DEMO_TITLES.includes(p.title));
console.log("demo posts found:", demoPosts.map((p) => `${p.title} (${p.id})`).join(" | ") || "none");

if (demoPosts.length) {
  const rev = await req("/blog/v3/draft-posts/update", {
    method: "PATCH",
    body: {
      draftPosts: demoPosts.map((p) => ({ draftPost: { id: p.id } })),
      action: "UPDATE_REVERT_TO_DRAFT",
    },
  });
  const reverted = (rev.results ?? []).filter((r) => r.itemMetadata?.success).map((r) => r.itemMetadata.id);
  console.log("reverted to draft:", reverted.length);
  if (reverted.length) {
    await req("/blog/v3/bulk/draft-posts", { method: "DELETE", body: { postIds: reverted } });
    const trash = await req("/blog/v3/draft-posts/trash-bin", { method: "GET" });
    const inTrash = (trash.draftPosts ?? []).map((d) => d.id);
    console.log("in trash:", inTrash.length, "of", reverted.length);
  }
}

// verify live: the 5 migrated posts keep their data
const vq = await req("/blog/v3/posts/query", { body: { query: { paging: { limit: 50 } } } });
console.log("live posts now:", (vq.posts ?? []).map((p) => `${p.slug} | ${p.firstPublishedDate}`).join("\n"));
