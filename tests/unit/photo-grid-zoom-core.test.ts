import { describe, expect, it } from "vitest";
import {
  clipInsetFor,
  containRect,
  coverContentRect,
  flipTransform,
  type Rect,
} from "@/features/home/photo-grid-zoom-core";

const rect = (left: number, top: number, width: number, height: number): Rect => ({ left, top, width, height });

describe("coverContentRect", () => {
  it("matches the box exactly when its aspect equals the image aspect", () => {
    const box = rect(100, 50, 400, 300);
    expect(coverContentRect(box, 800, 600)).toEqual(rect(100, 50, 400, 300));
  });

  it("extends past the box on the axis the cover crop hides", () => {
    // Box 2:3 (portrait tile), image 2:1 (landscape): cover scales by height.
    const box = rect(0, 0, 200, 300);
    const content = coverContentRect(box, 1000, 500);
    expect(content.height).toBe(300);
    expect(content.width).toBe(600); // 1000 * 0.6
    expect(content.top).toBe(0);
    expect(content.left).toBe(-200); // (600 - 200) / 2 past each side
  });

  it("centers the overflow on both axes", () => {
    const box = rect(10, 20, 300, 200);
    const content = coverContentRect(box, 600, 600);
    // scale = max(0.5, 200/600) → 600×600 at 0.5… box fits inside; both axes overflow? no: scale = max(300/600, 200/600)=0.5 → 300×300.
    expect(content.left).toBe(10);
    expect(content.top).toBe(20 - 50);
    expect(content.width).toBe(300);
    expect(content.height).toBe(300);
  });
});

describe("containRect", () => {
  it("fits the image inside the viewport with the default margins", () => {
    const target = containRect(1000, 800, 1000, 500);
    expect(target.width).toBeCloseTo(1000 * (1 - 0.055 * 2));
    expect(target.height).toBeCloseTo(target.width * 0.5);
    expect(target.left).toBeCloseTo((1000 - target.width) / 2);
    expect(target.top).toBeCloseTo((800 - target.height) / 2);
  });

  it("is limited by height when the image is wider than the viewport allows", () => {
    const target = containRect(1000, 400, 2000, 1000); // 2:1 image in a wide-short viewport
    expect(target.height).toBeCloseTo(400 * (1 - 0.075 * 2));
    expect(target.width).toBeCloseTo(target.height * 2);
  });

  it("never leaves the margins negative for tiny viewports", () => {
    const target = containRect(10, 10, 4000, 4000);
    expect(target.width).toBeGreaterThan(0);
    expect(target.height).toBeGreaterThan(0);
  });
});

describe("flipTransform", () => {
  it("maps an element laid out at `to` back onto `from`", () => {
    const flip = flipTransform(rect(0, 0, 200, 100), rect(500, 300, 400, 200));
    expect(flip.x).toBe(-500);
    expect(flip.y).toBe(-300);
    expect(flip.scaleX).toBe(0.5);
    expect(flip.scaleY).toBe(0.5);
  });

  it("keeps the identity when both rects are equal", () => {
    const flip = flipTransform(rect(10, 10, 100, 100), rect(10, 10, 100, 100));
    expect(flip.x).toBe(0);
    expect(flip.y).toBe(0);
    expect(flip.scaleX).toBe(1);
    expect(flip.scaleY).toBe(1);
  });
});

describe("clipInsetFor", () => {
  it("returns \"\" when the visible rect already covers the whole element", () => {
    const to = rect(0, 0, 400, 200);
    const flip = flipTransform(to, to);
    expect(clipInsetFor(to, flip, rect(-50, -50, 500, 300))).toBe("");
  });

  it("clips the element down to the on-screen visible rect", () => {
    // Element laid out at `to`, transformed to render at `content` (bigger, same aspect),
    // clipped to the tile rect.
    const content = rect(-200, 0, 600, 300);
    const target = rect(0, 0, 400, 200);
    const flip = flipTransform(content, target); // x:-200, y:0, scale 1.5
    const tile = rect(0, 0, 200, 300);
    const clip = clipInsetFor(target, flip, tile);
    // Element-local coordinates of the tile: left = (0 - (-200))/1.5 ≈ 133.33,
    // right edge = (200 - (-200))/1.5 ≈ 266.67 → right inset = 400 - 266.67 ≈ 133.33.
    // Vertical: the tile (0..300) covers the content (0..300) fully → 0 insets.
    expect(clip).toBe("inset(0px 133.33px 0px 133.33px)");
  });

  it("rounds to two decimals", () => {
    // The real open flow: a 1000×500 source, tile at (100,50) 200×300, lightbox target centered.
    const to = rect(55, 177.5, 890, 445); // containRect(1000, 800, 1000, 500)
    const flip = flipTransform(rect(-100, 50, 600, 300), to); // coverContentRect(tile, 1000, 500)
    const tile = rect(100, 50, 200, 300);
    const clip = clipInsetFor(to, flip, tile);
    // The tile crops the source horizontally only: no top/bottom insets.
    expect(clip).toBe("inset(0px 296.67px 0px 296.67px)");
  });
});
