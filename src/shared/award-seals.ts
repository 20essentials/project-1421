export interface AwardSeal {
  id: string;
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
}

export const awardSeals: readonly AwardSeal[] = [
  {
    id: "qep",
    src: "https://static.wixstatic.com/media/600582_fba6dd2ca035494cb920338e825adfa2~mv2.jpg",
    alt: "Qualifica QEP — Qualified European Photographer",
    label: "Qualifica QEP",
    width: 1029,
    height: 1004,
  },
  {
    id: "ipa-winner",
    src: "https://static.wixstatic.com/media/600582_02a8c1efe51347b6b7f588636d848557~mv2.png",
    alt: "IPA International Photo Awards — winner seal",
    label: "IPA International Photo Awards",
    width: 800,
    height: 790,
  },
  {
    id: "ipa-wedding-2016",
    src: "https://static.wixstatic.com/media/600582_0334b4cb9a1b4846963c5c3631d83b47~mv2.png",
    alt: "IPA International Photo Awards — 2° place Wedding 2016",
    label: "IPA International Photo Awards",
    width: 800,
    height: 790,
  },
  {
    id: "ipa-black-heart-2020",
    src: "https://static.wixstatic.com/media/600582_8a308e530faa45cfbcdf8ea49c438de9~mv2.png",
    alt: 'IPA International Photo Awards — 3° place "Black Heart" 2020',
    label: "IPA International Photo Awards",
    width: 2000,
    height: 2061,
  },
  {
    id: "bw-spider",
    src: "https://static.wixstatic.com/media/600582_bd28daabcca94357bd6e3a41e0d4ea3a~mv2.jpg",
    alt: "B&W Spider Awards — honorable mention",
    label: "B&W Spider Awards",
    width: 483,
    height: 837,
  },
  {
    id: "color-awards-11",
    src: "https://static.wixstatic.com/media/600582_3bc5573e9969414b839d337d95269b6f~mv2.png",
    alt: "International Color Awards — winner 11th edizione",
    label: "International Color Awards",
    width: 250,
    height: 251,
  },
  {
    id: "color-master",
    src: "https://static.wixstatic.com/media/600582_6b844f98f59f4792af43ce1483106b65~mv2.jpg",
    alt: "International Color Awards — Color Master nominee",
    label: "International Color Awards",
    width: 250,
    height: 245,
  },
  {
    id: "mifa-silver-2017",
    src: "https://static.wixstatic.com/media/600582_fbdd14dd878d401890627eb7f701cd66~mv2.png",
    alt: "MIFA Moscow International Foto Awards — silver 2017",
    label: "MIFA Moscow",
    width: 702,
    height: 702,
  },
  {
    id: "wpga-2016",
    src: "https://static.wixstatic.com/media/600582_c44541e7e73d4a8aad75998536353639~mv2.png",
    alt: "WPGA — honorable mention 2016",
    label: "WPGA",
    width: 800,
    height: 300,
  },
  {
    id: "grande-plaque",
    src: "https://static.wixstatic.com/media/600582_e670259e22cb4eec80d2b88f434b4584~mv2.jpeg",
    alt: "La Grande Plaque",
    label: "La Grande Plaque",
    width: 360,
    height: 360,
  },
];

const homeExtraSealIds = new Set([
  "qep",
  "ipa-black-heart-2020",
  "bw-spider",
  "color-master",
  "wpga-2016",
  "grande-plaque",
]);

export const homeExtraSeals = awardSeals.filter((seal) => homeExtraSealIds.has(seal.id));
