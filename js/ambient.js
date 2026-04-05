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

  const SPACING   = opts.spacing   || 40;   // px between grid points
  const DOT_R     = opts.dotRadius || 1;    // base dot radius
  const LINE_ALPHA = opts.lineAlpha ?? 0.04; // connecting line opacity
  const DOT_ALPHA  = opts.dotAlpha  ?? 0.12; // dot opacity
  const WARP_AMP   = opts.warpAmp  || 12;   // displacement amplitude
  const WARP_SPEED = opts.warpSpeed || 0.3;  // wave speed
  const WARP_FREQ  = opts.warpFreq || 0.008; // wave spatial frequency
  const DRAW_LINES = opts.drawLines ?? true;

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

  function getPoint(col, row, t) {
    const baseX = col * SPACING - SPACING;
    const baseY = row * SPACING - SPACING;
    // Two overlapping sine waves for organic displacement
    const dx = Math.sin(baseX * WARP_FREQ + t * WARP_SPEED + baseY * 0.003) * WARP_AMP
             + Math.sin(baseY * WARP_FREQ * 1.3 + t * WARP_SPEED * 0.7) * WARP_AMP * 0.5;
    const dy = Math.cos(baseY * WARP_FREQ + t * WARP_SPEED * 0.8 + baseX * 0.004) * WARP_AMP
             + Math.cos(baseX * WARP_FREQ * 0.9 + t * WARP_SPEED * 1.1) * WARP_AMP * 0.4;
    // Subtle scroll-linked shift
    const scrollOffset = scrollY * 0.015;
    return {
      x: baseX + dx,
      y: baseY + dy + scrollOffset * (row / rows),
    };
  }

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

    // Draw connecting lines (horizontal + vertical)
    if (DRAW_LINES) {
      ctx.strokeStyle = `rgba(255,255,255,${LINE_ALPHA})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = points[r][c];
          // Horizontal line to next column
          if (c < cols - 1) {
            const pNext = points[r][c + 1];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pNext.x, pNext.y);
          }
          // Vertical line to next row
          if (r < rows - 1) {
            const pBelow = points[r + 1][c];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pBelow.x, pBelow.y);
          }
        }
      }
      ctx.stroke();
    }

    // Draw dots at each grid intersection
    ctx.fillStyle = `rgba(255,255,255,${DOT_ALPHA})`;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p = points[r][c];
        // Subtle size variation based on displacement
        const dist = Math.sqrt(
          Math.pow(p.x - (c * SPACING - SPACING), 2) +
          Math.pow(p.y - (r * SPACING - SPACING), 2)
        );
        const sizeVar = 1 + dist / (WARP_AMP * 4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, DOT_R * sizeVar, 0, Math.PI * 2);
        ctx.fill();
      }
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
    drawLines: false, // dots only for the page bg — less visual noise
  });
  if (!renderer) return;

  window.addEventListener('resize', () => renderer.resize());
  renderer.resize();
  requestAnimationFrame(renderer.draw);
}
