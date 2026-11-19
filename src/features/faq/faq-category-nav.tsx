// FAQ category filter — editorial text tabs: uppercase micro-labels over one hairline,
// the active tab underlined by a line that scales in (origin-left, 500ms ease-fluid).
// "All" plus one tab per category that has questions. Renders nothing while fewer than two
// categories have questions. `asLinks` renders plain anchors to `?category=<id>` instead of
// buttons — a no-JS fallback (the page pre-selects the category server-side).
import { useFaq, type UseFaqOptions } from "@/features/faq/use-faq";

export interface FaqCategoryNavProps extends UseFaqOptions {
  /** The FAQ page's path (default "/faq") — the href base in asLinks mode. */
  base?: string;
  asLinks?: boolean;
  allLabel?: string;
}

const tab = (active: boolean) =>
  `relative inline-block pb-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${
    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
  }`;
const underline = (active: boolean) =>
  `absolute inset-x-0 bottom-0 h-px origin-left bg-foreground transition-transform duration-500 ease-fluid ${active ? "scale-x-100" : "scale-x-0"}`;

export default function FaqCategoryNav({ base = "/faq", asLinks = false, allLabel = "Tutte", ...options }: FaqCategoryNavProps) {
  const { data, activeCategoryId, selectCategory } = useFaq(options);
  const categories = (data?.categories ?? []).filter((c) => c.questionCount > 0);
  if (categories.length < 2) return null;

  const items = [{ id: null as string | null, title: allLabel }, ...categories.map((c) => ({ id: c.id as string | null, title: c.title }))];

  return (
    <nav aria-label="Categorie" className="mb-10 flex flex-wrap gap-x-8 gap-y-2">
      {items.map((item) =>
        asLinks ? (
          <a
            key={item.id ?? "all"}
            href={item.id ? `${base}?category=${encodeURIComponent(item.id)}` : base}
            aria-current={activeCategoryId === item.id ? "page" : undefined}
            className={`${tab(activeCategoryId === item.id)} no-underline`}
          >
            {item.title}
            <span aria-hidden="true" className={underline(activeCategoryId === item.id)} />
          </a>
        ) : (
          <button key={item.id ?? "all"} type="button" aria-pressed={activeCategoryId === item.id} onClick={() => selectCategory(item.id)} className={tab(activeCategoryId === item.id)}>
            {item.title}
            <span aria-hidden="true" className={underline(activeCategoryId === item.id)} />
          </button>
        ),
      )}
    </nav>
  );
}
