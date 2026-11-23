import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useWixForm, otherValue, FORM_ERROR } from "@/features/forms/use-wix-form";
import type { FormChoice, FormDto, FormFieldDto } from "@/features/forms/types";
import { COMBOBOX_MIN_CHOICES, filterChoices, flagFor } from "@/features/forms/choice-combobox-core";
import { HONEYPOT_NAME } from "@/features/forms/spam-core";
import { trackEvent } from "@/shared/analytics";

const OTHER_SELECT_VALUE = "__other__";

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M3.5 6l4.5 4.5L12.5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 shrink-0">
      <path d="M3 8.5l3.5 3.5L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The choice's flag, drawn from a tiny SVG so Windows visitors see it too (flag emoji render as bare letter codes there). */
function Flag({ label }: { label: string }) {
  const { url } = flagFor(label);
  if (!url) return null;
  return (
    <img
      src={url}
      alt=""
      aria-hidden="true"
      width={16}
      height={12}
      loading="lazy"
      className="h-3 w-4 shrink-0 rounded-[1px] border border-border object-cover"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
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

/**
 * A choice list too long to scroll (the country dropdown: 247 options) as a combobox —
 * smoothui-style country picker, in the form's own monochrome language: a trigger styled like
 * every other input, a searchable list with flags, full keyboard support (arrow keys move,
 * Enter picks, Escape closes, click-outside dismisses). The value lands in the store exactly
 * as a native select would, so validation and submission read no difference.
 */
function ChoiceCombobox({ f, f2 }: { f: FormFieldDto; f2: ReturnType<typeof useWixForm> }) {
  const value = typeof f2.values[f.target] === "string" ? (f2.values[f.target] as string) : "";
  const otherPrefix = `${f.otherOption?.label ?? "Other"}: `;
  const isOtherSelected = value.startsWith(otherPrefix);
  const otherEntry: FormChoice | null = f.otherOption
    ? { value: otherValue(f, ""), label: f.otherOption.label }
    : null;
  const entries = otherEntry ? [...f.choices, otherEntry] : f.choices;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filtered = filterChoices(entries, query);
  const selected = isOtherSelected
    ? { label: f.otherOption?.label ?? "Other" }
    : f.choices.find((c) => c.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent): void => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setActive(0);
    searchRef.current?.focus();
  }, [open, query]);

  useEffect(() => {
    if (!open) return;
    document.getElementById(`opt-${f.target}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, f.target]);

  const select = (v: string): void => {
    f2.setValues((prev) => ({ ...prev, [f.target]: v }));
    setOpen(false);
    f2.validate(f.target);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (filtered.length ? Math.min(a + 1, filtered.length - 1) : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (filtered.length ? Math.max(a - 1, 0) : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) select(filtered[active].value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <label className="eyebrow block" htmlFor={`fld-${f.target}`}>
        {f.label}
        {f.required && f2.form?.requiredIndicator === "ASTERISK" ? " *" : ""}
      </label>
      <button
        type="button"
        id={`fld-${f.target}`}
        role="combobox"
        aria-expanded={open}
        aria-controls={`list-${f.target}`}
        aria-haspopup="listbox"
        aria-describedby={`err-${f.target}`}
        aria-invalid={Boolean(f2.errors[f.target])}
        onClick={() => setOpen((o) => !o)}
        className="mt-2 flex w-full items-center justify-between gap-2 border-b border-border bg-transparent py-2 text-left text-foreground outline-none focus:border-accent"
      >
        <span className={selected ? "" : "text-muted-foreground"}>
          {selected ? (
            <>
              <Flag label={selected.label} />
              {selected.label}
            </>
          ) : (
            f.placeholder || f.label
          )}
        </span>
        <Chevron open={open} />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full border border-border bg-background shadow-xl">
          <input
            ref={searchRef}
            type="text"
            placeholder="Cerca…"
            aria-label="Cerca"
            aria-activedescendant={filtered[active] ? `opt-${f.target}-${active}` : undefined}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            className="w-full border-b border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
          <ul id={`list-${f.target}`} role="listbox" aria-label={f.label} className="max-h-64 overflow-y-auto overscroll-contain">
            {filtered.map((c, i) => (
              <li
                key={c.value}
                id={`opt-${f.target}-${i}`}
                role="option"
                aria-selected={c.value === value || (isOtherSelected && c === otherEntry)}
                onClick={() => select(c.value)}
                onMouseMove={() => setActive(i)}
                className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm ${i === active ? "bg-secondary text-secondary-foreground" : "text-foreground"}`}
              >
                <Flag label={c.label} />
                <span className="flex-1">{c.label}</span>
                {(c.value === value || (isOtherSelected && c === otherEntry)) && <CheckIcon />}
              </li>
            ))}
            {filtered.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">Nessun risultato</li>}
          </ul>
        </div>
      )}
      {isOtherSelected && (
        <input
          type="text"
          className="mt-2 w-full border-b border-border bg-transparent py-2 text-foreground outline-none focus:border-accent"
          placeholder={f.otherOption?.placeholder || f.otherOption?.label}
          aria-label={f.otherOption?.label || "Other"}
          value={value.slice(otherPrefix.length)}
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
    // A list the visitor cannot scroll usefully (the full country dropdown) becomes a
    // searchable combobox; a handful of choices stays a native select.
    if (f.control === "select" && f.choices.length >= COMBOBOX_MIN_CHOICES) {
      return <ChoiceCombobox f={f} f2={f2} />;
    }
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
        if (outcome) trackEvent("FormSubmit", { form_id: formId });
        if (outcome && (outcome.action === "CHECKOUT" || outcome.action === "REDIRECT") && outcome.url) {
          if (outcome.newTab) window.open(outcome.url);
          else window.location.assign(outcome.url);
        }
      }}
    >
      {f.form.steps.length > 1 && <p className="eyebrow mb-6">{step.name}</p>}

      {/* Honeypot: invisible to a visitor (off-screen, not focusable, not announced, not
          autofilled) — a bot that fills every input fills it too, and the store drops the
          submit silently. Uncontrolled: the value is never rendered, so no re-render. */}
      <input
        type="text"
        name={HONEYPOT_NAME}
        id={HONEYPOT_NAME}
        defaultValue=""
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        onChange={(e) => f.setHoneypot(e.currentTarget.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />


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
