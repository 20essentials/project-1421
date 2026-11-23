import { defineMiddleware } from "astro:middleware";
import { DEFAULT_LOCALE } from "@/features/i18n/locale";
import { resolvePathLocale } from "@/features/i18n/localized-path";
import { toAssetPath, toMutableResponse, toPublicOrigin, localeAssetRewriter } from "@/app/static-assets";

const ASSET_PROXY_HEADER = "x-asset-proxy";

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.request.headers.has(ASSET_PROXY_HEADER)) return next();

  const assetPath = toAssetPath(context.url.pathname);
  if (!assetPath) {
    const response = await next();
    const locale = resolvePathLocale(
      context.url.pathname,
      context.request.headers.get("x-wix-forwarded-url"),
    );
    if (
      !locale ||
      locale === DEFAULT_LOCALE ||
      !response.body ||
      !response.headers.get("content-type")?.startsWith("text/html")
    ) {
      return response;
    }
    return new Response(
      response.body.pipeThrough(localeAssetRewriter(locale, import.meta.env.BUILD_ID)),
      response,
    );
  }

  const origin = toPublicOrigin(
    context.url,
    context.request.headers.get("x-wix-forwarded-url"),
  );
  const headers = new Headers();
  headers.set("x-wix-language", DEFAULT_LOCALE);
  headers.set(ASSET_PROXY_HEADER, "1");

  const response = await fetch(new URL(assetPath, origin), {
    headers,
    redirect: "manual",
  });
  if (response.ok || response.status === 304) return toMutableResponse(response);

  return next();
});
