// FAQ accordion — editorial monochrome UI: hairline rows, a pointer-tracked spotlight
// hover (ReactBits SpotlightCard pattern, CSS vars only), a smooth 0fr→1fr height
// transition (grid-template-rows, no measuring) and a rotating plus. SEO and no-JS stay
// safe: SSR renders every panel collapsed with `hidden` (content is still in the DOM);
// after hydration the hidden attribute is dropped in favour of the grid collapse and the
// panel is made `inert` while closed, so nothing inside is focusable. Data and state come
// from useFaq; the only HTML render is `answerHtml`, which the core sanitized.
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { useFaq, type UseFaqOptions } from "@/features/faq/use-faq";
import { anchorId, faqDeepLink } from "@/features/faq/faq-core";
import type { FaqQuestion, FaqSection } from "@/features/faq/types";

export interface LinkLikeProps {
  href: string;
  className?: string;
  children?: ReactNode;
}

const PlainLink = ({ href, className, children }: LinkLikeProps) => (
  <a href={href} className={className}>
    {children}
  </a>
);

// The answer's HTML is plain tags (p, h4, ul/ol/li, blockquote, pre/code, a, img, hr, strong/em/u/s):
// styled here through Tailwind's arbitrary-descendant variants, on the tokens.
const ANSWER_CLASS =
  "text-[15px] leading-relaxed text-muted-foreground [&_p]:my-2 [&_h4]:mt-4 [&_h4]:mb-1 [&_h4]:font-medium [&_h4]:text-foreground " +
  "[&_ul]:my-2 [&_ul]:list-none [&_ul]:pl-5 [&_ul]:[&>li]:relative [&_ul]:[&>li]:before:absolute [&_ul]:[&>li]:before:left-0 [&_ul]:[&>li]:before:text-muted-foreground [&_ul]:[&>li]:before:content-['—'] " +
  "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_li]:marker:text-muted-foreground " +
  "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:text-foreground/80 [&_blockquote]:italic " +
  "[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:bg-secondary [&_pre]:p-3 [&_pre]:text-sm [&_a]:text-foreground [&_a]:underline [&_a]:decoration-foreground/40 [&_a]:underline-offset-4 " +
  "[&_a:hover]:decoration-foreground [&_img]:my-3 [&_img]:max-w-full [&_img]:rounded-sm [&_hr]:my-4 [&_hr]:border-border";

export interface FaqAccordionProps extends UseFaqOptions {
  /** The FAQ page's path — the base of every copied deep link (default "/faq"). */
  base?: string;
  emptyMessage?: string;
  retryLabel?: string;
  noResultsLabel?: string;
  resetSearchLabel?: string;
  questionLinkLabel?: string;
  copyLinkLabel?: string;
  copiedLabel?: string;
  truncatedLabel?: string;
  /** Category headings above each group. Default: only while every category shows (no active filter). */
  showCategoryHeadings?: boolean;
  LinkComponent?: ComponentType<LinkLikeProps>;
}

/** One collapsible panel: grid-template-rows 0fr→1fr, `inert` while closed. */
function Collapse({
  open,
  panelId,
  labelledBy,
  ssrHidden,
  children,
}: {
  open: boolean;
  panelId: string;
  labelledBy: string;
  /** Before hydration the panel keeps the SSR `hidden` (no-JS and crawlers keep the old guarantee). */
  ssrHidden: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (ref.current) ref.current.inert = !open;
  }, [open]);
  return (
    <div
      ref={ref}
      id={panelId}
      role="region"
      aria-labelledby={labelledBy}
      hidden={ssrHidden && !open}
      aria-hidden={!open || undefined}
      className="grid transition-[grid-template-rows] duration-500 ease-fluid"
      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="pb-8 pl-1 pr-2">{children}</div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div aria-busy="true" className="border-b border-border">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 border-t border-border py-7">
          <div className="h-4 w-2/3 max-w-md animate-pulse rounded-sm bg-secondary" />
          <div className="h-7 w-7 shrink-0 animate-pulse rounded-full border border-border" />
        </div>
      ))}
    </div>
  );
}

