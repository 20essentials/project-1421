import gsap from "gsap";
import { clipInsetFor, type Rect } from "./photo-grid-zoom-core";
import {
  videoFlipGeometry,
  type VideoFlipGeometry,
} from "./video-lightbox-zoom-core";

const OPEN = { zoom: 0.8, clip: 0.85, dim: 0.45, stagger: 0.35 };
const CLOSE = { zoom: 0.55, clip: 0.45, dim: 0.35, stagger: 0.25 };
const NO_CLIP = "inset(0px 0px 0px 0px)";

interface LightboxParts {
  dialog: HTMLDialogElement;
  video: HTMLVideoElement;
  title: HTMLElement;
  close: HTMLButtonElement;
}

type Phase = "idle" | "opening" | "open" | "closing";

const rectOf = (element: Element): Rect => {
  const rect = element.getBoundingClientRect();
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
};

function readLightbox(): LightboxParts | null {
  const dialog = document.querySelector<HTMLDialogElement>("[data-video-lightbox]");
  const video = dialog?.querySelector<HTMLVideoElement>("[data-video-lightbox-video]");
  const title = dialog?.querySelector<HTMLElement>("[data-video-lightbox-title]");
  const close = dialog?.querySelector<HTMLButtonElement>("[data-video-close]");
  return dialog && video && title && close ? { dialog, video, title, close } : null;
}

