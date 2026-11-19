import { describe, expect, it } from "vitest";
import {
  anchorId,
  assembleFaq,
  draftjsBlocks,
  draftjsToHtml,
  faqDeepLink,
  faqJsonLd,
  findByAnchor,
  groupByCategory,
  normalizeQuery,
  parseDeepLink,
  plainTextToHtml,
  search,
  sortCategories,
  sortQuestions,
  visibleQuestions,
  withCounts,
} from "@/features/faq/faq-core";
import type { FaqCategory, FaqQuestion } from "@/features/faq/types";

const cat = (id: string, sortOrder: number | null = null, title = `Cat ${id}`): FaqCategory => ({ id, title, sortOrder, questionCount: 0 });
const q = (over: Partial<FaqQuestion>): FaqQuestion => ({
  id: over.id ?? "id-1",
  slug: over.slug ?? "",
  question: over.question ?? "Question?",
  answerHtml: over.answerHtml ?? "<p>Answer.</p>",
  answerText: over.answerText ?? "Answer.",
  categoryId: over.categoryId ?? "c1",
  sortOrder: over.sortOrder ?? null,
  shareLink: over.shareLink ?? "",
  labels: over.labels ?? [],
});

describe("sorting", () => {
  it("sorts categories by sortOrder ascending, nulls last, then by title", () => {
    const sorted = sortCategories([cat("b", 20), cat("a", null), cat("c", 10), cat("d", null, "A first")]);
    expect(sorted.map((c) => c.id)).toEqual(["c", "b", "d", "a"]);
  });

  it("sorts questions by sortOrder ascending, nulls last, then by question text", () => {
    const sorted = sortQuestions([
      q({ id: "1", sortOrder: 30 }),
      q({ id: "2", sortOrder: null }),
      q({ id: "3", sortOrder: 10 }),
      q({ id: "4", sortOrder: null, question: "A first" }),
    ]);
    expect(sorted.map((x) => x.id)).toEqual(["3", "1", "4", "2"]);
  });
});

describe("withCounts + assembleFaq", () => {
  it("counts every question per category, even unmatched ones", () => {
    const cats = withCounts([cat("c1"), cat("c2")], [q({ categoryId: "c1" }), q({ categoryId: "c1", id: "2" }), q({ categoryId: "zz" })]);
    expect(cats.find((c) => c.id === "c1")!.questionCount).toBe(2);
    expect(cats.find((c) => c.id === "c2")!.questionCount).toBe(0);
  });

  it("assembles sorted categories with counts and sorted questions", () => {
    const data = assembleFaq([cat("c2", 20), cat("c1", 10)], [q({ id: "2", sortOrder: 20, categoryId: "c1" }), q({ id: "1", sortOrder: 10, categoryId: "c1" })], false);
    expect(data.categories.map((c) => c.id)).toEqual(["c1", "c2"]);
    expect(data.questions.map((x) => x.id)).toEqual(["1", "2"]);
    expect(data.truncated).toBe(false);
  });
});

describe("groupByCategory", () => {
  it("groups in category order, omits empty categories, sorts inside", () => {
    const sections = groupByCategory([cat("c1", 10), cat("c2", 20), cat("c3", 30)], [
      q({ id: "1", sortOrder: 20, categoryId: "c2" }),
      q({ id: "2", sortOrder: 10, categoryId: "c1" }),
    ]);
    expect(sections.map((s) => s.category.id)).toEqual(["c1", "c2"]);
    expect(sections[0].questions.map((x) => x.id)).toEqual(["2"]);
  });

  it("lands orphan questions in a synthetic Other section at the end", () => {
    const sections = groupByCategory([cat("c1", 10)], [q({ id: "1", categoryId: "c1" }), q({ id: "2", categoryId: "gone" })]);
    expect(sections.map((s) => s.category.id)).toEqual(["c1", "uncategorized"]);
    expect(sections[1].category.title).toBe("Other");
    expect(sections[1].questions.map((x) => x.id)).toEqual(["2"]);
  });
});

