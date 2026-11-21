import { describe, expect, it } from "vitest";
import {
  COMBOBOX_MIN_CHOICES,
  countryCodeFor,
  filterChoices,
  flagEmoji,
  flagUrl,
  normalizeForSearch,
} from "@/features/forms/choice-combobox-core";
import { COUNTRY_CODES_BY_NAME } from "@/features/forms/country-flags.generated";
import type { FormChoice } from "@/features/forms/types";

const c = (label: string): FormChoice => ({ value: label, label });

describe("normalizeForSearch", () => {
  it("lowercases, strips accents and collapses whitespace", () => {
    expect(normalizeForSearch("Perù")).toBe("peru");
    expect(normalizeForSearch("  Costa   d’Avorio ")).toBe("costa d avorio");
    expect(normalizeForSearch("Saint-Barthélemy")).toBe("saint-barthelemy");
  });
});

describe("filterChoices", () => {
  const choices = ["Italia", "Austria", "Perù", "Costa Rica", "Costa d’Avorio", "Altra destination"].map(c);

  it("returns the list untouched for an empty query", () => {
    expect(filterChoices(choices, "")).toEqual(choices);
    expect(filterChoices(choices, "   ")).toEqual(choices);
  });

  it("matches a substring of the label, accents-insensitive", () => {
    expect(filterChoices(choices, "peru").map((x) => x.label)).toEqual(["Perù"]);
    expect(filterChoices(choices, "costa").map((x) => x.label)).toEqual(["Costa Rica", "Costa d’Avorio"]);
  });

  it("requires every word of the query", () => {
    expect(filterChoices(choices, "costa rica").map((x) => x.label)).toEqual(["Costa Rica"]);
    expect(filterChoices(choices, "costa avorio").map((x) => x.label)).toEqual(["Costa d’Avorio"]);
  });

  it("matches the value too, not only the label", () => {
    expect(filterChoices([{ value: "VA", label: "Vaticano" }], "va").map((x) => x.label)).toEqual(["Vaticano"]);
  });

  it("finds nothing for a query no option holds", () => {
    expect(filterChoices(choices, "atlantide")).toEqual([]);
  });
});

describe("COMBOBOX_MIN_CHOICES", () => {
  it("keeps a short list a native select", () => {
    expect(COMBOBOX_MIN_CHOICES).toBe(20);
  });
});

describe("country flags", () => {
  it("maps the exact values the form stores", () => {
    expect(countryCodeFor("Italia")).toBe("IT");
    expect(countryCodeFor("Austria")).toBe("AT");
    expect(countryCodeFor("Stati Uniti")).toBe("US");
    expect(countryCodeFor("Altra destination")).toBe("");
  });

  it("builds the flag emoji and twemoji URL from the ISO code", () => {
    expect(flagEmoji("IT")).toBe("🇮🇹");
    expect(flagUrl("IT")).toBe("https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f1ee-1f1f9.svg");
    expect(flagUrl("it")).toBe("https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f1ee-1f1f9.svg");
    expect(flagUrl("")).toBe("");
    expect(flagUrl("ITA")).toBe("");
  });

  it("holds one entry per stored option and no duplicate codes for the same name", () => {
    const names = Object.keys(COUNTRY_CODES_BY_NAME);
    expect(names.length).toBe(246);
    expect(new Set(names).size).toBe(names.length);
  });
});