export function mountVideoLightbox(): void {
  const section = document.querySelector<HTMLElement>("#video-in-evidenza");
  if (!section || section.dataset.videoLightboxReady) return;
  section.dataset.videoLightboxReady = "";

  const parts = readLightbox();
  const triggers = Array.from(section.querySelectorAll<HTMLButtonElement>("[data-video-open]"));
  const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-video-card]"));
  if (!parts || triggers.length === 0) return;

  const { dialog, video, title, close } = parts;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    phase: "idle" as Phase,
    trigger: null as HTMLButtonElement | null,
    timeline: null as gsap.core.Timeline | null,
    geometry: null as VideoFlipGeometry | null,
    onResize: null as (() => void) | null,
    raf: 0,
  };

  function posterOf(trigger: HTMLButtonElement): HTMLImageElement | null {
    return trigger.closest<HTMLElement>("[data-video-card]")?.querySelector<HTMLImageElement>("[data-video-poster]") ?? null;
  }

  function geometryFor(poster: HTMLImageElement): VideoFlipGeometry {
    const width = Number(poster.getAttribute("width")) || 1920;
    const height = Number(poster.getAttribute("height")) || 1080;
    return videoFlipGeometry(
      rectOf(poster),
      { width, height },
      { width: window.innerWidth, height: window.innerHeight },
    );
  }

  function clipFor(geometry: VideoFlipGeometry, poster: HTMLImageElement): string {
    return clipInsetFor(geometry.target, geometry.flip, rectOf(poster)) || NO_CLIP;
  }

  function place(geometry: VideoFlipGeometry, poster: HTMLImageElement): void {
    gsap.set(video, {
      left: geometry.target.left,
      top: geometry.target.top,
      width: geometry.target.width,
      height: geometry.target.height,
      x: geometry.flip.x,
      y: geometry.flip.y,
      scaleX: geometry.flip.scaleX,
      scaleY: geometry.flip.scaleY,
      transformOrigin: "0 0",
      clipPath: clipFor(geometry, poster),
    });
  }

  function play(): void {
    void video.play().catch(() => {});
  }

  function relayout(): void {
    if (state.phase !== "open" || !state.trigger) return;
    const poster = posterOf(state.trigger);
    if (!poster) return;
    const geometry = geometryFor(poster);
    state.geometry = geometry;
    gsap.set(video, {
      left: geometry.target.left,
      top: geometry.target.top,
      width: geometry.target.width,
      height: geometry.target.height,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      transformOrigin: "0 0",
      clipPath: NO_CLIP,
    });
  }

  function stopWatching(): void {
    if (state.onResize) window.removeEventListener("resize", state.onResize);
    state.onResize = null;
    cancelAnimationFrame(state.raf);
    state.raf = 0;
  }

  function watchResize(): void {
    stopWatching();
    state.onResize = () => {
      cancelAnimationFrame(state.raf);
      state.raf = requestAnimationFrame(relayout);
    };
    window.addEventListener("resize", state.onResize);
  }

  function open(trigger: HTMLButtonElement): void {
    if (state.phase !== "idle") return;
    const poster = posterOf(trigger);
    const card = trigger.closest<HTMLElement>("[data-video-card]");
    if (!poster || !card) return;

    state.phase = "opening";
    state.trigger = trigger;
    video.src = trigger.dataset.videoSrc ?? "";
    video.poster = trigger.dataset.posterSrc ?? "";
    video.currentTime = 0;
    video.controls = false;
    title.textContent = trigger.dataset.videoCaption ?? "";
    dialog.showModal();

    const geometry = geometryFor(poster);
    state.geometry = geometry;
    place(geometry, poster);
    dialog.setAttribute("data-flip-ready", "");
    gsap.set(title, { opacity: 0 });

    if (reduced.matches) {
      gsap.set(video, {
        left: geometry.target.left,
        top: geometry.target.top,
        width: geometry.target.width,
        height: geometry.target.height,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        transformOrigin: "0 0",
        clipPath: NO_CLIP,
      });
      gsap.set(title, { opacity: 1 });
      gsap.set(
        cards.filter((candidate) => candidate !== card),
        { opacity: 0.16 },
      );
      video.controls = true;
      state.phase = "open";
      play();
      watchResize();
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        if (state.phase !== "opening") return;
        state.phase = "open";
        video.controls = true;
        play();
      },
    });
    state.timeline = timeline;
    timeline
      .to(video, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: OPEN.zoom, ease: "power3.out" }, 0)
      .to(video, { clipPath: NO_CLIP, duration: OPEN.clip, ease: "power2.inOut" }, 0)
      .to(
        cards.filter((candidate) => candidate !== card),
        {
          opacity: 1,
          duration: OPEN.dim,
          ease: "power2.out",
          stagger: { amount: OPEN.stagger, from: cards.indexOf(card) },
        },
        0,
      )
      .to(title, { opacity: 1, duration: 0.25, ease: "power2.out" }, 0.35);
    watchResize();
  }

  function finishClose(): void {
    state.timeline?.kill();
    stopWatching();
    video.pause();
    video.controls = false;
    gsap.set(video, {
      clearProps: "left,top,width,height,x,y,scaleX,scaleY,transformOrigin,clipPath",
    });
    gsap.set(cards, { clearProps: "opacity" });
    gsap.set(title, { clearProps: "opacity" });
    title.textContent = "";
    dialog.removeAttribute("data-flip-ready");
    state.phase = "idle";
    state.trigger = null;
    state.timeline = null;
    state.geometry = null;
  }

  function closeAnimated(): void {
    if (state.phase !== "open" && state.phase !== "opening") return;
    state.timeline?.kill();
    stopWatching();
    const geometry = state.geometry;
    const poster = state.trigger ? posterOf(state.trigger) : null;
    if (reduced.matches || !geometry || !poster) {
      dialog.close();
      return;
    }

    state.phase = "closing";
    video.controls = false;
    video.pause();
    const timeline = gsap.timeline({ onComplete: () => dialog.close() });
    state.timeline = timeline;
    timeline
      .to(
        video,
        {
          x: geometry.flip.x,
          y: geometry.flip.y,
          scaleX: geometry.flip.scaleX,
          scaleY: geometry.flip.scaleY,
          duration: CLOSE.zoom,
          ease: "power3.inOut",
        },
        0,
      )
      .to(video, { clipPath: clipFor(geometry, poster), duration: CLOSE.clip, ease: "power2.inOut" }, 0)
      .to(cards, { opacity: 1, duration: CLOSE.dim, ease: "power2.out" }, 0)
      .to(title, { opacity: 0, duration: 0.2 }, 0);
  }

  for (const trigger of triggers) {
    trigger.addEventListener("click", () => open(trigger));
  }

  close.addEventListener("click", closeAnimated);
  dialog.addEventListener("cancel", (event) => {
    if (state.phase !== "open" && state.phase !== "opening") return;
    event.preventDefault();
    closeAnimated();
  });
  dialog.addEventListener("close", finishClose);
}
