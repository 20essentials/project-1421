import { withPublishedTranslation } from "@/features/i18n/published-content";
import type { HeaderLike } from "@/features/i18n/locale-from-request";
import { getItemById } from "@/wix/cms/items";
import {
  SITE_CHROME_COLLECTION_ID,
  SITE_CHROME_ITEM_ID,
  toSiteChromeLabels,
  type SiteChromeLabels,
} from "./site-chrome-core";

export async function getSiteChrome(headers?: HeaderLike): Promise<SiteChromeLabels> {
  let item: Record<string, unknown> = {};
  try {
    item = (await getItemById(SITE_CHROME_COLLECTION_ID, SITE_CHROME_ITEM_ID)) ?? {};
  } catch {
    item = {};
  }
  const translated = await withPublishedTranslation(item, {
    entityType: SITE_CHROME_COLLECTION_ID,
    entityId: SITE_CHROME_ITEM_ID,
    headers,
  });
  return toSiteChromeLabels(translated);
}