describe("search", () => {
  it("normalizes case, edges and collapsed whitespace", () => {
    expect(normalizeQuery("  Dove   LAVORI ")).toBe("dove lavori");
  });

  it("matches question and answer text case-insensitively; empty needle keeps everything", () => {
    const qs = [q({ question: "Dove lavori?", answerText: "In Italia e Austria." })];
    expect(search(qs, "austria")).toHaveLength(1);
    expect(search(qs, "dove")).toHaveLength(1);
    expect(search(qs, "")).toBe(qs);
    expect(search(qs, "germania")).toHaveLength(0);
  });

  it("filters category first, then search, sorted", () => {
    const data = {
      categories: [cat("c1", 10), cat("c2", 20)],
      questions: [q({ id: "1", categoryId: "c1", question: "Austria?" }), q({ id: "2", categoryId: "c2", question: "Dove?" })],
      truncated: false,
    };
    expect(visibleQuestions(data, "c2", "").map((x) => x.id)).toEqual(["2"]);
    expect(visibleQuestions(data, null, "dove").map((x) => x.id)).toEqual(["2"]);
    expect(visibleQuestions(null, null, "")).toEqual([]);
  });
});

describe("deep links", () => {
  it("builds an anchor from slug, id as fallback", () => {
    expect(anchorId({ slug: "dove-lavori", id: "x1" })).toBe("q-dove-lavori");
    expect(anchorId({ slug: "", id: "x1" })).toBe("q-x1");
  });

  it("builds the link with an optional encoded category", () => {
    expect(faqDeepLink({ slug: "s", id: "x1" }, "/faq", null)).toBe("/faq#q-s");
    expect(faqDeepLink({ slug: "s", id: "x1" }, "/faq", "abc")).toBe("/faq?category=abc#q-s");
  });

  it("parses category from search and anchor from hash (slug only)", () => {
    expect(parseDeepLink("?category=c1&q=x", "q-dove")).toEqual({ categoryId: "c1", anchor: "dove" });
    expect(parseDeepLink("", "")).toEqual({ categoryId: null, anchor: null });
    expect(parseDeepLink("", "other")).toEqual({ categoryId: null, anchor: null });
  });

  it("finds a question by slug first, then by id", () => {
    const qs = [q({ slug: "dove", id: "x1" }), q({ slug: "quando", id: "x2" })];
    expect(findByAnchor(qs, "dove")!.id).toBe("x1");
    expect(findByAnchor(qs, "x2")!.slug).toBe("quando");
    expect(findByAnchor(qs, "nope")).toBeUndefined();
  });
});

describe("structured data", () => {
  it("builds a FAQPage JSON-LD with one Question entity per question", () => {
    const ld = faqJsonLd([q({ question: "Dove?", answerHtml: "<p>In Italia</p>" })], "https://x.example/faq") as {
      "@type": string;
      mainEntity: Array<{ "@type": string; name: string; url: string; acceptedAnswer: { text: string } }>;
    };
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity).toHaveLength(1);
    expect(ld.mainEntity[0].name).toBe("Dove?");
    expect(ld.mainEntity[0].url).toBe("https://x.example/faq#q-id-1");
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("<p>In Italia</p>");
  });
});

describe("plain text and draft.js answers", () => {
  it("turns blank-line paragraphs into <p> and single newlines into <br>", () => {
    expect(plainTextToHtml("Uno\nDue\n\nTre")).toBe("<p>Uno<br>Due</p><p>Tre</p>");
  });

  it("escapes HTML in plain text", () => {
    expect(plainTextToHtml("<b>x</b>")).toBe("<p>&lt;b&gt;x&lt;/b&gt;</p>");
  });

  it("reads draft.js blocks; garbage parses to none", () => {
    const blocks = draftjsBlocks(JSON.stringify({ blocks: [{ text: "Hi", type: "unstyled" }] }));
    expect(blocks).toEqual([{ text: "Hi", type: "unstyled" }]);
    expect(draftjsBlocks("not json")).toEqual([]);
  });

  it("renders draft.js blocks: lists wrap, headers to h4, blockquote, code", () => {
    const html = draftjsToHtml([
      { text: "A", type: "unordered-list-item" },
      { text: "B", type: "unordered-list-item" },
      { text: "Title", type: "header-two" },
      { text: "Quote", type: "blockquote" },
      { text: "code()", type: "code-block" },
      { text: "Para", type: "unstyled" },
      { text: "  ", type: "unstyled" },
    ]);
    expect(html).toBe("<ul><li>A</li><li>B</li></ul><h4>Title</h4><blockquote><p>Quote</p></blockquote><pre><code>code()</code></pre><p>Para</p>");
  });
});
