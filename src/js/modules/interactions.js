/* ============================================================
   interactions.js — Ticker, card tilt, spotlight, toast, etc.
   Menu is now handled by gsap/transitions.js
   ============================================================ */

export function initInteractions() {
  initTicker();
  initCardTilt();
  initSpotlight();
  initBackTop();
  initToast();
  initContactCopy();
  initRoleCycler();
}

/* ---- Ticker Band ---- */
function initTicker() {
  const track = document.querySelector('.ticker-track');
  if (!track) return;
  const clone = track.cloneNode(true);
  track.parentElement.appendChild(clone);
  track.classList.add('running');
  clone.classList.add('running');
}

/* ---- 3D Card Tilt ---- */
function initCardTilt() {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      card.style.transform = `perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) scale(1.01)`;
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ---- Spotlight ---- */
function initSpotlight() {
  document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.project-card').forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
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

/* ---- Toast ---- */
export function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
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
      window.location.href = `mailto:${email}`;
    });
  });
}

/* ---- Role Cycler (typewriter) — moved from hero.js ---- */
function initRoleCycler() {
  const el = document.getElementById('role-text');
  if (!el) return;

  const roles = [
    'Analytics Engineer',
    'Data Scientist',
    'ML Researcher',
    'HealthTech Engineer',
    'AI/ML Specialist',
  ];

  let roleIdx = 0, charIdx = 0, deleting = false, paused = false;

  function type() {
    if (paused) return;
    const target = roles[roleIdx];
    if (!deleting) {
      el.textContent = target.slice(0, ++charIdx);
      if (charIdx === target.length) {
        paused = true;
        setTimeout(() => { deleting = true; paused = false; }, 2400);
        return;
      }
      setTimeout(type, 80);
    } else {
      el.textContent = target.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        paused = true;
        setTimeout(() => { paused = false; setTimeout(type, 100); }, 200);
        return;
      }
      setTimeout(type, 40);
    }
  }

  setTimeout(type, 1200);
}
