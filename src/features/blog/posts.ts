// Post reads (Wix Blog V3) over the SDK — the only file that touches raw post entities on this
// transport. Everything it returns is a plain DTO from ./types. The rules and mappers live in
// ./posts-core (shared with the REST twin in templates/blog/rest/); this file is the transport
// only. Copy as-is; extend by adding functions, not by editing these. Blog posts are NOT CMS
// collections — always @wix/blog, never @wix/data.
// docs: https://dev.wix.com/docs/api-reference/business-solutions/blog/posts-stats/query-posts.md
// docs: https://dev.wix.com/docs/api-reference/business-solutions/blog/posts-stats/get-post-by-slug.md
// docs: https://dev.wix.com/docs/api-reference/business-solutions/blog/posts-stats/get-post-metrics.md
import { posts as postsModule } from "@wix/blog";
import { wixModule } from "@/shared/sdk";
import { imgSrc } from "@/shared/media";
import { fetchAuthorsByIds } from "@/features/blog/authors";
import { fetchPublishedContentBatch } from "@/features/i18n/published-content";
import { currentLocale } from "@/features/i18n/current-locale";
import type { HeaderLike } from "@/features/i18n/locale-from-request";
import type { Locale } from "@/features/i18n/locale";
import {
  BLOG_APP_ID,
  CARD_FIELDSETS,
  DETAIL_FIELDSETS,
  RELATED_LIMIT,
  categoryPath,
  formatCount,
  isNotFound,
  pickCurated,
  postMetaLine,
  postPath,
  relativeDateLabel,
  tagPath,
  toDetail,
  toMetrics,
  toSummary,
  withAuthors,
  type FetchPostsOptions,
  type Raw,
} from "@/features/blog/posts-core";
import type { PostDetail, PostMetrics, PostPage, PostSummary } from "@/features/blog/types";

export { BLOG_APP_ID, categoryPath, formatCount, postMetaLine, postPath, relativeDateLabel, tagPath, type FetchPostsOptions };

const posts = wixModule(postsModule);

// Cards carry METRICS (view/like/comment counts); the fieldsets option rides outside the query.
const cardQuery = () => posts.queryPosts({ fieldsets: [...CARD_FIELDSETS] as any });

/**
 * Published post-title translations in the current locale, keyed by post id (one batched read;
 * empty map for the primary locale). `title` is the only field the blog's translation schema
 * exposes, so bodies stay in the site's primary language.
 */
async function titleTranslations(headers?: HeaderLike): Promise<Map<string, Record<string, unknown>>> {
  return fetchPublishedContentBatch({
    entityType: "wix.blog.v4.DraftPost",
    appId: BLOG_APP_ID,
    scope: "GLOBAL",
    headers,
  });
}

const withTitle = async <T extends { id: string }>(dto: T, map: Map<string, Record<string, unknown>>): Promise<T> => {
  const t = map.get(dto.id);
  const title = t?.title;
  return typeof title === "string" && title ? { ...dto, title } : dto;
};

/**
 * One version of each translation group, in the visitor's language. Posts sharing a
 * translationId are the same story in different languages: prefer the version whose language
 * matches the current locale — the newest one when duplicates claim the same language (a legacy
 * original that never carried "it") — else fall back to the group's first-published member, the
 * Italian original.
 */
function pickLocalePost<T extends { id: string; language?: string; translationId?: string }>(posts: T[], locale: string): T[] {
  type Group = { key: string; items: T[] };
  const groups: Group[] = [];
  const byKey = new Map<string, Group>();
  for (const p of posts) {
    const key = p.translationId || `solo-${p.id}`;
    let g = byKey.get(key);
    if (!g) {
      g = { key, items: [] };
      byKey.set(key, g);
      groups.push(g);
    }
    g.items.push(p);
  }
  const published = (p: T) => new Date((p as unknown as { dateISO?: string }).dateISO || 0).getTime();
  return groups
    .map((g) => {
      const exact = g.items.filter((p) => p.language === locale);
      if (exact.length) return exact.sort((a, b) => published(b) - published(a))[0];
      return [...g.items].sort((a, b) => published(a) - published(b))[0];
    })
    .sort((a, b) => posts.indexOf(a) - posts.indexOf(b));
}

// The authors of one page in one batched read, joined onto the DTOs; a failed read leaves "" (no byline).
async function withPageAuthors<T extends PostSummary>(items: T[]): Promise<T[]> {
  return withAuthors(items, await fetchAuthorsByIds(items.map((p) => p.authorId)));
}

/**
 * The visitor's locale for this request. SSR callers pass the page's own `locale` (resolved from
 * the full page URL — a cookie-only resolution would serve the previous language on first visit);
 * the client-side store omits it and `currentLocale` falls back to the wixLanguage cookie, which
 * the browser already holds on pagination.
 */
function requestLocale(headers: HeaderLike | undefined, locale?: Locale): Locale {
  return locale ?? currentLocale("/", headers);
}

/**
 * One page of published posts: pinned first, then newest first. Only published posts come back
 * to a visitor token — a "missing" post usually wasn't published, not a query bug. The builder
 * below spells posts-core's feedQuery: sort + filters on the first page, the cursor alone after.
 */
