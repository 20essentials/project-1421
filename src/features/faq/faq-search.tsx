// FAQ search — an editorial bottom-hairline input: the field sits on one hairline, and a
// second line scales in on focus (origin-left, 500ms ease-fluid) instead of a focus ring.
// Debounced 250 ms into the store's query (Enter and clearing flush at once), with the
// results count announced to assistive tech. Search runs client-side over the loaded
// questions and answers — nothing here fetches.
import { useEffect, useRef, useState } from "react";
import { useFaq, type UseFaqOptions } from "@/features/faq/use-faq";

export interface FaqSearchProps extends UseFaqOptions {
  label?: string;
  placeholder?: string;
  resultUnit?: string;
  resultUnitSingular?: string;
  /** Debounce in ms (default 250). */
  delay?: number;
}

export default function FaqSearch({ label = "Cerca", placeholder = "Cerca una domanda…", resultUnit = "risultati", resultUnitSingular = "risultato", delay = 250, ...options }: FaqSearchProps) {
  const { query, setQuery, resultsCount, data } = useFaq(options);
  const [draft, setDraft] = useState(query);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The store's query can change from elsewhere (the accordion's "Clear search") — mirror it.
  useEffect(() => setDraft(query), [query]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const flush = (value: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setQuery(value);
  };
  const onChange = (value: string) => {
    setDraft(value);
    if (timer.current) clearTimeout(timer.current);
    if (!value.trim()) return flush("");
    timer.current = setTimeout(() => flush(value), delay);
  };

  const active = query.trim().length > 0 && data !== null;
  return (
    <form role="search" onSubmit={(e) => { e.preventDefault(); flush(draft); }} className="mb-10">
      <label htmlFor="faq-search" className="eyebrow mb-3 block text-muted-foreground">
        {label}
      </label>
      <div className="relative flex items-end gap-4 border-b border-border transition-colors duration-500 focus-within:border-foreground/60">
        <input
          id="faq-search"
          type="search"
          value={draft}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="peer w-full bg-transparent py-3 pr-8 text-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-fluid peer-focus:scale-x-100" />
        {active && (
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs tabular-nums text-muted-foreground" aria-hidden="true">
            {resultsCount}
          </span>
        )}
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-sm text-muted-foreground">
        {active ? `${resultsCount} ${resultsCount === 1 ? resultUnitSingular : resultUnit}` : ""}
      </p>
    </form>
  );
}
