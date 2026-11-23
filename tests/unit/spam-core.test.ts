import { describe, expect, it } from "vitest";
import { HONEYPOT_NAME, MIN_FILL_MS, isSpamSubmission } from "@/features/forms/spam-core";

describe("isSpamSubmission", () => {
  it("flags a filled honeypot even when everything else looks human", () => {
    const t = Date.now();
    expect(isSpamSubmission({ honeypot: " http://spam.example ", openedAt: t, now: t + 60_000 })).toBe(true);
  });

  it("ignores whitespace-only honeypots", () => {
    const t = Date.now();
    expect(isSpamSubmission({ honeypot: "   ", openedAt: t, now: t + 60_000 })).toBe(false);
  });

  it("flags a submission faster than a human can fill the form", () => {
    const t = 1_000_000;
    expect(isSpamSubmission({ honeypot: "", openedAt: t, now: t + MIN_FILL_MS - 1 })).toBe(true);
  });

  it("accepts a submission at or past the minimum fill time", () => {
    const t = 1_000_000;
    expect(isSpamSubmission({ honeypot: "", openedAt: t, now: t + MIN_FILL_MS })).toBe(false);
    expect(isSpamSubmission({ honeypot: "", openedAt: t, now: t + MIN_FILL_MS + 60_000 })).toBe(false);
  });

  it("fails open when a signal is missing (no honeypot rendered, store never started)", () => {
    const now = Date.now();
    expect(isSpamSubmission({ honeypot: "", openedAt: null, now })).toBe(false);
    expect(isSpamSubmission({ honeypot: "", openedAt: undefined, now } as unknown as { honeypot: string; openedAt: number | null; now: number })).toBe(false);
  });

  it("exposes a field name no autofill rule would guess", () => {
    expect(HONEYPOT_NAME).not.toMatch(/url|website|email|name|phone|address/i);
  });
});
