import { analytics } from "@wix/site";
import { hasAnalyticsConsent } from "@/shared/consent";

export type AnalyticsEventName =
  | "ViewContent"
  | "ArticleView"
  | "FormSubmit"
  | "Lead"
  | "Schedule"
  | "CustomEvent"
  | (string & {});

export type AnalyticsPayload = Record<string, unknown>;

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  try {
    analytics.trackEvent(name, payload as Parameters<typeof analytics.trackEvent>[1]);
  } catch {
    if (import.meta.env.DEV) console.debug("[analytics] event failed", name, payload);
  }
}
