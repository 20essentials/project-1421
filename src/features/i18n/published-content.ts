import { wixFetch } from "@/shared/sdk";
import { currentLocale } from "./current-locale";
import {
  overlayTranslation,
  publishedContentFilter,
  publishedContentMap,
  publishedContentMapAll,
  type PublishedContent,
  type PublishedContentField,
  type PublishedContentScope,
} from "./published-content-core";
import { DEFAULT_LOCALE, type Locale } from "./locale";

const PUBLISHED_CONTENT_PATH = "/translation-published-content/v3/published-contents/query";

export interface PublishedContentRequest {
  entityType: string;
  entityId?: string;
  appId?: string;
  scope?: PublishedContentScope;
  locale?: Locale;
  headers?: { get(name: string): string | null | undefined };
}

export async function fetchPublishedContent(
  request: PublishedContentRequest,
): Promise<Record<string, unknown> | null> {
  const locale = request.locale ?? currentLocale("", request.headers);
  if (locale === DEFAULT_LOCALE) return null;

  const body = {
    query: {
      filter: publishedContentFilter({
        appId: request.appId,
        entityType: request.entityType,
        scope: request.scope,
        entityId: request.entityId,
        locale,
      }),
    },
  };

  try {
    const response = await wixFetch(PUBLISHED_CONTENT_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as {
      publishedContent?: PublishedContent[];
      fields?: PublishedContentField[];
    };
    return publishedContentMap(data.publishedContent);
  } catch {
    return null;
  }
}

export async function withPublishedTranslation<T extends Record<string, unknown>>(
  base: T,
  request: PublishedContentRequest,
): Promise<T> {
  const baseId = typeof base._id === "string" ? base._id : typeof base.id === "string" ? base.id : undefined;
  const translation = await fetchPublishedContent({
    ...request,
    entityId: request.entityId ?? baseId,
  });
  return overlayTranslation(base, translation);
}

/**
 * Every published translation of one entityType in the current locale, keyed by entityId — for
 * overlaying a whole list (all FAQ questions, all portfolio projects, all blog cards) with a
 * single read instead of one per entity. Empty map for the primary locale (nothing to overlay).
 */
export async function fetchPublishedContentBatch(
  request: PublishedContentRequest,
): Promise<Map<string, Record<string, unknown>>> {
  const locale = request.locale ?? currentLocale("", request.headers);
  if (locale === DEFAULT_LOCALE) return new Map();

  const body = {
    query: {
      filter: publishedContentFilter({
        appId: request.appId,
        entityType: request.entityType,
        scope: request.scope,
        locale,
      }),
    },
  };

  try {
    const response = await wixFetch(PUBLISHED_CONTENT_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) return new Map();
    const data = (await response.json()) as {
      publishedContent?: PublishedContent[];
      fields?: PublishedContentField[];
    };
    return publishedContentMapAll(data.publishedContent);
  } catch {
    return new Map();
  }
}
