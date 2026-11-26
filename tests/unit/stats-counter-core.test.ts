import { describe, expect, it } from "vitest";
import { countAt, formatCountStat, parseCountStat } from "@/features/home/stats-counter-core";

describe("parseCountStat", () => {
  it("reads a plain number", () => {
    expect(parseCountStat("25")).toEqual({ target: 25, suffix: "" });
  });

  it("keeps a trailing suffix", () => {
    expect(parseCountStat("40+")).toEqual({ target: 40, suffix: "+" });
  });

  it("ignores words and labelled years", () => {
    expect(parseCountStat("QEP")).toBeNull();
    expect(parseCountStat("Dal 2012")).toBeNull();
  });
});

describe("countAt", () => {
  it("clamps progress and lands exactly on the target", () => {
    expect(countAt(0, 40, -1)).toBe(0);
    expect(countAt(0, 40, 2)).toBe(40);
    expect(countAt(0, 40, 1)).toBe(40);
  });

  it("eases out instead of moving linearly", () => {
    expect(countAt(0, 40, 0.5)).toBe(35);
    expect(countAt(0, 40, 0.25)).toBe(23);
  });
});

describe("formatCountStat", () => {
  it("restores the suffix while counting", () => {
    expect(formatCountStat({ target: 40, suffix: "+" }, 18)).toBe("18+");
  });
});
