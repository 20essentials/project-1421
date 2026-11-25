export const PRIVACY_CONSENT_ERROR = "Devi accettare l'informativa privacy per inviare la richiesta.";

/** A consent gate is local to the page, not a Wix form field: one message, no submission while unchecked. */
export function privacyConsentError(checked: boolean, message = PRIVACY_CONSENT_ERROR): string {
  return checked ? "" : message;
}
