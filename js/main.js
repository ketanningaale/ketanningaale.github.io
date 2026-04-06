/* ============================================================
   main.js — Entry point, initialise all modules
   ============================================================ */

import { initPreloader }                       from './preloader.js';
import { initCursor }                          from './cursor.js';
import { initHero }                            from './hero.js';
import { initScroll }                          from './scroll.js';
import { initInteractions }                    from './interactions.js';
import { initHackyText, initLinkHover }        from './hacky-text.js';
import { initPreloaderAmbient, initPageAmbient } from './ambient.js';
import { initGSAPAnimations }                  from './gsap-animations.js';

// Preloader runs immediately (before DOM ready)
initPreloader();
initPreloaderAmbient();

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initHero();
  initScroll();
  initInteractions();
  initHackyText();
  initLinkHover();
  initPageAmbient();
  // GSAP enrichments — runs after GSAP CDN scripts have loaded (also deferred)
  initGSAPAnimations();
});
