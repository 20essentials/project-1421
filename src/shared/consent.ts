import { consentPolicyManager } from "@wix/site";

export const CONSENT_STORAGE_KEY = "sl_consent_v1";
export const CONSENT_GRANULAR_STORAGE_KEY = "sl_consent_v1_granular";

export type ConsentState = "accepted" | "rejected";
export type ConsentCategory =
  | "functional"
  | "preferences"
  | "analytics"
  | "marketing"
  | "advertising"
  | "dataToThirdParty";

export interface GranularConsentPreferences {
  essential: true;
  functional: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  advertising: boolean;
  dataToThirdParty: boolean;
}

export interface WixConsentPolicy {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  advertising: boolean;
  dataToThirdParty: boolean;
}

export const DENIED_PREFERENCES: GranularConsentPreferences = {
  essential: true,
  functional: false,
  preferences: false,
  analytics: false,
  marketing: false,
  advertising: false,
  dataToThirdParty: false,
};

export const GRANTED_PREFERENCES: GranularConsentPreferences = {
  essential: true,
  functional: true,
  preferences: true,
  analytics: true,
  marketing: true,
  advertising: true,
  dataToThirdParty: true,
};

const CATEGORY_KEYS: ConsentCategory[] = [
  "functional",
  "preferences",
  "analytics",
  "marketing",
  "advertising",
  "dataToThirdParty",
];

export function isGranularPreferences(value: unknown): value is GranularConsentPreferences {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    candidate.essential === true &&
    CATEGORY_KEYS.every((key) => typeof candidate[key] === "boolean")
  );
}

function getStorage(): Storage | null {
  if (typeof localStorage === "undefined") return null;
  try {
    return localStorage;
  } catch {
    return null;
  }
}

export function getConsentState(): ConsentState | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const value = storage.getItem(CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

export function getGranularPreferences(): GranularConsentPreferences {
  const storage = getStorage();
  if (!storage) return DENIED_PREFERENCES;
  try {
    const raw = storage.getItem(CONSENT_GRANULAR_STORAGE_KEY);
    if (!raw) return DENIED_PREFERENCES;
    const parsed: unknown = JSON.parse(raw);
    return isGranularPreferences(parsed) ? parsed : DENIED_PREFERENCES;
  } catch {
    return DENIED_PREFERENCES;
  }
}

export function hasAnalyticsConsent(): boolean {
  return getGranularPreferences().analytics;
}

export function policyFromPreferences(
  preferences: GranularConsentPreferences,
): WixConsentPolicy {
  return {
    essential: true,
    functional: preferences.functional,
    analytics: preferences.analytics,
    advertising: preferences.advertising || preferences.marketing,
    dataToThirdParty:
      preferences.dataToThirdParty || preferences.marketing || preferences.advertising,
  };
}

export function applyConsentPolicy(preferences: GranularConsentPreferences): void {
  if (typeof window === "undefined") return;
  try {
    void consentPolicyManager.setConsentPolicy(
      policyFromPreferences(preferences),
      () => {},
      () => {},
    );
  } catch {
  }
}

export function saveConsentPreferences(preferences: GranularConsentPreferences): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(
      CONSENT_STORAGE_KEY,
      preferences.analytics || preferences.marketing ? "accepted" : "rejected",
    );
    storage.setItem(CONSENT_GRANULAR_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
  }
  applyConsentPolicy(preferences);
}

export function setConsentState(state: ConsentState): void {
  saveConsentPreferences(state === "accepted" ? GRANTED_PREFERENCES : DENIED_PREFERENCES);
}

export function clearConsent(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(CONSENT_STORAGE_KEY);
    storage.removeItem(CONSENT_GRANULAR_STORAGE_KEY);
  } catch {
  }
}
