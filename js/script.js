/* ═══════════════════════════════════════════════════════════════
   Ahmed Khan Portfolio — Main Script
   ══════════════════════════════════════════════════════════════ */

'use strict';

/* ── UTILITIES ──────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/* ── LOADER ─────────────────────────────────────────────────── */
function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  const done = () => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    initRevealObserver();
    initCounters();
  };

  document.body.style.overflow = 'hidden';

  // Match CSS animation duration (1.8s) + small buffer
  setTimeout(done, 2000);
}

/* ── CUSTOM CURSOR ──────────────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cursor = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followX = 0, followY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followX += (mouseX - followX) * 0.12;
    followY += (mouseY - followY) * 0.12;
    follower.style.left = followX + 'px';
    follower.style.top  = followY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  const hoverTargets = 'a, button, .work__filter, .project-card, .service-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('cursor--hover');
      follower.classList.add('cursor--hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('cursor--hover');
      follower.classList.remove('cursor--hover');
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else animateFollower();
  });
}

/* ── NAVIGATION ─────────────────────────────────────────────── */
function initNav() {
  const nav       = $('#nav');
  const toggle    = $('#navToggle');
  const mobileMenu = $('#mobileMenu');
  const links     = $$('.nav__link');
  const mobileLinks = $$('.mobile-menu__link');

  if (!nav) return;

  // Scrolled state
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active link highlight
  const sections = $$('section[id]');
  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach((sec) => {
      const top    = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const id     = sec.getAttribute('id');
      links.forEach((link) => {
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.toggle('active', scrollY >= top && scrollY < bottom);
        }
      });
    });
  }

  // Mobile toggle
  function openMenu() {
    toggle.classList.add('open');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
function initRevealObserver() {
  const targets = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ── ANIMATED COUNTERS ──────────────────────────────────────── */
function initCounters() {
  const counters = $$('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1600;
        const start    = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = clamp(elapsed / duration, 0, 1);
          // Ease out cubic
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * ease);
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ── PROJECT FILTER ─────────────────────────────────────────── */
function initProjectFilter() {
  const filters = $$('.work__filter');
  const cards   = $$('.project-card');
  if (!filters.length) return;

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filters.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards with animation
      cards.forEach((card) => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          void card.offsetHeight; // reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ── PROJECT MODAL ──────────────────────────────────────────── */
const projectData = {
  visa: {
    title: 'Rukn Al Keswa — Dubai Visa Campaign',
    cat: 'Marketing Campaign · 2026',
    desc: [
      'A comprehensive marketing campaign for Rukn Al Keswa Documents Clearing Services — a leading UAE visa services provider. The brief was clear: project authority, trust, and accessibility to a diverse international audience.',
      'The visual language draws on Dubai\'s iconic skyline and the aspirational narrative of opportunity, rendered in a rich dark-gold palette that communicates premium service without alienating the target audience of everyday travellers seeking quality assistance.',
    ],
    details: {
      Client: 'Rukn Al Keswa D.C.S.',
      Services: 'Flyer Design, Social Media Creatives',
      Year: '2026',
      Tools: 'Adobe Photoshop, Illustrator',
    },
    bg: 'linear-gradient(135deg, #1a0a00 0%, #3d1f00 40%, #1a0a00 100%)',
  },
  brand: {
    title: 'Nexus — Corporate Brand Identity',
    cat: 'Brand Identity · 2025',
    desc: [
      'A full brand identity system for Nexus, a strategy and design consultancy positioning itself at the premium end of the Gulf market. The challenge was creating a mark that felt both authoritative and contemporary — serious without being stiff.',
      'The identity uses a bold geometric form — a diamond suggesting both precision and vision — paired with clean sans-serif typography and a restricted palette of deep navy and warm white.',
    ],
    details: {
      Client: 'Nexus Consulting',
      Services: 'Logo, Brand Guidelines, Stationery',
      Year: '2025',
      Tools: 'Adobe Illustrator, InDesign',
    },
    bg: 'linear-gradient(135deg, #080d1a 0%, #0f1e3d 50%, #080d1a 100%)',
  },
  social: {
    title: 'E-commerce Launch — Social Media Kit',
    cat: 'Social Media Design · 2025',
    desc: [
      'A 30-piece social media template system designed for a product launch campaign spanning Instagram, Facebook, and LinkedIn. The kit was built to be modular — easily customisable by the client\'s in-house team without design expertise.',
      'Strong colour-coded categories, consistent typography rules, and pre-built animation guides gave the client a turnkey system that maintained brand coherence across 8 weeks of daily posting.',
    ],
    details: {
      Client: 'E-commerce Brand (NDA)',
      Services: 'Social Media Templates, Ad Creatives',
      Year: '2025',
      Tools: 'Adobe Photoshop, Figma',
    },
    bg: 'linear-gradient(135deg, #0a0a1a 0%, #12124a 50%, #0a0a1a 100%)',
  },
  print: {
    title: 'Luxury Real Estate — Brochure Design',
    cat: 'Print Design · 2025',
    desc: [
      'A 48-page luxury property brochure designed for a high-end real estate development in Dubai. The editorial-style layout prioritises the photography — generous white space, restrained typography, and elegant grid-breaking compositions.',
      'Print specifications included premium silk-laminate cover with spot UV on the logo, and interior pages on 150gsm coated stock — every material detail reinforcing the premium positioning of the development.',
    ],
    details: {
      Client: 'Real Estate Developer (NDA)',
      Services: 'Brochure Design, Print Production',
      Year: '2025',
      Tools: 'Adobe InDesign, Photoshop',
    },
    bg: 'linear-gradient(135deg, #0a0f0a 0%, #1a2e1a 50%, #0a0f0a 100%)',
  },
  resto: {
    title: 'Al Diwan — Fine Dining Brand Identity',
    cat: 'Brand Identity · 2024',
    desc: [
      'Al Diwan is a luxury Arabic fine-dining restaurant that asked for a visual identity reflecting the opulence of classical Arabic culture through a contemporary design lens. The result is an identity that feels timeless rather than nostalgic.',
      'The emblem draws on Islamic geometric patterns, simplified into a precise monogram. The colour palette of deep amber and off-white prints beautifully on embossed menus and golden-edged stationery.',
    ],
    details: {
      Client: 'Al Diwan Restaurant',
      Services: 'Brand Identity, Menu Design, Stationery',
      Year: '2024',
      Tools: 'Adobe Illustrator, InDesign',
    },
    bg: 'linear-gradient(135deg, #100a00 0%, #2a1800 50%, #100a00 100%)',
  },
  realestate: {
    title: 'Dubai Marina — Real Estate Campaign',
    cat: 'Marketing Design · 2024',
    desc: [
      'A multi-format marketing campaign for a luxury residential launch in Dubai Marina. The campaign needed to translate premium lifestyle aspirations into compelling visual assets across multiple formats simultaneously — from 6m billboards to Instagram stories.',
      'The visual system was built around a single hero image concept: Dubai Marina at dusk, seen through floor-to-ceiling glass — the ultimate status frame. All other assets derived their mood and palette from this central concept.',
    ],
    details: {
      Client: 'Property Developer (NDA)',
      Services: 'Billboard, Digital Banners, Print',
      Year: '2024',
      Tools: 'Adobe Photoshop, Illustrator, InDesign',
    },
    bg: 'linear-gradient(135deg, #000a1a 0%, #001433 50%, #000a1a 100%)',
  },
};

function initProjectModal() {
  const modal    = $('#projectModal');
  const backdrop = $('#modalBackdrop');
  const closeBtn = $('#modalClose');
  const content  = $('#modalContent');
  if (!modal) return;

  function openModal(projectKey) {
    const data = projectData[projectKey];
    if (!data) return;

    const detailsHTML = Object.entries(data.details)
      .map(([label, val]) => `
        <div class="modal__meta-item">
          <label>${label}</label>
          <span>${val}</span>
        </div>`)
      .join('');

    content.innerHTML = `
      <h2>${data.title}</h2>
      <span class="modal-cat">${data.cat}</span>
      <div class="modal__visual" style="background:${data.bg};">
        <div style="text-align:center; opacity:0.4; color:#C9A84C; font-family:'Bebas Neue',sans-serif; font-size:3rem; letter-spacing:4px;">
          ${data.title.split('—')[0].trim()}
        </div>
      </div>
      <div class="modal__body">
        <div class="modal__desc">
          ${data.desc.map((p) => `<p>${p}</p>`).join('')}
        </div>
        <div class="modal__meta">${detailsHTML}</div>
      </div>`;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Open on card button click
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.project-card__view-btn');
    if (btn) openModal(btn.dataset.project);
  });

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ── TESTIMONIALS SLIDER ────────────────────────────────────── */
function initTestimonials() {
  const track   = $('#testimonialsTrack');
  const dotsWrap = $('#testimonialDots');
  const prevBtn  = $('#prevTestimonial');
  const nextBtn  = $('#nextTestimonial');
  if (!track) return;

  const cards  = $$('.testimonial-card', track);
  let current  = 0;
  let autoPlay;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;

    $$('.testimonials__dot', dotsWrap).forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  function startAuto() {
    autoPlay = setInterval(next, 5000);
  }

  function resetAuto() {
    clearInterval(autoPlay);
    startAuto();
  }

  startAuto();

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.addEventListener('mouseleave', startAuto);

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
      resetAuto();
    }
  }, { passive: true });
}

/* ── BACK TO TOP ────────────────────────────────────────────── */
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── CONTACT FORM ───────────────────────────────────────────── */
function initContactForm() {
  const form      = $('#contactForm');
  const submitBtn = $('#formSubmitBtn');
  if (!form) return;

  const validators = {
    name:    (v) => v.trim().length >= 2 ? '' : 'Please enter your full name.',
    email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.',
    message: (v) => v.trim().length >= 10 ? '' : 'Please include a brief project description.',
  };

  function showError(field, msg) {
    field.classList.toggle('error', !!msg);
    const err = field.closest('.form-group')?.querySelector('.form-error');
    if (err) err.textContent = msg;
  }

  function validateField(field) {
    const name = field.getAttribute('name');
    if (!validators[name]) return true;
    const msg = validators[name](field.value);
    showError(field, msg);
    return !msg;
  }

  // Live validation
  $$('.form-input', form).forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields  = $$('.form-input[required]', form);
    const valid   = fields.map(validateField).every(Boolean);
    if (!valid) {
      fields.find((f) => f.classList.contains('error'))?.focus();
      return;
    }

    // Loading state
    const btnText = submitBtn.querySelector('.btn__text');
    btnText.textContent = 'Sending…';
    submitBtn.classList.add('btn--loading');

    // Simulate send (replace with actual endpoint)
    await new Promise((r) => setTimeout(r, 1800));

    btnText.textContent = 'Message Sent ✓';
    submitBtn.style.background = '#2d6a2d';
    form.reset();

    setTimeout(() => {
      btnText.textContent = 'Send Message';
      submitBtn.style.background = '';
      submitBtn.classList.remove('btn--loading');
    }, 4000);
  });
}

/* ── YEAR ───────────────────────────────────────────────────── */
function setYear() {
  const el = $('#currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── SMOOTH ANCHOR SCROLL ───────────────────────────────────── */
function initSmoothLinks() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
}

/* ── INIT ───────────────────────────────────────────────────── */
function init() {
  initLoader();
  initCursor();
  initNav();
  initProjectFilter();
  initProjectModal();
  initTestimonials();
  initBackToTop();
  initContactForm();
  initSmoothLinks();
  setYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
