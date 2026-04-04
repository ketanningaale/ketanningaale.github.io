/* ============================================================
   cursor.js — Custom cursor: outer ring + inner dot + magnetic
   ============================================================ */

export function initCursor() {
  const outer = document.getElementById('cursor-outer');
  const dot   = document.getElementById('cursor-dot');

  if (!outer || !dot) return;

  // Don't show custom cursor on touch devices
  if ('ontouchstart' in window) {
    outer.style.display = 'none';
    dot.style.display = 'none';
    return;
  }

  let mouseX = -200, mouseY = -200;
  let outerX = -200, outerY = -200;
  let isVisible = false;

  // Inner dot follows exactly
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    if (!isVisible) {
      isVisible = true;
      outer.style.opacity = '1';
      dot.style.opacity = '1';
    }
  });

  // Outer ring lags behind
  function animateOuter() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    outer.style.left = outerX + 'px';
    outer.style.top  = outerY + 'px';
    requestAnimationFrame(animateOuter);
  }
  animateOuter();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, [data-cursor-hover], input, textarea, select, label';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Click state
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });

  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    outer.style.opacity = '0';
    dot.style.opacity = '0';
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    if (mouseX > -100) {
      outer.style.opacity = '1';
      dot.style.opacity = '1';
      isVisible = true;
    }
  });

  // Magnetic effect on buttons / CTAs
  const magneticEls = document.querySelectorAll('[data-magnetic]');

  magneticEls.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}
