// Portfolio reads (Wix Portfolio v1) over the SDK — the only file that touches raw portfolio
// entities on this transport. Read-only vertical: no cart, no checkout, no @wix/ecom. Everything
// it returns is a plain DTO from ./types. The rules and mappers live in ./portfolio-core (shared
// with the REST twin in templates/portfolio/rest/); this file is the transport only. Copy as-is;
// extend by adding functions, not by editing these.
// docs: https://dev.wix.com/docs/api-reference/business-solutions/portfolio/collections/list-collections.md
// docs: https://dev.wix.com/docs/api-reference/business-solutions/portfolio/projects/list-projects.md
// docs: https://dev.wix.com/docs/api-reference/business-solutions/portfolio/project-items/list-project-items.md
// docs: https://dev.wix.com/docs/sdk/core-modules/sdk/media.md
import {
  collections as collectionsModule,
  projects as projectsModule,
  projectItems as projectItemsModule,
} from "@wix/portfolio";
import { media, VideoResolution } from "@wix/sdk";
import { wixModule } from "@/shared/sdk";
import { imgFitSrc } from "@/shared/media";
import { fetchPublishedContentBatch } from "@/features/i18n/published-content";
import type { HeaderLike } from "@/features/i18n/locale-from-request";
import {
  galleryItems,
  visibleCollection,
  visibleCollections,
  visibleProject,
  visibleProjects,
  type Raw,
  type VideoSrc,
} from "@/features/portfolio/portfolio-core";
import type { CollectionSummary, GalleryItem, ProjectDetail, ProjectSummary } from "@/features/portfolio/types";

const collections = wixModule(collectionsModule);
const projects = wixModule(projectsModule);
const projectItems = wixModule(projectItemsModule);

const PORTFOLIO_APP_ID = "d90652a2-f5a1-4c7c-84c4-d4cdcc41f130";

/**
 * Published translations of the portfolio's collections and projects in the current locale, keyed
 * by entity id (one batched read per entityType; empty maps for the primary locale).
 */
async function portfolioTranslations(headers?: HeaderLike): Promise<{
  collections: Map<string, Record<string, unknown>>;
  projects: Map<string, Record<string, unknown>>;
}> {
  const [collections, projects] = await Promise.all([
    fetchPublishedContentBatch({ entityType: "com.wixpress.portfolio.collections.Collection", appId: PORTFOLIO_APP_ID, scope: "GLOBAL", headers }),
    fetchPublishedContentBatch({ entityType: "com.wixpress.portfolio.projects.Project", appId: PORTFOLIO_APP_ID, scope: "GLOBAL", headers }),
  ]);
  return { collections, projects };
}

const translated = (raw: Raw, map: Map<string, Record<string, unknown>>): Raw => {
  const id = raw?.id ?? raw?._id;
  const t = typeof id === "string" ? map.get(id) : undefined;
  if (!t) return raw;
  const out: Raw = { ...raw, ...t };
  // Repeated details() fields arrive as arrays keyed by sequence id — rebuild the details list,
  // overlaying each translated label/text onto the raw element it belongs to.
  const detailLabels = t["details()-label"];
  const detailTexts = t["details()-text"];
  if (Array.isArray(detailLabels) || Array.isArray(detailTexts)) {
    const rawDetails = Array.isArray(raw.details) ? raw.details : [];
    const count = Math.max(
      Array.isArray(detailLabels) ? detailLabels.length : 0,
      Array.isArray(detailTexts) ? detailTexts.length : 0,
      rawDetails.length,
    );
    const details = [];
    for (let i = 0; i < count; i++) {
      const base = rawDetails[i] ?? {};
      const label = Array.isArray(detailLabels) ? detailLabels[i] : undefined;
      const text = Array.isArray(detailTexts) ? detailTexts[i] : undefined;
      details.push({
        ...base,
        ...(label !== undefined ? { label } : {}),
        ...(text !== undefined ? { text } : {}),
      });
    }
    out.details = details;
  }
  return out;
};

// The SDK types coverImage.imageInfo / item.image.imageInfo as a bare wix:image:// STRING and
// videoInfo as a bare wix:video:// string; getVideoUrl derives the mp4 rendition + poster.
const videoSrc: VideoSrc = (ref) => {
  try {
    const v = media.getVideoUrl(ref, VideoResolution.MID);
    return { url: v.url, thumbnail: v.thumbnail };
  } catch {
    return null;
  }
};

/** List visible collections in the owner's dashboard order (sortOrder). */
export async function fetchCollections({ limit = 100, headers }: { limit?: number; headers?: HeaderLike } = {}): Promise<CollectionSummary[]> {
  const [res, t] = await Promise.all([
    collections.listCollections({ paging: { limit } }),
    portfolioTranslations(headers),
  ]);
  return visibleCollections((res.collections ?? []).map((c: Raw) => translated(c, t.collections)), imgFitSrc);
}

/** Fetch one visible collection by its URL slug. Null when not found or hidden. */
export async function fetchCollectionBySlug(slug: string, headers?: HeaderLike): Promise<CollectionSummary | null> {
  const [res, t] = await Promise.all([
    collections.queryCollections().eq("slug", slug).limit(1).find(),
    portfolioTranslations(headers),
  ]);
  return visibleCollection(
    (res.items ?? []).map((c: Raw) => translated(c, t.collections))[0],
    imgFitSrc,
  );
}

/** List visible projects (list order), optionally only one collection's. */
export async function fetchProjects({
  collectionId,
  limit = 100,
  headers,
}: { collectionId?: string; limit?: number; headers?: HeaderLike } = {}): Promise<ProjectSummary[]> {
  const [res, t] = await Promise.all([
    projects.listProjects({ paging: { limit } }),
    portfolioTranslations(headers),
  ]);
  return visibleProjects((res.projects ?? []).map((p: Raw) => translated(p, t.projects)), collectionId, imgFitSrc, videoSrc);
}

/** Fetch one visible project by its URL slug. Null when not found or hidden. */
export async function fetchProjectBySlug(slug: string, headers?: HeaderLike): Promise<ProjectDetail | null> {
  const [res, t] = await Promise.all([
    projects.queryProjects().eq("slug", slug).limit(1).find(),
    portfolioTranslations(headers),
  ]);
  return visibleProject(
    (res.items ?? []).map((p: Raw) => translated(p, t.projects))[0],
    imgFitSrc,
    videoSrc,
  );
}

/**
 * A project's media gallery in dashboard order (item sortOrder). IMAGE and VIDEO items only —
 * UNDEFINED and unresolvable media are dropped. First arg is the project _id (positional).
 */
export async function fetchProjectGallery(projectId: string): Promise<GalleryItem[]> {
  const res = await projectItems.listProjectItems(projectId, { paging: { limit: 100 } });
  return galleryItems((res.items ?? []) as Raw[], imgFitSrc, videoSrc);
}
