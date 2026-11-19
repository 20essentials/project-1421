export interface ArtParallaxElement extends HTMLElement {
  dataset: HTMLElement["dataset"] & {
    slides?: string;
    interval?: string;
  };
}
