import { useEffect } from "react";
import { GalleryLink, GalleryMedia } from "@/features/portfolio/gallery-media";
import type { CollectionSummary, GalleryItem } from "@/features/portfolio/types";

export default function CollectionPage(props: {
  collection: CollectionSummary;
  items: GalleryItem[];
  galleryError?: boolean;
  labels?: Record<string, string>;
}) {
  const label = (key: string, fallback: string) => props.labels?.[key] || fallback;

  useEffect(() => {
    let cancelled = false;
    void import("@/features/home/photo-grid-zoom").then(({ mountPhotoZoom }) => {
      if (!cancelled) mountPhotoZoom({ grid: ".pg-gallery-grid", tile: ".pg-gallery-tile" });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="mx-auto max-w-7xl px-6">
        <header className="border-b border-border pb-10 text-center">
          <h1 className="font-display text-4xl font-medium sm:text-5xl">{props.collection.title}</h1>
          {props.collection.description && (
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{props.collection.description}</p>
          )}
        </header>

        {props.galleryError && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {label("galleryLoadError", "Non è stato possibile caricare alcune immagini. Riprova tra poco.")}
          </p>
        )}

        {props.items.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">{label("noImages", "Nessuna immagine pubblicata ancora in questa collezione.")}</p>
        )}

        {props.items.length > 0 && (
          <div className="pg-gallery-grid mt-10 columns-1 gap-4 sm:columns-2 sm:gap-6 lg:columns-3">
            {props.items.map((item) => {
              const media = (
                <div className="overflow-hidden bg-secondary">
                  <GalleryMedia item={item} className="block h-auto w-full transition-transform duration-700 hover:scale-103" />
                </div>
              );
              return (
                <figure key={item.id} className="mb-4 break-inside-avoid sm:mb-6">
                  {item.kind === "image" && !item.linkUrl ? (
                    <button
                      type="button"
                      className="pg-gallery-tile block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      aria-label={`${item.title || label("openImage", "Fotografia")} — ${label("openImageHint", "Apri a schermo intero")}`}
                      aria-haspopup="dialog"
                    >
                      {media}
                    </button>
                  ) : (
                    <GalleryLink item={item}>{media}</GalleryLink>
                  )}
                </figure>
              );
            })}
          </div>
        )}
      </div>

      <div className="pg-lightbox" role="dialog" aria-modal="true" aria-label={label("lightboxLabel", "Fotografia")} hidden>
        <img className="pg-lightbox__img" alt="" decoding="async" />
        <button type="button" className="pg-lightbox__close" aria-label={label("closeImage", "Chiudi l'immagine a schermo intero")}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </>
  );
}
