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
