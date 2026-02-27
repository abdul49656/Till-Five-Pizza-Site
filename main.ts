/**
 * main.ts — Daugherty & Honey Campaign Site
 * TypeScript source — Spring/Summer 2026
 *
 * Compiled to main.js for browser use.
 * Run `tsc` to recompile after changes.
 */

// ── Config ────────────────────────────────────────────────
// Paste your deployed Google Apps Script Web App URL here.
// Deploy as: Execute as > Me, Who has access > Anyone
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxT5KQsuLEFscY4drvf_FSMxHaOl3Ogs7p4q3f3NTKX9FoPhPY5LfzN19zTrWWy_E93og/exec';

// ── Types ────────────────────────────────────────────────

interface ParallaxLayer {
  element: HTMLElement;
  speed: number;
}

interface CounterItem {
  el: HTMLElement;
  target: number;
  animated: boolean;
}

// ── Navbar ───────────────────────────────────────────────

function initNavbar(): void {
  const navbar = document.getElementById('navbar') as HTMLElement | null;
  if (!navbar) return;

  const onScroll = (): void => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile Menu ──────────────────────────────────────────

function initMobileMenu(): void {
  const hamburger = document.getElementById('nav-hamburger') as HTMLButtonElement | null;
  const navMenu   = document.getElementById('nav-menu')     as HTMLElement       | null;
  if (!hamburger || !navMenu) return;

  const open = (): void => {
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.classList.add('active');
    navMenu.classList.add('open');
    document.body.classList.add('menu-open');
  };

  const close = (): void => {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  hamburger.addEventListener('click', (): void => {
    hamburger.getAttribute('aria-expanded') === 'true' ? close() : open();
  });

  navMenu.querySelectorAll<HTMLAnchorElement>('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on Escape
  document.addEventListener('keydown', (e: KeyboardEvent): void => {
    if (e.key === 'Escape') close();
  });
}

// ── Parallax ─────────────────────────────────────────────

function initParallax(): void {
  // Skip parallax on low-power preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers: ParallaxLayer[] = Array.from(
    document.querySelectorAll<HTMLElement>('[data-parallax]')
  ).map(element => ({
    element,
    speed: parseFloat(element.dataset.parallax ?? '0.3'),
  }));

  if (layers.length === 0) return;

  let ticking = false;

  const update = (): void => {
    const scrollY = window.scrollY;
    layers.forEach(({ element, speed }) => {
      // Only update when parent section is near viewport
      const parent = element.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      element.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
}

// ── Scroll Reveal ─────────────────────────────────────────

function initReveal(): void {
  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]): void => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
    // Don't observe hero elements (they use CSS animation)
    if (el.closest('#hero')) return;
    observer.observe(el);
  });
}

// ── Smooth Scroll ─────────────────────────────────────────

function initSmoothScroll(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e: MouseEvent): void => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (!href) return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      const navH = (document.getElementById('navbar') as HTMLElement | null)?.offsetHeight ?? 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ── Counter Animation ─────────────────────────────────────

function animateCounter(el: HTMLElement, target: number, duration = 2000): void {
  const start = performance.now();
  const tick  = (now: number): void => {
    const t = Math.min((now - start) / duration, 1);
    const v = 1 - Math.pow(1 - t, 3); // ease-out cubic
    el.textContent = Math.floor(v * target).toLocaleString();
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initCounters(): void {
  const items: CounterItem[] = Array.from(
    document.querySelectorAll<HTMLElement>('[data-counter]')
  ).map(el => ({
    el,
    target: parseInt(el.dataset.counter ?? '0', 10),
    animated: false,
  }));

  if (items.length === 0) return;

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]): void => {
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

function initFloatingPetals(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const container = document.getElementById('petals-container');
  if (!container) return;

  const spawnPetal = (): void => {
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

  // Seed a few immediately
  for (let i = 0; i < 6; i++) setTimeout(spawnPetal, i * 300);
  // Then keep spawning
  setInterval(spawnPetal, 1400);
}

// ── Form Handler ──────────────────────────────────────────

function initForm(): void {
  const form = document.querySelector<HTMLFormElement>('.cform');
  if (!form) return;

  // Inject inline status message element
  const status = document.createElement('p');
  status.id = 'cf-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.style.cssText = 'font-family:"DM Sans",sans-serif;font-size:0.875rem;text-align:center;margin-top:0.5rem;min-height:1.4em;transition:opacity 0.3s ease';
  form.appendChild(status);

  form.addEventListener('submit', async (e: SubmitEvent): Promise<void> => {
    e.preventDefault();
    const btn      = form.querySelector<HTMLButtonElement>('[type="submit"]');
    const nameEl   = document.getElementById('cf-name')  as HTMLInputElement;
    const emailEl  = document.getElementById('cf-email') as HTMLInputElement;
    const howEl    = document.getElementById('cf-how')   as HTMLSelectElement;
    const msgEl    = document.getElementById('cf-msg')   as HTMLTextAreaElement;

    const nameVal  = nameEl.value.trim();
    const emailVal = emailEl.value.trim();
    const emailRx  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameVal) {
      showStatus('error', 'Please enter your full name.');
      nameEl.focus();
      return;
    }
    if (!emailVal || !emailRx.test(emailVal)) {
      showStatus('error', 'Please enter a valid email address.');
      emailEl.focus();
      return;
    }
    if (!btn || btn.disabled) return;

    const origText  = btn.textContent ?? '';
    btn.textContent = 'Sending…';
    btn.disabled    = true;
    showStatus('', '');

    const body = new URLSearchParams({
      name:     nameVal,
      email:    emailVal,
      interest: howEl.value,
      message:  msgEl.value.trim()
    });

    try {
      await fetch(GOOGLE_SHEET_URL, { method: 'POST', mode: 'no-cors', body });
      btn.textContent = 'Sent! 🍯';
      btn.classList.add('success');
      showStatus('success', "Thanks! We'll be in touch soon.");
      form.reset();
      setTimeout((): void => {
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

  function showStatus(type: '' | 'success' | 'error', text: string): void {
    status.textContent = text;
    status.style.color   = type === 'error' ? '#C0392B' : type === 'success' ? '#27AE60' : 'inherit';
    status.style.opacity = text ? '1' : '0';
  }
}

// ── Init ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', (): void => {
  initNavbar();
  initMobileMenu();
  initParallax();
  initReveal();
  initSmoothScroll();
  initCounters();
  initForm();
  initFloatingPetals();
});
