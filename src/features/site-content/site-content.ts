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
  video: "Video",
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

export async function getSitePageContent(page: SitePageId): Promise<SitePageContent> {
  const result = await queryItems(SITE_PAGE_COLLECTIONS[page], { limit: 1 });
  const content = toSitePageContent(result.items[0] ?? null);
  if (!content)
    throw new Error(`SiteContent: no item in collection "${SITE_PAGE_COLLECTIONS[page]}".`);
  return content;
}

export async function getHomeContent(): Promise<HomeContent> {
  const result = await queryItems("Home", { limit: 1 });
  const content = toHomeContent(result.items[0] ?? null);
  if (!content) throw new Error('SiteContent: no item in collection "Home".');
  return content;
}
