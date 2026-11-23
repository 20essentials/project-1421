import { i18n } from "@wix/essentials";
import { resolveLocale, type HeaderLike } from "./locale-from-request";
import type { Locale } from "./locale";

export function currentLocale(url: URL | string, headers?: HeaderLike): Locale {
  let hostLanguage: string | null = null;
  try {
    hostLanguage = i18n.getLanguage();
  } catch {
    hostLanguage = null;
  }
  return resolveLocale(url, headers, hostLanguage);
}
