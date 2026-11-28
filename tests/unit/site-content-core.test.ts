import { describe, expect, it } from "vitest";
import {
  HOME_GRID_ALT_FIELDS,
  HOME_GRID_IMAGE_FIELDS,
  toHomeContent,
  toHomeGridPhotos,
  toNotFoundContent,
  toSitePageContent,
} from "@/features/site-content/site-content-core";

const item = {
  eyebrow: "Occhiello",
  title: "Titolo",
  intro: "Intro",
  body: "<p>Corpo</p>",
  version: "Versione 1.0",
};

describe("toSitePageContent", () => {
  it("maps a Single Item collection item with clean field keys", () => {
    expect(toSitePageContent(item)).toEqual({
      eyebrow: "Occhiello",
      title: "Titolo",
      intro: "Intro",
      bodyHtml: "<p>Corpo</p>",
      version: "Versione 1.0",
    });
  });

  it("returns empty strings for fields the CMS has not filled", () => {
    expect(toSitePageContent({ title: "Solo titolo" })).toEqual({
      eyebrow: "",
      title: "Solo titolo",
      intro: "",
      bodyHtml: "",
      version: "",
    });
  });

  it("ignores fields that are not part of the schema", () => {
    expect(toSitePageContent({ title: "T", seoTitle: "legacy" })?.title).toBe("T");
    expect(toSitePageContent({ title: "T", seoTitle: "legacy" })?.bodyHtml).toBe("");
  });

  it("returns null when there is no item", () => {
    expect(toSitePageContent(null)).toBeNull();
    expect(toSitePageContent(undefined)).toBeNull();
  });
});

describe("toHomeContent", () => {
  it("maps the base fields plus every home section field", () => {
    const home = toHomeContent({
      eyebrow: "Hero",
      title: "Titolo hero",
      intro: "Descrizione hero",
      heroCta: "Contattami",
      slide2Title: "Slide 2",
      fvVideoUrl: "https://video.wixstatic.com/video/x/file",
      heroImage:
        "https://static.wixstatic.com/media/600582_x~mv2.avif/v1/fill/w_1200,h_675/600582_x~mv2.avif",
    });
    expect(home?.heroCta).toBe("Contattami");
    expect(home?.slide2Title).toBe("Slide 2");
    expect(home?.fvVideoUrl).toBe("https://video.wixstatic.com/video/x/file");
    expect(home?.heroImage).toContain("static.wixstatic.com");
    expect(home?.ctaButton).toBe("");
  });

  it("returns null when there is no item", () => {
    expect(toHomeContent(null)).toBeNull();
    expect(toHomeContent(undefined)).toBeNull();
  });
});

describe("toHomeGridPhotos", () => {
  it("keeps the portfolio at the intended 16 photos", () => {
    expect(HOME_GRID_IMAGE_FIELDS).toHaveLength(16);
    expect(HOME_GRID_ALT_FIELDS).toHaveLength(16);
  });

  it("pairs each CMS image with its editable alt and source dimensions", () => {
    const home = toHomeContent({
      gridImage01: "https://static.wixstatic.com/media/one.avif",
      gridAlt01: "Matrimonio autentico",
      gridImage02: "https://static.wixstatic.com/media/two.avif",
      gridAlt02: "Ritratto elegante",
    });
    expect(home && toHomeGridPhotos(home)).toEqual([
      {
        src: "https://static.wixstatic.com/media/one.avif",
        alt: "Matrimonio autentico",
        width: 1600,
        height: 1066,
      },
      {
        src: "https://static.wixstatic.com/media/two.avif",
        alt: "Ritratto elegante",
        width: 1066,
        height: 1600,
      },
    ]);
  });

  it("skips grid slots without a CMS image", () => {
    const home = toHomeContent({ gridAlt01: "Solo testo" });
    expect(home && toHomeGridPhotos(home)).toEqual([]);
  });
});

describe("toNotFoundContent", () => {
  it("maps the 404 background image from the NotFound collection", () => {
    expect(
      toNotFoundContent({
        eyebrow: "404",
        title: "Pagina non trovata",
        notFoundImage: "https://static.wixstatic.com/media/background.avif",
      }),
    ).toMatchObject({
      eyebrow: "404",
      title: "Pagina non trovata",
      notFoundImage: "https://static.wixstatic.com/media/background.avif",
    });
  });

  it("returns null when there is no item", () => {
    expect(toNotFoundContent(null)).toBeNull();
  });
});
