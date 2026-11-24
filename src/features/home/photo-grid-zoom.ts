/**
 * Lightbox FLIP zoom compartido por la grid de fotos de la homepage y por las
 * galerías de las colecciones de portfolio.
 *
 * Click en un tile: la imagen despega EXACTAMENTE de su encuadre en el tile,
 * crece hasta un marco centrado respetando su aspecto natural y, mientras crece,
 * un `clip-path: inset()` animado abre la foto completa. En el masonry el tile
 * ya muestra la foto completa, así que el clip arranca abierto; en una grid con
 * `object-fit: cover` cura el recorte original. Detrás, la grid se atenúa en
 * cascada desde el tile pulsado y el resto de la página cae bajo un velo.
 * Click en cualquier parte, Escape o el botón de cierre devuelven la imagen a
 * su tile por el mismo camino.
 *
 * Idea tomada de 20essentials/project-1108 (GSAP Flip sobre una capa fija);
 * reescrita: la geometría cover→contain es matemática propia y pura
 * (photo-grid-zoom-core.ts, con tests), el estado es una mini máquina con
 * guardas, y hay teclado, foco, aria, scroll lock (Lenis) y reduced motion —
 * nada del listener global ni del `sleep(250)` del original.
 *
 * Sin JS: la grid queda como viene del SSR y los tiles son <button> inertes
 * (el aria-label los anuncia; sin JS no abren el lightbox).
 */

import gsap from "gsap";
import { setScrollLocked } from "@/shared/smooth-scroll";
import {
  clipInsetFor,
  containRect,
  coverContentRect,
  flipTransform,
  type Rect,
} from "./photo-grid-zoom-core";

const OPEN = { zoom: 0.8, clip: 0.85, backdrop: 0.45, dim: 0.55, stagger: 0.4 };
const CLOSE = { zoom: 0.55, clip: 0.45, backdrop: 0.3, dim: 0.4, stagger: 0.25 };
const BACKDROP = "rgba(6,6,8,0.94)";
const DIMMED = 0.16;
const NO_CLIP = "inset(0px 0px 0px 0px)";

/** Selectores de la grid y sus tiles; el lightbox es el mismo en toda la página. */
export interface PhotoZoomTargets {
  grid: string;
  tile: string;
  lightbox?: string;
}

interface Lightbox {
  root: HTMLElement;
  img: HTMLImageElement;
  close: HTMLButtonElement;
}

type Phase = "idle" | "opening" | "open" | "closing";

interface FlipState {
  content: Rect;
  target: Rect;
  flip: ReturnType<typeof flipTransform>;
}

const rectOf = (el: Element): Rect => {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};

/** Sin recorte devolvemos un inset explícito: GSAP interpola mejor de valor a valor. */
const clipFor = (flipState: FlipState, tileImg: HTMLImageElement): string =>
  clipInsetFor(flipState.target, flipState.flip, rectOf(tileImg)) || NO_CLIP;

/** Natural size of the tile's image, decoding it first so the lightbox never opens half-drawn. */
async function naturalSize(img: HTMLImageElement): Promise<{ width: number; height: number }> {
  if (img.decode) {
    try {
      await img.decode();
    } catch {
      // decode() rejects on some formats/race cases; the listener below still resolves.
    }
  }
  if (img.naturalWidth > 0 && img.naturalHeight > 0) {
    return { width: img.naturalWidth, height: img.naturalHeight };
  }
  await new Promise<void>((resolve) => {
    img.addEventListener("load", () => resolve(), { once: true });
  });
  return { width: img.naturalWidth, height: img.naturalHeight };
}

