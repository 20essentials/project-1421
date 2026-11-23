import { DEFAULT_LOCALE, toLocale, type Locale } from "./locale";
import { localeFromPath } from "./localized-path";

export interface HeaderLike {
  get(name: string): string | null | undefined;
}

export function cookieValue(headers: HeaderLike | undefined, name: string): string | null {
  const raw = headers?.get("cookie");
  if (!raw) return null;
  for (const entry of raw.split(";")) {
    const [key, ...rest] = entry.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function resolveLocale(
  url: URL | string,
  headers: HeaderLike | undefined,
  hostLanguage?: string | null,
): Locale {
  const path = typeof url === "string" ? url : url.pathname;
  const fromPath = localeFromPath(path);
  if (fromPath) return fromPath;

  // Under the @wix/astro localization middleware the page URL is rewritten to the locale-stripped
  // clean URL; the visitor's language arrives per request through the essentials host
  // (i18n.getLanguage), so it outranks the cookie on those paths.
  const fromHost = toLocale(hostLanguage);
  if (fromHost) return fromHost;

  const fromCookie = toLocale(cookieValue(headers, "wixLanguage"));
  if (fromCookie) return fromCookie;

  return DEFAULT_LOCALE;
}
