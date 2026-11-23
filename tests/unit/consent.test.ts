import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { setConsentPolicy } = vi.hoisted(() => ({
  setConsentPolicy: vi.fn(),
}));

vi.mock("@wix/site", () => ({
  consentPolicyManager: {
    setConsentPolicy,
  },
}));

import {
  CONSENT_GRANULAR_STORAGE_KEY,
  CONSENT_STORAGE_KEY,
  DENIED_PREFERENCES,
  applyConsentPolicy,
  getConsentState,
  getGranularPreferences,
  hasAnalyticsConsent,
  policyFromPreferences,
  saveConsentPreferences,
  setConsentState,
} from "@/shared/consent";

class MemoryStorage implements Storage {
  private data = new Map<string, string>();

  get length(): number {
    return this.data.size;
  }

  clear(): void {
    this.data.clear();
  }

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.data.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  setItem(key: string, value: string): void {
    this.data.set(key, String(value));
  }
}

describe("consent", () => {
  beforeEach(() => {
    setConsentPolicy.mockClear();
    vi.stubGlobal("window", {
      consentPolicyManager: { setConsentPolicy },
    });
    vi.stubGlobal("localStorage", new MemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("denies analytics by default", () => {
    expect(getConsentState()).toBeNull();
    expect(getGranularPreferences()).toEqual(DENIED_PREFERENCES);
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("stores and applies accepted consent", () => {
    setConsentState("accepted");

    expect(getConsentState()).toBe("accepted");
    expect(hasAnalyticsConsent()).toBe(true);
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("accepted");
    expect(localStorage.getItem(CONSENT_GRANULAR_STORAGE_KEY)).toContain("analytics");
    expect(setConsentPolicy).toHaveBeenCalledTimes(1);
    expect(setConsentPolicy.mock.calls[0][0]).toEqual({
      essential: true,
      functional: true,
      analytics: true,
      advertising: true,
      dataToThirdParty: true,
    });
  });

  it("stores and applies rejected consent", () => {
    setConsentState("rejected");

    expect(getConsentState()).toBe("rejected");
    expect(hasAnalyticsConsent()).toBe(false);
    expect(setConsentPolicy.mock.calls[0][0]).toEqual({
      essential: true,
      functional: false,
      analytics: false,
      advertising: false,
      dataToThirdParty: false,
    });
  });

  it("honors a granular analytics-only choice", () => {
    saveConsentPreferences({
      essential: true,
      functional: false,
      preferences: false,
      analytics: true,
      marketing: false,
      advertising: false,
      dataToThirdParty: false,
    });

    expect(hasAnalyticsConsent()).toBe(true);
    expect(policyFromPreferences(getGranularPreferences())).toEqual({
      essential: true,
      functional: false,
      analytics: true,
      advertising: false,
      dataToThirdParty: false,
    });
  });

  it("falls back to denied for corrupted storage", () => {
    localStorage.setItem(CONSENT_GRANULAR_STORAGE_KEY, "{not json");

    expect(getGranularPreferences()).toEqual(DENIED_PREFERENCES);
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("applies the policy when the viewer consent manager is present", () => {
    vi.stubGlobal("window", {
      consentPolicyManager: { setConsentPolicy },
    });

    applyConsentPolicy(DENIED_PREFERENCES);

    expect(setConsentPolicy).toHaveBeenCalledTimes(1);
  });

  it("applies the policy when only the viewer globals expose consentPolicy", () => {
    vi.stubGlobal("window", {
      globals: {
        $ns: { "wix-window": { consentPolicy: { setConsentPolicy } } },
      },
    });

    applyConsentPolicy(DENIED_PREFERENCES);

    expect(setConsentPolicy).toHaveBeenCalledTimes(1);
  });

  it("skips the Wix policy call when no consent manager is available", () => {
    vi.stubGlobal("window", {});

    setConsentState("accepted");

    expect(getConsentState()).toBe("accepted");
    expect(setConsentPolicy).not.toHaveBeenCalled();
  });
});
