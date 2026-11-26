export interface CountStat {
  target: number;
  suffix: string;
}

export function parseCountStat(raw: string): CountStat | null {
  const match = /^(\d+)(\D*)$/.exec(raw.trim());
  if (!match) return null;
  return { target: Number(match[1]), suffix: match[2] };
}

export function countAt(from: number, to: number, progress: number): number {
  const t = Math.max(0, Math.min(1, progress));
  const eased = 1 - Math.pow(1 - t, 3);
  return Math.round(from + (to - from) * eased);
}

export function formatCountStat(stat: CountStat, value: number): string {
  return `${value}${stat.suffix}`;
}
