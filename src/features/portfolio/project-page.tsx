import { useProjectDetail } from "@/features/portfolio/use-project-detail";
import { GalleryLink, GalleryMedia } from "@/features/portfolio/gallery-media";
import { imgAttrs } from "@/shared/media";
import type { GalleryItem, ProjectDetail } from "@/features/portfolio/types";

export default function ProjectPage(props: {
  slug: string;
  initialProject?: ProjectDetail;
  initialItems?: GalleryItem[];
}) {
  const { project, notFound, items, error } = useProjectDetail(props.slug, props);

  if (notFound) {
    return <p className="text-center text-sm text-muted-foreground">Questo progetto non esiste (più).</p>;
  }
  if (!project) {
    return <div className="h-10 w-72 animate-pulse bg-secondary" />;
  }

  return (
    <article>
      <header className="mx-auto max-w-3xl px-6 text-center">
        <h1 className="font-display text-4xl font-medium sm:text-5xl">{project.title}</h1>
        {project.description && <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{project.description}</p>}
        {project.details.length > 0 && (
          <dl className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
            {project.details.map((d) => (
              <div className="flex gap-2">
                <dt className="eyebrow">{d.label}</dt>
                <dd>
                  {d.url ? (
                    <a href={d.url} target={d.target ?? undefined} className="text-accent underline underline-offset-4">
                      {d.text}
                    </a>
                  ) : (
                    d.text
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      {error && <p className="mt-10 text-center text-sm text-muted-foreground">Non è stato possibile caricare la galleria. Riprova tra poco.</p>}

      {items === null && <div className="mt-10 aspect-[3/2] w-full animate-pulse bg-secondary" />}

      {items !== null && items.length === 0 && project.imageUrl && (
        <div className="mt-10 w-full overflow-hidden bg-secondary">
          <img {...imgAttrs(project.imageUrl, "100vw", 3 / 2)} alt={project.title} className="h-auto w-full object-cover" />
        </div>
      )}

      {items !== null && items.length === 0 && !project.imageUrl && (
        <p className="mt-10 text-center text-sm text-muted-foreground">Nessuna immagine pubblicata ancora in questo progetto.</p>
      )}

      {items !== null && items.length > 0 && (
        <div className="mt-10 flex flex-col gap-4 sm:gap-6">
          {items.map((i) => (
            <figure className="m-0 flex w-full justify-center bg-secondary">
              <GalleryLink item={i}>
                <GalleryMedia item={i} className="max-h-[70vh] w-auto max-w-full object-contain" />
              </GalleryLink>
            </figure>
          ))}
        </div>
      )}
    </article>
  );
}
