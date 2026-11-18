export interface ReelProject {
  name: string;
  category: string;
  description: string;
  image: string;
  link: string;
}

export const PLANE_W = 2.38;
export const PLANE_H = 1.5771;
export const PLANE_ASPECT = PLANE_W / PLANE_H;
export const HALF_W = 1.19;
export const STEP = 0.95;
export const BEND_BASE = 0.3;
export const BEND_RANGE = 0.12;
export const RIPPLE = 0.006;
export const CAM_FOV = 65.7;
export const CAM_Z = 8.1;
export const Z_OFFSET = 0.28;

const VIEW_TAN = Math.tan(((CAM_FOV / 2) * Math.PI) / 180);

export const clamp = (v: number, min: number, max: number): number =>
  Math.min(Math.max(v, min), max);

export const mod = (a: number, n: number): number => ((a % n) + n) % n;

export const wrapRel = (rel: number, n: number): number => {
  const half = n / 2;
  return mod(rel + half, n) - half;
};

export interface ReelLayout {
  scale: number;
  radius: number;
  depth: number;
  pitch: number;
  frontFraction: number;
}

export const computeLayout = (vw: number, vh: number): ReelLayout => {
  const aspect = clamp(vw / Math.max(vh, 1), 0.2, 5);
  const t = clamp(1 - (aspect - 0.62) / 0.58, 0, 1);
  const frontFraction = 0.37 + 0.4 * t;
  const f = Math.pow(clamp(aspect / 1.6, 0.2, 1.3), 0.3);
  const depth = 2.4 * f;
  const camDist = CAM_Z - (depth - Z_OFFSET);
  const viewH = 2 * VIEW_TAN * camDist;
  const scale = (frontFraction * aspect * viewH) / PLANE_W;
  return {
    scale,
    radius: 7.4 * f,
    depth,
    pitch: 0.52 * scale,
    frontFraction
  };
};

export interface CardTransform {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  visible: boolean;
}

export const cardTransform = (
  i: number,
  phase: number,
  layout: ReelLayout,
  n: number,
  lean = 0
): CardTransform => {
  const rel = wrapRel(i - phase, n);
  const theta = rel * STEP;
  const x = Math.sin(theta) * layout.radius;
  const y = rel * layout.pitch;
  const z = Math.cos(theta) * layout.depth - Z_OFFSET;
  const rotY = Math.atan2(
    layout.depth * Math.sin(theta),
    layout.radius * Math.cos(theta)
  );
  const rotX = rel * -0.01 + lean;
  const visible = Math.cos(rotY) > 0.03;
  return { x, y, z, rotX, rotY, visible };
};

export const clampDt = (dt: number): number => Math.min(Math.max(dt, 0), 0.05);

export const smoothPhase = (
  phase: number,
  target: number,
  dt: number
): number => phase + (target - phase) * (1 - Math.exp(-13 * dt));

export const wheelImpulse = (
  dy: number,
  dx: number,
  deltaMode: number
): number => {
  const d = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
  const v = deltaMode === 1 ? d * 33 : d;
  return clamp(v, -160, 160) * 0.0016;
};

export const settleTarget = (target: number): number => Math.round(target);

export const modIndex = (target: number, n: number): number =>
  mod(Math.round(target), n);

export const homeTarget = (target: number, n: number): number => {
  const base = Math.round(target);
  return base - mod(base, n);
};

export const leanFromVelocity = (vel: number): number =>
  clamp(vel * -0.05, -0.15, 0.15);

export const bendTarget = (lead: number): number =>
  BEND_BASE + BEND_RANGE * clamp(lead / 1.1, 0, 1);

export const ariaText = (p: ReelProject): string =>
  `${p.name} — ${p.category}. ${p.description}`;
