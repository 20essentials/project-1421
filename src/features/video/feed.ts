export interface FeedVideo {
  id: string;
  title: string;
  published: string;
}

const FEED_URL = "https://www.youtube.com/feeds/videos.xml?channel_id=UCgXlR8jkSz_eY4p4x7lputQ";
const CACHE_TTL = 60 * 60 * 1000;

let cache: { at: number; videos: FeedVideo[] } | null = null;

const decodeXml = (value: string): string =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .trim();

const parseEntry = (entry: string): FeedVideo | null => {
  const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
  const title = entry.match(/<title>([^<]+)<\/title>/)?.[1];
  const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];
  if (!id || !title) return null;
  return { id, title: decodeXml(title), published: published ?? "" };
};

export async function fetchChannelFeed(): Promise<FeedVideo[]> {
  if (cache && Date.now() - cache.at < CACHE_TTL) return cache.videos;
  try {
    const response = await fetch(FEED_URL, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`YouTube feed responded ${response.status}`);
    const xml = await response.text();
    const videos = xml
      .split("<entry>")
      .slice(1)
      .map(parseEntry)
      .filter((video): video is FeedVideo => video !== null);
    if (videos.length > 0) cache = { at: Date.now(), videos };
    return videos.length > 0 ? videos : (cache?.videos ?? []);
  } catch {
    return cache?.videos ?? [];
  }
}
