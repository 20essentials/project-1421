// Pure rules behind the searchable choice combobox (schema-form.tsx). A dropdown the owner fills
// with the full country list (247 options) is unusable as a native <select>, so a large choice
// list upgrades to a combobox: type-to-filter (accents-insensitive, so "peru" finds "Perù"),
// keyboard navigation, and a flag resolved from the choice's own label — the form stores the
// Italian country name as the value, and the generated name→code table feeds the flag URL
// (twemoji CDN, because Windows renders flag emoji as bare letter codes).
import { COUNTRY_CODES_BY_NAME } from "@/features/forms/country-flags.generated";
import type { FormChoice } from "@/features/forms/types";

/** Below this many choices a native <select> stays — it scrolls fine and costs nothing. */
export const COMBOBOX_MIN_CHOICES = 20;

/** Lowercase, accent-free, whitespace-collapsed — so "Costa d'Avorio" matches "costa davario". */
export function normalizeForSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[''’]/g, " ")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * The choices whose label or value contains EVERY word of the query. Substring matching, not
 * word-boundary: "sud" finds "Sudafrica", "Sudan" and "Sud Sudan"; "stati uniti" finds
 * "Stati Uniti". An empty query returns the list as-is.
 */
export function filterChoices(choices: FormChoice[], query: string): FormChoice[] {
  const q = normalizeForSearch(query);
  if (!q) return choices;
  const words = q.split(" ");
  return choices.filter((c) => {
    const haystack = `${normalizeForSearch(c.label)} ${normalizeForSearch(c.value)}`;
    return words.every((w) => haystack.includes(w));
  });
}

/** The choice's ISO alpha-2 code when its label is a country name, else "". */
export function countryCodeFor(label: string): string {
  return COUNTRY_CODES_BY_NAME[label] ?? "";
}

/** The flag emoji of an ISO alpha-2 code (regional-indicator pair); "" for anything else. */
export function flagEmoji(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/**
 * A flag as a tiny SVG the browser can draw on every platform — Windows renders flag emoji as
 * bare two-letter codes, which duplicates the name next to it. Deterministic URL, so the SSR
 * pass and hydration agree. Broken loads hide themselves (the name alone still reads fine).
 */
export function flagUrl(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return "";
  const points = [...code.toUpperCase()].map((c) => (0x1f1e6 + c.charCodeAt(0) - 65).toString(16));
  return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/${points.join("-")}.svg`;
}

/** A choice's flag markup inputs: URL and emoji fallback, both "" when it is not a country. */
export function flagFor(label: string): { url: string; emoji: string } {
  const code = countryCodeFor(label);
  return { url: flagUrl(code), emoji: flagEmoji(code) };
}
