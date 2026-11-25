export interface SitePageContent {
  eyebrow: string;
  title: string;
  intro: string;
  bodyHtml: string;
  version: string;
}

function text(item: Record<string, unknown>, key: string): string {
  return typeof item[key] === "string" ? (item[key] as string) : "";
}

export function toSitePageContent(
  item: Record<string, unknown> | null | undefined,
): SitePageContent | null {
  if (!item) return null;
  return {
    eyebrow: text(item, "eyebrow"),
    title: text(item, "title"),
    intro: text(item, "intro"),
    bodyHtml: text(item, "body"),
    version: text(item, "version"),
  };
}

/** The homepage's section texts beyond the base hero fields (eyebrow/title/intro). */
export const HOME_TEXT_FIELDS = [
  "heroCta",
  "heroCta2",
  "slide2Eyebrow",
  "slide2Title",
  "slide2Intro",
  "slide2Cta",
  "slide3Eyebrow",
  "slide3Title",
  "slide3Intro",
  "slide3Cta",
  "aboutIntro",
  "aboutText1",
  "aboutText2",
  "aboutCta",
  "aboutCta2",
  "arteEyebrow",
  "arteTitle",
  "arteIntro",
  "arteSingulartLabel",
  "arteSingulartCta",
  "arteLunagalleryLabel",
  "arteLunagalleryCta",
  "presentoEyebrow",
  "presentoTitle",
  "presentoIntro",
  "presentoCaption",
  "presentoLink",
  "presentoVideoId",
  "manifestoQuote",
  "manifestoText",
  "manifestoWelcome",
  "fvEyebrow",
  "fvTitle",
  "fvText",
  "fvCta",
  "fvCaption",
  "fvVideoUrl",
  "gridEyebrow",
  "gridTitle",
  "gridCta",
  "parallaxEyebrow",
  "parallaxTitle",
  "parallaxLine",
  "storiesEyebrow",
  "storiesTitle",
  "storiesCta",
  "awardsEyebrow",
  "awardsTitle",
  "awardsText",
  "awardsCta",
  "quoteText",
  "quoteSource",
  "quoteCta",
  "faqEyebrow",
  "faqTitle",
  "faqCta",
  "ctaEyebrow",
  "ctaTitle",
  "ctaText",
  "ctaButton",
] as const;

/** The homepage's image fields — the transport resolves each to a browser-loadable https URL. */
export const HOME_IMAGE_FIELDS = [
  "heroImage",
  "heroImage2",
  "slide2Image",
  "slide3Image",
  "aboutImage",
  "fvPoster",
  "singulartLogo",
  "lunagalleryLogo",
  "awardLogo1",
  "awardLogo2",
  "awardLogo3",
  "awardLogo4",
  "awardLogo5",
  "awardLogo6",
] as const;

export type HomeContent = SitePageContent &
  Record<(typeof HOME_TEXT_FIELDS)[number], string> &
  Record<(typeof HOME_IMAGE_FIELDS)[number], string>;

export function toHomeContent(
  item: Record<string, unknown> | null | undefined,
): HomeContent | null {
  const base = toSitePageContent(item);
  if (!item || !base) return null;
  const extra = {} as HomeContent;
  for (const key of HOME_TEXT_FIELDS) extra[key] = text(item, key);
  for (const key of HOME_IMAGE_FIELDS) extra[key] = text(item, key);
  return { ...base, ...extra };
}
