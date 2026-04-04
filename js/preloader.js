/* ============================================================
   preloader.js — Loading screen with progress counter
   ============================================================ */

const files = [
  'index.html',
  'css/main.css',
  'css/animations.css',
  'js/preloader.js',
  'js/cursor.js',
  'js/hero.js',
  'js/scroll.js',
  'js/interactions.js',
  'js/main.js',
  'assets loaded',
];

export function initPreloader() {
  const preloader  = document.getElementById('preloader');
  const bar        = document.querySelector('.preloader-bar-fill');
  const pct        = document.querySelector('.preloader-percent');
  const fileEl     = document.querySelector('.preloader-file');

  if (!preloader) return;

  let current = 0;
  let fileIdx = 0;
  let done = false;

  function setProgress(val) {
    const clamped = Math.min(100, Math.max(0, Math.round(val)));
    if (bar) bar.style.width = clamped + '%';
    if (pct) pct.textContent = clamped + '%';
  }

  function cycleFile() {
    if (fileEl && fileIdx < files.length) {
      fileEl.textContent = files[fileIdx++];
    }
  }

  // Animate progress 0 → 90 over ~1.8s
  const startTime = performance.now();
  const fakeDuration = 1800;

  function animateFake(now) {
    if (done) return;
    const elapsed = now - startTime;
    const t = Math.min(elapsed / fakeDuration, 1);
    // Ease-in-out curve so it slows near 90
    const eased = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
    current = eased * 90;
    setProgress(current);

    const expectedFile = Math.floor(t * (files.length - 1));
    if (expectedFile > fileIdx - 1) cycleFile();

    if (t < 1) {
      requestAnimationFrame(animateFake);
    }
  }

  requestAnimationFrame(animateFake);

  function hidePreloader() {
    if (done) return;
    done = true;
    // Jump to 100
    setProgress(100);
    if (fileEl) fileEl.textContent = 'ready.';

    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => {
        preloader.style.display = 'none';
        document.dispatchEvent(new CustomEvent('preloaderDone'));
      }, 850);
    }, 300);
  }

  // Hide when page fully loaded
  window.addEventListener('load', () => {
    setTimeout(hidePreloader, 400);
  });

  // Hard fallback
  setTimeout(hidePreloader, 3500);
}
