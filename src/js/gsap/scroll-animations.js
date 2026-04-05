/* ============================================================
   scroll-animations.js — GSAP ScrollTrigger section reveals
   Replaces the old IntersectionObserver system
   ============================================================ */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setScrollProgress } from '../webgl/scene.js';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  initScrollProgress();
  initSectionReveals();
  initHeroParallax();
  initCounters();
  initActiveNav();
  initWebGLSync();
}

/* ---- Scroll progress bar ---- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate(self) {
      bar.style.width = (self.progress * 100) + '%';
    },
  });
}

/* ---- Section reveal animations ---- */
function initSectionReveals() {
  // Standard fade-up reveals
  const revealEls = document.querySelectorAll('[data-reveal]');
  revealEls.forEach((el) => {
    const delay = parseFloat(el.dataset.revealDelay || 0) * 0.1;
    const isInsideMask = el.closest('.reveal-mask');

    gsap.from(el, {
      y: isInsideMask ? '105%' : 40,
      opacity: isInsideMask ? 1 : 0,
      duration: 1,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: isInsideMask || el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Section headers get a special staggered reveal
  document.querySelectorAll('.section-header').forEach((header) => {
    gsap.from(header.querySelectorAll('.section-label, .section-title, .section-number'), {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}

/* ---- Hero parallax + fade on scroll ---- */
function initHeroParallax() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  gsap.to(heroContent, {
    y: -80,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // Parallax elements with data-speed
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed || el.dataset.parallax || 0.2);
    gsap.to(el, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

/* ---- Counter animations ---- */
function initCounters() {
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter() {
        gsap.to(obj, {
          val: target,
          duration: 1.4,
          ease: 'power3.out',
          onUpdate() {
            el.textContent = Math.floor(obj.val) + suffix;
          },
        });
      },
    });
  });
}

/* ---- Active nav dots ---- */
function initActiveNav() {
  const dots = document.querySelectorAll('.nav-dot[data-section]');
  if (!dots.length) return;

  document.querySelectorAll('section[id]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle(self) {
        if (self.isActive) {
          const id = section.getAttribute('id');
          dots.forEach((d) => d.classList.toggle('active', d.dataset.section === id));
        }
      },
    });
  });
}

/* ---- Sync scroll progress to WebGL shader ---- */
function initWebGLSync() {
  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate(self) {
      setScrollProgress(self.progress);
    },
  });
}
