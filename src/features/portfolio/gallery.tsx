import { useCollections } from "@/features/portfolio/use-collections";
import { imgAttrs } from "@/shared/media";
import type { CollectionSummary } from "@/features/portfolio/types";

export default function Gallery(props: { initialCollections?: CollectionSummary[] }) {
  const { collections, error } = useCollections(props);

  if (error) {
    return <p className="mt-10 text-center text-sm text-muted-foreground">Non è stato possibile caricare il portfolio. Riprova tra poco.</p>;
  }
  if (collections === null) {
    return (
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="aspect-[3/4] animate-pulse bg-secondary" />
        <div className="aspect-[3/4] animate-pulse bg-secondary" />
      </div>
    );
  }
  if (collections.length === 0) {
    return <p className="mt-10 text-center text-sm text-muted-foreground">Nessuna collezione ancora pubblicata.</p>;
  }

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
      {collections.map((c) => (
        <a key={c.id} href={`/portfolio/${c.slug}`} className="group block min-w-0 no-underline">
          <div className="aspect-[3/4] w-full overflow-hidden bg-secondary">
            {c.imageUrl ? (
              <img
                {...imgAttrs(c.imageUrl, "(min-width: 640px) 50vw, 100vw", 4 / 3)}
                alt={c.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>
          <h2 className="font-display mt-4 break-words text-2xl font-medium text-foreground transition-colors group-hover:text-accent sm:text-3xl">
            {c.title}
          </h2>
          {c.description && <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{c.description}</p>}
        </a>
      ))}
    </div>
  );
}