export default function FaqAccordion({
  base = "/faq",
  emptyMessage = "Nessuna domanda per ora.",
  retryLabel = "Riprova",
  noResultsLabel = "Nessun risultato per",
  resetSearchLabel = "Azzera la ricerca",
  questionLinkLabel = "Link a questa domanda",
  copyLinkLabel = "Copia link",
  copiedLabel = "Copiato",
  truncatedLabel = "Prime domande mostrate.",
  showCategoryHeadings,
  LinkComponent = PlainLink,
  ...options
}: FaqAccordionProps) {
  const { data, sections, visible, query, activeCategoryId, error, loading, isExpanded, toggleQuestion, setQuery, retry } = useFaq(options);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const headings = showCategoryHeadings ?? activeCategoryId === null;

  // The deep link to one question, absolute when a browser is present. Clipboard access is browser-only
  // and may be refused (insecure context); the link is also rendered as an <a>, so nothing is lost.
  const copyLink = (q: FaqQuestion) => {
    const href = faqDeepLink(q, base, activeCategoryId);
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    const abs = typeof location !== "undefined" ? new URL(href, location.href).toString() : href;
    navigator.clipboard.writeText(abs).then(
      () => {
        setCopiedId(q.id);
        setTimeout(() => setCopiedId((c) => (c === q.id ? null : c)), 2000);
      },
      () => {},
    );
  };

  // Pointer-tracked spotlight (ReactBits SpotlightCard pattern): CSS vars on the row, no re-render.
  const spotlight = (e: React.MouseEvent<HTMLDivElement>) => {
    const row = e.currentTarget;
    const rect = row.getBoundingClientRect();
    row.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    row.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  if (data === null) return <Skeleton />;

  return (
    <div>
      {error && (
        <p className="mb-4 flex items-center gap-3 text-sm text-destructive">
          <span>{error}</span>
          <button type="button" onClick={retry} disabled={loading} className="rounded-full border border-border px-3 py-1 text-foreground hover:bg-secondary disabled:opacity-50">
            {retryLabel}
          </button>
        </p>
      )}
      {data.questions.length === 0 ? (
        !error && <p className="py-16 text-center text-muted-foreground">{emptyMessage}</p>
      ) : visible.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          {query.trim() ? (
            <>
              {noResultsLabel} &ldquo;{query.trim()}&rdquo;.{" "}
              <button type="button" onClick={() => setQuery("")} className="underline underline-offset-4 text-foreground">
                {resetSearchLabel}
              </button>
            </>
          ) : (
            emptyMessage
          )}
        </p>
      ) : (
        sections.map((section: FaqSection, sectionIndex: number) => (
          <section key={section.category.id} aria-labelledby={headings ? `faq-cat-${section.category.id}` : undefined} className="mb-14 last:mb-0">
            {headings && (
              <div id={`faq-cat-${section.category.id}`} className="mb-2 flex items-baseline gap-4">
                <span aria-hidden="true" className="text-xs tabular-nums text-muted-foreground">
                  {String(sectionIndex + 1).padStart(2, "0")}
                </span>
                <h2 className="eyebrow">{section.category.title}</h2>
                <span aria-hidden="true" className="h-px flex-1 bg-border" />
              </div>
            )}
            <div className="border-b border-border">
              {section.questions.map((q) => {
                const expanded = isExpanded(q.id);
                const id = anchorId(q);
                return (
                  <div key={q.id} id={id} onMouseMove={spotlight} className="group relative scroll-mt-28 border-t border-border">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(340px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--color-foreground) 5%, transparent), transparent 72%)",
                      }}
                    />
                    <h3 className="m-0">
                      <button
                        type="button"
                        id={`${id}-button`}
                        aria-expanded={expanded}
                        aria-controls={`${id}-panel`}
                        onClick={() => toggleQuestion(q.id)}
                        className="relative flex w-full items-center justify-between gap-6 px-1 py-7 text-left focus:outline-none"
                      >
                        <span className="font-sans text-lg font-medium leading-snug tracking-tight text-foreground sm:text-xl">{q.question}</span>
                        <span
                          aria-hidden="true"
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-foreground transition-[transform,border-color,background-color] duration-500 ease-fluid ${
                            expanded ? "rotate-45 border-foreground bg-foreground text-primary-foreground" : "border-border group-hover:border-foreground"
                          }`}
                        >
                          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M8 3v10M3 8h10" />
                          </svg>
                        </span>
                      </button>
                    </h3>
                    <Collapse open={expanded} panelId={`${id}-panel`} labelledBy={`${id}-button`} ssrHidden={!mounted}>
                      <div className="max-w-[62ch]">
                        <div className={ANSWER_CLASS} dangerouslySetInnerHTML={{ __html: q.answerHtml }} />
                        <p className="mt-4 flex items-center gap-5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          <LinkComponent href={faqDeepLink(q, base, activeCategoryId)} className="transition-colors hover:text-foreground no-underline underline-offset-4">
                            {questionLinkLabel}
                          </LinkComponent>
                          <button type="button" onClick={() => copyLink(q)} className="uppercase tracking-[0.18em] transition-colors hover:text-foreground">
                            {copiedId === q.id ? copiedLabel : copyLinkLabel}
                          </button>
                        </p>
                      </div>
                    </Collapse>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
      {data.truncated && (
        <p className="mt-6 text-sm text-muted-foreground">{truncatedLabel.replace("{count}", String(data.questions.length))}</p>
      )}
    </div>
  );
}
