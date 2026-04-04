/* ============================================================
   main.js — Entry point, initialise all modules
   ============================================================ */

import { initPreloader }             from './preloader.js';
import { initCursor }                from './cursor.js';
import { initHero }                  from './hero.js';
import { initScroll }                from './scroll.js';
import { initInteractions }          from './interactions.js';
import { initHackyText, initLinkHover } from './hacky-text.js';

// Preloader runs immediately (before DOM ready)
initPreloader();

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initHero();
  initScroll();
  initInteractions();
  initHackyText();
  initLinkHover();
});
