// Pure mapping + fallbacks for the site's business info. The transport is in
// ./site-info (server-side only); this file has no Wix imports so it can be
// unit-tested without auth.
//
// Source: the Wix Site Properties API — what the owner sets in the dashboard
// under Settings > Business Info (and Settings > Website settings for the
// favicon, which Wix serves at /favicon.ico itself). Every field falls back to
// the studio's known values when the owner left it empty or the read failed.
// docs: https://dev.wix.com/docs/api-reference/business-management/site-properties/properties/get-site-properties.md

export interface SiteInfo {
  businessName: string;
  displayName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
}

export const SITE_INFO_FALLBACKS: SiteInfo = {
  businessName: "Stefano Lunardi",
  displayName: "Stefano Lunardi",
  email: "studio@stefanolunardi.com",
  phone: "+39 338 751 3113 (Italia)",
  address: "Villach · Udine · Treviso",
  description: "Fotografo di matrimoni | Fine Art | Fotoreporter",
};

type Raw = Record<string, unknown>;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function formatAddress(raw: Raw | null): string {
  const google = str(raw?.googleFormattedAddress);
  if (google) return google;
  const parts = [
    [str(raw?.street), str(raw?.streetNumber)].filter(Boolean).join(" "),
    str(raw?.zip),
    str(raw?.city),
    str(raw?.country),
  ].filter(Boolean);
  return parts.join(", ");
}

export function toSiteInfo(raw: Raw | null | undefined): SiteInfo {
  const properties = (raw ?? {}) as Raw;
  const fallback = SITE_INFO_FALLBACKS;
  const email = str(properties.email);
  const phone = str(properties.phone);
  const businessName = str(properties.businessName) || str(properties.siteDisplayName);
  const description = str(properties.description);
  const address = formatAddress((properties.address as Raw) ?? null);
  return {
    businessName: businessName || fallback.businessName,
    displayName: str(properties.siteDisplayName) || businessName || fallback.displayName,
    email: email || fallback.email,
    phone: phone || fallback.phone,
    address: address || fallback.address,
    description: description || fallback.description,
  };
}
