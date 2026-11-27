import {
  containRect,
  coverContentRect,
  flipTransform,
  type Rect,
} from "./photo-grid-zoom-core";

export interface VideoSourceSize {
  width: number;
  height: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface VideoFlipGeometry {
  content: Rect;
  target: Rect;
  flip: ReturnType<typeof flipTransform>;
}

export function videoFlipGeometry(
  box: Rect,
  source: VideoSourceSize,
  viewport: ViewportSize,
): VideoFlipGeometry {
  const content = coverContentRect(box, source.width, source.height);
  const target = containRect(viewport.width, viewport.height, source.width, source.height);
  return { content, target, flip: flipTransform(content, target) };
}
