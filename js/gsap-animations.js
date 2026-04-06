/* ============================================================
   gsap-animations.js — GSAP v3 + ScrollTrigger enrichments
   Smooth scroll, char-split reveals, timeline draw,
   hero orbs, skill stagger, cursor particle trail.
   ============================================================ */

export function initGSAPAnimations() {
  const G  = window.gsap;
  const ST = window.ScrollTrigger;
  const STo = window.ScrollToPlugin;

  if (!G) return; // GSAP not loaded — graceful no-op

  if (ST)  G.registerPlugin(ST);
  if (STo) G.registerPlugin(STo);

  initSmoothScroll(G, STo);
  initCharSplits(G, ST);
  initTimelineDraw(G, ST);
  initHeroOrbs(G);
  initSkillStagger(G, ST);
  initCursorTrail();
  initScrollFx(G, ST);
}

/* ---- Smooth anchor scroll (GSAP ScrollTo) ---- */
function initSmoothScroll(G, STo) {
  // CSS smooth scroll as base
  document.documentElement.style.scrollBehavior = 'smooth';

  if (!STo) return;

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      G.to(window, {
        scrollTo: { y: target, offsetY: 60 },
        duration: 1.4,
        ease: 'power3.inOut',
      });
    });
  });
}

/* ---- Character split reveal on [data-split] elements ---- */
function initCharSplits(G, ST) {
  const els = document.querySelectorAll('[data-split]');
  if (!els.length) return;

  els.forEach((el) => {
    const text = el.textContent.trim();
    if (!text) return;

    // Preserve aria label, then build char spans
    el.setAttribute('aria-label', text);
    el.innerHTML = text
      .split('')
      .map((ch) =>
        ch === ' '
          ? `<span style="display:inline-block;width:0.22em;" aria-hidden="true"> </span>`
          : `<span class="gsap-ch" style="display:inline-block;overflow:hidden;vertical-align:bottom;" aria-hidden="true"><span style="display:inline-block;will-change:transform;">${ch}</span></span>`
      )
      .join('');

    const inners = el.querySelectorAll('.gsap-ch > span');
    const delay  = parseFloat(el.dataset.splitDelay || 0);

    const tl = G.fromTo(
      inners,
      { y: '115%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        stagger: { amount: 0.45, from: 'start' },
        duration: 0.7,
        ease: 'power3.out',
        delay,
        paused: true,
      }
    );

    if (ST) {
      ST.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => tl.play(),
      });
    } else {
      // No ScrollTrigger — play immediately after a brief delay
      setTimeout(() => tl.play(), 300);
    }
  });
}

/* ---- Experience section: vertical timeline line draws on scroll ---- */
function initTimelineDraw(G, ST) {
  if (!ST) return;
  const line = document.querySelector('.exp-timeline-line');
  if (!line) return;

  G.set(line, { scaleY: 0, transformOrigin: 'top center' });

  G.to(line, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#experience',
      start: 'top 55%',
      end: 'bottom 50%',
      scrub: 0.6,
    },
  });

  // Pulse dots at each experience item
  document.querySelectorAll('.experience-item').forEach((item) => {
    const dot = document.createElement('div');
    dot.className = 'exp-timeline-dot';
    dot.setAttribute('aria-hidden', 'true');
    item.appendChild(dot);

    G.fromTo(
      dot,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: item,
          start: 'top 75%',
          once: true,
        },
      }
    );
  });
}

/* ---- Hero orbs — GSAP floating animation ---- */
function initHeroOrbs(G) {
  const orbs = document.querySelectorAll('.hero-orb');
  orbs.forEach((orb, i) => {
    // Random initial offset so they don't start in sync
    G.set(orb, {
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
    });

    G.to(orb, {
      x: `random(-60, 60, 1)`,
      y: `random(-50, 50, 1)`,
      duration: 10 + i * 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 1.8,
    });

    // Also pulse opacity
    G.to(orb, {
      opacity: 0.55,
      duration: 5 + i * 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i,
    });
  });
}

/* ---- Skills: stagger each .skill-item when category enters view ---- */
function initSkillStagger(G, ST) {
  // Set initial invisible state for all skill items
  G.set('.skill-item', { opacity: 0, x: -10 });

  document.querySelectorAll('.skill-category').forEach((cat) => {
    const items = cat.querySelectorAll('.skill-item');
    const opts = {
      opacity: 1,
      x: 0,
      stagger: 0.07,
      duration: 0.45,
      ease: 'power2.out',
    };

    if (ST) {
      ST.create({
        trigger: cat,
        start: 'top 82%',
        once: true,
        onEnter: () => G.to(items, opts),
      });
    } else {
      G.to(items, opts);
    }
  });
}

/* ---- Extra scroll-triggered FX ---- */
function initScrollFx(G, ST) {
  if (!ST) return;

  // Section numbers: scale+fade from large
  document.querySelectorAll('.section-number[data-reveal]').forEach((el) => {
    G.fromTo(
      el,
      { opacity: 0, scale: 1.4, y: 10 },
      {
        opacity: 0.1, // match CSS target opacity
        scale: 1,
        y: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
  });

  // Project card tag chips: stagger in
  document.querySelectorAll('.project-card').forEach((card) => {
    const tags = card.querySelectorAll('.project-tag');
    G.fromTo(
      tags,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 82%', once: true },
      }
    );
  });

  // About stats: subtle scale bounce
  document.querySelectorAll('.about-stat').forEach((stat, i) => {
    G.fromTo(
      stat,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        delay: i * 0.1,
        ease: 'back.out(1.5)',
        scrollTrigger: { trigger: stat, start: 'top 85%', once: true },
      }
    );
  });

  // Pub cards: slide up with stagger
  document.querySelectorAll('.pub-card').forEach((card, i) => {
    G.fromTo(
      card,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        delay: i * 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      }
    );
  });
}

/* ---- Cursor particle trail ---- */
function initCursorTrail() {
  if ('ontouchstart' in window) return; // no trail on touch

  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-trail';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:9997;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W = (canvas.width  = window.innerWidth);
  let H = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const particles = [];
  let mouseX = -500, mouseY = -500;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (Math.random() < 0.4) {
      particles.push({
        x:     mouseX + (Math.random() - 0.5) * 6,
        y:     mouseY + (Math.random() - 0.5) * 6,
        r:     Math.random() * 2.2 + 0.4,
        life:  1,
        decay: Math.random() * 0.035 + 0.025,
        vx:    (Math.random() - 0.5) * 0.6,
        vy:    (Math.random() - 0.5) * 0.6 - 0.2, // slight upward drift
      });
    }
  });

  function loop() {
    ctx.clearRect(0, 0, W, H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= p.decay;
      p.x    += p.vx;
      p.y    += p.vy;
      p.r    *= 0.96;

      if (p.life <= 0 || p.r < 0.1) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.life * 0.28})`;
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }

  loop();
}
