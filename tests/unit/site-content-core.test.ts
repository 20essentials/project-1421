import { describe, expect, it } from "vitest";
import { toHomeContent, toSitePageContent } from "@/features/site-content/site-content-core";

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