export function mountPhotoZoom(targets: PhotoZoomTargets): void {
  const grid = document.querySelector<HTMLElement>(targets.grid);
  if (!grid || grid.dataset.zoomReady) return;
  grid.dataset.zoomReady = "";

  const tiles = Array.from(grid.querySelectorAll<HTMLButtonElement>(targets.tile));
  const lightbox = readLightbox(targets.lightbox ?? ".pg-lightbox");
  if (tiles.length === 0 || !lightbox) return;
  const { root, img, close: closeBtn } = lightbox;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    phase: "idle" as Phase,
    trigger: null as HTMLButtonElement | null,
    openTimeline: null as gsap.core.Timeline | null,
    onKey: null as ((event: KeyboardEvent) => void) | null,
    onResize: null as (() => void) | null,
    lastRect: null as FlipState | null,
  };

  /** Lays the lightbox image out at `state`'s target rect with the FLIP start transform + crop clip. */
  function place(flipState: FlipState, tileImg: HTMLImageElement): void {
    state.lastRect = flipState;
    gsap.set(img, {
      left: flipState.target.left,
      top: flipState.target.top,
      width: flipState.target.width,
      height: flipState.target.height,
      x: flipState.flip.x,
      y: flipState.flip.y,
      scaleX: flipState.flip.scaleX,
      scaleY: flipState.flip.scaleY,
      transformOrigin: "0 0",
      clipPath: clipFor(flipState, tileImg),
    });
  }

  async function open(trigger: HTMLButtonElement): Promise<void> {
    if (state.phase !== "idle") return;
    const tileImg = trigger.querySelector("img");
    if (!tileImg) return;
    state.phase = "opening";
    state.trigger = trigger;
    setScrollLocked(true);

    const natural = await naturalSize(tileImg);
    // El click pudo resolverse (o cancelarse) mientras esperábamos el decode.
    if (state.phase !== "opening" || state.trigger !== trigger) return;

    const flipState: FlipState = {
      content: coverContentRect(rectOf(tileImg), natural.width, natural.height),
      target: containRect(window.innerWidth, window.innerHeight, natural.width, natural.height),
      flip: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
    };
    flipState.flip = flipTransform(flipState.content, flipState.target);

    img.src = tileImg.currentSrc || tileImg.src;
    img.alt = tileImg.alt;
    root.setAttribute("aria-label", tileImg.alt);
    root.hidden = false;
    closeBtn.focus();

    if (reducedMotion.matches) {
      gsap.set(root, { backgroundColor: BACKDROP });
      gsap.set(img, {
        left: flipState.target.left,
        top: flipState.target.top,
        width: flipState.target.width,
        height: flipState.target.height,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        clipPath: "inset(0px 0px 0px 0px)",
        transformOrigin: "0 0",
      });
      gsap.set(tiles, { opacity: DIMMED });
      state.phase = "open";
      watchGlobally();
      return;
    }

    place(flipState, tileImg);
    const tl = gsap.timeline({
      onComplete: () => {
        if (state.phase === "opening") state.phase = "open";
      },
    });
    state.openTimeline = tl;
    tl.set(root, { backgroundColor: "rgba(6,6,8,0)" }, 0)
      .to(root, { backgroundColor: BACKDROP, duration: OPEN.backdrop, ease: "power2.out" }, 0)
      .to(
        img,
        { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: OPEN.zoom, ease: "power3.out" },
        0,
      )
      .to(img, { clipPath: "inset(0px 0px 0px 0px)", duration: OPEN.clip, ease: "power2.inOut" }, 0)
      .to(
        tiles.filter((tile) => tile !== trigger),
        {
          opacity: DIMMED,
          duration: OPEN.dim,
          ease: "power2.out",
          stagger: { amount: OPEN.stagger, from: tiles.indexOf(trigger) },
        },
        0,
      )
      .fromTo(closeBtn, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.3);
    watchGlobally();
  }

  function close(): void {
    if (state.phase !== "open" && state.phase !== "opening") return;
    state.openTimeline?.kill();
    state.openTimeline = null;
    stopWatching();
    const flipState = state.lastRect;
    const tileImg = state.trigger?.querySelector("img");
    const trigger = state.trigger;

    if (reducedMotion.matches || !flipState || !tileImg || !trigger) {
      gsap.set(root, { clearProps: "backgroundColor" });
      gsap.set(tiles, { clearProps: "opacity" });
      root.hidden = true;
      setScrollLocked(false);
      trigger?.focus();
      state.phase = "idle";
      state.trigger = null;
      return;
    }

    state.phase = "closing";
    gsap
      .timeline({
        onComplete: () => {
          root.hidden = true;
          gsap.set(root, { clearProps: "backgroundColor" });
          setScrollLocked(false);
          trigger.focus();
          state.phase = "idle";
          state.trigger = null;
        },
      })
      .to(root, { backgroundColor: "rgba(6,6,8,0)", duration: CLOSE.backdrop, ease: "power2.in" }, 0)
      .to(
        img,
        {
          x: flipState.flip.x,
          y: flipState.flip.y,
          scaleX: flipState.flip.scaleX,
          scaleY: flipState.flip.scaleY,
          duration: CLOSE.zoom,
          ease: "power3.inOut",
        },
        0,
      )
      .to(
        img,
        { clipPath: clipFor(flipState, tileImg), duration: CLOSE.clip, ease: "power2.inOut" },
        0,
      )
      .to(tiles, { opacity: 1, duration: CLOSE.dim, ease: "power2.out", stagger: { amount: CLOSE.stagger, from: tiles.indexOf(trigger) } }, 0.05)
      .to(closeBtn, { opacity: 0, duration: 0.2 }, 0);
  }

  function relayout(): void {
    const triggerImg = state.trigger?.querySelector("img");
    if (state.phase !== "open" || !state.lastRect || !triggerImg) return;
    const natural = { width: triggerImg.naturalWidth, height: triggerImg.naturalHeight };
    const next: FlipState = {
      content: coverContentRect(rectOf(triggerImg), natural.width, natural.height),
      target: containRect(window.innerWidth, window.innerHeight, natural.width, natural.height),
      flip: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
    };
    next.flip = flipTransform(next.content, next.target);
    state.lastRect = next;
    gsap.to(img, {
      left: next.target.left,
      top: next.target.top,
      width: next.target.width,
      height: next.target.height,
      x: next.flip.x,
      y: next.flip.y,
      scaleX: next.flip.scaleX,
      scaleY: next.flip.scaleY,
      clipPath: clipFor(next, triggerImg),
      duration: 0.3,
      ease: "power2.out",
    });
  }

  function watchGlobally(): void {
    state.onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "Tab" && root.contains(document.activeElement)) {
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", state.onKey);
    let raf = 0;
    state.onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(relayout);
    };
    window.addEventListener("resize", state.onResize);
  }

  function stopWatching(): void {
    if (state.onKey) document.removeEventListener("keydown", state.onKey);
    if (state.onResize) window.removeEventListener("resize", state.onResize);
    state.onKey = null;
    state.onResize = null;
  }

  for (const tile of tiles) {
    tile.addEventListener("click", () => void open(tile));
  }
  root.addEventListener("click", close);
  closeBtn.addEventListener("click", close);
}

/** Entrada que usa la homepage; las galerías llaman a `mountPhotoZoom` con sus selectores. */
export function mountPhotoGridZoom(): void {
  mountPhotoZoom({ grid: ".bento-grid", tile: ".bento-tile" });
}

function readLightbox(selector: string): Lightbox | null {
  const root = document.querySelector<HTMLElement>(selector);
  const img = root?.querySelector<HTMLImageElement>(".pg-lightbox__img");
  const close = root?.querySelector<HTMLButtonElement>(".pg-lightbox__close");
  return root && img && close ? { root, img, close } : null;
}
