import { useCollectionProjects } from "../../hooks/portfolio/useCollectionProjects";
import { imgAttrs } from "../../wix/media";
import type { CollectionSummary, ProjectSummary } from "../../wix/portfolio/types";

export default function CollectionPage(props: {
  slug: string;
  initialCollection?: CollectionSummary;
  initialProjects?: ProjectSummary[];
}) {
  const { collection, notFound, projects, error } = useCollectionProjects(props.slug, props);

  if (notFound) {
    return <p className="mt-16 text-center text-sm text-muted-foreground">Questa collezione non esiste (più).</p>;
  }

  return (
    <div>
      <header className="mt-12 border-b border-border pb-10 text-center">
        {collection ? (
          <>
            <h1 className="font-display text-4xl font-medium sm:text-5xl">{collection.title}</h1>
            {collection.description && (
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{collection.description}</p>
            )}
          </>
        ) : (
          <div className="mx-auto h-10 w-64 animate-pulse bg-secondary" />
        )}
      </header>

      {error && <p className="mt-10 text-center text-sm text-muted-foreground">Non è stato possibile caricare i progetti. Riprova tra poco.</p>}

      {projects === null && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse bg-secondary" />
          <div className="aspect-[4/3] animate-pulse bg-secondary" />
        </div>
      )}

      {projects !== null && projects.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">Nessun progetto ancora pubblicato in questa collezione.</p>
      )}

      {projects !== null && projects.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          {projects.map((p) => (
            <a key={p.id} href={`/projects/${p.slug}`} className="group block min-w-0 no-underline">
              <div className="aspect-[4/3] w-full overflow-hidden bg-secondary">
                {p.imageUrl ? (
                  <img
                    {...imgAttrs(p.imageUrl, "(min-width: 640px) 50vw, 100vw", 4 / 3)}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>
              <h2 className="font-display mt-4 break-words text-2xl font-medium text-foreground transition-colors group-hover:text-accent">
                {p.title}
              </h2>
              {p.description && <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{p.description}</p>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
