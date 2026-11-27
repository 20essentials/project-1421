// The site's own sitemap with REAL URLs, served at /sitemap-full.xml.
//
// Why not /sitemap.xml: Wix hosting intercepts that path (and /robots.txt, /llms.txt) BEFORE the
// Astro worker and serves its auto-generated file, whose generator only knows the site's page
// registry — every Astro dynamic route leaks into it as its literal pattern (/blog/[...slug]),
// and item pages of custom dynamic routes (portfolio collections, projects, blog
// categories/tags) are missing entirely. This endpoint serves the entries the Wix one cannot
// at a path Wix does not reserve; robots.txt (dashboard SEO Tools, or the TXT-file-server API)
// carries the `Sitemap:` line pointing here. Data comes from the same fetchers the pages use,
// so a new post or project is in the sitemap the moment it is published. (See
// docs/wix-platform-issues.md — "Wix hosting owns the SEO root files".)
//
// Canonical URLs only (no /{locale}/ prefixes): the same choice Wix's own sitemap makes —
// per-locale hreflang alternates are already emitted in-page by the layout.
import { fetchPosts, postPath, categoryPath, tagPath } from "@/features/blog/posts";
import { fetchBlogCategories, fetchBlogTags } from "@/features/blog/taxonomy";
import { fetchCollections, fetchProjects } from "@/features/portfolio/portfolio";

/** Every static route the site serves — the nav surfaces plus the legal set and contact. */
const STATIC_PATHS = [
  "/",
  "/portfolio",
  "/il-mio-metodo",
  "/chi-sono",
  "/location",
  "/investimento",
  "/awards",
  "/fine-art",
  "/blog",
  "/recensioni",
  "/faq",
  "/contatti",
  "/impressum",
  "/legal",
  "/legal/termini-e-condizioni",
  "/legal/privacy",
  "/legal/accessibilita",
  "/legal/cookie-policy",
  "/legal/carta-accordo-privacy",
  "/legal/manifesto-soberania-digitale",
  "/legal/termini-di-utilizzo",
  "/legal/accordo-utente",
  "/legal/resi-e-rimborsi",
  "/legal/protezione-dati",
  "/legal/avviso-legale",
];

const escapeXml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c] as string);

interface Entry {
  loc: string;
  lastmod?: string;
}

const xmlEntry = ({ loc, lastmod }: Entry): string =>
  `<url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : ""}</url>`;

export async function GET({ request }: { request: Request }): Promise<Response> {
  const forwardedUrl = request.headers.get("x-wix-forwarded-url");
  const origin =
    (import.meta.env.PUBLIC_SITE_URL || "").replace(/\/$/, "") ||
    (forwardedUrl && URL.canParse(forwardedUrl) ? new URL(forwardedUrl).origin : new URL(request.url).origin);

  // Every section fails open: a slow or failing app must not take the whole sitemap down —
  // a sitemap missing one section is recoverable, a 500 means nothing gets crawled from it.
  const [postsRes, categoriesRes, tagsRes, collectionsRes, projectsRes] = await Promise.allSettled([
    fetchPosts({ limit: 100, headers: request.headers }),
    fetchBlogCategories(),
    fetchBlogTags(),
    fetchCollections({ headers: request.headers }),
    fetchProjects({ limit: 100, headers: request.headers }),
  ]);

  const entries: Entry[] = STATIC_PATHS.map((path) => ({ loc: new URL(path, origin).href }));

  if (postsRes.status === "fulfilled") {
    const page = postsRes.value;
    for (const post of page.posts) {
      entries.push({ loc: new URL(postPath(post.slug), origin).href, lastmod: post.dateISO || undefined });
    }
  }
  if (categoriesRes.status === "fulfilled") {
    for (const c of categoriesRes.value) entries.push({ loc: new URL(categoryPath(c.slug), origin).href });
  }
  if (tagsRes.status === "fulfilled") {
    for (const t of tagsRes.value) if (t.postCount > 0) entries.push({ loc: new URL(tagPath(t.slug), origin).href });
  }
  if (collectionsRes.status === "fulfilled") {
    for (const c of collectionsRes.value) entries.push({ loc: new URL(`/portfolio/${c.slug}`, origin).href });
  }
  if (projectsRes.status === "fulfilled") {
    for (const p of projectsRes.value) entries.push({ loc: new URL(`/projects/${p.slug}`, origin).href });
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(xmlEntry).join("")}</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
