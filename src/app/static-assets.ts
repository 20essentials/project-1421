import { LOCALES, type Locale } from "@/features/i18n/locale";

const ASSET_FILES = ["/favicon.ico", "/favicon.svg", "/site.webmanifest"];
const ASSET_PREFIXES = ["/_astro/"];

function isAssetPath(pathname: string): boolean {
  return (
    ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    ASSET_FILES.includes(pathname)
  );
}

export function toAssetPath(pathname: string): string | null {
  if (isAssetPath(pathname)) return pathname;
  const withoutLocale = pathname.replace(/^\/[a-z]{2}(?:-[A-Za-z]{2})?(?=\/)/, "");
  return isAssetPath(withoutLocale) ? withoutLocale : null;
}

export function toPublicOrigin(url: URL, forwardedUrl: string | null): string {
  if (forwardedUrl && URL.canParse(forwardedUrl)) {
    const parsed = new URL(forwardedUrl);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return parsed.origin;
  }
  return url.origin;
}

export function toMutableResponse(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  if (headers.has("cache-control")) {
    headers.set("cache-control", "public, max-age=300, must-revalidate");
  }
  return response.status === 304
    ? new Response(null, { status: 304, headers })
    : new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
}

/**
 * Rewrites bare `/_astro/…` asset URLs in SSR HTML to the page locale base
 * (`/es/_astro/…?v=<BUILD_ID>`). Two edge problems this solves:
 *
 * 1. One page's module graph must live under ONE base. The multilingual edge
 *    answers bare asset requests with a 302 to the visitor locale (the
 *    `wixLanguage` cookie wins over Accept-Language) and its CDN also caches
 *    some of those 302s, while other requests reach the worker and get proxied
 *    at the bare URL — so React, imported from both bases, exists twice and
 *    hydration dies with "Cannot read properties of null (reading 'useRef')".
 *    Locale-prefixed asset URLs never redirect (verified against the live
 *    edge). Primary-locale pages keep bare URLs: the edge canonicalizes
 *    `/it/…` back to `/…`, which would redirect every asset again.
 *
 * 2. Every release gets fresh cache keys (?v=<BUILD_ID>): the CDN has served
 *    corrupt/stale compressed variants of same-hash assets, and browsers keep
 *    them under cache-control: immutable — an unstyled page until the visitor
 *    manually clears the cache.
 *
 * Chunk-safe: matches are scanned over the accumulated text and only a trailing
 * PARTIAL match (needle or in-URL filename) is carried into the next chunk, so
 * an occurrence split across chunk boundaries is still handled whole. An
 * occurrence already preceded by a locale segment (`/es/_astro/…`) keeps its
 * base (still gets ?v=).
 */
export function localeAssetRewriter(
  locale: Locale,
  version?: string,
): TransformStream<Uint8Array, Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const NEEDLE = "/_astro/";
  const urlPattern = /\/_astro\/[A-Za-z0-9._/-]+/g;
  const prefixedBefore = new RegExp(`^\\s*/(?:${LOCALES.join("|")})$`);
  const query = version ? `?v=${version}` : "";
  let tail = "";
  const scan = (text: string, holdPartial: boolean): { out: string; tail: string } => {
    let out = "";
    let pos = 0;
    let hold = text.length;
    urlPattern.lastIndex = 0;
    for (let m = urlPattern.exec(text); m; m = urlPattern.exec(text)) {
      const url = m[0];
      const idx = m.index;
      if (holdPartial && idx + url.length === text.length) {
        // The match reaches the chunk end — the URL could continue there
        // (asset hashes are [A-Za-z0-9._-]). Hold it whole for the next chunk.
        out += text.slice(pos, idx);
        pos = idx;
        hold = idx;
        break;
      }
      const before = text.slice(Math.max(0, idx - 3), idx);
      const rewritten = prefixedBefore.test(before)
        ? `${url}${query}`
        : `/${locale}${url}${query}`;
      out += text.slice(pos, idx) + rewritten;
      pos = idx + url.length;
    }
    // A trailing partial match also continues in the next chunk: a bare needle
    // prefix ("/_astro", "/_as", "/") or a complete needle followed only by URL
    // chars (the URL itself still growing). Held in input coordinates.
    if (holdPartial && hold === text.length) {
      const rest = text.slice(pos);
      let cut = -1;
      const last = rest.lastIndexOf(NEEDLE);
      if (last !== -1 && /^[A-Za-z0-9._/-]*$/.test(rest.slice(last + NEEDLE.length))) {
        cut = last;
      } else {
        for (let n = Math.min(NEEDLE.length - 1, rest.length); n >= 1; n--) {
          if (NEEDLE.startsWith(rest.slice(-n))) {
            cut = rest.length - n;
            break;
          }
        }
      }
      if (cut !== -1) hold = pos + cut;
    }
    out += text.slice(pos, hold);
    return { out, tail: text.slice(hold) };
  };
  return new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      const { out, tail: rest } = scan(tail + decoder.decode(chunk, { stream: true }), true);
      tail = rest;
      if (out) controller.enqueue(encoder.encode(out));
    },
    flush(controller) {
      const { out } = scan(tail + decoder.decode(), false);
      if (out) controller.enqueue(encoder.encode(out));
    },
  });
}

