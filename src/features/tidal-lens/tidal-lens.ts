const VERT_SRC = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision highp float;

uniform sampler2D uTex;
uniform vec2 uCanvas;
uniform vec2 uImage;
uniform vec2 uLens;
uniform float uRadius;
uniform float uTime;
uniform vec2 uVel;
uniform float uMotion;

vec2 coverUv(vec2 p) {
  float s = max(uCanvas.x / uImage.x, uCanvas.y / uImage.y);
  vec2 scaled = uImage * s;
  vec2 off = (uCanvas - scaled) * 0.5;
  vec2 ip = (p - off) / s;
  return vec2(ip.x / uImage.x, 1.0 - ip.y / uImage.y);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uCanvas.y - gl_FragCoord.y);

  vec3 sampled = texture2D(uTex, coverUv(p)).rgb;
  float luma = dot(sampled, vec3(0.299, 0.587, 0.114));
  vec3 before = vec3(luma);

  vec2 d = p - uLens;
  float dist = length(d);
  float ang = atan(d.y, d.x);

  float speed = length(uVel) * uMotion;
  float wob = uMotion * (
    0.05 * sin(3.0 * ang + uTime * 0.8) +
    0.035 * sin(5.0 * ang - uTime * 1.15) +
    0.02 * sin(8.0 * ang + uTime * 0.5)
  );
  float stretch = min(speed / max(uRadius, 1.0), 0.12);
  float velAng = atan(uVel.y, uVel.x);
  float r = uRadius * (1.0 + wob + stretch * cos(2.0 * (ang - velAng)));

  float tu = dist / max(r, 1.0);
  float t = clamp(tu, 0.0, 1.0);
  float inside = 1.0 - smoothstep(r - 1.5, r + 1.5, dist);

  vec3 col = before;
  if (inside > 0.0) {
    float pinch = 0.12 * t * t * t;
    vec2 sp = uLens + d * (1.0 - pinch);

    float rimT = smoothstep(0.45, 1.0, t);
    float split = (1.5 + uRadius * 0.015) * rimT;
    vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0);
    vec3 after;
    after.r = texture2D(uTex, coverUv(sp - dir * split)).r;
    after.g = texture2D(uTex, coverUv(sp)).g;
    after.b = texture2D(uTex, coverUv(sp + dir * split)).b;

    col = mix(before, after, inside);

    float rimBand = smoothstep(0.62, 0.9, t) * (1.0 - smoothstep(0.92, 1.0, t));
    float streak = pow(max(0.0, sin(ang * 3.0 - uTime * 1.2 + 0.6)), 6.0)
      + 0.6 * pow(max(0.0, sin(ang * 2.0 + uTime * 0.85 + 2.4)), 10.0);
    col += vec3(1.0) * rimBand * streak * 0.35 * uMotion;

    float line = smoothstep(0.985, 1.0, tu)
      * (1.0 - smoothstep(1.0, 1.0 + 2.0 / max(r, 1.0), tu));
    col += vec3(0.85) * line * 0.3;
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

interface Vec2 {
  x: number;
  y: number;
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function mountTidalLens(root: HTMLElement): void {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-tidal-canvas]");
  const afterImg = root.querySelector<HTMLElement>("[data-tidal-after]");
  const slider = root.querySelector<HTMLInputElement>("[data-tidal-diameter]");
  const lockBtn = root.querySelector<HTMLButtonElement>("[data-tidal-lock]");
  const src = root.dataset.tidalSrc;

  if (!canvas || !src) return;

  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = reducedQuery.matches;

  let cssW = 0;
  let cssH = 0;
  let rectLeft = 0;
  let rectTop = 0;
  let initialized = false;

  const pointer: Vec2 = { x: 0, y: 0 };
  const pos: Vec2 = { x: 0, y: 0 };
  const vel: Vec2 = { x: 0, y: 0 };

  let radiusPct = 0.3;
  let radius = 0;
  let locked = false;
  let dragging = false;
  let time = 0;
  let last = performance.now();
  let raf = 0;
  let running = false;

  let gl: WebGLRenderingContext | null = null;
  let program: WebGLProgram | null = null;
  let texture: WebGLTexture | null = null;
  let texReady = false;
  let imgW = 1;
  let imgH = 1;
  const uniforms: Record<string, WebGLUniformLocation | null> = {};

  const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

  const enableFallback = () => {
    gl = null;
    texReady = false;
    root.dataset.mode = "css";
  };

  const initGl = (): boolean => {
    let context: WebGLRenderingContext | null = null;
    try {
      context = canvas.getContext("webgl", {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        premultipliedAlpha: true,
      }) as WebGLRenderingContext | null;
    } catch {
      context = null;
    }
    if (!context) return false;

    const vs = compileShader(context, context.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(context, context.FRAGMENT_SHADER, FRAG_SRC);
    const prog = context.createProgram();
    if (!vs || !fs || !prog) return false;
    context.attachShader(prog, vs);
    context.attachShader(prog, fs);
    context.linkProgram(prog);
    if (!context.getProgramParameter(prog, context.LINK_STATUS)) return false;
    context.useProgram(prog);

    const buf = context.createBuffer();
    if (!buf) return false;
    context.bindBuffer(context.ARRAY_BUFFER, buf);
    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      context.STATIC_DRAW,
    );
    const aPos = context.getAttribLocation(prog, "aPos");
    context.enableVertexAttribArray(aPos);
    context.vertexAttribPointer(aPos, 2, context.FLOAT, false, 0, 0);

    const tex = context.createTexture();
    if (!tex) return false;
    context.bindTexture(context.TEXTURE_2D, tex);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
    context.uniform1i(context.getUniformLocation(prog, "uTex"), 0);

    gl = context;
    program = prog;
    texture = tex;
    for (const name of ["uCanvas", "uImage", "uLens", "uRadius", "uTime", "uVel", "uMotion"]) {
      uniforms[name] = context.getUniformLocation(prog, name);
    }
    return true;
  };

