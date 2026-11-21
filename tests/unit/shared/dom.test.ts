import { describe, expect, it, vi } from "vitest";
import { $, $$ } from "@/shared/dom";

describe("dom selectors", () => {
  it("returns the first match from a custom root", () => {
    const match = { tagName: "VIDEO" };
    const root = { querySelector: vi.fn(() => match) };

    expect($("video", root as unknown as ParentNode)).toBe(match);
    expect(root.querySelector).toHaveBeenCalledWith("video");
  });

  it("returns null when there is no match", () => {
    const root = { querySelector: vi.fn(() => null) };

    expect($("video", root as unknown as ParentNode)).toBeNull();
  });

  it("returns a real array of matches", () => {
    const matches = [{ id: 1 }, { id: 2 }];
    const root = { querySelectorAll: vi.fn(() => matches) };

    const result = $$<HTMLElement>("[data-item]", root as unknown as ParentNode);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual(matches);
    expect(root.querySelectorAll).toHaveBeenCalledWith("[data-item]");
  });
});
