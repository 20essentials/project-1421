// Press feedback for every `.rounded-control` CTA: a currentColor circle grows
// from the pointer position and fades out, clipped by the control's own box.
// Mounted once from the site layout; no-ops under reduced motion.

const HOST_SELECTOR = ".rounded-control";

export function mountRipple() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.button !== 0 || !event.isPrimary) return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(HOST_SELECTOR) : null;
      if (!target || target.matches(":disabled, [aria-disabled='true']")) return;

      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const size = 2 * Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));

      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.setAttribute("aria-hidden", "true");
      ripple.style.setProperty("--ripple-x", `${x}px`);
      ripple.style.setProperty("--ripple-y", `${y}px`);
      ripple.style.setProperty("--ripple-size", `${size}px`);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
      target.append(ripple);
    },
    { passive: true },
  );
}
