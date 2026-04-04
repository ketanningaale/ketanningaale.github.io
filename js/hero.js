/* ============================================================
   hero.js — Canvas starfield + role typewriter + parallax
   ============================================================ */

export function initHero() {
  initStarfield();
  initRoleCycler();
  initHeroParallax();
}

/* ---- Starfield Canvas ---- */
function initStarfield() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, stars = [], shootingStars = [];
  let animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.6 + 0.1,
        speed: Math.random() * 0.3 + 0.05,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  function maybeLaunchShootingStar() {
    if (Math.random() < 0.003 && shootingStars.length < 3) {
      shootingStars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.5,
        vx: (Math.random() * 4 + 3) * (Math.random() < 0.5 ? 1 : -1),
        vy: Math.random() * 2 + 1,
        len: Math.random() * 100 + 60,
        alpha: 1,
        life: 1,
        decay: Math.random() * 0.02 + 0.015,
      });
    }
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, W, H);

    // Subtle gradient sky
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(4,4,8,1)');
    grad.addColorStop(1, 'rgba(8,8,8,1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Stars
    stars.forEach(s => {
      const tw = Math.sin(t * s.twinkleSpeed + s.twinkleOffset) * 0.25 + 0.75;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha * tw})`;
      ctx.fill();
    });

    // Shooting stars
    shootingStars.forEach((ss, i) => {
      ctx.save();
      ctx.globalAlpha = ss.life;
      const grad2 = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * ss.len / 4, ss.y - ss.vy * ss.len / 4);
      grad2.addColorStop(0, 'rgba(255,255,255,0.8)');
      grad2.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad2;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - ss.vx * (ss.len / 4), ss.y - ss.vy * (ss.len / 4));
      ctx.stroke();
      ctx.restore();

      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.life -= ss.decay;

      if (ss.life <= 0) shootingStars.splice(i, 1);
    });
  }

  let lastTime = 0;
  function loop(ts) {
    const t = ts * 0.001;
    if (ts - lastTime > 16) {
      maybeLaunchShootingStar();
      drawStars(t);
      lastTime = ts;
    }
    animId = requestAnimationFrame(loop);
  }

  const ro = new ResizeObserver(() => {
    resize();
    createStars(Math.floor((W * H) / 3000));
  });
  ro.observe(canvas);

  resize();
  createStars(Math.floor((W * H) / 3000));
  animId = requestAnimationFrame(loop);
}

/* ---- Role Cycler (typewriter) ---- */
function initRoleCycler() {
  const el = document.getElementById('role-text');
  if (!el) return;

  const roles = [
    'Software Engineer',
    'Full-Stack Developer',
    'AI/ML Engineer',
    'Data Scientist',
    'Web3 Developer',
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused = false;

  function type() {
    if (paused) return;

    const target = roles[roleIdx];

    if (!deleting) {
      el.textContent = target.slice(0, ++charIdx);
      if (charIdx === target.length) {
        deleting = false;
        paused = true;
        setTimeout(() => { deleting = true; paused = false; }, 2400);
        return;
      }
      setTimeout(type, 80);
    } else {
      el.textContent = target.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        paused = true;
        setTimeout(() => { paused = false; setTimeout(type, 100); }, 200);
        return;
      }
      setTimeout(type, 40);
    }
  }

  setTimeout(type, 1200);
}

/* ---- Parallax on mouse move ---- */
function initHeroParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  let tX = 0, tY = 0;
  let cX = 0, cY = 0;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    tX = (e.clientX - cx) / cx;
    tY = (e.clientY - cy) / cy;
  });

  function animate() {
    cX += (tX - cX) * 0.05;
    cY += (tY - cY) * 0.05;

    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
      canvas.style.transform = `translate(${cX * -12}px, ${cY * -8}px) scale(1.04)`;
    }

    requestAnimationFrame(animate);
  }

  animate();
}
