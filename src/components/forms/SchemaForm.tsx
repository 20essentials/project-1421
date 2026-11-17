import { useWixForm, otherValue, FORM_ERROR } from "../../hooks/forms/useWixForm";
import type { FormDto, FormFieldDto } from "../../wix/forms/types";

const OTHER_SELECT_VALUE = "__other__";

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}

function ChoiceField({ f, f2 }: { f: FormFieldDto; f2: ReturnType<typeof useWixForm> }) {
  const value = f2.values[f.target];
  const otherPrefix = `${f.otherOption?.label ?? "Other"}: `;
  const isOtherSelected = typeof value === "string" && value.startsWith(otherPrefix);
  return (
    <div>
      <label className="eyebrow block" htmlFor={`fld-${f.target}`}>
        {f.label}
        {f.required && f2.form?.requiredIndicator === "ASTERISK" ? " *" : ""}
      </label>
      <select
        id={`fld-${f.target}`}
        name={f.target}
        aria-describedby={`err-${f.target}`}
        aria-invalid={Boolean(f2.errors[f.target])}
        value={isOtherSelected ? OTHER_SELECT_VALUE : (typeof value === "string" ? value : "")}
        onChange={(e) => {
          const v = e.currentTarget.value;
          f2.setValues((prev) => ({ ...prev, [f.target]: v === OTHER_SELECT_VALUE ? otherValue(f, "") : v }));
        }}
        onBlur={() => f2.validate(f.target)}
        className="mt-2 w-full border-b border-border bg-transparent py-2 text-foreground outline-none focus:border-accent"
      >
        <option value="">—</option>
        {f.choices.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
        {f.otherOption && <option value={OTHER_SELECT_VALUE}>{f.otherOption.label}</option>}
      </select>
      {isOtherSelected && (
        <input
          type="text"
          className="mt-2 w-full border-b border-border bg-transparent py-2 text-foreground outline-none focus:border-accent"
          placeholder={f.otherOption?.placeholder || f.otherOption?.label}
          aria-label={f.otherOption?.label || "Other"}
          value={typeof value === "string" ? value.slice(otherPrefix.length) : ""}
          onChange={(e) => {
            const text = e.currentTarget.value;
            f2.setValues((prev) => ({ ...prev, [f.target]: otherValue(f, text) }));
          }}
        />
      )}
      <ErrorText id={`err-${f.target}`} message={f2.errors[f.target]} />
      {f.description && <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>}
    </div>
  );
}

function Field({ f, f2 }: { f: FormFieldDto; f2: ReturnType<typeof useWixForm> }) {
  const textLike = ["text", "email", "url", "phone", "number", "password"].includes(f.control);
  const dateLike = ["date", "time", "datetime"].includes(f.control);

  if (f.control === "textarea") {
    return (
      <div>
        <label className="eyebrow block" htmlFor={`fld-${f.target}`}>
          {f.label}
          {f.required && f2.form?.requiredIndicator === "ASTERISK" ? " *" : ""}
        </label>
        <textarea
          {...f2.bind(f.target)}
          id={`fld-${f.target}`}
          rows={4}
          placeholder={f.placeholder}
          className="mt-2 w-full resize-y border-b border-border bg-transparent py-2 text-foreground outline-none focus:border-accent"
        />
        <ErrorText id={`err-${f.target}`} message={f2.errors[f.target]} />
        {f.description && <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>}
      </div>
    );
  }

  if ((f.control === "select" || f.control === "radio") && f.choices.length > 0) {
    return <ChoiceField f={f} f2={f2} />;
  }

  if (textLike || dateLike || f.control === "unknown") {
    const type = f.control === "email" ? "email" : f.control === "phone" ? "tel" : f.control === "url" ? "url" : f.control === "number" ? "number" : f.control === "password" ? "password" : dateLike ? f.control : "text";
    return (
      <div>
        <label className="eyebrow block" htmlFor={`fld-${f.target}`}>
          {f.label}
          {f.required && f2.form?.requiredIndicator === "ASTERISK" ? " *" : ""}
        </label>
        <input
          {...f2.bind(f.target)}
          id={`fld-${f.target}`}
          type={type}
          placeholder={f.placeholder}
          className="mt-2 w-full border-b border-border bg-transparent py-2 text-foreground outline-none focus:border-accent"
        />
        <ErrorText id={`err-${f.target}`} message={f2.errors[f.target]} />
        {f.description && <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>}
      </div>
    );
  }

  return (
    <p className="text-xs text-muted-foreground">
      {f.label}: campo non disponibile in questa pagina.
    </p>
  );
}

export default function SchemaForm({ formId, initialForm }: { formId: string; initialForm?: FormDto }) {
  const f = useWixForm(formId, { initialForm });

  if (f.outcome && f.outcome.action !== "CHECKOUT" && f.outcome.action !== "REDIRECT") {
    return (
      <div className="border border-border bg-secondary px-6 py-12 text-center">
        {(f.outcome.message || "Grazie!").split("\n").map((line, i) => (
          <p key={i} className="font-display text-2xl leading-snug">
            {line}
          </p>
        ))}
      </div>
    );
  }

  if (f.errors[FORM_ERROR] && !f.form) {
    return <p className="text-sm text-destructive">{f.errors[FORM_ERROR]}</p>;
  }

  if (!f.form) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-secondary" />
        <div className="h-8 w-full bg-secondary" />
        <div className="h-8 w-full bg-secondary" />
      </div>
    );
  }

  if (f.closed) {
    return <p className="text-sm text-muted-foreground">{f.form.disabledMessage || "Questo modulo non accetta più risposte."}</p>;
  }

  const step = f.form.steps[f.step];
  const last = f.step === f.form.steps.length - 1;
  const fields = f.form.fields.filter((x) => x.stepId === step.id);

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        const outcome = await f.submit(e);
        if (outcome && (outcome.action === "CHECKOUT" || outcome.action === "REDIRECT") && outcome.url) {
          if (outcome.newTab) window.open(outcome.url);
          else window.location.assign(outcome.url);
        }
      }}
    >
      {f.form.steps.length > 1 && <p className="eyebrow mb-6">{step.name}</p>}

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.target} className={field.control === "textarea" ? "sm:col-span-2" : undefined}>
            <Field f={field} f2={f} />
          </div>
        ))}
      </div>

      {f.errors[FORM_ERROR] && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {f.errors[FORM_ERROR]}
        </p>
      )}

      <div className="mt-8 flex items-center gap-4">
        {f.step > 0 && (
          <button type="button" onClick={() => f.previous()} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            {f.form.previousText || "Indietro"}
          </button>
        )}
        {last ? (
          <button
            type="submit"
            disabled={f.loading}
            className="rounded-control border border-foreground bg-foreground px-8 py-3 text-sm font-medium text-primary-foreground no-underline transition-colors hover:border-accent hover:bg-accent disabled:opacity-50"
          >
            {f.form.submitText || "Invia"}
          </button>
        ) : (
          <button type="button" onClick={(e) => f.next(e)} className="rounded-control border border-foreground bg-foreground px-8 py-3 text-sm font-medium text-primary-foreground">
            {f.form.nextText || "Continua"}
          </button>
        )}
      </div>
    </form>
  );
}
