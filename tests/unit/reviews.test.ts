import { describe, expect, it } from "vitest";
import { formatReviewDate, getHomeReviews, REVIEWS } from "@/features/reviews/reviews";

describe("reviews", () => {
  it("keeps the full verified review set", () => {
    expect(REVIEWS).toHaveLength(10);
    expect(new Set(REVIEWS.map((review) => review.id)).size).toBe(10);
  });

  it("exposes short excerpts for the home preview", () => {
    const preview = getHomeReviews();
    expect(preview).toHaveLength(6);
    for (const review of preview) {
      expect(review.excerpt.length).toBeLessThan(review.text.length);
      expect(review.excerpt.length).toBeLessThanOrEqual(180);
    }
  });

  it("formats review dates in the requested locale", () => {
    expect(formatReviewDate("it", "13 settembre 2026")).toBe("13 settembre 2026");
    expect(formatReviewDate("en", "13 settembre 2026")).toBe("September 13, 2026");
    expect(formatReviewDate("es", "22 agosto 2026")).toBe("22 de agosto de 2026");
    expect(formatReviewDate("de", "22 agosto 2026")).toBe("22. August 2026");
  });

  it("keeps the original value for unparseable dates", () => {
    expect(formatReviewDate("en", "recently")).toBe("recently");
  });
});
