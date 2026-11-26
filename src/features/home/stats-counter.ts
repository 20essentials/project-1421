import { countAt, formatCountStat, parseCountStat } from "./stats-counter-core";

const DURATION = 1400;
const STAGGER = 110;

function animate(el: HTMLElement, finalText: string): void {
  const stat = parseCountStat(finalText);
  if (!stat) return;

  const startedAt = performance.now();
  el.textContent = formatCountStat(stat, 0);

  const tick = (now: number): void => {
    const progress = (now - startedAt) / DURATION;
    if (progress >= 1) {
      el.textContent = finalText;
      return;
    }
    el.textContent = formatCountStat(stat, countAt(0, stat.target, progress));
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

export function mountStatsCounter(selector = "#numeri"): void {
  const section = document.querySelector<HTMLElement>(selector);
  if (!section || section.dataset.statsReady) return;
  section.dataset.statsReady = "";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  const values = Array.from(section.querySelectorAll<HTMLElement>(".stat__value"));
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      values.forEach((el, index) => {
        const finalText = el.textContent?.trim() ?? "";
        window.setTimeout(() => animate(el, finalText), index * STAGGER);
      });
    },
    { threshold: 0.35 },
  );

  observer.observe(section);
}
