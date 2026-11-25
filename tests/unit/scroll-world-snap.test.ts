import { describe, expect, it } from "vitest";
import { heroSnapEasing, heroSnapPoints, isHeroSnapActive } from "@/features/home/scroll-world";

describe("heroSnapEasing", () => {
  it("es suave, simétrica y monótona", () => {
    expect(heroSnapEasing(0)).toBeCloseTo(0);
    expect(heroSnapEasing(0.5)).toBeCloseTo(0.5);
    expect(heroSnapEasing(1)).toBeCloseTo(1);
    expect(heroSnapEasing(0.25)).toBeCloseTo(1 - heroSnapEasing(0.75));

    for (let t = 0; t < 1; t += 0.05) {
      expect(heroSnapEasing(t + 0.05)).toBeGreaterThanOrEqual(heroSnapEasing(t));
    }
  });
});

describe("heroSnapPoints", () => {
  it("devuelve los puntos de reposo del hero de tres escenas", () => {
    expect(heroSnapPoints(0, 1280, 3)).toEqual([0, 1920, 3200, 3840]);
  });

  it("usa el final real del root cuando el hero tiene una cola de viewport", () => {
    expect(heroSnapPoints(0, 1280, 3, 4640)).toEqual([0, 1920, 3200, 4640]);
  });

  it("respeta el offset del hero dentro de la página", () => {
    expect(heroSnapPoints(120, 800, 2, 2520)).toEqual([120, 1320, 2520]);
  });

  it("no genera puntos con una sola escena o segmentos inválidos", () => {
    expect(heroSnapPoints(0, 800, 1)).toEqual([]);
    expect(heroSnapPoints(0, 0, 3)).toEqual([]);
    expect(heroSnapPoints(0, -800, 3)).toEqual([]);
  });
});

describe("isHeroSnapActive", () => {
  it("está activo dentro del hero, incluidos sus bordes", () => {
    expect(isHeroSnapActive(0, 0, 4640)).toBe(true);
    expect(isHeroSnapActive(3200, 0, 4640)).toBe(true);
    expect(isHeroSnapActive(4640, 0, 4640)).toBe(true);
  });

  it("se desactiva al salir del hero", () => {
    expect(isHeroSnapActive(-2, 0, 4640)).toBe(false);
    expect(isHeroSnapActive(4642, 0, 4640)).toBe(false);
  });
});
