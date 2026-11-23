// The post-body renderer — wire AS-IS (machinery, not a reference). A post body is a Ricos
// document, not HTML and not text: never innerHTML it, never String() its nodes. This is the
// documented render path (@wix/ricos/viewer + quick-start plugins: the viewer-only entry, 11.17+,
// without the editor, its dev tools and CodeMirror that the root import drags into every bundle).
//
// In Astro this component MUST be a `client:only="react"` island — the ricos viewer breaks
// under SSR. Dark theme: the ricos CSS hardcodes near-black text; scope an override on
// `.ricos-content` forcing the foreground token (in Astro use <style is:global> — React
// islands don't inherit scoped Astro styles).
import { quickStartViewerPlugins, RicosViewer } from "@wix/ricos/viewer";
import type { RicosViewerProps } from "@wix/ricos/viewer";
import { fetchWithAuth } from "@wix/sdk/context";
import "@wix/ricos/css/all-plugins-viewer.css";

// Module-level, once — never rebuild the plugin list per render.
const plugins = quickStartViewerPlugins();

// RicosViewer warns and makes unauthenticated requests without a wixClient. There is no client
// object under ambient auth; this bridge routes the viewer's calls through the same ambient
// fetchWithAuth every other client island uses (the viewer only calls fetchWithAuth and
// auth.getAuthHeaders, which the ambient layer handles itself — hence empty headers).
const ricosWixClient = {
  fetchWithAuth: (url: string | URL, init?: RequestInit) => fetchWithAuth(url, init),
  auth: { getAuthHeaders: async () => ({ headers: {} as Record<string, string> }) },
} as unknown as NonNullable<RicosViewerProps["wixClient"]>;

export interface RichContentProps {
  /** PostDetail.richContent — the Ricos document (plain JSON). */
  content: Record<string, unknown> | null;
  /** PostDetail.paragraphs — the honest fallback body when richContent is null. */
  fallbackParagraphs?: string[];
}

/** A node has renderable text when it or any descendant carries a non-empty text run. */
function hasText(node: any): boolean {
  const t = node?.textData?.text ?? node?.text_data?.text;
  if (typeof t === "string" && t.trim()) return true;
  return (node?.nodes ?? []).some(hasText);
}

/**
 * The dashboard's rich text editor leaves stray empty paragraphs between sections; the viewer
 * renders each as a full blank line, which reads as brutal gaps. Drop PARAGRAPH nodes that carry
 * no text (images/embeds and headings stay), on a copy — the source document is untouched.
 */
function withoutEmptyParagraphs(content: Record<string, unknown>): Record<string, unknown> {
  const nodes = (Array.isArray(content.nodes) ? content.nodes : []).filter(
    (n: any) => !(n?.type === "PARAGRAPH" && !hasText(n)),
  );
  return { ...content, nodes };
}

export default function RichContent({ content, fallbackParagraphs = [] }: RichContentProps) {
  if (content) {
    return (
      <div className="ricos-content">
        <RicosViewer content={withoutEmptyParagraphs(content) as any} plugins={plugins} wixClient={ricosWixClient} />
      </div>
    );
  }
  if (fallbackParagraphs.length > 0) {
    return (
      <div className="space-y-4">
        {fallbackParagraphs.map((p, i) => (
          <p key={i} className="leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    );
  }
  return null;
}
