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

/** Homepage wedding-grid photos and their editable alt text, paired by number. */
export const HOME_GRID_IMAGE_FIELDS = [
  "gridImage01",
  "gridImage02",
  "gridImage03",
  "gridImage04",
  "gridImage05",
  "gridImage06",
  "gridImage07",
  "gridImage08",
  "gridImage09",
  "gridImage10",
  "gridImage11",
  "gridImage12",
  "gridImage13",
  "gridImage14",
  "gridImage15",
  "gridImage16",
] as const;

export const HOME_GRID_ALT_FIELDS = [
  "gridAlt01",
  "gridAlt02",
  "gridAlt03",
  "gridAlt04",
  "gridAlt05",
  "gridAlt06",
  "gridAlt07",
  "gridAlt08",
  "gridAlt09",
  "gridAlt10",
  "gridAlt11",
  "gridAlt12",
  "gridAlt13",
  "gridAlt14",
  "gridAlt15",
  "gridAlt16",
] as const;

const HOME_GRID_PHOTO_DIMENSIONS: Record<
  (typeof HOME_GRID_IMAGE_FIELDS)[number],
  { width: number; height: number }
> = {
  gridImage01: { width: 1600, height: 1066 },
  gridImage02: { width: 1066, height: 1600 },
  gridImage03: { width: 1600, height: 1068 },
  gridImage04: { width: 1066, height: 1600 },
  gridImage05: { width: 1066, height: 1600 },
  gridImage06: { width: 1068, height: 1600 },
  gridImage07: { width: 1066, height: 1600 },
  gridImage08: { width: 1066, height: 1600 },
  gridImage09: { width: 1066, height: 1600 },
  gridImage10: { width: 1600, height: 1098 },
  gridImage11: { width: 1600, height: 1067 },
  gridImage12: { width: 1066, height: 1600 },
  gridImage13: { width: 1600, height: 1063 },
  gridImage14: { width: 1600, height: 1066 },
  gridImage15: { width: 1600, height: 1062 },
  gridImage16: { width: 1600, height: 1066 },
};

export interface HomeGridPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export type HomeContent = SitePageContent &
  Record<(typeof HOME_TEXT_FIELDS)[number], string> &
  Record<(typeof HOME_IMAGE_FIELDS)[number], string> &
  Record<(typeof HOME_GRID_IMAGE_FIELDS)[number], string> &
  Record<(typeof HOME_GRID_ALT_FIELDS)[number], string>;

export interface NotFoundContent extends SitePageContent {
  notFoundImage: string;
}

export function toHomeContent(
  item: Record<string, unknown> | null | undefined,
): HomeContent | null {
  const base = toSitePageContent(item);
  if (!item || !base) return null;
  const extra = {} as HomeContent;
  for (const key of HOME_TEXT_FIELDS) extra[key] = text(item, key);
  for (const key of HOME_IMAGE_FIELDS) extra[key] = text(item, key);
  for (const key of HOME_GRID_IMAGE_FIELDS) extra[key] = text(item, key);
  for (const key of HOME_GRID_ALT_FIELDS) extra[key] = text(item, key);
  return { ...base, ...extra };
}

export function toHomeGridPhotos(content: HomeContent): HomeGridPhoto[] {
  return HOME_GRID_IMAGE_FIELDS.flatMap((key, index) => {
    const src = content[key];
    if (!src) return [];
    const { width, height } = HOME_GRID_PHOTO_DIMENSIONS[key];
    return [{ src, alt: content[HOME_GRID_ALT_FIELDS[index]], width, height }];
  });
}

export function toNotFoundContent(
  item: Record<string, unknown> | null | undefined,
): NotFoundContent | null {
  const base = toSitePageContent(item);
  if (!item || !base) return null;
  return { ...base, notFoundImage: text(item, "notFoundImage") };
}