  const resize = () => {
    if (!gl) return;
    const d = dpr();
    canvas.width = Math.max(Math.round(cssW * d), 1);
    canvas.height = Math.max(Math.round(cssH * d), 1);
  };

  const measure = () => {
    const r = root.getBoundingClientRect();
    cssW = Math.max(r.width, 1);
    cssH = Math.max(r.height, 1);
    rectLeft = r.left;
    rectTop = r.top;
    if (!initialized) {
      initialized = true;
      pointer.x = cssW / 2;
      pointer.y = cssH / 2;
      pos.x = pointer.x;
      pos.y = pointer.y;
      radius = radiusPct * Math.min(cssW, cssH);
    }
    resize();
  };

  const loadTexture = (): boolean => {
    if (!gl || !texture) return false;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (!gl || !texture) return;
      imgW = img.naturalWidth || 1;
      imgH = img.naturalHeight || 1;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      texReady = true;
      root.dataset.mode = "webgl";
    };
    img.onerror = () => enableFallback();
    img.src = src;
    return true;
  };

  const drawGl = () => {
    if (!gl || !program || !texReady) return;
    const d = dpr();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);
    gl.uniform2f(uniforms.uCanvas, canvas.width, canvas.height);
    gl.uniform2f(uniforms.uImage, imgW, imgH);
    gl.uniform2f(uniforms.uLens, pos.x * d, pos.y * d);
    gl.uniform1f(uniforms.uRadius, Math.max(radius, 1) * d);
    gl.uniform1f(uniforms.uTime, time);
    gl.uniform2f(uniforms.uVel, vel.x * d, vel.y * d);
    gl.uniform1f(uniforms.uMotion, reduced ? 0 : 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const drawFallback = () => {
    if (!afterImg) return;
    afterImg.style.clipPath = `circle(${Math.max(radius, 1).toFixed(1)}px at ${pos.x.toFixed(1)}px ${pos.y.toFixed(1)}px)`;
  };

  const frame = (now: number) => {
    const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05);
    last = now;

    const k = reduced ? 1 : 1 - Math.exp(-dt * 7);
    const prevX = pos.x;
    const prevY = pos.y;
    pos.x += (pointer.x - pos.x) * k;
    pos.y += (pointer.y - pos.y) * k;

    const instVx = dt > 0 ? (pos.x - prevX) / dt : 0;
    const instVy = dt > 0 ? (pos.y - prevY) / dt : 0;
    const vs = reduced ? 0 : 0.2;
    vel.x += (instVx - vel.x) * vs;
    vel.y += (instVy - vel.y) * vs;

    const minDim = Math.min(cssW, cssH);
    const rTarget = radiusPct * minDim;
    const kr = reduced ? 1 : 1 - Math.exp(-dt * 8);
    radius += (rTarget - radius) * kr;

    if (!reduced) time += dt;

    if (gl && texReady) {
      drawGl();
    } else {
      drawFallback();
    }

    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
  };

  const toLocal = (e: PointerEvent): Vec2 => ({
    x: e.clientX - rectLeft,
    y: e.clientY - rectTop,
  });

  const isControl = (target: EventTarget | null): boolean =>
    target instanceof HTMLElement &&
    Boolean(target.closest("a, button, input, label, [data-tidal-controls]"));

  root.addEventListener("pointerdown", (e) => {
    if (isControl(e.target)) return;
    dragging = true;
    try {
      root.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    if (!locked) {
      const p = toLocal(e);
      pointer.x = p.x;
      pointer.y = p.y;
    }
  });

  root.addEventListener("pointermove", (e) => {
    if (locked) return;
    const touch = e.pointerType !== "mouse";
    if (touch && !dragging) return;
    const p = toLocal(e);
    pointer.x = p.x;
    pointer.y = p.y;
  });

  const endDrag = (e: PointerEvent) => {
    dragging = false;
    try {
      root.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };
  root.addEventListener("pointerup", endDrag);
  root.addEventListener("pointercancel", endDrag);

  root.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? 120 : 48;
    let handled = true;
    switch (e.key) {
      case "ArrowLeft":
        pointer.x -= step;
        break;
      case "ArrowRight":
        pointer.x += step;
        break;
      case "ArrowUp":
        pointer.y -= step;
        break;
      case "ArrowDown":
        pointer.y += step;
        break;
      default:
        handled = false;
    }
    if (handled) e.preventDefault();
  });

  lockBtn?.addEventListener("click", () => {
    locked = !locked;
    lockBtn.setAttribute("aria-pressed", String(locked));
  });

  slider?.addEventListener("input", () => {
    const v = Number(slider.value);
    if (Number.isFinite(v)) radiusPct = Math.min(Math.max(v / 100, 0.08), 0.8);
  });

  const onReducedChange = () => {
    reduced = reducedQuery.matches;
  };
  reducedQuery.addEventListener?.("change", onReducedChange);

  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    enableFallback();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  const ro = new ResizeObserver(measure);
  ro.observe(root);

  measure();
  if (initGl()) {
    loadTexture();
  } else {
    enableFallback();
  }
  start();
}
