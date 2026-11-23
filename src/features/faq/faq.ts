// FAQ reads (Wix FAQ app: Categories V2 + Question Entries V2) over the SDK — the only file that
// touches raw FAQ entities on this transport. Everything it returns is a plain DTO from ./types. The
// rules and mappers live in ./faq-core (shared with the REST twin in templates/faq/rest/); this file
// is the transport only. Copy as-is; extend by adding functions, not by editing these. The vertical
// is read-only: authoring stays in the dashboard.
// docs: https://dev.wix.com/docs/api-reference/business-management/faq-app/category-v2/query-categories.md
// docs: https://dev.wix.com/docs/api-reference/business-management/faq-app/question-entry-v2/query-question-entries.md
import { category as categoryModule, questionEntry as questionModule } from "@wix/faq";
import { wixModule } from "@/shared/sdk";
import { imgSrc } from "@/shared/media";
import { fetchPublishedContentBatch } from "@/features/i18n/published-content";
import type { HeaderLike } from "@/features/i18n/locale-from-request";
import {
  CONTENT_FORMAT,
  FAQ_APP_ID,
  FIELD_SET,
  PAGE_LIMIT,
  assembleFaq,
  loadAllQuestions,
  rawId,
  sortCategories,
  toCategory,
  toQuestion,
  type Raw,
} from "@/features/faq/faq-core";
import type { FaqCategory, FaqData, FaqQuestion, FaqQuestionPage, FetchQuestionsOptions } from "@/features/faq/types";

export { FAQ_APP_ID };

const categories = wixModule(categoryModule);
const questions = wixModule(questionModule);

/**
 * Published translations of the FAQ's categories and questions in the current locale, keyed by
 * entity id (one batched read per entityType; empty maps for the primary locale). Applied to the
 * raws before the DTO mapping, so answerHtml/answerText/search derive from the translation.
 */
async function faqTranslations(headers?: HeaderLike): Promise<{
  cats: Map<string, Record<string, unknown>>;
  qs: Map<string, Record<string, unknown>>;
}> {
  const [cats, qs] = await Promise.all([
    fetchPublishedContentBatch({ entityType: "wix.faq.category.v2.Category", appId: FAQ_APP_ID, scope: "GLOBAL", headers }),
    fetchPublishedContentBatch({ entityType: "wix.faq.questionentry.v2.QuestionEntry", appId: FAQ_APP_ID, scope: "GLOBAL", headers }),
  ]);
  return { cats, qs };
}

const translated = (raw: Raw, map: Map<string, Record<string, unknown>>): Raw => {
  const t = map.get(rawId(raw));
  return t ? { ...raw, ...t } : raw;
};

/** All categories in owner order (a site has few; one page of 100 is the whole list). `questionCount` is 0 here — fetchFaq fills it. */
export async function fetchCategories(headers?: HeaderLike): Promise<FaqCategory[]> {
  const { cats } = await faqTranslations(headers);
  const res = await categories.queryCategories().ascending("sortOrder").limit(PAGE_LIMIT).find();
  return sortCategories((res.items ?? []).map((c: Raw) => toCategory(translated(c, cats))));
}

/**
 * One cursor page of questions, optionally one category's, in owner order, with the Ricos answer and
 * the share link. The builder spells faq-core's questionsQueryBody: filter + sort on the first page,
 * the cursor alone after (a cursor encodes the original filter+sort).
 */
export async function fetchQuestions(o: FetchQuestionsOptions & { headers?: HeaderLike } = {}): Promise<FaqQuestionPage> {
  const { categoryId = null, limit = PAGE_LIMIT, cursor = null, headers } = o;
  const { qs } = await faqTranslations(headers);
  let q = questions.queryQuestionEntries({ contentFormat: CONTENT_FORMAT, fieldSet: [...FIELD_SET] });
  if (cursor) {
    q = q.skipTo(cursor);
  } else {
    if (categoryId) q = q.eq("categoryId", categoryId);
    q = q.ascending("sortOrder");
  }
  const res = await q.limit(Math.min(Math.max(1, limit), PAGE_LIMIT)).find();
  return {
    questions: (res.items ?? []).map((r: Raw) => toQuestion(translated(r, qs), imgSrc)),
    nextCursor: res.hasNext() ? (res.cursors?.next ?? null) : null,
  };
}

/** Everything the FAQ page needs: categories (counted) + every question (paged until done or MAX_QUESTIONS). */
export async function fetchFaq(headers?: HeaderLike): Promise<FaqData> {
  const [cats, { questions: all, truncated }] = await Promise.all([
    fetchCategories(headers),
    loadAllQuestions((o) => fetchQuestions({ ...o, headers })),
  ]);
  return assembleFaq(cats, all, truncated);
}

/** One question by id (a redirect page, a widget) — the same query read as the page, so one permission covers both. Null when missing. */
export async function fetchQuestionById(id: string, headers?: HeaderLike): Promise<FaqQuestion | null> {
  const { qs } = await faqTranslations(headers);
  const res = await questions
    .queryQuestionEntries({ contentFormat: CONTENT_FORMAT, fieldSet: [...FIELD_SET] })
    .eq("_id", id)
    .limit(1)
    .find();
  const raw = res.items?.[0];
  return raw ? toQuestion(translated(raw as Raw, qs), imgSrc) : null;
}
