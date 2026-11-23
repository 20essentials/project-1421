// llms.txt — the machine-readable site summary for AI assistants (llmstxt.org convention):
// the site's facts, pages, services and FAQ as plain markdown, so an LLM can answer questions
// about Stefano Lunardi without scraping. Data comes from the same fetchers the pages use.
//
// ROUTE OWNERSHIP (verified against the live edge, see docs/wix-platform-issues.md §5): Wix
// hosting serves /llms.txt itself and never reaches the Astro worker at that path — this file
// is therefore the CONTENT GENERATOR, not the serving route. The generated text (plus Wix's
// own MCP section, preserved verbatim) is PUT to the Llms Txt API
// (https://www.wixapis.com/promote-seo-robots-server/v2/llms, `manuallyEdited: true`) to
// publish it. Re-run that sync after content changes: the file Wix serves is a snapshot.
//
// Every section fails open: an FAQ outage must shorten the file, not 500 the route.
import { fetchPosts, postPath } from "@/features/blog/posts";
import { fetchCollections, fetchProjects } from "@/features/portfolio/portfolio";
import { fetchFaq } from "@/features/faq/faq";
import { getSiteChrome } from "@/features/site-chrome/site-chrome";
import { fetchSiteInfo } from "@/features/site-info/site-info";
import { SITE_INFO_FALLBACKS, type SiteInfo } from "@/features/site-info/site-info-core";

export async function GET({ request }: { request: Request }): Promise<Response> {
  const forwardedUrl = request.headers.get("x-wix-forwarded-url");
  const origin =
    (import.meta.env.PUBLIC_SITE_URL || "").replace(/\/$/, "") ||
    (forwardedUrl && URL.canParse(forwardedUrl) ? new URL(forwardedUrl).origin : new URL(request.url).origin);
  const url = (path: string): string => new URL(path, origin).href;

  const [infoRes, labelsRes, postsRes, collectionsRes, projectsRes, faqRes] = await Promise.allSettled([
    fetchSiteInfo(),
    getSiteChrome(request.headers),
    fetchPosts({ limit: 10, headers: request.headers }),
    fetchCollections({ headers: request.headers }),
    fetchProjects({ limit: 30, headers: request.headers }),
    fetchFaq(request.headers),
  ]);

  const info: SiteInfo = infoRes.status === "fulfilled" ? infoRes.value : SITE_INFO_FALLBACKS;
  const labels = labelsRes.status === "fulfilled" ? labelsRes.value : {};
  const label = (key: string, fallback: string): string => labels[key] || fallback;

  const lines: string[] = [];
  lines.push(`# ${info.displayName || info.businessName}`);
  lines.push("");
  lines.push(
    `> ${label("seoDescription", "Fotografia di matrimonio fine art in Italia e Austria: storie autentiche, emozioni e ricordi che restano.")}`,
  );
  lines.push("");
  lines.push(
    "Fotografo di matrimoni e fine art tra Villach (Austria), Udine e Treviso (Italia). " +
      "Reportage autentico, scatto analogico e digitale, metodo dei tre incontri preparatori. " +
      "Il sito è disponibile in italiano, español, english e deutsch su path per lingua (/it, /es, /en, /de).",
  );
  lines.push("");

  lines.push("## Contatti");
  lines.push("");
  if (info.email) lines.push(`- Email: ${info.email}`);
  if (info.phone) lines.push(`- Telefono: ${info.phone}`);
  if (info.address) lines.push(`- Indirizzo: ${info.address}`);
  lines.push(`- Contatti e form di richiesta: ${url("/contatti")}`);
  lines.push("");

  lines.push("## Pagine");
  lines.push("");
  for (const [path, name] of [
    ["/portfolio", "Portfolio — collezioni di matrimoni e progetti"],
    ["/video", "Video — showreel e film di matrimonio"],
    ["/il-mio-metodo", "Il mio metodo — i tre incontri preparatori"],
    ["/chi-sono", "Chi sono — biografia di Stefano Lunardi"],
    ["/location", "Location — dove lavoro (Austria e Italia)"],
    ["/investimento", "Investimento — pacchetti e prezzi"],
    ["/awards", "Awards — premi e riconoscimenti"],
    ["/fine-art", "Fine art — opere d'arte fotografiche"],
    ["/blog", "Blog — storie e racconti di matrimoni"],
    ["/recensioni", "Recensioni — cosa dicono le coppie"],
    ["/faq", "FAQ — domande frequenti"],
    ["/contatti", "Contatti — richiesta di disponibilità"],
  ] as const) {
    lines.push(`- [${name}](${url(path)})`);
  }
  lines.push("");

  if (collectionsRes.status === "fulfilled" && collectionsRes.value.length) {
    lines.push("## Collezioni del portfolio");
    lines.push("");
    for (const c of collectionsRes.value) {
      lines.push(`- [${c.title}](${url(`/portfolio/${c.slug}`)})${c.description ? `: ${c.description}` : ""}`);
    }
    lines.push("");
  }
  if (projectsRes.status === "fulfilled" && projectsRes.value.length) {
    lines.push("## Progetti");
    lines.push("");
    for (const p of projectsRes.value) {
      lines.push(`- [${p.title}](${url(`/projects/${p.slug}`)})${p.description ? `: ${p.description}` : ""}`);
    }
    lines.push("");
  }
  if (postsRes.status === "fulfilled" && postsRes.value.posts.length) {
    lines.push("## Storie recenti (blog)");
    lines.push("");
    for (const post of postsRes.value.posts) {
      lines.push(`- [${post.title}](${url(postPath(post.slug))})${post.excerpt ? `: ${post.excerpt}` : ""}`);
    }
    lines.push("");
  }
  if (faqRes.status === "fulfilled" && faqRes.value.questions.length) {
    lines.push("## Domande frequenti");
    lines.push("");
    for (const q of faqRes.value.questions) {
      lines.push(`### ${q.question}`);
      lines.push("");
      if (q.answerText) lines.push(q.answerText);
      lines.push(`Answer page: ${url(`/faq#q-${q.slug || q.id}`)}`);
      lines.push("");
    }
  }

  const body = lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
