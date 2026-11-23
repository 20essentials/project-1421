import { useCollectionProjects } from "@/features/portfolio/use-collection-projects";
import { DEFAULT_LOCALE, type Locale } from "@/features/i18n/locale";
import { localizedHref } from "@/features/i18n/localized-path";
import { imgFitAttrs } from "@/shared/media";
import type { CollectionSummary, ProjectSummary } from "@/features/portfolio/types";

export default function CollectionPage(props: {
  slug: string;
  initialCollection?: CollectionSummary;
  initialProjects?: ProjectSummary[];
  locale?: Locale;
  labels?: Record<string, string>;
}) {
  const { collection, notFound, projects, error } = useCollectionProjects(props.slug, props);
  const locale = props.locale ?? DEFAULT_LOCALE;
  const label = (key: string, fallback: string) => props.labels?.[key] || fallback;

  if (notFound) {
    return <p className="text-center text-sm text-muted-foreground">{label("collectionNotFound", "Questa collezione non esiste (più).")}</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6">
      <header className="border-b border-border pb-10 text-center">
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

      {error && <p className="mt-10 text-center text-sm text-muted-foreground">{label("projectsLoadError", "Non è stato possibile caricare i progetti. Riprova tra poco.")}</p>}

      {projects === null && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="aspect-4/3 animate-pulse bg-secondary" />
          <div className="aspect-4/3 animate-pulse bg-secondary" />
        </div>
      )}

      {projects !== null && projects.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">{label("noProjects", "Nessun progetto ancora pubblicato in questa collezione.")}</p>
      )}

      {projects !== null && projects.length > 0 && (
        <div className="mt-10 columns-1 gap-6 sm:columns-2 sm:gap-8">
          {projects.map((p) => (
            <a key={p.id} href={localizedHref(locale, `/projects/${p.slug}`)} className="group mb-8 block min-w-0 break-inside-avoid no-underline">
              {p.imageUrl ? (
                <div className="overflow-hidden bg-secondary">
                  <img
                    {...imgFitAttrs(p.imageUrl, "(min-width: 640px) 50vw, 100vw")}
                    alt={p.title}
                    className="block h-auto w-full transition-transform duration-700 group-hover:scale-103"
                  />
                </div>
              ) : (
                <div className="h-48 bg-secondary" />
              )}
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
