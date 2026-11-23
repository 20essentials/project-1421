import { DEFAULT_LOCALE, toLocale, type Locale } from "./locale";

const LOCALE_PATH = /^\/(it|es|en|de)(?=\/|$)/;

function cleanPath(path: string): string {
  const value = path || "/";
  return value.startsWith("/") ? value : `/${value}`;
}

function pathname(value: string): string {
  try {
    return new URL(value, "https://example.test").pathname || "/";
  } catch {
    return cleanPath(value);
  }
}

export function localeFromPath(path: string): Locale | null {
  const match = LOCALE_PATH.exec(cleanPath(path));
  return match ? toLocale(match[1]) : null;
}

export function stripLocalePrefix(path: string): string {
  const value = cleanPath(path);
  const match = LOCALE_PATH.exec(value);
  if (!match) return value;
  const rest = value.slice(match[0].length);
  return rest ? (rest.startsWith("/") ? rest : `/${rest}`) : "/";
}

export function localizedPath(locale: Locale, path: string): string {
  const clean = stripLocalePrefix(path);
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

export function localizedHref(locale: Locale, href: string): string {
  if (!href || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) return href;
  const match = /^([^?#]*)(.*)$/.exec(href);
  const path = match?.[1] ?? href;
  const suffix = match?.[2] ?? "";
  if (!path.startsWith("/")) return href;
  return `${localizedPath(locale, path)}${suffix}`;
}

export function localizedCanonicalPath(
  currentPath: string,
  forwardedUrl: string | null | undefined,
  locale: Locale,
): string {
  const forwardedPath =
    forwardedUrl && /^https?:\/\//i.test(forwardedUrl) ? pathname(forwardedUrl) : null;
  const source = forwardedPath ?? pathname(currentPath);
  return localizedPath(locale, source);
}

export function currentCleanPath(currentPath: string): string {
  return stripLocalePrefix(pathname(currentPath));
}

export function resolvePathLocale(
  currentPath: string,
  forwardedUrl: string | null | undefined,
): Locale | null {
  const forwardedPath =
    forwardedUrl && /^https?:\/\//i.test(forwardedUrl) ? pathname(forwardedUrl) : null;
  return localeFromPath(forwardedPath ?? pathname(currentPath)) ?? localeFromPath(currentPath) ?? null;
}

export function fallbackLocale(currentPath: string): Locale {
  return resolvePathLocale(currentPath, null) ?? DEFAULT_LOCALE;
}
