/* ============================================================
   transitions.js — GSAP timelines for preloader, menu, hero
   ============================================================ */

import { gsap } from 'gsap';

/* ---- Preloader timeline ---- */
export function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar       = document.querySelector('.preloader-bar-fill');
  const pct       = document.querySelector('.preloader-percent');
  const fileEl    = document.querySelector('.preloader-file');
  const kiEl      = document.querySelector('.preloader-ki');
  const kiK       = document.querySelector('.preloader-ki-k');
  const kiI       = document.querySelector('.preloader-ki-i');
  const bottom    = document.querySelector('.preloader-bottom');

  if (!preloader) return;

  const files = [
    'index.html', 'css/main.css', 'webgl/scene.js', 'webgl/shaders',
    'gsap/scroll-animations.js', 'modules/cursor.js', 'modules/hacky-text.js',
    'fonts loaded', 'textures ready', 'assets loaded',
  ];

  let fileIdx = 0;

  // Entrance timeline
  const enterTl = gsap.timeline({ delay: 0.2 });

  enterTl
    .fromTo(kiK, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
    .fromTo(kiI, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5')
    .fromTo(bottom, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3');

  // Progress animation (fake 0→90 over 1.8s)
  const progressObj = { val: 0 };
  gsap.to(progressObj, {
    val: 90,
    duration: 1.8,
    ease: 'power2.inOut',
    onUpdate() {
      const v = Math.round(progressObj.val);
      if (bar) bar.style.width = v + '%';
      if (pct) pct.textContent = v + '%';
      const idx = Math.floor((v / 90) * (files.length - 1));
      if (idx > fileIdx && fileEl) {
        fileIdx = idx;
        fileEl.textContent = files[idx] || '';
      }
    },
  });

  // Hide function called on window.load
  function hidePreloader() {
    // Jump to 100
    gsap.to(progressObj, {
      val: 100,
      duration: 0.3,
      ease: 'power1.out',
      onUpdate() {
        const v = Math.round(progressObj.val);
        if (bar) bar.style.width = v + '%';
        if (pct) pct.textContent = v + '%';
      },
    });
    if (fileEl) fileEl.textContent = 'ready.';

    // Exit timeline: KI scales up + blurs, then fade out
    const exitTl = gsap.timeline({ delay: 0.3 });

    exitTl
      .to([kiK, kiI], {
        scale: 1.25, y: -15, opacity: 0, filter: 'blur(8px)',
        duration: 0.6, ease: 'power2.in', stagger: 0.05,
      })
      .to(bottom, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.4')
      .to(preloader, {
        opacity: 0, duration: 0.7, ease: 'power2.inOut',
        onComplete() {
          preloader.style.display = 'none';
          document.dispatchEvent(new CustomEvent('preloaderDone'));
        },
      }, '-=0.2');
  }

  // Trigger hide on page load
  let hidden = false;
  function tryHide() {
    if (hidden) return;
    hidden = true;
    hidePreloader();
  }

  window.addEventListener('load', () => setTimeout(tryHide, 400));
  setTimeout(tryHide, 4000); // hard fallback
}

/* ---- Menu transitions ---- */
export function initMenuTransitions() {
  const btn     = document.getElementById('hamburger');
  const overlay = document.getElementById('menu-overlay');
  const links   = overlay ? overlay.querySelectorAll('.menu-nav-item') : [];
  let open = false;

  if (!btn || !overlay) return;

  function openMenu() {
    open = true;
    btn.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');

    gsap.to(overlay, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 0.7,
      ease: 'power3.inOut',
    });

    // Stagger menu items in
    gsap.fromTo(
      overlay.querySelectorAll('.menu-nav-text, .menu-nav-num'),
      { y: '100%' },
      { y: '0%', duration: 0.6, stagger: 0.04, ease: 'power3.out', delay: 0.15 }
    );
  }

  function closeMenu() {
    open = false;
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');

    gsap.to(overlay, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.5,
      ease: 'power3.inOut',
    });
  }

  btn.addEventListener('click', () => open ? closeMenu() : openMenu());
  links.forEach((link) => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) closeMenu();
  });
}

/* ---- Hero title line reveal (GSAP version) ---- */
export function initHeroReveal() {
  const lines = document.querySelectorAll('.hero-title-line > span');
  if (!lines.length) return;

  gsap.fromTo(lines,
    { y: '110%' },
    {
      y: '0%',
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2,
    }
  );
}
