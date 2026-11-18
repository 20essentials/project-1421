import * as THREE from 'three';
import {
  PLANE_W,
  PLANE_H,
  HALF_W,
  BEND_BASE,
  RIPPLE,
  CAM_FOV,
  CAM_Z,
  PLANE_ASPECT,
  smoothPhase,
  modIndex,
  leanFromVelocity,
  bendTarget,
  clampDt,
  cardTransform,
  computeLayout,
  ariaText,
  clamp,
  type ReelProject,
  type ReelLayout
} from './engine';

const VERTEX_SHADER = `
uniform float uBend;
uniform float uTime;
uniform float uRipple;
varying vec2 vUv;
varying float vShade;
void main() {
  vUv = uv;
  vec3 p = position;
  float angle = (p.x / ${HALF_W}) * uBend;
  float radius = ${HALF_W} / uBend;
  p.z += (cos(angle) - 1.0) * radius;
  p.x = sin(angle) * radius;
  p.y += sin(uTime * 0.7 + position.x * 3.1) * uRipple;
  vShade = 0.9 + 0.1 * cos(angle);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const FRAGMENT_SHADER = `
uniform sampler2D uMap;
uniform float uTexAspect;
varying vec2 vUv;
varying float vShade;
void main() {
  vec2 uv = vUv;
  if (uTexAspect > ${PLANE_ASPECT.toFixed(6)}) {
    uv.x = (uv.x - 0.5) * (${PLANE_ASPECT.toFixed(6)} / uTexAspect) + 0.5;
  } else {
    uv.y = (uv.y - 0.5) * (uTexAspect / ${PLANE_ASPECT.toFixed(6)}) + 0.5;
  }
  vec2 q = abs(uv - 0.5) - vec2(0.5) + 0.04;
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 0.04;
  float w = fwidth(d);
  float alpha = 1.0 - smoothstep(-w * 1.5, w * 1.5, d);
  if (alpha < 0.003) discard;
  vec4 tex = texture2D(uMap, uv);
  gl_FragColor = vec4(tex.rgb * vShade, alpha * tex.a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

interface Card {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  uniforms: {
    uMap: { value: THREE.Texture | null };
    uTexAspect: { value: number };
    uBend: { value: number };
    uTime: { value: number };
    uRipple: { value: number };
  };
}

const readProjects = (section: HTMLElement): ReelProject[] => {
  const el = section.querySelector<HTMLScriptElement>(
    'script[type="application/json"][data-coil-projects]'
  );
  if (!el || !el.textContent) return [];
  try {
    const parsed: unknown = JSON.parse(el.textContent);
    return Array.isArray(parsed) ? (parsed as ReelProject[]) : [];
  } catch {
    return [];
  }
};

const sameOriginAsset = (src: string): string => {
  try {
    const url = new URL(src, window.location.href);
    // Same-origin assets resolve to a plain pathname; CDN assets (static.wixstatic.com)
    // must keep their absolute URL — TextureLoader loads them with CORS.
    return url.origin === window.location.origin ? url.pathname : url.href;
  } catch {
    return src;
  }
};

export interface MountResult {
  destroy: () => void;
}

export const mountReel = (section: HTMLElement): MountResult | null => {
  if (section.dataset.coilInit) return null;
  section.dataset.coilInit = 'true';

  const canvas = section.querySelector<HTMLCanvasElement>('[data-coil-canvas]');
  const live = section.querySelector<HTMLElement>('[data-coil-live]');
  const wrap = section.closest<HTMLElement>('[data-coil-wrap]');
  const projects = readProjects(section);
  const n = projects.length;
  if (!canvas || n === 0) return null;

  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const dispatchFallback = () => {
    canvas.setAttribute('hidden', '');
    section.dispatchEvent(
      new CustomEvent('coil:fallback', {
        detail: { sources: projects.map((project) => ({ ...project, src: project.image })) }
      })
    );
  };

  const tryCreateRenderer = (): THREE.WebGLRenderer | null => {
    try {
      const candidate = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      if (candidate.getContext()) return candidate;
      candidate.dispose();
    } catch {
      /* WebGL unavailable */
    }
    return null;
  };

  const renderer = tryCreateRenderer();
  if (!renderer) {
    dispatchFallback();
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CAM_FOV, 1, 0.1, 40);
  camera.position.set(0, 0, CAM_Z);

  const geometry = new THREE.PlaneGeometry(PLANE_W, PLANE_H, 48, 24);
  const loader = new THREE.TextureLoader();

  const cards: Card[] = projects.map((project) => {
    const uniforms = {
      uMap: { value: null as THREE.Texture | null },
      uTexAspect: { value: PLANE_ASPECT },
      uBend: { value: BEND_BASE },
      uTime: { value: 0 },
      uRipple: { value: RIPPLE }
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    loader.load(sameOriginAsset(project.image), (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      const img = tex.image as { width: number; height: number } | undefined;
      if (img && img.height) uniforms.uTexAspect.value = img.width / img.height;
      uniforms.uMap.value = tex;
    });
    return { mesh, uniforms };
  });

  let layout: ReelLayout = computeLayout(window.innerWidth, window.innerHeight);  let target = 0;
  let phase = 0;
  let prevPhase = 0;
  let bend = BEND_BASE;
  let lean = 0;
  let time = 0;
  let shownIndex = -1;
  let raf = 0;
  let last = 0;
  let pageVisible = !document.hidden;
  let inView = true;

  const updateAria = (idx: number) => {
    const project = projects[idx];
    if (!project) return;
    canvas.setAttribute(
      'aria-label',
      `Reel del portfolio. Progetto corrente: ${project.name}, ${project.category}. ${project.description}`
    );
    if (live) live.textContent = ariaText(project);
  };

  const update = (dt: number) => {
    if (reducedQuery.matches) {
      phase = target;
    } else {
      phase = smoothPhase(phase, target, dt);
    }
    const vel = dt > 0 ? (phase - prevPhase) / dt : 0;
    prevPhase = phase;
    const bendGoal = reducedQuery.matches
      ? BEND_BASE
      : bendTarget(Math.abs(target - phase));
    bend += (bendGoal - bend) * (1 - Math.exp(-10 * dt));
    const leanGoal = reducedQuery.matches ? 0 : leanFromVelocity(vel);
    lean += (leanGoal - lean) * (1 - Math.exp(-9 * dt));
    time += dt;
    for (let i = 0; i < n; i++) {
      const card = cards[i];
      const t = cardTransform(i, phase, layout, n, lean);
      card.mesh.position.set(t.x, t.y, t.z);
      card.mesh.rotation.set(t.rotX, t.rotY, 0);
      card.mesh.scale.setScalar(layout.scale);
      card.mesh.visible = t.visible;
      card.uniforms.uTime.value = time;
      card.uniforms.uBend.value = bend;
      card.uniforms.uRipple.value = reducedQuery.matches ? 0 : RIPPLE;
    }
    renderer.render(scene, camera);
    const idx = modIndex(target, n);
    if (idx !== shownIndex) {
      shownIndex = idx;
      updateAria(idx);
    }
  };

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = clampDt((now - last) / 1000);
    last = now;
    update(dt);
  };

  const isRunning = () => pageVisible && inView;

  const emitState = () => {
    section.dataset.coilState = isRunning() ? 'running' : 'paused';
  };

  const start = () => {
    if (raf || !isRunning()) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
    emitState();
  };

  const stopTick = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    emitState();
  };

  const refreshSize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
    // The stage is 150vh: proportions follow the canvas, not the window.
    layout = computeLayout(w, h);
  };

  const resizeObserver = new ResizeObserver(refreshSize);
  resizeObserver.observe(canvas);

  const onResize = () => refreshSize();
  window.addEventListener('resize', onResize);

  const observer = new IntersectionObserver(
    (entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      if (isRunning()) start();
      else stopTick();
    },
    { threshold: 0, rootMargin: '-48px 0px -48px 0px' }
  );
  observer.observe(section);

  const onVisibility = () => {
    pageVisible = !document.hidden;
    if (pageVisible) start();
    else stopTick();
  };
  document.addEventListener('visibilitychange', onVisibility);

  // Scroll-driven: the pinned wrapper's progress maps to the reel target, so
  // the page scroll keeps flowing (no wheel hijack). Dragging stays available.
  const scrollTarget = () => {
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    if (total <= 0) return;
    target = clamp(-r.top / total, 0, 1) * (n - 1);
  };
  window.addEventListener('scroll', scrollTarget, { passive: true });

  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragBase = 0;

  const releasePointer = (e: PointerEvent) => {
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerDown = (e: PointerEvent) => {
    if (!e.isPrimary) return;
    dragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragBase = target;
    canvas.setPointerCapture(e.pointerId);
    section.dataset.coilGrabbing = 'true';
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    target = dragBase + (-dx + dy) * 0.0036;
  };

  const settle = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    releasePointer(e);
    delete section.dataset.coilGrabbing;
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', settle);
  canvas.addEventListener('pointercancel', settle);

  scrollTarget();
  updateAria(0);
  refreshSize();
  start();

  return {
    destroy: () => {
      stopTick();
      resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('scroll', scrollTarget);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', settle);
      canvas.removeEventListener('pointercancel', settle);
      geometry.dispose();
      for (const card of cards) {
        card.mesh.material.dispose();
        if (card.uniforms.uMap.value) card.uniforms.uMap.value.dispose();
      }
      renderer.dispose();
    }
  };
};
