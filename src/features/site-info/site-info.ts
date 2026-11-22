// Server-side read of the site's business info (Wix Site Properties API — what
// the owner manages in the dashboard under Settings > Business Info). Maps into
// a SiteInfo with hard fallbacks in ./site-info-core, so pages render the
// studio's values whether or not the owner filled the dashboard fields.
//
// The read needs SITE_SETTINGS.VIEW, which the ambient visitor token does NOT
// have (403 PERMISSION_DENIED — verified against the live site). The documented
// managed-Astro pattern is `auth.elevate(...)`, which runs the call with the
// app's server-side credentials. Callers must catch — a failed read is handled
// by the fallbacks, never an SSR throw.
//
// docs: https://dev.wix.com/docs/api-reference/business-management/site-properties/properties/read?apiView=SDK
import { auth } from "@wix/essentials";
import { siteProperties } from "@wix/business-tools";
import { wixModule } from "@/shared/sdk";
import { SITE_INFO_FALLBACKS, toSiteInfo, type SiteInfo } from "@/features/site-info/site-info-core";

const FIELDS = ["businessName", "siteDisplayName", "email", "phone", "address", "description"];

export async function fetchSiteInfo(): Promise<SiteInfo> {
  try {
    const read = auth.elevate(wixModule(siteProperties).getSiteProperties);
    const res = await read({ fields: FIELDS });
    return toSiteInfo((res?.properties as unknown as Record<string, unknown> | null) ?? null);
  } catch (err) {
    console.error("site-info: falling back to the studio's values.", err);
    return SITE_INFO_FALLBACKS;
  }
}
