/* ============================================================
   ambient.js — Animated mesh grid background
   Approximates the kprverse Three.js shader aesthetic using
   a 2D canvas: a grid of dots that subtly warp via sine-wave
   displacement, creating an organic, living surface feel.
   ============================================================ */

/* ---- Shared mesh-grid renderer ---- */
function createMeshRenderer(canvas, opts = {}) {
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');

  const SPACING    = opts.spacing    || 40;
  const DOT_R      = opts.dotRadius  || 1;
  const LINE_ALPHA = opts.lineAlpha  ?? 0.04;
  const DOT_ALPHA  = opts.dotAlpha   ?? 0.12;
  const WARP_AMP   = opts.warpAmp   || 12;
  const WARP_SPEED = opts.warpSpeed || 0.3;
  const WARP_FREQ  = opts.warpFreq  || 0.008;
  const DRAW_LINES = opts.drawLines ?? true;
  const MOUSE_FX   = opts.mouseFx   ?? false; // enable on page canvas only

  let W, H, cols, rows;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.offsetWidth  || window.innerWidth;
    H = canvas.offsetHeight || window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / SPACING) + 2;
    rows = Math.ceil(H / SPACING) + 2;
  }

  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  // Mouse tracking (page coordinates; canvas is fixed full-screen)
  let mouseX = -9999, mouseY = -9999;
  if (MOUSE_FX) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });
    document.addEventListener('mouseleave', () => {
      mouseX = -9999; mouseY = -9999;
    });
  }

  // Click ripples
  const ripples = [];
  if (MOUSE_FX) {
    document.addEventListener('click', (e) => {
      ripples.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.35, maxR: 160 });
    });
  }

  function getPoint(col, row, t) {
    const baseX = col * SPACING - SPACING;
    const baseY = row * SPACING - SPACING;
    const dx = Math.sin(baseX * WARP_FREQ + t * WARP_SPEED + baseY * 0.003) * WARP_AMP
             + Math.sin(baseY * WARP_FREQ * 1.3 + t * WARP_SPEED * 0.7) * WARP_AMP * 0.5;
    const dy = Math.cos(baseY * WARP_FREQ + t * WARP_SPEED * 0.8 + baseX * 0.004) * WARP_AMP
             + Math.cos(baseX * WARP_FREQ * 0.9 + t * WARP_SPEED * 1.1) * WARP_AMP * 0.4;
    const scrollOffset = scrollY * 0.015;
    return {
      x: baseX + dx,
      y: baseY + dy + scrollOffset * (row / rows),
    };
  }

  const MOUSE_RADIUS = 140; // px — brightening radius

  function draw(ts) {
    const t = ts * 0.001;
    ctx.clearRect(0, 0, W, H);

    // Build grid of warped points
    const points = [];
    for (let r = 0; r < rows; r++) {
      points[r] = [];
      for (let c = 0; c < cols; c++) {
        points[r][c] = getPoint(c, r, t);
      }
    }

    // Draw connecting lines
    if (DRAW_LINES) {
      ctx.strokeStyle = `rgba(255,255,255,${LINE_ALPHA})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = points[r][c];
          if (c < cols - 1) {
            const pNext = points[r][c + 1];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pNext.x, pNext.y);
          }
          if (r < rows - 1) {
            const pBelow = points[r + 1][c];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pBelow.x, pBelow.y);
          }
        }
      }
      ctx.stroke();
    }

    // Draw dots — with optional mouse-proximity brightening
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p = points[r][c];
        const disp = Math.sqrt(
          Math.pow(p.x - (c * SPACING - SPACING), 2) +
          Math.pow(p.y - (r * SPACING - SPACING), 2)
        );
        const sizeVar = 1 + disp / (WARP_AMP * 4);

        let alpha = DOT_ALPHA;
        let radius = DOT_R * sizeVar;

        if (MOUSE_FX && mouseX > -999) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            const strength = 1 - dist / MOUSE_RADIUS;
            alpha  = DOT_ALPHA + strength * 0.55;
            radius = DOT_R * sizeVar * (1 + strength * 1.2);
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }
    }

    // Draw constellation lines near mouse
    if (MOUSE_FX && mouseX > -999) {
      ctx.lineWidth = 0.4;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const p  = points[r][c];
          const p2 = points[r][c + 1];
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS * 0.7) {
            const strength = (1 - dist / (MOUSE_RADIUS * 0.7)) * 0.2;
            ctx.strokeStyle = `rgba(255,255,255,${strength})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }

    // Draw ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rip = ripples[i];
      rip.r     += 4;
      rip.alpha *= 0.94;

      if (rip.alpha < 0.01 || rip.r > rip.maxR) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${rip.alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  return { resize, draw };
}

/* ---- Preloader background ---- */
export function initPreloaderAmbient() {
  const canvas = document.getElementById('preloader-canvas');
  const renderer = createMeshRenderer(canvas, {
    spacing: 50,
    dotRadius: 0.8,
    lineAlpha: 0.03,
    dotAlpha: 0.08,
    warpAmp: 16,
    warpSpeed: 0.4,
    warpFreq: 0.006,
    drawLines: true,
  });
  if (!renderer) return;

  const ro = new ResizeObserver(() => renderer.resize());
  ro.observe(canvas.parentElement);
  renderer.resize();
  requestAnimationFrame(renderer.draw);
}

/* ---- Page-wide ambient background ---- */
export function initPageAmbient() {
  const canvas = document.getElementById('ambient-canvas');
  const renderer = createMeshRenderer(canvas, {
    spacing: 60,
    dotRadius: 0.6,
    lineAlpha: 0.02,
    dotAlpha: 0.05,
    warpAmp: 10,
    warpSpeed: 0.2,
    warpFreq: 0.005,
    drawLines: false,
    mouseFx: true,   // enable mouse proximity brightening + ripples
  });
  if (!renderer) return;

  window.addEventListener('resize', () => renderer.resize());
  renderer.resize();
  requestAnimationFrame(renderer.draw);
}
