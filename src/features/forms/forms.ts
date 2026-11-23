// Wix Forms schema reads — the only file that touches a raw Form on this transport. Returns flat
// FormDto / FormFieldDto from ./types. The flattening rules live in ./forms-core (shared with the
// REST twin in templates/forms/rest/); this file is the transport only. Copy as-is; extend by
// adding functions.
//
// The reads go over `wixFetch` (the SDK's own authenticated fetch), NOT the `forms` module of
// @wix/forms: that generated module is 15 MB. Bundled server-side it pushes a Wix deploy past its
// size limit (HTTP 413 on release); bundled client-side every visitor downloads it. The
// submissions module (./submissions.ts) is 100 KB and stays on the SDK.
//
// The visitor token is enough, and the spec says otherwise. Every schema read is listed under
// the owner scope `SCOPE.FORMS.VIEW-FORM`, and returns 200 on an anonymous visitor: Wix grants
// implicit visitor access so a published site can render its own forms. Do NOT add a backend, a
// connector token, or auth.elevate to make a form load.
//
// docs: https://dev.wix.com/docs/api-reference/crm/forms/form-schemas/get-form.md
// docs: https://dev.wix.com/docs/api-reference/crm/forms/form-schemas/list-forms.md
// docs: https://dev.wix.com/docs/api-reference/crm/forms/form-schemas/about-form-fields.md
import { wixFetch } from "@/shared/sdk";
import { imgSrc } from "@/shared/media";
import { fetchPublishedContentBatch } from "@/features/i18n/published-content";
import type { HeaderLike } from "@/features/i18n/locale-from-request";
import { FORMS_NAMESPACE, applyRules, isClosed, otherText, otherValue, toForm, type Raw } from "@/features/forms/forms-core";
import type { FormDto } from "@/features/forms/types";

export { FORMS_NAMESPACE, applyRules, isClosed, otherText, otherValue };

const FORMS_APP_ID = "14ce1214-b278-a7e4-1373-00cebd1bef7c";

/**
 * Overlay the published field translations (labels, placeholders, submit wording) onto a form
 * DTO. The published content carries each translated formFields() element once, keyed by the
 * inputOptions path of its control type — every label key collapses into one array ordered by
 * element. The DTO's fields follow the same layout order, so index i of the arrays maps onto
 * fields[i]; the submit wording is the last (rightmost) element of its array.
 */
async function withFormTranslations<T extends FormDto>(form: T, headers?: HeaderLike): Promise<T> {
  const t = (await fetchPublishedContentBatch({ entityType: "wix.forms.v4.Form", appId: FORMS_APP_ID, scope: "GLOBAL", headers })).get(form.id);
  if (!t) return form;
  const labels: unknown[] = [];
  const placeholders: unknown[] = [];
  const choiceLabels: unknown[][] = [];
  let submit: string | undefined;
  for (const [key, value] of Object.entries(t)) {
    // Doubly-nested choice options arrive as plain strings keyed "…-options()-label#<fieldElement>|<option>".
    const nested = key.match(/-options\(\)-label#(\d+)\|(\d+)$/);
    if (nested && typeof value === "string") {
      const el = Number(nested[1]) - 1;
      const opt = Number(nested[2]) - 1;
      choiceLabels[el] = choiceLabels[el] ?? [];
      if (choiceLabels[el][opt] === undefined) choiceLabels[el][opt] = value;
      continue;
    }
    if (!Array.isArray(value)) continue;
    const merge = (target: unknown[]) => {
      value.forEach((v, i) => {
        if (typeof v === "string" && v && target[i] === undefined) target[i] = v;
      });
    };
    if (key.endsWith("-label")) merge(labels);
    else if (key.endsWith("-placeholder")) merge(placeholders);
    else if (key.endsWith("-submitText") && value.at(-1) !== undefined) submit = String(value.at(-1));
  }
  const hasLabels = labels.some(v => v !== undefined);
  const hasPlaceholders = placeholders.some(v => v !== undefined);
  const fields = form.fields.map((fl, i) => ({
    ...fl,
    ...(hasLabels && typeof labels[i] === "string" ? { label: labels[i] as string } : {}),
    ...(hasPlaceholders && typeof placeholders[i] === "string" ? { placeholder: placeholders[i] as string } : {}),
    ...(choiceLabels[i]
      ? { choices: fl.choices.map((c, j) => (typeof choiceLabels[i][j] === "string" ? { ...c, label: choiceLabels[i][j] as string } : c)) }
      : {}),
  }));
  return { ...form, fields, ...(submit ? { submitText: submit } : {}) };
}

async function getJson(path: string): Promise<Raw> {
  const res = await wixFetch(path);
  if (!res.ok) throw new Error(`forms: GET ${path} failed (${res.status}).`);
  return (await res.json()) as Raw;
}

/**
 * Read one form by id. Throws when the id is wrong or the form was deleted — a form that
 * cannot load is a setup problem, so fail loudly rather than rendering a hand-built fallback
 * that would drop real enquiries silently. A form the owner switched OFF still loads, with
 * `enabled: false` and the owner's `disabledMessage` — show that instead of the fields.
 */
export async function getForm(formId: string, headers?: HeaderLike): Promise<FormDto> {
  // GET /form-schema-service/v4/forms/{formId} → { form }; 404 FORM_NOT_FOUND on a wrong id.
  const res = await getJson(`/form-schema-service/v4/forms/${encodeURIComponent(formId)}`);
  if (!res?.form) throw new Error(`forms: form "${formId}" not found.`);
  return withFormTranslations(toForm(res.form as Raw, imgSrc), headers);
}

/**
 * Every form on the site, in the Wix Forms namespace. Use ONE call for several forms on a page
 * rather than a getForm each.
 *
 * Returns only ENABLED forms: the list call's `enabled` filter defaults to true
 * (ListFormsOptions in the v4 typings), so a form the owner disabled vanishes from the listing
 * rather than erroring. That is usually right for a public site; `getForm` still reads it.
 */
export async function listForms(headers?: HeaderLike): Promise<FormDto[]> {
  // GET /form-schema-service/v4/forms?namespace=… → { forms }; the namespace is required (400 without).
  const res = await getJson(`/form-schema-service/v4/forms?namespace=${encodeURIComponent(FORMS_NAMESPACE)}`);
  const forms = ((res?.forms ?? []) as Raw[]).map((raw) => toForm(raw, imgSrc));
  return Promise.all(forms.map((f) => withFormTranslations(f, headers)));
}
