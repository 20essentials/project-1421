import { describe, expect, it } from "vitest";
import {
  SITE_INFO_FALLBACKS,
  formatAddress,
  toSiteInfo,
} from "@/features/site-info/site-info-core";

describe("formatAddress", () => {
  it("prefers the google formatted address", () => {
    expect(
      formatAddress({
        googleFormattedAddress: "Via Roma 1, 33100 Udine UD, Italia",
        street: "Roma",
        city: "Udine",
      }),
    ).toBe("Via Roma 1, 33100 Udine UD, Italia");
  });

  it("joins the present parts", () => {
    expect(formatAddress({ street: "Roma", streetNumber: "1", zip: "33100", city: "Udine" })).toBe(
      "Roma 1, 33100, Udine",
    );
  });

  it("skips missing parts", () => {
    expect(formatAddress({ city: "Villach", country: "AT" })).toBe("Villach, AT");
  });

  it("returns an empty string when nothing is set", () => {
    expect(formatAddress(null)).toBe("");
    expect(formatAddress({})).toBe("");
  });
});

describe("toSiteInfo", () => {
  it("maps the full properties response", () => {
    expect(
      toSiteInfo({
        businessName: "Studio Lunardi",
        siteDisplayName: "Stefano",
        email: "info@lunardi.example",
        phone: "+43 000",
        address: { googleFormattedAddress: "Piazza Grande 1, Udine" },
        description: "Fine art",
      }),
    ).toEqual({
      businessName: "Studio Lunardi",
      displayName: "Stefano",
      email: "info@lunardi.example",
      phone: "+43 000",
      address: "Piazza Grande 1, Udine",
      description: "Fine art",
    });
  });

  it("falls back per field for empty values", () => {
    expect(toSiteInfo({ businessName: "", email: " ", siteDisplayName: "" })).toEqual({
      ...SITE_INFO_FALLBACKS,
      businessName: SITE_INFO_FALLBACKS.businessName,
    });
  });

  it("falls back to the display name when the business name is missing", () => {
    expect(toSiteInfo({ siteDisplayName: "Lunardi Studio" }).businessName).toBe("Lunardi Studio");
  });

  it("returns every fallback for null/undefined properties", () => {
    expect(toSiteInfo(null)).toEqual(SITE_INFO_FALLBACKS);
    expect(toSiteInfo(undefined)).toEqual(SITE_INFO_FALLBACKS);
  });
});
