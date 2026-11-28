import { describe, expect, it } from "vitest";
import {
  localeAssetRewriter,
  toAssetPath,
  toMutableResponse,
  toPublicOrigin,
} from "@/app/static-assets";

describe("toAssetPath", () => {
  it("keeps root asset paths", () => {
    expect(toAssetPath("/_astro/index.CAOXZTkl.css")).toBe("/_astro/index.CAOXZTkl.css");
    expect(toAssetPath("/site.webmanifest")).toBe("/site.webmanifest");
    expect(toAssetPath("/favicon.svg")).toBe("/favicon.svg");
  });

  it("strips a locale segment from localized asset paths", () => {
    expect(toAssetPath("/es/_astro/index.CAOXZTkl.css")).toBe("/_astro/index.CAOXZTkl.css");
    expect(toAssetPath("/it-IT/_astro/photo.avif")).toBe("/_astro/photo.avif");
    expect(toAssetPath("/de/site.webmanifest")).toBe("/site.webmanifest");
  });

  it("ignores pages and unknown paths", () => {
    expect(toAssetPath("/es/faq")).toBeNull();
    expect(toAssetPath("/portfolio")).toBeNull();
    expect(toAssetPath("/_astrox/file.js")).toBeNull();
  });
});

describe("toPublicOrigin", () => {
  it("prefers a valid forwarded URL", () => {
    expect(
      toPublicOrigin(
        new URL("http://internal/_astro/index.css"),
        "https://stefano-lunardi-d960960gm-0f09.wix-site-host.com/es/faq",
      ),
    ).toBe("https://stefano-lunardi-d960960gm-0f09.wix-site-host.com");
  });

  it("falls back to the request origin", () => {
    expect(toPublicOrigin(new URL("http://localhost:4321/es/faq"), null)).toBe(
      "http://localhost:4321",
    );
    expect(toPublicOrigin(new URL("http://localhost:4321/es/faq"), "/faq")).toBe(
      "http://localhost:4321",
    );
  });
});

describe("toMutableResponse", () => {
  it("copies an immutable response into a mutable one with the same body and headers", async () => {
    const original = new Response("body", {
      status: 200,
      headers: {
        "cache-control": "public, max-age=3600, immutable",
        "content-encoding": "br",
        "content-length": "4",
        "content-type": "text/css",
      },
    });
    const copy = toMutableResponse(original);

    expect(copy).not.toBe(original);
    expect(copy.headers).not.toBe(original.headers);
    expect(copy.status).toBe(200);
    expect(copy.headers.get("content-type")).toBe("text/css");
    expect(copy.headers.get("cache-control")).toBe("public, max-age=300, must-revalidate");
    expect(copy.headers.has("content-encoding")).toBe(false);
    expect(copy.headers.has("content-length")).toBe(false);
    expect(() => copy.headers.set("x-test", "1")).not.toThrow();
    expect(await copy.text()).toBe("body");
  });

  it("keeps a 304 response body empty", () => {
    const copy = toMutableResponse(new Response(null, { status: 304 }));

    expect(copy.status).toBe(304);
    expect(copy.body).toBeNull();
  });
});

describe("localeAssetRewriter", () => {
  const V = "202611231200";

  async function rewrite(html: string, locale: Parameters<typeof localeAssetRewriter>[0], version?: string) {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(html));
        controller.close();
      },
    }).pipeThrough(localeAssetRewriter(locale, version));
    return await new Response(stream).text();
  }

  it("prefixes bare asset urls with the page locale and the release version", async () => {
    const html =
      '<script src="/_astro/app.js"></script>' +
      '<astro-island component-url="/_astro/a.js" before-hydration-url="/_astro/b.js">';
    expect(await rewrite(html, "es", V)).toBe(
      '<script src="/es/_astro/app.js?v=' + V + '"></script>' +
        '<astro-island component-url="/es/_astro/a.js?v=' + V + '" before-hydration-url="/es/_astro/b.js?v=' + V + '">',
    );
  });

  it("appends the version to already-prefixed urls without re-prefixing them", async () => {
    const html = '<script src="/es/_astro/app.js"></script><img srcset="/en/_astro/a.webp 1x">';
    expect(await rewrite(html, "es", V)).toBe(
      '<script src="/es/_astro/app.js?v=' + V + '"></script><img srcset="/en/_astro/a.webp?v=' + V + ' 1x">',
    );
  });

  it("prefixes url-like text even when not inside a quoted attribute", async () => {
    expect(await rewrite("href=/_astro/x.js", "de", V)).toBe("href=/de/_astro/x.js?v=" + V);
  });

  it("matches occurrences split across chunk boundaries", async () => {
    const html = '<p x="/_astro/one.js">/_astro/two.js</p>';
    const expected = '<p x="/de/_astro/one.js?v=' + V + '">/de/_astro/two.js?v=' + V + '</p>';
    const bytes = new TextEncoder().encode(html);
    for (const size of [1, 2, 3, 7, 8, 9, 23, 24, 25]) {
      const chunks: Uint8Array[] = [];
      for (let i = 0; i < bytes.length; i += size) chunks.push(bytes.slice(i, i + size));
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          for (const c of chunks) controller.enqueue(c);
          controller.close();
        },
      }).pipeThrough(localeAssetRewriter("de", V));
      expect(await new Response(stream).text()).toBe(expected);
    }
  });

  it("handles multibyte characters across chunks without corrupting them", async () => {
    const html = '<p>ñoki—✓</p><script src="/_astro/app.js"></script>';
    expect(await rewrite(html, "en", V)).toBe(
      '<p>ñoki—✓</p><script src="/en/_astro/app.js?v=' + V + '"></script>',
    );
  });

  it("omits the query when no version is given", async () => {
    expect(await rewrite('<script src="/_astro/a.js">', "es", undefined)).toBe(
      '<script src="/es/_astro/a.js">',
    );
  });
});
