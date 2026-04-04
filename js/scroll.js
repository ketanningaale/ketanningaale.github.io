/* ============================================================
   scroll.js — Scroll progress, reveals, active nav, counters
   ============================================================ */

export function initScroll() {
  initScrollProgress();
  initReveal();
  initActiveNav();
  initCounters();
}

/* ---- Scroll Progress Bar ---- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function update() {
    const scrollTop = document.documentElement.scrollTop;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---- Intersection Observer Reveals ---- */
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  // For mask reveals, observe the parent .reveal-mask container so the
  // trigger fires when the mask wrapper enters the viewport (not the
  // hidden child which may be clipped to zero height).
  function getObserveTarget(el) {
    const parent = el.parentElement;
    if (parent && parent.classList.contains('reveal-mask')) {
      return parent;
    }
    return el;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // For mask wrappers, reveal all [data-reveal] children
          if (entry.target.classList.contains('reveal-mask')) {
            const children = entry.target.querySelectorAll('[data-reveal]');
            children.forEach((child) => child.classList.add('revealed'));
          } else {
            entry.target.classList.add('revealed');
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  const observed = new Set();
  els.forEach((el) => {
    const target = getObserveTarget(el);
    if (!observed.has(target)) {
      observed.add(target);
      observer.observe(target);
    }
  });
}

/* ---- Active Section / Nav Dots ---- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const dots = document.querySelectorAll('.nav-dot[data-section]');
  if (!dots.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          dots.forEach((dot) => {
            dot.classList.toggle('active', dot.dataset.section === id);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ---- Counter Animations ---- */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();

        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }

        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}
