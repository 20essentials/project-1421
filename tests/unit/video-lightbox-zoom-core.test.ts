import { describe, expect, it } from "vitest";
import { videoFlipGeometry } from "../../src/features/home/video-lightbox-zoom-core";

describe("videoFlipGeometry", () => {
  it("centers the enlarged video in the viewport", () => {
    const geometry = videoFlipGeometry(
      { left: 100, top: 100, width: 400, height: 225 },
      { width: 1920, height: 1080 },
      { width: 1000, height: 800 },
    );

    expect(geometry.target.width / geometry.target.height).toBeCloseTo(1920 / 1080, 5);
    expect(geometry.target.left + geometry.target.width / 2).toBeCloseTo(500, 5);
    expect(geometry.target.top + geometry.target.height / 2).toBeCloseTo(400, 5);
    expect(geometry.target.width).toBeLessThanOrEqual(1000 * (1 - 0.055 * 2));
    expect(geometry.target.height).toBeLessThanOrEqual(800 * (1 - 0.075 * 2));
  });

  it("starts the enlarged video exactly on the card poster", () => {
    const box = { left: 100, top: 100, width: 400, height: 225 };
    const geometry = videoFlipGeometry(
      box,
      { width: 1920, height: 1080 },
      { width: 1000, height: 800 },
    );

    expect(geometry.content).toEqual(box);
    expect(geometry.target.left + geometry.flip.x).toBeCloseTo(box.left, 5);
    expect(geometry.target.top + geometry.flip.y).toBeCloseTo(box.top, 5);
    expect(geometry.target.width * geometry.flip.scaleX).toBeCloseTo(box.width, 5);
    expect(geometry.target.height * geometry.flip.scaleY).toBeCloseTo(box.height, 5);
  });

  it("uses the full source crop when the card is taller than the video", () => {
    const geometry = videoFlipGeometry(
      { left: 20, top: 40, width: 300, height: 300 },
      { width: 1920, height: 1080 },
      { width: 900, height: 700 },
    );

    expect(geometry.content.width).toBeGreaterThan(300);
    expect(geometry.content.height).toBeCloseTo(300, 5);
    expect(geometry.flip.scaleX).toBeCloseTo(geometry.flip.scaleY, 5);
  });
});
