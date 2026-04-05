/* ============================================================
   main.js — Vite entry point
   Initialises: Three.js WebGL → GSAP → modules
   ============================================================ */

import { initWebGL }           from './webgl/scene.js';
import { initScrollAnimations } from './gsap/scroll-animations.js';
import { initPreloader, initMenuTransitions, initHeroReveal } from './gsap/transitions.js';
import { initCursor }           from './modules/cursor.js';
import { initInteractions }     from './modules/interactions.js';
import { initHackyText, initLinkHover } from './modules/hacky-text.js';

// Preloader starts immediately — before DOMContentLoaded
initPreloader();

document.addEventListener('DOMContentLoaded', () => {
  // WebGL scene (Three.js background)
  initWebGL();

  // GSAP scroll system (replaces IntersectionObserver)
  initScrollAnimations();

  // Menu open/close with GSAP clip-path
  initMenuTransitions();

  // Hero title line slide-up
  initHeroReveal();

  // Custom cursor
  initCursor();

  // Interactions: ticker, tilt, role cycler, etc.
  initInteractions();

  // kprverse-style glitch text + link hover
  initHackyText();
  initLinkHover();
});
