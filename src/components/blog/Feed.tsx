import { useBlogFeed } from "../../hooks/blog/useBlogFeed";
import { categoryPath, formatCount, postMetaLine, postPath } from "../../wix/blog/posts";
import { imgAttrs } from "../../wix/media";
import type { BlogCategory, BlogTag, PostPage } from "../../wix/blog/types";

export default function Feed(props: {
  initialPage?: PostPage;
  initialCategoryId?: string | null;
  initialTagId?: string | null;
  initialCategories?: BlogCategory[];
  initialTags?: BlogTag[];
  emptyMessage?: string;
}) {
  const feed = useBlogFeed(props);
  const { posts, categories, activeCategoryId, hasMore, loadMore, loadingMore, error } = feed;
  const categoriesWithPosts = categories.filter((c) => c.postCount > 0);

  return (
    <div>
      {categoriesWithPosts.length > 1 && (
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          <a
            href="/blog"
            className={`rounded-control border px-4 py-1.5 text-sm no-underline ${
              !activeCategoryId ? "border-foreground bg-foreground text-primary-foreground" : "border-border text-foreground hover:border-accent"
            }`}
          >
            Tutti
          </a>
          {categoriesWithPosts.map((c) => (
            <a
              key={c.id}
              href={categoryPath(c.slug)}
              className={`rounded-control border px-4 py-1.5 text-sm no-underline ${
                activeCategoryId === c.id ? "border-foreground bg-foreground text-primary-foreground" : "border-border text-foreground hover:border-accent"
              }`}
            >
              {c.label}
            </a>
          ))}
        </div>
      )}

      {error && <p className="mt-6 text-center text-sm text-muted-foreground">Non è stato possibile caricare gli articoli. Riprova tra poco.</p>}

      {posts === null && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="aspect-[3/4] animate-pulse bg-secondary" />
          <div className="aspect-[3/4] animate-pulse bg-secondary" />
          <div className="aspect-[3/4] animate-pulse bg-secondary" />
        </div>
      )}

      {posts !== null && posts.length === 0 && !error && (
        <p className="mt-10 text-center text-sm text-muted-foreground">{props.emptyMessage || "Nessun articolo pubblicato ancora."}</p>
      )}

      {posts !== null && posts.length > 0 && (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <a key={p.id} href={postPath(p.slug)} className="group block min-w-0 no-underline">
              <div className="aspect-[3/4] w-full overflow-hidden bg-secondary">
                {p.coverUrl ? (
                  <img
                    {...imgAttrs(p.coverUrl, "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", 4 / 3)}
                    alt={p.coverAlt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>
              <h2 className="font-display mt-4 break-words text-2xl font-medium leading-snug text-foreground transition-colors group-hover:text-accent">
                {p.title}
              </h2>
              {p.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>}
              {postMetaLine(p) && (
                <time dateTime={p.dateISO} className="eyebrow mt-3 block">
                  {postMetaLine(p)}
                </time>
              )}
              {typeof p.viewCount === "number" && p.viewCount > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">{formatCount(p.viewCount)} letture</p>
              )}
            </a>
          ))}
        </div>
      )}

      {hasMore && posts !== null && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-control border border-foreground px-6 py-3 text-sm font-medium text-foreground no-underline transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {loadingMore ? "Carico…" : "Altri articoli"}
          </button>
        </div>
      )}
    </div>
  );
}
