/* ============================================================
   interactions.js — Menu, tilt, ticker, spotlight, toast, etc.
   ============================================================ */

export function initInteractions() {
  initMenu();
  initTicker();
  initCardTilt();
  initSpotlight();
  initBackTop();
  initToast();
  initContactCopy();
}

/* ---- Hamburger Menu ---- */
function initMenu() {
  const btn     = document.getElementById('hamburger');
  const overlay = document.getElementById('menu-overlay');
  const links   = overlay ? overlay.querySelectorAll('.menu-nav-item') : [];
  let open = false;

  if (!btn || !overlay) return;

  function openMenu() {
    open = true;
    btn.classList.add('active');
    overlay.classList.add('open');
    document.body.classList.add('menu-open');
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    open = false;
    btn.classList.remove('active');
    overlay.classList.remove('open');
    document.body.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => open ? closeMenu() : openMenu());

  links.forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) closeMenu();
  });
}

/* ---- Ticker Band ---- */
function initTicker() {
  const track = document.querySelector('.ticker-track');
  if (!track) return;

  // Clone for seamless loop
  const clone = track.cloneNode(true);
  track.parentElement.appendChild(clone);
  track.classList.add('running');
  clone.classList.add('running');
}

/* ---- 3D Card Tilt ---- */
function initCardTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      const tiltX = y * -6;
      const tiltY = x * 6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---- Spotlight (radial glow follows mouse on cards) ---- */
function initSpotlight() {
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
  });
}

/* ---- Back to Top ---- */
function initBackTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- Toast System ---- */
const toastContainer = () => document.getElementById('toast-container');

export function showToast(message, duration = 3000) {
  const container = toastContainer();
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('dismissed');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

function initToast() {
  // Expose globally for inline use if needed
  window.showToast = showToast;
}

/* ---- Contact Email Copy ---- */
function initContactCopy() {
  const emailLink = document.querySelector('.contact-email');
  if (!emailLink) return;

  emailLink.addEventListener('click', (e) => {
    const email = emailLink.dataset.email || emailLink.textContent.trim();
    if (!email.includes('@')) return;

    e.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      showToast('Email copied to clipboard');
    }).catch(() => {
      // fallback: open mailto
      window.location.href = `mailto:${email}`;
    });
  });
}
