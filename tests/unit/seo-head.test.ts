import { describe, expect, it } from "vitest";
import { shouldEmitSecondaryLocaleTitle } from "@/app/seo-head";

describe("shouldEmitSecondaryLocaleTitle", () => {
  it("emits a title only for secondary locales on static production pages", () => {
    expect(shouldEmitSecondaryLocaleTitle("es", false, false, true)).toBe(true);
    expect(shouldEmitSecondaryLocaleTitle("de", false, false, true)).toBe(true);
  });

  it("leaves the default locale title to the Wix dashboard", () => {
    expect(shouldEmitSecondaryLocaleTitle("it", false, false, true)).toBe(false);
  });

  it("keeps fallback, dashboard-managed and untitled pages untouched", () => {
    expect(shouldEmitSecondaryLocaleTitle("en", true, false, true)).toBe(false);
    expect(shouldEmitSecondaryLocaleTitle("en", false, true, true)).toBe(false);
    expect(shouldEmitSecondaryLocaleTitle("en", false, false, false)).toBe(false);
  });
});
