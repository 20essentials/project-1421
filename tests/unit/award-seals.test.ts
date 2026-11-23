import { describe, expect, it } from "vitest";
import { awardSeals, homeExtraSeals } from "@/shared/award-seals";

const cmsHomeLogoUrls = [
  "https://static.wixstatic.com/media/600582_c6b21435075c4f75a2e85ae788bd40f8~mv2.png",
  "https://static.wixstatic.com/media/600582_ddc10a9178a043be98339105c08ea8d5~mv2.png",
  "https://static.wixstatic.com/media/600582_02a8c1efe51347b6b7f588636d848557~mv2.png",
  "https://static.wixstatic.com/media/600582_fbdd14dd878d401890627eb7f701cd66~mv2.png",
  "https://static.wixstatic.com/media/600582_3bc5573e9969414b839d337d95269b6f~mv2.png",
  "https://static.wixstatic.com/media/600582_0334b4cb9a1b4846963c5c3631d83b47~mv2.png",
];

describe("awardSeals", () => {
  it("keeps the ten awards-page seals with stable ids and unique media URLs", () => {
    expect(awardSeals).toHaveLength(10);
    expect(new Set(awardSeals.map((seal) => seal.id)).size).toBe(10);
    expect(new Set(awardSeals.map((seal) => seal.src)).size).toBe(10);
    expect(
      awardSeals.every((seal) => seal.src.startsWith("https://static.wixstatic.com/media/")),
    ).toBe(true);
  });

  it("adds six seals that are not already editable from the Home collection", () => {
    expect(homeExtraSeals).toHaveLength(6);
    for (const seal of homeExtraSeals) {
      expect(cmsHomeLogoUrls).not.toContain(seal.src);
    }
  });
});
