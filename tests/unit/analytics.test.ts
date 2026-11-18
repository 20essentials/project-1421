import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { trackEventMock, hasAnalyticsConsentMock } = vi.hoisted(() => ({
  trackEventMock: vi.fn(),
  hasAnalyticsConsentMock: vi.fn(),
}));

vi.mock("@wix/site", () => ({
  analytics: {
    trackEvent: trackEventMock,
  },
}));

vi.mock("@/shared/consent", () => ({
  hasAnalyticsConsent: hasAnalyticsConsentMock,
}));

import { trackEvent } from "@/shared/analytics";
import { hasAnalyticsConsent } from "@/shared/consent";

describe("trackEvent", () => {
  beforeEach(() => {
    trackEventMock.mockClear();
    hasAnalyticsConsentMock.mockReset();
    vi.stubGlobal("window", {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does nothing during SSR", () => {
    vi.stubGlobal("window", undefined);
    hasAnalyticsConsentMock.mockReturnValue(true);

    trackEvent("FormSubmit", { form_id: "abc" });

    expect(trackEventMock).not.toHaveBeenCalled();
  });

  it("does nothing without analytics consent", () => {
    hasAnalyticsConsentMock.mockReturnValue(false);

    trackEvent("FormSubmit", { form_id: "abc" });

    expect(hasAnalyticsConsent).toHaveBeenCalledTimes(1);
    expect(trackEventMock).not.toHaveBeenCalled();
  });

  it("forwards the event when consent was granted", () => {
    hasAnalyticsConsentMock.mockReturnValue(true);

    trackEvent("ArticleView", { post_id: "p1" });

    expect(trackEventMock).toHaveBeenCalledWith("ArticleView", { post_id: "p1" });
  });
});
