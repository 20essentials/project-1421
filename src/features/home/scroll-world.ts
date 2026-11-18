/**
 * Scroll-world para la homepage, portado del mobile reveal de scroll-world
 * (project-1415): escenas de 100vh apiladas en sticky; la escena entrante sube
 * tapando a la anterior con un wipe `inset()` controlado por el progreso de
 * scroll, la saliente hace un drift de parallax y el copy hace dwell (fade in
 * a mitad de segmento, out antes del siguiente wipe).
 *
 * Sin JS o con `prefers-reduced-motion: reduce`, el root queda como viene del
 * SSR (escenas apiladas en flujo, una debajo de la otra, cada una 100dvh).
 * Con JS activo marca data-ready y el CSS las vuelve sticky/absolutas.
 */

const SCROLL_PER_SCENE = 1.6; // vh de scroll por escena (wipe + dwell del copy)
const TAU = 0.4; // mitad del ancho del wipe, en vh (como el original)

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x: number) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};

interface Scene {
  el: HTMLElement;
  imgs: HTMLElement[];
  copy: HTMLElement | null;
  start: number;
  end: number;
}

export function mountScrollWorld() {
  const root = document.querySelector<HTMLElement>("[data-scroll-world]");
  if (!root) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const scenes: Scene[] = Array.from(root.querySelectorAll<HTMLElement>(".sw-scene")).map((el) => ({
    el,
    imgs: Array.from(el.querySelectorAll<HTMLElement>(".sw-still img")),
    copy: el.querySelector<HTMLElement>(".sw-copy"),
    start: 0,
    end: 0,
  }));
  const n = scenes.length;
  if (n < 2) return;

  root.dataset.ready = "";

  let vh = window.innerHeight;
  let laidOutW = window.innerWidth;

  const layout = () => {
    vh = window.innerHeight;
    laidOutW = window.innerWidth;
    // La altura del track en px (no vh): los segmentos quedan anclados aunque
    // la barra de URL mobile cambie el 100vh del CSS.
    root.style.height = `${Math.round(n * SCROLL_PER_SCENE * vh)}px`;
    const seg = SCROLL_PER_SCENE * vh;
    const trackTop = root.getBoundingClientRect().top + window.scrollY;
    scenes.forEach((s, i) => {
      s.start = trackTop + i * seg;
      s.end = s.start + seg;
    });
  };

  let ticking = false;

  const read = () => {
    ticking = false;
    const y = window.scrollY;
    const t = Math.min(TAU * vh, (scenes[0].end - scenes[0].start) * 0.5);

    const reveal = (i: number) =>
      i === 0 ? 1 : smooth(clamp((y - (scenes[i].start - t)) / (2 * t)));

    // El drift de una escena la maneja el reveal de la siguiente.
    const nextReveal: number[] = new Array(n).fill(0);
    for (let i = n - 2; i >= 0; i--) nextReveal[i] = reveal(i + 1);

    for (let i = 0; i < n; i++) {
      const s = scenes[i];
      const r = reveal(i);
      s.el.style.zIndex = String(i + 1);
      s.el.style.clipPath = r >= 0.999 ? "none" : `inset(${((1 - r) * 100).toFixed(2)}% 0 0 0)`;

      const local = clamp((y - s.start) / (s.end - s.start), 0, 1);
      if (s.imgs.length) {
        const drift = nextReveal[i] * 5;
        const sc = 1.12 + local * 0.05;
        const transform = `translateY(${drift.toFixed(2)}%) scale(${sc.toFixed(3)})`;
        for (const img of s.imgs) img.style.transform = transform;
      }

      let cop: number;
      if (i === 0)
        cop = y > s.end ? 0 : smooth(1 - local / 0.62); // saluda al aterrizar
      else if (i === n - 1)
        cop = y < s.start ? 0 : smooth(local / 0.4); // sostiene el CTA al final
      else cop = smooth(1 - Math.abs(local - 0.5) / 0.5);
      if (s.copy) {
        s.copy.style.opacity = cop.toFixed(3);
        s.copy.style.pointerEvents = cop > 0.5 ? "auto" : "none";
        s.copy.toggleAttribute("inert", cop < 0.1);
      }
    }
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(read);
    }
  };

  // Los browsers mobile disparan `resize` al deslizar la barra de URL; rehacer
  // el layout ahi moveria el scroll. Solo re-layout cuando cambia el ancho
  // (rotacion incluida); para cambios de altura alcanza re-leer.
  window.addEventListener("resize", () => {
    if (window.innerWidth !== laidOutW) layout();
    onScroll();
  });
  window.addEventListener("orientationchange", () => layout());
  window.addEventListener("scroll", onScroll, { passive: true });

  layout();
  read();
}
