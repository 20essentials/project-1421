export interface SitePageContent {
  eyebrow: string;
  title: string;
  intro: string;
  bodyHtml: string;
  version: string;
}

function text(item: Record<string, unknown>, key: string): string {
  return typeof item[key] === "string" ? (item[key] as string) : "";
}

export function toSitePageContent(
  item: Record<string, unknown> | null | undefined,
): SitePageContent | null {
  if (!item) return null;
  return {
    eyebrow: text(item, "eyebrow"),
    title: text(item, "title"),
    intro: text(item, "intro"),
    bodyHtml: text(item, "body"),
    version: text(item, "version"),
  };
}
