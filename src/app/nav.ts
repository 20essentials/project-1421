// Shared nav model — one source for the site header (SiteHeader), the footer links and the
// 404 page's floating menu. Order matters: allNav interleaves the two secondary items.
export const primaryNav = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/video", label: "Video" },
  { href: "/il-mio-metodo", label: "Il metodo" },
  { href: "/chi-sono", label: "Chi sono" },
  { href: "/location", label: "Location" },
  { href: "/investimento", label: "Investimento" },
  { href: "/blog", label: "Storie" },
  { href: "/recensioni", label: "Recensioni" },
  { href: "/faq", label: "FAQ" },
];
export const secondaryNav = [
  { href: "/awards", label: "Awards" },
  { href: "/fine-art", label: "Fine Art" },
];
export const allNav = [...primaryNav.slice(0, 5), ...secondaryNav, ...primaryNav.slice(5)];
