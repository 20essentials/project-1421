import { describe, expect, it } from "vitest";
import { toSitePageContent } from "@/features/site-content/site-content-core";

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
