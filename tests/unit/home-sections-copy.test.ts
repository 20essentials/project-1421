import { describe, expect, it } from "vitest";
import { LOCALES } from "@/features/i18n/locale";
import { HOME_SECTIONS_COPY, localizedGridTitle } from "@/features/home/home-sections-copy";

describe("HOME_SECTIONS_COPY", () => {
  it("covers every locale with the same section shape as Italian", () => {
    const base = HOME_SECTIONS_COPY.it;
    for (const locale of LOCALES) {
      const copy = HOME_SECTIONS_COPY[locale];
      expect(copy.method.steps).toHaveLength(base.method.steps.length);
      expect(copy.percorso.title).toHaveLength(base.percorso.title.length);
      expect(copy.percorso.steps).toHaveLength(base.percorso.steps.length);
      expect(copy.delivery.steps).toHaveLength(base.delivery.steps.length);
      expect(copy.stats.items).toHaveLength(base.stats.items.length);
      expect(copy.reviews.eyebrow).not.toBe("");
      expect(copy.reviews.title).not.toBe("");
      expect(copy.reviews.intro).not.toBe("");
      expect(copy.reviews.cta).not.toBe("");
    }
  });

  it("leaves no Italian section copy in the translated locales", () => {
    const base = HOME_SECTIONS_COPY.it;
    const italianPhrases = [
      base.gridTitle,
      base.method.eyebrow,
      base.method.title,
      base.method.lead,
      base.method.cta,
      base.percorso.eyebrow,
      base.percorso.intro,
      base.delivery.eyebrow,
      base.delivery.title,
      base.stats.ariaLabel,
      base.reviews.eyebrow,
      base.reviews.title,
      base.reviews.intro,
      base.reviews.cta,
      base.reviews.newlyweds,
      base.video.title,
    ];
    for (const locale of ["es", "en", "de"] as const) {
      const serialized = JSON.stringify(HOME_SECTIONS_COPY[locale]);
      for (const phrase of italianPhrases) expect(serialized).not.toContain(phrase);
    }
  });

  it("gives every percorso title line visible text", () => {
    for (const locale of LOCALES) {
      for (const line of HOME_SECTIONS_COPY[locale].percorso.title) {
        expect(line.before + line.em + line.after).not.toBe("");
      }
    }
  });
});

describe("localizedGridTitle", () => {
  it("uses the CMS title for Italian", () => {
    expect(localizedGridTitle("it", "Titolo dal CMS")).toBe("Titolo dal CMS");
  });

  it("translates the untranslated Italian CMS source", () => {
    expect(localizedGridTitle("es", HOME_SECTIONS_COPY.it.gridTitle)).toBe(HOME_SECTIONS_COPY.es.gridTitle);
  });

  it("keeps a translation the owner added in the CMS", () => {
    expect(localizedGridTitle("en", "A custom CMS title")).toBe("A custom CMS title");
  });

  it("falls back to the dictionary when the CMS field is empty", () => {
    expect(localizedGridTitle("de", "")).toBe(HOME_SECTIONS_COPY.de.gridTitle);
  });
});
