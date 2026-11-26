import { DEFAULT_LOCALE, type Locale } from "@/features/i18n/locale";

export function shouldEmitSecondaryLocaleTitle(
  locale: Locale,
  emitFallbackHead: boolean,
  hasSeoTags: boolean,
  hasTitle: boolean,
): boolean {
  return !emitFallbackHead && !hasSeoTags && hasTitle && locale !== DEFAULT_LOCALE;
}
