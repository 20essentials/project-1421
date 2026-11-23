import { localizedHref } from "@/features/i18n/localized-path";
import type { Locale } from "@/features/i18n/locale";

export const SITE_CHROME_COLLECTION_ID = "SiteChrome";
export const SITE_CHROME_ITEM_ID = "SINGLE_ITEM_ID";

export type SiteChromeLabels = Record<string, string>;

export interface NavPath {
  href: string;
  labelKey: string;
}

export interface NavItem {
  href: string;
  label: string;
}

export const SITE_CHROME_FALLBACKS: SiteChromeLabels = {
  navPortfolio: "Portfolio",
  navVideo: "Video",
  navMethod: "Il metodo",
  navAbout: "Chi sono",
  navLocation: "Location",
  navInvestment: "Investimento",
  navStories: "Storie",
  navReviews: "Recensioni",
  navFaq: "FAQ",
  navAwards: "Awards",
  navFineArt: "Fine Art",
  skipLink: "Salta al contenuto",
  homeAriaLabel: "Stefano Lunardi — Home",
  mainNavAriaLabel: "Principale",
  fullMenuAriaLabel: "Menu completo",
  socialAriaLabel: "Social",
  quoteCta: "Richiedi un preventivo",
  quoteShort: "Preventivo",
  openMenu: "Apri menu",
  closeMenu: "Chiudi menu",
  bookConsultation: "Prenota una consulenza",
  headerTagline: "Villach · Udine · Treviso",
  socialInstagram: "Instagram",
  socialFacebook: "Facebook",
  socialLinkedIn: "LinkedIn",
  socialYouTube: "YouTube",
  newsletterTitle: "La newsletter di Stefano",
  newsletterSubtitle: "Aggiornamenti esclusivi",
  newsletterDescription:
    "Nuovi lavori, premi e storie dietro le quinte, una volta al mese. Niente spam.",
  newsletterUnavailable:
    "L'iscrizione alla newsletter è temporaneamente non disponibile. Scrivici a studio@stefanolunardi.com.",
  footerQuote: "Tutto è fugace, ma ciò che rimane è il ricordo.",
  footerTagline: "Autenticità · Contemplazione · Relazione · Arte · Emozione",
  siteLabel: "Il sito",
  footerAriaLabel: "Footer",
  legalDocuments: "Documenti legali",
  allDocuments: "Tutti i documenti",
  termsConditions: "Termini e condizioni",
  privacy: "Privacy",
  accessibility: "Accessibilità",
  cookie: "Cookie",
  legalNotice: "Avviso legale",
  contacts: "Contatti",
  followLabel: "Segui",
  copyright: "© {year} Stefano Lunardi — Fotografo di matrimoni | Fine Art | Fotoreporter",
  cookiePreferences: "Preferenze cookie",
  cookieBannerText:
    "Usiamo cookie tecnici necessari e, solo con il tuo consenso, cookie di analisi per capire come viene visitato il sito. Puoi cambiare scelta in qualsiasi momento dal footer.",
  cookiePreferencesShort: "Preferenze",
  rejectAll: "Rifiuta",
  acceptAll: "Accetta",
  categoriesLabel: "Categorie",
  necessaryCategory: "Necessari",
  necessaryDescription: "Sempre attivi.",
  functionalCategory: "Funzionali",
  functionalDescription: "Ricordano le tue preferenze.",
  preferencesCategory: "Preferenze",
  preferencesDescription: "Personalizzano la navigazione.",
  analyticsCategory: "Analisi",
  analyticsDescription: "Statistiche anonime di visita.",
  marketingCategory: "Marketing",
  marketingDescription: "Misurazione delle campagne.",
  advertisingCategory: "Pubblicità",
  advertisingDescription: "Pixel e annunci personalizzati.",
  thirdPartyCategory: "Dati a terze parti",
  thirdPartyDescription: "Trasferimento agli strumenti collegati.",
  savePreferences: "Salva preferenze",
  searchPlaceholder: "Cerca",
  searchButton: "Cerca",
  noResults: "Nessun risultato",
  back: "Indietro",
  submit: "Invia",
  continueLabel: "Continua",
  thanks: "Grazie",
  formClosed: "Modulo chiuso",
  otherOption: "Altro",
  blogTitle: "Storie",
  blogDescription: "Storie di matrimonio, viaggi e vita",
  blogHeading: "Storie",
  blogIntro: "Racconti, idee e dietro le quinte",
  allFilter: "Tutti",
  postsLoadError: "Impossibile caricare gli articoli",
  noPosts: "Nessun articolo",
  readingUnit: "min di lettura",
  loadMore: "Carica altri",
  loading: "Caricamento",
  categoryLabel: "Categoria",
  tagLabel: "Tema",
  noCategoryPosts: "Nessun articolo in questa categoria",
  noTagPosts: "Nessun articolo con questo tema",
  faqTitle: "FAQ",
  faqHeading: "Domande frequenti",
  faqIntro: "Tutto quello che devi sapere",
  faqQuestionsUnit: "domande",
  faqTopicsUnit: "argomenti",
  faqSearchPlaceholder: "Cerca nelle risposte",
  faqSearchButton: "Cerca",
  resultUnit: "risultati",
  faqAll: "Tutte",
  faqCategories: "Categorie",
  faqNoQuestions: "Nessuna domanda",
  retry: "Riprova",
  faqNoResults: "Nessun risultato",
  resetSearch: "Azzera ricerca",
  copyLink: "Copia link",
  copied: "Copiato",
  copyLinkAria: "Copia il link di questa domanda",
  faqLimit: "Domande",
  portfolioTitle: "Portfolio",
  portfolioDescription: "Matrimoni, ritratti e storie visive",
  portfolioRole: "Fotografia",
  portfolioHeading: "Ogni fotogramma è un dipinto",
  portfolioIntro: "Una selezione di storie e luoghi",
  portfolioLoadError: "Impossibile caricare il portfolio",
  noCollections: "Nessuna collezione",
  noProjects: "Nessun progetto",
  noImages: "Nessuna immagine",
  projectNotFound: "Progetto non trovato",
  collectionNotFound: "Collezione non trovata",
  videoHeading: "Video",
  videoIntro: "Storie in movimento",
  watchAllVideos: "Guarda tutti i video",
  fromChannel: "Dal canale",
  reelAria: "Video",
  scrollExplore: "Scorri per esplorare",
  pageNotFound: "Pagina non trovata",
  backHome: "Torna alla home",
  lensInstructions: "Muovi la lente per esplorare l'immagine",
  lensDiameter: "Lente",
  lensLock: "Blocca lente",
  localeLabel: "Lingua",
  contactMessageTitle: "Scrivimi",
  contactResponseNote: "Rispondo di solito entro 24 ore",
  directContacts: "Contatti diretti",
  zones: "Zone",
  firstMeetingTitle: "Primo incontro",
  jobTitle: "Fotografo di matrimoni",
  knowsAboutWedding: "Fotografia di matrimonio",
  knowsAboutFineArt: "Fine Art",
  knowsAboutPhotojournalism: "Fotoreportage",
};

export function toSiteChromeLabels(item: Record<string, unknown> | null | undefined): SiteChromeLabels {
  const labels: SiteChromeLabels = { ...SITE_CHROME_FALLBACKS };
  const keys = new Set([...Object.keys(SITE_CHROME_FALLBACKS), ...Object.keys(item ?? {})]);
  for (const key of keys) {
    if (key.startsWith("_")) continue;
    const value = item?.[key];
    if (typeof value === "string") labels[key] = value;
  }
  return labels;
}

export function toNavItems(
  paths: readonly NavPath[],
  labels: SiteChromeLabels,
  locale: Locale,
): NavItem[] {
  return paths.map((path) => ({
    href: localizedHref(locale, path.href),
    label: labels[path.labelKey] ?? "",
  }));
}
