export interface CuratedVideo {
  id: string;
  title: string;
  note: string;
}

/** Featured videos picked by Stefano. Edit this array to change "In evidenza". */
export const curatedVideos: CuratedVideo[] = [
  { id: "JUkLNUDQdyI", title: "Video reel wedding 2026", note: "Gennaio 2026" },
  { id: "xBfiG56ODcg", title: "Federica & Paolo — wedding video", note: "2023" },
  { id: "Wt7sIGC8cEM", title: "Video promo SL", note: "2020" },
];
