// The client-side spam gate for Wix Forms submissions, decided BEFORE any network call —
// there is no backend of our own in front of the create-submission API, so the only
// interception point is the browser that submits. Two signals, both invisible to a human:
//
// 1. HONEYPOT — an off-screen input a real visitor can never reach (not focusable, not
//    announced); bots that fill every field they find fill it too. Autofill is the one way a
//    human trips it, so the field name is meaningless (`sl_hp`) and `autoComplete="off"` —
//    password managers fill names like "website" or "url", never an unknown token.
// 2. TIME TRAP — a human needs seconds to read and answer; a scripted POST fires in under
//    one. `openedAt` is set when the form mounts (store.start(), client only), never on the
//    server render, so the clock only runs for someone who actually has the form open.
//
// A hit is SILENT: submit() resolves false with no error and no thank-you. An error message
// would teach a bot's operator exactly which check to bypass; a fake success would make the
// bot stop — but it would also hide a real, wrongly-caught enquiry (an autofilled honeypot)
// behind a thank-you the visitor never sees. Fail silent, fail closed on the signal, fail
// OPEN when a signal is missing (no honeypot rendered, or the store never started): dropping
// a real enquiry is the one unrecoverable outcome.
export const HONEYPOT_NAME = "sl_hp";

/** A human cannot read the form and answer every field in less than this. Bots routinely do. */
export const MIN_FILL_MS = 2500;

export interface SpamSignals {
  /** The honeypot input's value — anything typed into it is a bot's. */
  honeypot: string;
  /** `store.start()` on the client, or null when it never ran. */
  openedAt: number | null;
  now: number;
}

export function isSpamSubmission({ honeypot, openedAt, now }: SpamSignals): boolean {
  if (honeypot.trim() !== "") return true;
  if (openedAt == null) return false;
  return now - openedAt < MIN_FILL_MS;
}
