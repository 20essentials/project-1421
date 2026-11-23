import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  LOCALES,
  languageTag,
  ogLocale,
  toLocale,
} from "@/features/i18n/locale";
import {
  currentCleanPath,
  localeFromPath,
  localizedCanonicalPath,
  localizedHref,
  localizedPath,
  stripLocalePrefix,
} from "@/features/i18n/localized-path";
import { cookieValue, resolveLocale } from "@/features/i18n/locale-from-request";
import {
  overlayTranslation,
  publishedContentFilter,
  publishedContentMap,
  publishedContentMapAll,
  toTranslationMap,
  TRANSLATION_SITE_APP_ID,
} from "@/features/i18n/published-content-core";

describe("locale", () => {
  it("supports the four site locales with Italian default", () => {
    expect(LOCALES).toEqual(["it", "es", "en", "de"]);
    expect(DEFAULT_LOCALE).toBe("it");
    expect(toLocale("es-ES")).toBe("es");
    expect(toLocale("DE")).toBe("de");
    expect(toLocale("fr")).toBeNull();
    expect(languageTag("en")).toBe("en-US");
    expect(ogLocale("de")).toBe("de_DE");
  });
});

describe("localized paths", () => {
  it("strips and applies locale prefixes", () => {
    expect(localeFromPath("/es/faq")).toBe("es");
    expect(stripLocalePrefix("/es/faq")).toBe("/faq");
    expect(stripLocalePrefix("/es")).toBe("/");
    expect(stripLocalePrefix("/faq")).toBe("/faq");
    expect(localizedPath("it", "/")).toBe("/it");
    expect(localizedPath("de", "/faq")).toBe("/de/faq");
    expect(localizedPath("en", "/es/faq")).toBe("/en/faq");
  });

  it("localizes only internal hrefs and keeps suffixes", () => {
    expect(localizedHref("es", "/faq?x=1#y")).toBe("/es/faq?x=1#y");
    expect(localizedHref("es", "/it")).toBe("/es");
    expect(localizedHref("es", "#section")).toBe("#section");
    expect(localizedHref("es", "mailto:studio@stefanolunardi.com")).toBe(
      "mailto:studio@stefanolunardi.com",
    );
    expect(localizedHref("es", "https://example.test/faq")).toBe("https://example.test/faq");
  });

  it("uses the forwarded URL for canonical paths", () => {
    expect(currentCleanPath("/it/faq")).toBe("/faq");
    expect(
      localizedCanonicalPath(
        "/faq",
        "https://stefano-lunardi-d960960gm-0f09.wix-site-host.com/es/faq?x=1",
        "es",
      ),
    ).toBe("/es/faq");
    expect(localizedCanonicalPath("/it/faq", null, "it")).toBe("/it/faq");
  });
});

describe("request locale", () => {
  it("reads the multilingual cookie and resolves by url", () => {
    const headers = new Headers({ cookie: "foo=1; wixLanguage=de; bar=2" });
    expect(cookieValue(headers, "wixLanguage")).toBe("de");
    expect(resolveLocale("/portfolio", headers)).toBe("de");
    expect(resolveLocale("/en/portfolio", headers, null)).toBe("en");
    // The middleware strips the locale prefix and re-resolves through the essentials host
    // language: an unprefixed clean URL resolves by host first, then cookie, then default.
    expect(resolveLocale("/portfolio", undefined, "es")).toBe("es");
    expect(resolveLocale("/portfolio", undefined)).toBe("it");
  });
});

describe("published content", () => {
  it("builds the SITE filter with one condition per field", () => {
    expect(
      publishedContentFilter({
        entityType: "SiteChrome",
        entityId: "SINGLE_ITEM_ID",
        locale: "es",
      }),
    ).toEqual({
      "schemaKey.appId": { $eq: TRANSLATION_SITE_APP_ID },
      "schemaKey.entityType": { $eq: "SiteChrome" },
      "schemaKey.scope": { $eq: "SITE" },
      entityId: { $eq: "SINGLE_ITEM_ID" },
      locale: { $eq: "es" },
    });
  });

  it("maps direct and nested published field values", () => {
    const map = publishedContentMap([
      {
        fields: [
          { schemaFieldKey: "navVideo", textValue: "Vídeo", sequenceIds: [] },
          { schemaFieldKey: "title", value: { textValue: "Título" }, sequenceIds: [] },
          { schemaFieldKey: "image", value: { image: { id: "img" } }, sequenceIds: [] },
          { schemaFieldKey: "empty", sequenceIds: [] },
        ],
      },
    ]);
    expect(map.navVideo).toBe("Vídeo");
    expect(map.title).toBe("Título");
    expect(map.image).toEqual({ id: "img" });
    expect(map.empty).toBeUndefined();
    expect(toTranslationMap(undefined)).toEqual({});
  });

  it("collects repeated fields by sequence id", () => {
    const map = publishedContentMap([
      {
        fields: [
          { schemaFieldKey: "details()-label", textValue: "Estilo", sequenceIds: ["2"] },
          { schemaFieldKey: "details()-text", textValue: "Hotel Excelsior, Venecia", sequenceIds: ["1"] },
          { schemaFieldKey: "details()-label", textValue: "Ubicación", sequenceIds: ["1"] },
          { schemaFieldKey: "details()-text", textValue: "Fine Art", sequenceIds: ["2"] },
        ],
      },
    ]);
    expect(map["details()-label"]).toEqual(["Ubicación", "Estilo"]);
    expect(map["details()-text"]).toEqual(["Hotel Excelsior, Venecia", "Fine Art"]);
  });

  it("keys deeply nested repeats by their sequence chain", () => {
    const map = publishedContentMap([
      {
        fields: [
          { schemaFieldKey: "formFields()-options()-label", textValue: "Alemania", sequenceIds: ["5", "72"] },
          { schemaFieldKey: "formFields()-options()-label", textValue: "Italia", sequenceIds: ["5", "139"] },
        ],
      },
    ]);
    expect(map["formFields()-options()-label#5|72"]).toBe("Alemania");
    expect(map["formFields()-options()-label#5|139"]).toBe("Italia");
  });

  it("overlays only translated fields", () => {
    expect(overlayTranslation({ title: "Titolo", image: "base" }, { title: "Title" })).toEqual({
      title: "Title",
      image: "base",
    });
    expect(overlayTranslation({ title: "Titolo" }, null)).toEqual({ title: "Titolo" });
  });

  it("batches published contents by entityId", () => {
    const map = publishedContentMapAll([
      { entityId: "a", locale: "es", fields: [{ schemaFieldKey: "title", textValue: "Título A" }] },
      { entityId: "b", locale: "es", fields: [{ schemaFieldKey: "title", textValue: "Título B" }] },
      { entityId: "c", locale: "es", fields: [{ schemaFieldKey: "empty" }] },
      { fields: [{ schemaFieldKey: "title", textValue: "Sin id" }] },
    ]);
    expect(map.get("a")).toEqual({ title: "Título A" });
    expect(map.get("b")).toEqual({ title: "Título B" });
    expect(map.get("c")).toEqual({});
    expect(map.size).toBe(3);
    expect(publishedContentMapAll(undefined).size).toBe(0);
  });
});
