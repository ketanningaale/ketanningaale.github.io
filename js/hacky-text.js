/* ============================================================
   hacky-text.js — kprverse signature: text writes itself in
   with random glitch characters before resolving.

   Usage:
     <span data-hacky>Your text here</span>
     <span data-hacky data-hacky-hover>Hover to replay</span>
   ============================================================ */

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
const CHAR_SPEED = 0.038; // seconds per character (kprverse: 0.04)
const GLITCH_ROUNDS = 3;  // random chars shown per position before settling

export function initHackyText() {
  const els = document.querySelectorAll('[data-hacky]');
  if (!els.length) return;

  // Store original text, replace with spaces initially
  els.forEach((el) => {
    const original = el.textContent.trim();
    el.dataset.hackyOriginal = original;
    el.setAttribute('aria-label', original);
    el.textContent = original; // keep original for no-JS
  });

  // Trigger on scroll enter
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Only play once unless data-hacky-repeat is set
          if (!el.dataset.hackyRepeat) observer.unobserve(el);
          animateHacky(el);
        }
      });
    },
    { threshold: 0.3, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el) => observer.observe(el));

  // Hover replay
  document.querySelectorAll('[data-hacky-hover]').forEach((el) => {
    el.addEventListener('mouseenter', () => animateHacky(el));
  });
}

function animateHacky(el) {
  if (el._hackyRunning) return;
  el._hackyRunning = true;

  const original = el.dataset.hackyOriginal || el.textContent;
  const chars = [...original];
  const totalMs = chars.length * CHAR_SPEED * 1000;

  let frame = 0;
  const totalFrames = Math.ceil(chars.length * GLITCH_ROUNDS);
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    // How many characters have "settled" (resolved to original)
    const settled = Math.floor((elapsed / totalMs) * chars.length);

    let result = '';
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === ' ') {
        result += ' ';
      } else if (i < settled) {
        // Character has settled — show original
        result += original[i];
      } else {
        // Character still glitching — show random char
        const glitchChar = CHARS[Math.floor(Math.random() * CHARS.length)];
        // Preserve case feel: if original is lowercase, use lowercase random
        result += original[i] === original[i].toLowerCase()
          ? glitchChar.toLowerCase()
          : glitchChar;
      }
    }

    el.textContent = result;

    if (settled < chars.length) {
      requestAnimationFrame(tick);
    } else {
      // Fully settled
      el.textContent = original;
      el._hackyRunning = false;
    }
  }

  requestAnimationFrame(tick);
}

/* ============================================================
   Link hover: bg slides in, text color inverts
   Apply .link-hover class to any <a> element for this effect.
   ============================================================ */

export function initLinkHover() {
  const links = document.querySelectorAll('.link-hover');

  links.forEach((link) => {
    // Wrap text content if not already done
    if (!link.querySelector('.link-hover__bg')) {
      const text = link.innerHTML;
      link.innerHTML = `
        <span class="link-hover__bg" aria-hidden="true"></span>
        <span class="link-hover__text">${text}</span>
      `;
    }

    const bg   = link.querySelector('.link-hover__bg');
    const txt  = link.querySelector('.link-hover__text');

    link.addEventListener('mouseenter', () => {
      bg.style.transform  = 'translateX(0%)';
      txt.style.mixBlendMode = 'difference';
    });

    link.addEventListener('mouseleave', () => {
      bg.style.transform  = 'translateX(101%)';
      txt.style.mixBlendMode = '';
    });
  });
}
