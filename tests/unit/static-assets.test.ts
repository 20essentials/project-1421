import { describe, expect, it } from "vitest";
import { toAssetPath, toMutableResponse, toPublicOrigin } from "@/app/static-assets";

describe("toAssetPath", () => {
  it("keeps root asset paths", () => {
    expect(toAssetPath("/_astro/index.CAOXZTkl.css")).toBe("/_astro/index.CAOXZTkl.css");
    expect(toAssetPath("/site.webmanifest")).toBe("/site.webmanifest");
    expect(toAssetPath("/favicon.svg")).toBe("/favicon.svg");
  });

  it("strips a locale segment from localized asset paths", () => {
    expect(toAssetPath("/es/_astro/index.CAOXZTkl.css")).toBe("/_astro/index.CAOXZTkl.css");
    expect(toAssetPath("/it-IT/_astro/10-eleganti.webp")).toBe("/_astro/10-eleganti.webp");
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
