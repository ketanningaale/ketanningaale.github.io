/* ============================================================
   ambient.js — Ambient background animations
   Inspired by kprverse: slow-drifting gradient orbs + particles.

   Runs on:
     - #preloader-canvas  (full-screen while loading)
     - #hero-canvas is handled by hero.js (starfield)
   ============================================================ */

/* ---- Preloader ambient canvas ---- */
export function initPreloaderAmbient() {
  const canvas = document.getElementById('preloader-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth  || window.innerWidth;
    H = canvas.height = canvas.offsetHeight || window.innerHeight;
  }

  // Orb definitions — position as fraction of W/H, drifts on sine path
  const orbs = [
    {
      fx: 0.25, fy: 0.35,           // base position (fraction)
      r: 0.55,                       // radius as fraction of min(W,H)
      color: [60, 30, 110],          // RGB — deep purple
      alpha: 0.18,
      speedX: 0.00018, speedY: 0.00012,
      phaseX: 0, phaseY: Math.PI * 0.6,
      ampX: 0.18, ampY: 0.14,
    },
    {
      fx: 0.72, fy: 0.60,
      r: 0.45,
      color: [90, 45, 15],           // warm amber/brown
      alpha: 0.14,
      speedX: 0.00014, speedY: 0.00020,
      phaseX: Math.PI, phaseY: 0,
      ampX: 0.16, ampY: 0.20,
    },
    {
      fx: 0.50, fy: 0.20,
      r: 0.35,
      color: [15, 55, 90],           // cold blue
      alpha: 0.10,
      speedX: 0.00022, speedY: 0.00016,
      phaseX: Math.PI * 1.3, phaseY: Math.PI * 0.4,
      ampX: 0.22, ampY: 0.12,
    },
  ];

  // Particles — tiny floating specks
  let particles = [];

  function createParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.0 + 0.3,
        alpha: Math.random() * 0.25 + 0.05,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.008 + 0.003,
      });
    }
  }

  function drawFrame(ts) {
    const t = ts * 0.001;

    ctx.clearRect(0, 0, W, H);

    // Orbs
    orbs.forEach((orb) => {
      const cx = (orb.fx + Math.sin(t * orb.speedX * 1000 + orb.phaseX) * orb.ampX) * W;
      const cy = (orb.fy + Math.sin(t * orb.speedY * 1000 + orb.phaseY) * orb.ampY) * H;
      const radius = orb.r * Math.min(W, H);

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      const [r, g2, b] = orb.color;
      g.addColorStop(0,   `rgba(${r},${g2},${b},${orb.alpha})`);
      g.addColorStop(0.5, `rgba(${r},${g2},${b},${orb.alpha * 0.4})`);
      g.addColorStop(1,   `rgba(${r},${g2},${b},0)`);

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Particles
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < -2) p.x = W + 2;
      if (p.x > W + 2) p.x = -2;
      if (p.y < -2) p.y = H + 2;
      if (p.y > H + 2) p.y = -2;

      const tw = Math.sin(t * p.twinkleSpeed * 1000 + p.twinkle) * 0.3 + 0.7;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha * tw})`;
      ctx.fill();
    });

    requestAnimationFrame(drawFrame);
  }

  const ro = new ResizeObserver(() => {
    resize();
    createParticles(Math.floor((W * H) / 6000));
  });
  ro.observe(canvas.parentElement);

  resize();
  createParticles(Math.floor((W * H) / 6000));
  requestAnimationFrame(drawFrame);
}

/* ---- Page-wide ambient overlay (orbs that follow through all sections) ---- */
export function initPageAmbient() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  const orbs = [
    {
      fx: 0.15, fy: 0.25,
      r: 0.70,
      color: [50, 25, 100],
      alpha: 0.07,
      speedX: 0.00010, speedY: 0.00008,
      phaseX: 0, phaseY: 1.2,
      ampX: 0.20, ampY: 0.18,
    },
    {
      fx: 0.80, fy: 0.65,
      r: 0.55,
      color: [100, 50, 10],
      alpha: 0.06,
      speedX: 0.00009, speedY: 0.00012,
      phaseX: 3.1, phaseY: 0.5,
      ampX: 0.18, ampY: 0.22,
    },
  ];

  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  function drawFrame(ts) {
    const t = ts * 0.001;

    ctx.clearRect(0, 0, W, H);

    orbs.forEach((orb) => {
      // Orbs drift across the screen AND shift slightly based on scroll
      const scrollShift = scrollY * 0.00008;
      const cx = (orb.fx + Math.sin(t * orb.speedX * 1000 + orb.phaseX + scrollShift) * orb.ampX) * W;
      const cy = (orb.fy + Math.sin(t * orb.speedY * 1000 + orb.phaseY) * orb.ampY) * H;
      const radius = orb.r * Math.min(W, H);

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      const [r, g2, b] = orb.color;
      g.addColorStop(0,   `rgba(${r},${g2},${b},${orb.alpha})`);
      g.addColorStop(0.6, `rgba(${r},${g2},${b},${orb.alpha * 0.3})`);
      g.addColorStop(1,   `rgba(${r},${g2},${b},0)`);

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(drawFrame);
  }

  window.addEventListener('resize', () => {
    resize();
  });

  resize();
  requestAnimationFrame(drawFrame);
}
