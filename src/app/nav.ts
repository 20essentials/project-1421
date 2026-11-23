import type { NavPath } from "@/features/site-chrome/site-chrome-core";

export const primaryNav: NavPath[] = [
  { href: "/portfolio", labelKey: "navPortfolio" },
  { href: "/video", labelKey: "navVideo" },
  { href: "/il-mio-metodo", labelKey: "navMethod" },
  { href: "/chi-sono", labelKey: "navAbout" },
  { href: "/location", labelKey: "navLocation" },
  { href: "/investimento", labelKey: "navInvestment" },
  { href: "/blog", labelKey: "navStories" },
  { href: "/recensioni", labelKey: "navReviews" },
  { href: "/faq", labelKey: "navFaq" },
];

export const secondaryNav: NavPath[] = [
  { href: "/awards", labelKey: "navAwards" },
  { href: "/fine-art", labelKey: "navFineArt" },
];

export const allNav: NavPath[] = [
  ...primaryNav.slice(0, 5),
  ...secondaryNav,
  ...primaryNav.slice(5),
];