export async function fetchPosts({ limit = 20, cursor, categoryId, tagId, headers, locale }: FetchPostsOptions & { headers?: HeaderLike; locale?: Locale } = {}): Promise<PostPage> {
  let q = cardQuery().limit(limit);
  if (cursor) {
    // A cursor encodes the original filter+sort — re-sending them alongside it is rejected.
    q = q.skipTo(cursor);
  } else {
    // queryPosts with an explicit sort does not pin on its own — the pinned key comes first.
    q = q.descending("pinned").descending("firstPublishedDate");
    if (categoryId) q = q.hasSome("categoryIds", [categoryId]);
    if (tagId) q = q.hasSome("tagIds", [tagId]);
  }
  const [res, titles] = await Promise.all([q.find(), titleTranslations(headers)]);
  const resolved = requestLocale(headers, locale);
  return {
    posts: await withPageAuthors(
      pickLocalePost(
        await Promise.all((res.items ?? []).map(async (p: Raw) => withTitle(toSummary(p, imgSrc), titles))),
        resolved,
      ),
    ),
    nextCursor: res.hasNext() ? (res.cursors?.next ?? null) : null,
  };
}

/**
 * One post by its URL slug with the full body and SEO/comments fields (RICH_CONTENT, CONTENT_TEXT,
 * SEO, REFERENCE_ID, INTERNAL_ID — without them those fields come back undefined; INTERNAL_ID is the
 * one that actually carries referenceId). Null when the slug resolves
 * to nothing (404 / NOT_FOUND is an expected miss); any other failure throws. The dedicated
 * by-slug read, not a slug query: slugs are per translation, so a slug-only query is ambiguous on
 * a multilingual site.
 */
export async function fetchPostBySlug(slug: string, headers?: HeaderLike, locale?: Locale): Promise<PostDetail | null> {
  // Fast path: the dedicated by-slug read. Translated copies of one post can SHARE a slug (the
  // dashboard derives it once and blocks slug edits via API), and then the read 404s — fall back
  // to a slug query and pick the visitor's language from the translation group.
  let raw: Raw | undefined;
  try {
    raw = (await posts.getPostBySlug(slug, { fieldsets: [...DETAIL_FIELDSETS] as any })).post as Raw | undefined;
  } catch (e) {
    if (!isNotFound(e)) throw e;
  }
  if (!raw) {
    const [res, titles] = await Promise.all([
      posts.queryPosts({ fieldsets: [...DETAIL_FIELDSETS] as any }).eq("slug", slug).limit(20).find(),
      titleTranslations(headers),
    ]);
    const candidates = await Promise.all(
      (res.items ?? []).map(async (p: Raw) => withTitle(toDetail(p, imgSrc), titles)),
    );
    const picked = pickLocalePost(candidates, requestLocale(headers, locale))[0];
    if (!picked) return null;
    const [detail] = await withPageAuthors([picked]);
    return detail;
  }
  const titles = await titleTranslations(headers);
  const [detail] = await withPageAuthors([await withTitle(toDetail(raw, imgSrc), titles)]);
  return detail;
}

/** Posts by id, as cards (order is the API's — callers restore their own). Non-fatal: [] on failure. */
export async function fetchPostsByIds(ids: string[], headers?: HeaderLike, locale?: Locale): Promise<PostSummary[]> {
  if (!ids.length) return [];
  try {
    const [res, titles] = await Promise.all([
      cardQuery().in("_id", ids).limit(ids.length).find(),
      titleTranslations(headers),
    ]);
    return withPageAuthors(
      pickLocalePost(
        await Promise.all((res.items ?? []).map(async (p: Raw) => withTitle(toSummary(p, imgSrc), titles))),
        requestLocale(headers, locale),
      ),
    );
  } catch {
    return [];
  }
}

/**
 * The post page's related strip: the writer's curated `relatedPostIds` (their order, the current
 * post dropped) when at least one still resolves; else the newest posts sharing a category with this
 * one (site-wide recents when it has none). Strictly either/or — never topped up. Non-fatal: [].
 */
export async function fetchRelatedPosts(
  post: Pick<PostDetail, "id" | "categoryIds" | "relatedPostIds">,
  limit = RELATED_LIMIT,
  headers?: HeaderLike,
  locale?: Locale,
): Promise<PostSummary[]> {
  try {
    const titles = await titleTranslations(headers);
    if (post.relatedPostIds.length) {
      const curated = pickCurated(post.relatedPostIds, await fetchPostsByIds(post.relatedPostIds, headers, locale), post.id, limit);
      if (curated.length) return curated;
    }
    let q = cardQuery().ne("_id", post.id).descending("firstPublishedDate").limit(limit);
    if (post.categoryIds.length) q = q.hasSome("categoryIds", post.categoryIds);
    const res = await q.find();
    return withPageAuthors(
      pickLocalePost(
        await Promise.all((res.items ?? []).map(async (p: Raw) => withTitle(toSummary(p, imgSrc), titles))),
        requestLocale(headers, locale),
      ),
    );
  } catch {
    return [];
  }
}

/**
 * The post's fresh counters — the API's designated source (the `metrics` field on a post is
 * deprecated as potentially inconsistent). Null on failure: keep the count you had.
 */
export async function fetchPostMetrics(postId: string): Promise<PostMetrics | null> {
  try {
    return toMetrics((await posts.getPostMetrics(postId)).metrics as Raw | undefined);
  } catch {
    return null;
  }
}
