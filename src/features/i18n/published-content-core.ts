export const TRANSLATION_SITE_APP_ID = "e593b0bd-b783-45b8-97c2-873d42aacaf4";

export type PublishedContentScope = "SITE" | "GLOBAL";

export interface PublishedContentField {
  schemaFieldKey?: string;
  textValue?: string;
  richContent?: unknown;
  image?: unknown;
  video?: unknown;
  document?: unknown;
  value?: {
    textValue?: string;
    richContent?: unknown;
    image?: unknown;
    video?: unknown;
    document?: unknown;
  };
  sequenceIds?: string[];
}

export interface PublishedContent {
  id?: string;
  entityId?: string;
  locale?: string;
  fields?: PublishedContentField[];
}

const VALUE_KEYS = ["textValue", "richContent", "image", "video", "document"] as const;

function fieldValue(field: PublishedContentField): unknown {
  if (field.value && typeof field.value === "object") {
    for (const key of VALUE_KEYS) {
      if (field.value[key] !== undefined) return field.value[key];
    }
  }
  for (const key of VALUE_KEYS) {
    if (field[key] !== undefined) return field[key];
  }
  return undefined;
}

export function publishedContentFilter({
  appId = TRANSLATION_SITE_APP_ID,
  entityType,
  scope = "SITE",
  entityId,
  locale,
}: {
  appId?: string;
  entityType: string;
  scope?: PublishedContentScope;
  entityId?: string;
  locale: string;
}): Record<string, unknown> {
  return {
    "schemaKey.appId": { $eq: appId },
    "schemaKey.entityType": { $eq: entityType },
    "schemaKey.scope": { $eq: scope },
    ...(entityId ? { entityId: { $eq: entityId } } : {}),
    locale: { $eq: locale },
  };
}

export function toTranslationMap(fields: PublishedContentField[] | undefined): Record<string, unknown> {
  const map: Record<string, unknown> = {};
  for (const field of fields ?? []) {
    const key = field.schemaFieldKey;
    if (!key) continue;
    const value = fieldValue(field);
    if (value === undefined) continue;
    // Repeated fields arrive once per element, same key, identified by sequenceIds. Single-level
    // repeats collect into an array ordered by the (1-based) sequence id so overlays can rebuild
    // the list; deeper chains (formFields → options) are stored under "key#level1|level2".
    const seq = field.sequenceIds ?? [];
    if (seq.length === 1) {
      const idx = Number(seq[0]);
      if (!Number.isFinite(idx) || idx < 1) continue;
      const arr = Array.isArray(map[key]) ? [...(map[key] as unknown[])] : [];
      arr[idx - 1] = value;
      map[key] = arr;
    } else if (seq.length > 1) {
      map[`${key}#${seq.join("|")}`] = value;
    } else {
      map[key] = value;
    }
  }
  return map;
}

export function publishedContentMap(content: PublishedContent[] | undefined): Record<string, unknown> {
  return toTranslationMap(content?.[0]?.fields);
}

/** All of a batch query's contents, keyed by entityId (one field map per translated entity). */
export function publishedContentMapAll(content: PublishedContent[] | undefined): Map<string, Record<string, unknown>> {
  const map = new Map<string, Record<string, unknown>>();
  for (const item of content ?? []) {
    if (!item.entityId) continue;
    map.set(item.entityId, toTranslationMap(item.fields));
  }
  return map;
}

export function overlayTranslation<T extends Record<string, unknown>>(
  base: T,
  translation: Record<string, unknown> | null | undefined,
): T {
  if (!translation) return base;
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(translation)) {
    if (value !== undefined) out[key] = value;
  }
  return out as T;
}
