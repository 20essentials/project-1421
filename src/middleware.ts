import { defineMiddleware } from "astro:middleware";
import { DEFAULT_LOCALE } from "@/features/i18n/locale";
import { toAssetPath, toMutableResponse, toPublicOrigin } from "@/app/static-assets";

const ASSET_PROXY_HEADER = "x-asset-proxy";

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.request.headers.has(ASSET_PROXY_HEADER)) return next();

  const assetPath = toAssetPath(context.url.pathname);
  if (!assetPath) return next();

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
