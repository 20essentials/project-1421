import { describe, expect, it, vi } from "vitest";
import { scrollToTarget, shouldEnableSmoothScroll } from "@/shared/smooth-scroll";

describe("shouldEnableSmoothScroll", () => {
  it("enables smooth scrolling when the visitor allows motion", () => {
    expect(shouldEnableSmoothScroll(false)).toBe(true);
  });

  it("keeps native scrolling for reduced-motion visitors", () => {
    expect(shouldEnableSmoothScroll(true)).toBe(false);
  });
});

describe("scrollToTarget", () => {
  it("falls back to the native scrollIntoView when Lenis is not mounted (SSR, tests)", () => {
    const target = { scrollIntoView: vi.fn() } as unknown as Element;
    scrollToTarget(target);
    expect(target.scrollIntoView).toHaveBeenCalledWith({ block: "start" });
  });
});

describe("onLenisReady", () => {
  it("runs registered setups once Lenis mounts and stops running them after unsubscribe", async () => {
    vi.resetModules();
    vi.stubGlobal("window", { matchMedia: () => ({ matches: false }) });
    vi.doMock("lenis", () => ({ default: class {} }));
    const mod = await import("@/shared/smooth-scroll");
    const setup = vi.fn();
    const off = mod.onLenisReady(setup);

    mod.mountSmoothScroll();
    await vi.waitFor(() => expect(setup).toHaveBeenCalledTimes(1));

    off();
    mod.mountSmoothScroll();
    expect(setup).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
    vi.doUnmock("lenis");
  });
});
