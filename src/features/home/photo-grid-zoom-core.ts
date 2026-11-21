/**
 * Pure FLIP math for the homepage photo-grid lightbox: how an image laid out at
 * its final lightbox rect has to be transformed, translated, scaled and
 * clipped, so that its very first frame lands EXACTLY on the tile it was
 * clicked in — matching the tile's `object-fit: cover` crop pixel for pixel —
 * and then relaxes into the full, uncropped frame as it zooms.
 *
 * No DOM, no GSAP: everything here is a plain function over numbers, so the
 * geometry is unit-testable in isolation. The DOM/GSAP side lives in
 * photo-grid-zoom.ts.
 */

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Fractions of the viewport the lightbox image keeps free on each side. */
export const LIGHTBOX_MARGINS = { x: 0.055, y: 0.075 };

/**
 * The rect the FULL (uncropped) source image occupies when `object-fit: cover`
 * maps it into `box`: same scale as the cover fit, centered on the box, so it
 * extends past it on one axis. This is the rect the lightbox image must start
 * on for a seamless handoff from the tile.
 */
export function coverContentRect(box: Rect, naturalWidth: number, naturalHeight: number): Rect {
  const scale = Math.max(box.width / naturalWidth, box.height / naturalHeight);
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;
  return {
    left: box.left - (width - box.width) / 2,
    top: box.top - (height - box.height) / 2,
    width,
    height,
  };
}

/** The centered rect of the image's own aspect that fits inside the viewport minus the lightbox margins. */
export function containRect(
  viewportWidth: number,
  viewportHeight: number,
  naturalWidth: number,
  naturalHeight: number,
  marginX = LIGHTBOX_MARGINS.x,
  marginY = LIGHTBOX_MARGINS.y,
): Rect {
  const availableWidth = viewportWidth * (1 - marginX * 2);
  const availableHeight = viewportHeight * (1 - marginY * 2);
  const scale = Math.min(availableWidth / naturalWidth, availableHeight / naturalHeight);
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;
  return {
    left: (viewportWidth - width) / 2,
    top: (viewportHeight - height) / 2,
    width,
    height,
  };
}

/**
 * The transform — translate + scale from a top-left origin — an element laid
 * out at `to` needs to render exactly at `from` at its first frame. `flipTransform(from, to)` in,
 * animated to the identity transform, IS the FLIP.
 */
export function flipTransform(from: Rect, to: Rect): { x: number; y: number; scaleX: number; scaleY: number } {
  return {
    x: from.left - to.left,
    y: from.top - to.top,
    scaleX: to.width === 0 ? 1 : from.width / to.width,
    scaleY: to.height === 0 ? 1 : from.height / to.height,
  };
}

/**
 * A `clip-path: inset()` value — in the element's own coordinates, before the
 * transform — that clips an element laid out at `to` (then transformed by
 * `transform` so it renders at `flipTransform`'s source rect) down to the
 * visible part of `visible` on screen. "" when nothing needs clipping. It is
 * what makes the zoom start as the tile's cropped view instead of the whole
 * uncropped frame: as the clip relaxes to 0, the crop "heals" into the full
 * photograph.
 */
export function clipInsetFor(
  to: Rect,
  transform: { x: number; y: number; scaleX: number; scaleY: number },
  visible: Rect,
): string {
  // The element covers `to`; the transform (origin 0 0) maps its own point
  // (px, py) to screen (to.left + transform.x + px * scaleX, …). Invert that
  // to place `visible` back in element coordinates.
  const sx = transform.scaleX || 1;
  const sy = transform.scaleY || 1;
  const originX = to.left + transform.x;
  const originY = to.top + transform.y;
  const insetTop = (visible.top - originY) / sy;
  const insetLeft = (visible.left - originX) / sx;
  const insetBottom = (to.height - (visible.top + visible.height - originY) / sy);
  const insetRight = (to.width - (visible.left + visible.width - originX) / sx);
  const inset = { top: insetTop, right: insetRight, bottom: insetBottom, left: insetLeft };
  const pad = (value: number) => Math.max(0, Math.round(value * 100) / 100);
  if (inset.top <= 0 && inset.right <= 0 && inset.bottom <= 0 && inset.left <= 0) return "";
  return `inset(${pad(inset.top)}px ${pad(inset.right)}px ${pad(inset.bottom)}px ${pad(inset.left)}px)`;
}
