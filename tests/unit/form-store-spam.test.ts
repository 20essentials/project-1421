import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFormStore } from "@/features/forms/form-store";
import { MIN_FILL_MS } from "@/features/forms/spam-core";
import type { FormDto, FormFieldDto } from "@/features/forms/types";

// The store's data layer, mocked: forms.ts and submissions.ts pull the Wix SDK, whose
// transports no unit test needs — only the names form-store imports, with the pure
// decision logic re-exported from the real cores.
vi.mock("@/features/forms/forms", async () => {
  const core = await import("@/features/forms/forms-core");
  return {
    applyRules: core.applyRules,
    isClosed: core.isClosed,
    otherText: core.otherText,
    otherValue: core.otherValue,
    getForm: vi.fn(),
  };
});
vi.mock("@/features/forms/submissions", async () => {
  const core = await import("@/features/forms/submissions-core");
  return {
    normalizePhone: core.normalizePhone,
    normalizeUrl: core.normalizeUrl,
    submissionErrors: core.submissionErrors,
    formLevelError: core.formLevelError,
    toSubmissionValues: core.toSubmissionValues,
    uploadFiles: vi.fn(async (_formId: string, _fields: unknown, values: unknown) => values),
    createSubmission: vi.fn(),
    checkoutUrl: vi.fn(),
  };
});

import { createSubmission } from "@/features/forms/submissions";

const FIELD: FormFieldDto = {
  target: "name_a1",
  label: "Name",
  showLabel: true,
  control: "text",
  required: true,
  readOnly: false,
  hidden: false,
  stepId: "s1",
  defaultValue: "",
  choices: [],
  addressParts: [],
  validation: {},
  identifier: "TEXT_INPUT",
  inputType: "TEXT",
  componentType: "TEXT_INPUT",
};

const FORM: FormDto = {
  id: "form-1",
  name: "Contact",
  fields: [FIELD],
  steps: [{ id: "s1", name: "", targets: [FIELD.target] }],
  rules: [],
  submitText: "Send",
  nextText: "",
  previousText: "",
  enabled: true,
  disabledMessage: "",
  limits: {},
  requiredIndicator: "NONE",
  requiredIndicatorBefore: false,
  success: { action: "NO_ACTION" },
};

function makeStore() {
  return createFormStore({ formId: "form-1", initialForm: FORM });
}

beforeEach(() => {
  vi.mocked(createSubmission).mockReset();
  vi.mocked(createSubmission).mockResolvedValue({ id: "sub-1", status: "CONFIRMED" });
});

describe("form-store spam gate", () => {
  it("silently drops a submit that fills the honeypot, without creating a submission", async () => {
    const store = makeStore();
    store.start();
    store.setValue(FIELD.target, "Stefano");
    store.setHoneypot("http://spam.example");

    await expect(store.submit()).resolves.toBe(false);
    expect(createSubmission).not.toHaveBeenCalled();
    // Silent: no error, no thank-you — the bot learns nothing.
    expect(store.getState().errors).toEqual({});
    expect(store.getState().outcome).toBeNull();
  });

  it("silently drops a submit that fires faster than a human can fill the form", async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(1_000_000);
      const store = makeStore();
      store.start(); // openedAt = now
      store.setValue(FIELD.target, "Stefano");

      vi.setSystemTime(1_000_000 + MIN_FILL_MS - 1);
      await expect(store.submit()).resolves.toBe(false);
      expect(createSubmission).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it("lets a normal submission through and creates it", async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(1_000_000);
      const store = makeStore();
      store.start();
      store.setValue(FIELD.target, "Stefano");

      vi.setSystemTime(1_000_000 + MIN_FILL_MS + 5_000);
      const outcome = await store.submit();
      expect(outcome).not.toBe(false);
      expect(createSubmission).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
