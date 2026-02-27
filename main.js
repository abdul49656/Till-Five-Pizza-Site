/**
 * main.js — Daugherty & Honey Campaign Site
 * Compiled from main.ts — Spring/Summer 2025
 */

// ── Config ────────────────────────────────────────────────
// Paste your deployed Google Apps Script Web App URL here.
// Deploy as: Execute as > Me, Who has access > Anyone
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxT5KQsuLEFscY4drvf_FSMxHaOl3Ogs7p4q3f3NTKX9FoPhPY5LfzN19zTrWWy_E93og/exec';

// ── Navbar ───────────────────────────────────────────────

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile Menu ──────────────────────────────────────────

function initMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const navMenu   = document.getElementById('nav-menu');
  if (!hamburger || !navMenu) return;

  const open = () => {
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.classList.add('active');
    navMenu.classList.add('open');
    document.body.classList.add('menu-open');
  };

  const close = () => {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  hamburger.addEventListener('click', () => {
    hamburger.getAttribute('aria-expanded') === 'true' ? close() : open();
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

// ── Parallax ─────────────────────────────────────────────

function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers = Array.from(document.querySelectorAll('[data-parallax]')).map(element => ({
    element,
    speed: parseFloat(element.dataset.parallax ?? '0.3'),
  }));

  if (layers.length === 0) return;

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;
    layers.forEach(({ element, speed }) => {
      const parent = element.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      element.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
}

// ── Scroll Reveal ─────────────────────────────────────────

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => {
    if (el.closest('#hero')) return;
    observer.observe(el);
  });
}

// ── Smooth Scroll ─────────────────────────────────────────

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      if (!target) return;
      const navH = document.getElementById('navbar')?.offsetHeight ?? 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ── Counter Animation ─────────────────────────────────────

function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const tick  = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const v = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(v * target).toLocaleString();
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initCounters() {
  const items = Array.from(document.querySelectorAll('[data-counter]')).map(el => ({
    el,
    target: parseInt(el.dataset.counter ?? '0', 10),
    animated: false,
  }));

  if (items.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const item = items.find(c => c.el === entry.target);
        if (!item || item.animated) return;
        item.animated = true;
        animateCounter(item.el, item.target);
        observer.unobserve(item.el);
      });
    },
    { threshold: 0.5 }
  );

  items.forEach(({ el }) => observer.observe(el));
}

// ── Floating Petals ───────────────────────────────────────

function initFloatingPetals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const container = document.getElementById('petals-container');
  if (!container) return;

  const spawnPetal = () => {
    const petal = document.createElement('div');
    petal.className = 'petal';

    const size     = 4 + Math.random() * 5;
    const left     = Math.random() * 100;
    const duration = 5 + Math.random() * 8;
    const delay    = Math.random() * 1.5;
    const opacity  = 0.25 + Math.random() * 0.35;
    const drift    = (Math.random() - 0.5) * 180;

    petal.style.cssText = `
      left: ${left}vw;
      width: ${size}px;
      height: ${size}px;
      opacity: ${opacity};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    petal.style.setProperty('--drift', `${drift}px`);

    container.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove());
  };

  for (let i = 0; i < 6; i++) setTimeout(spawnPetal, i * 300);
  setInterval(spawnPetal, 1400);
}

// ── Form Handler ──────────────────────────────────────────

function initForm() {
  const form = document.querySelector('.cform');
  if (!form) return;

  // Inject inline status message element
  const status = document.createElement('p');
  status.id = 'cf-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.style.cssText = 'font-family:"DM Sans",sans-serif;font-size:0.875rem;text-align:center;margin-top:0.5rem;min-height:1.4em;transition:opacity 0.3s ease';
  form.appendChild(status);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn      = form.querySelector('[type="submit"]');
    const nameVal  = document.getElementById('cf-name').value.trim();
    const emailVal = document.getElementById('cf-email').value.trim();
    const emailRx  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameVal) {
      showStatus('error', 'Please enter your full name.');
      document.getElementById('cf-name').focus();
      return;
    }
    if (!emailVal || !emailRx.test(emailVal)) {
      showStatus('error', 'Please enter a valid email address.');
      document.getElementById('cf-email').focus();
      return;
    }
    if (btn.disabled) return;

    const origText  = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled    = true;
    showStatus('', '');

    const body = new URLSearchParams({
      name:     nameVal,
      email:    emailVal,
      interest: document.getElementById('cf-how').value,
      message:  document.getElementById('cf-msg').value.trim()
    });

    try {
      await fetch(GOOGLE_SHEET_URL, { method: 'POST', mode: 'no-cors', body });
      btn.textContent = 'Sent! 🍯';
      btn.classList.add('success');
      showStatus('success', "Thanks! We'll be in touch soon.");
      form.reset();
      setTimeout(() => {
        btn.textContent = origText;
        btn.disabled    = false;
        btn.classList.remove('success');
        showStatus('', '');
      }, 4000);
    } catch {
      btn.textContent = origText;
      btn.disabled    = false;
      showStatus('error', 'Something went wrong. Check your connection and try again.');
    }
  });

  function showStatus(type, text) {
    status.textContent = text;
    status.style.color   = type === 'error' ? '#C0392B' : type === 'success' ? '#27AE60' : 'inherit';
    status.style.opacity = text ? '1' : '0';
  }
}

// ── Init ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initParallax();
  initReveal();
  initSmoothScroll();
  initCounters();
  initForm();
  initFloatingPetals();
});
