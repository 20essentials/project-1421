import "lenis/dist/lenis.css";
import type Lenis from "lenis";

/**
 * Site-wide premium smooth scroll (Lenis).
 *
 * Mounted once from src/app/layout.astro; call sites that need to send the
 * visitor somewhere (menu links, FAQ deep links) go through scrollToTarget so
 * the glide runs through Lenis when it is active, falling back to the native
 * scrollIntoView everywhere else (SSR, tests, reduced-motion visitors).
 */
let lenis: Lenis | null = null;

/** Smooth scroll is an enhancement: visitors who ask for reduced motion keep native scrolling. */
export function shouldEnableSmoothScroll(prefersReducedMotion: boolean): boolean {
  return !prefersReducedMotion;
}

export function mountSmoothScroll(): void {
  if (lenis || typeof window === "undefined") return;
  if (!shouldEnableSmoothScroll(window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
  void import("lenis").then(({ default: Lenis }) => {
    if (lenis) return;
    lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });
  });
}

/**
 * Locks or unlocks page scroll while a modal overlay is open (lightbox,
 * fullscreen menus). Stops Lenis when it is running and pins the document,
 * falling back to the same CSS pin everywhere else (SSR, tests, reduced-motion
 * visitors, Lenis not mounted yet).
 */
export function setScrollLocked(locked: boolean): void {
  if (typeof document === "undefined") return;
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (locked) lenis?.stop();
  else lenis?.start();
}

export function scrollToTarget(target: Element, block: ScrollLogicalPosition = "start"): void {
  if (lenis && block === "start") {
    lenis.scrollTo(target as HTMLElement);
    return;
  }
  target.scrollIntoView({ block });
}
