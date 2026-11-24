import { describe, expect, it } from "vitest";
import { mergeGalleries } from "@/features/portfolio/portfolio-core";
import type { GalleryItem } from "@/features/portfolio/types";

const item = (id: string): GalleryItem => ({
  id,
  kind: "image",
  title: id,
  description: "",
  imageUrl: `https://example.test/${id}.jpg`,
  videoUrl: null,
  linkUrl: null,
  linkTarget: null,
});

describe("mergeGalleries", () => {
  it("keeps project order and drops duplicate media ids", () => {
    const result = mergeGalleries([[item("a"), item("b")], [item("b"), item("c")]]);
    expect(result.map((i) => i.id)).toEqual(["a", "b", "c"]);
  });

  it("returns an empty gallery when no project has media", () => {
    expect(mergeGalleries([])).toEqual([]);
    expect(mergeGalleries([[], []])).toEqual([]);
  });
});
