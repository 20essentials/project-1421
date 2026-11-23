import { describe, expect, it } from "vitest";
import { toNavItems, toSiteChromeLabels } from "@/features/site-chrome/site-chrome-core";

describe("toSiteChromeLabels", () => {
  it("keeps Italian defaults for fields without a CMS value", () => {
    const labels = toSiteChromeLabels({ navFaq: "FAQ", _id: "SINGLE_ITEM_ID" });
    expect(labels.navFaq).toBe("FAQ");
    expect(labels.navMethod).toBe("Il metodo");
    expect(labels._id).toBeUndefined();
  });

  it("uses CMS values for known and additional string fields", () => {
    const labels = toSiteChromeLabels({ navFaq: "Preguntas", customLabel: "Extra" });
    expect(labels.navFaq).toBe("Preguntas");
    expect(labels.customLabel).toBe("Extra");
  });
});

describe("toNavItems", () => {
  it("localizes hrefs and resolves labels from the CMS", () => {
    const items = toNavItems(
      [
        { href: "/faq", labelKey: "navFaq" },
        { href: "/blog", labelKey: "navStories" },
      ],
      { navFaq: "FAQ", navStories: "Historias" },
      "es",
    );
    expect(items).toEqual([
      { href: "/es/faq", label: "FAQ" },
      { href: "/es/blog", label: "Historias" },
    ]);
  });
});
