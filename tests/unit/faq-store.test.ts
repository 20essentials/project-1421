import { describe, expect, it } from "vitest";
import { collapseQuestion, getFaqState, seedFaq } from "@/features/faq/faq-store";
import type { FaqData, FaqQuestion } from "@/features/faq/types";

const question = (id: string): FaqQuestion => ({
  id,
  slug: id,
  question: `Question ${id}?`,
  answerHtml: "<p>Answer.</p>",
  answerText: "Answer.",
  categoryId: "c1",
  sortOrder: id === "q1" ? 10 : 20,
  shareLink: "",
  labels: [],
});

const data: FaqData = {
  categories: [{ id: "c1", title: "Category", sortOrder: 10, questionCount: 2 }],
  questions: [question("q1"), question("q2")],
  truncated: false,
};

const seed = () => seedFaq({ initialData: data, expandOnlyOne: false, defaultOpenAll: true, syncUrl: false });

describe("faq-store defaultOpenAll", () => {
  it("opens every visible answer when the store is seeded", () => {
    seed();
    expect(getFaqState().expandedIds).toEqual(["q1", "q2"]);
  });

  it("leaves other answers open when one is collapsed", () => {
    seed();
    collapseQuestion("q1");
    expect(getFaqState().expandedIds).toEqual(["q2"]);
  });
});
