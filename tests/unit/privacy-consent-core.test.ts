import { describe, expect, it } from "vitest";
import { PRIVACY_CONSENT_ERROR, privacyConsentError } from "@/features/forms/privacy-consent-core";

describe("privacyConsentError", () => {
  it("blocks an unchecked consent with the default message", () => {
    expect(privacyConsentError(false)).toBe(PRIVACY_CONSENT_ERROR);
  });

  it("clears the error once the visitor checks the box", () => {
    expect(privacyConsentError(true)).toBe("");
  });

  it("honours a custom message", () => {
    expect(privacyConsentError(false, "Accetta la privacy")).toBe("Accetta la privacy");
  });
});
