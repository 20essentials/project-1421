import { withPublishedTranslation } from "@/features/i18n/published-content";
import type { HeaderLike } from "@/features/i18n/locale-from-request";
import { queryItems } from "@/wix/cms/items";
import {
  toHomeContent,
  toSitePageContent,
  type HomeContent,
  type SitePageContent,
} from "./site-content-core";

const SITE_PAGE_COLLECTIONS = {
  home: "Home",
  "il-mio-metodo": "IlMetodo",
  "chi-sono": "ChiSono",
  contatti: "Contatti",
  "fine-art": "FineArt",
  location: "Location",
  investimento: "Investimento",
  awards: "Awards",
  recensioni: "Recensioni",
  "termini-e-condizioni": "TerminiECondizioni",
  privacy: "Privacy",
  accessibilita: "Accessibilita",
  "carta-accordo-privacy": "CartaAccordoPrivacy",
  "manifesto-soberania-digitale": "ManifestoSoberaniaDigitale",
  "termini-di-utilizzo": "TerminiDiUtilizzo",
  "accordo-utente": "AccordoUtente",
  "cookie-policy": "CookiePolicy",
  "resi-e-rimborsi": "ResiERimborsi",
  "protezione-dati": "ProtezioneDati",
  "avviso-legale": "AvvisoLegale",
  "legal-index": "LegalIndex",
  "not-found": "NotFound",
} as const;

export type SitePageId = keyof typeof SITE_PAGE_COLLECTIONS;

export async function getSitePageContent(
  page: SitePageId,
  headers?: HeaderLike,
): Promise<SitePageContent> {
  const collection = SITE_PAGE_COLLECTIONS[page];
  const result = await queryItems(collection, { limit: 1 });
  const raw = result.items[0];
  const translated = raw
    ? await withPublishedTranslation(raw, { entityType: collection, headers })
    : {};
  const content = toSitePageContent(translated);
  if (!content) throw new Error(`SiteContent: no item in collection "${collection}".`);
  return content;
}

export async function getHomeContent(headers?: HeaderLike): Promise<HomeContent> {
  const result = await queryItems("Home", { limit: 1 });
  const raw = result.items[0];
  const translated = raw
    ? await withPublishedTranslation(raw, { entityType: "Home", headers })
    : {};
  const content = toHomeContent(translated);
  if (!content) throw new Error('SiteContent: no item in collection "Home".');
  return content;
}
