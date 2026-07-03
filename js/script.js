/* ═══════════════════════════════════════════════════════════════
   Ahmad Khan Portfolio — Main Script
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

  document.body.style.overflow = 'hidden';

  const done = () => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    initRevealObserver();
    initCounters();
  };

  setTimeout(done, 2000);
}

/* ── CUSTOM CURSOR ──────────────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cursor   = $('#cursor');
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
  const nav        = $('#nav');
  const toggle     = $('#navToggle');
  const mobileMenu = $('#mobileMenu');
  const links      = $$('.nav__link');
  const mobileLinks = $$('.mobile-menu__link');

  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

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

  function openMenu() {
    toggle.classList.add('open');
    // Set display:flex first, then add .open on next frame so transition fires
    mobileMenu.style.display = 'flex';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mobileMenu.classList.add('open');
      });
    });
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
    // Hide after transition ends
    mobileMenu.addEventListener('transitionend', () => {
      if (!mobileMenu.classList.contains('open')) {
        mobileMenu.style.display = '';
      }
    }, { once: true });
  }

  toggle.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

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
        const el       = entry.target;
        const target   = parseInt(el.dataset.target, 10);
        const duration = 1600;
        const start    = performance.now();

        function update(now) {
          const elapsed  = now - start;
          const progress = clamp(elapsed / duration, 0, 1);
          const ease     = 1 - Math.pow(1 - progress, 3);
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

      filters.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      cards.forEach((card) => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ── PROJECT MODAL DATA ─────────────────────────────────────── */
const projectData = {
  zyntrix: {
    permalink: 'https://www.behance.net/gallery/247238973/GRAPHIC-DESIGN-PORTFOLIO-2026/modules/1442208009',
    title: 'ZYNTRIX — Brand Identity Design',
    cat: 'Brand Identity · 2026',
    accentColor: '#E5E5E5',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1e1e1e 100%)',
    desc: [
      'ZYNTRIX is a tech and engineering company with the tagline "Engineered to Impress." The brand needed a visual identity that communicated precision, reliability, and forward-thinking innovation.',
      'The logo mark uses a bold geometric bar system inspired by data visualization — three vertical bars of varying height, with the centre bar in a contrasting tone to signify the core/pinnacle. The wordmark uses Poppins Bold for impact and legibility across all applications.',
    ],
    details: {
      'Color Palette': 'Charcorant Black #0F0F0F · Light Gray #E5E5E5 · Dark Gray #686868',
      'Typography':    'Poppins Bold (Heading) · Poppins Regular (Body)',
      'Applications':  'Business Card, Laptop Screen, App Icon, Wall Signage',
      'Tools':         'Adobe Illustrator',
      'Year':          '2026',
    },
  },
  gryd: {
    permalink: 'https://www.behance.net/gallery/247238973/GRAPHIC-DESIGN-PORTFOLIO-2026',
    title: 'GRYD — Tech Brand Identity',
    cat: 'Brand Identity · 2026',
    accentColor: '#C81F2A',
    bg: 'linear-gradient(135deg, #0d0000 0%, #280000 100%)',
    desc: [
      '"Code your identity" — GRYD is a modern technology-driven identity system for a company representing structure, coding logic, and digital innovation. The mark is built on a precise modular grid system inspired by code architecture.',
      'The identity reflects security, progression, and minimalism in every line. A bold red primary palette gives the brand high energy and digital confidence, applied consistently across business cards, digital screens, app icons, and wall signage.',
    ],
    details: {
      'Color Palette': 'Primary Red #C81F2A · White #FFFFFF · Dark #111111',
      'Typography':    'Montserrat Bold · Montserrat Regular',
      'Applications':  'Business Card, Laptop Screen, App Icon, Wall Signage',
      'Tools':         'Adobe Illustrator',
      'Year':          '2026',
    },
  },
  vektor: {
    permalink: 'https://www.behance.net/gallery/247238973/GRAPHIC-DESIGN-PORTFOLIO-2026/modules/1442207973',
    title: 'Vektor Core — Digital Brand Identity',
    cat: 'Brand Identity · 2026',
    accentColor: '#FF6B00',
    bg: 'linear-gradient(135deg, #0a0500 0%, #1f0e00 100%)',
    desc: [
      'Vektor Core represents precision, innovation, and structured intelligence converging at the core. The brand identity reflects cutting-edge technology, targeting industries focused on data, engineering, and advanced digital solutions.',
      'The logo is a diamond shape symbolizing precision, strength, and focus — with an inner core representing data and intelligence, and symmetry conveying balance and stability. The bold icon and sleek Montserrat typography symbolize precision at the core of next-gen tech.',
    ],
    details: {
      'Color Palette': 'Orange #FF6B00 · Black #000000 · White #FFFFFF',
      'Typography':    'Montserrat Bold · Montserrat Regular',
      'Symbol':        'Diamond shape — precision, strength, pinpoint accuracy',
      'Tools':         'Adobe Illustrator · Adobe Photoshop',
      'Year':          '2026',
    },
  },
  peanuts: {
    permalink: 'https://www.behance.net/gallery/247238973/GRAPHIC-DESIGN-PORTFOLIO-2026/modules/1442207977',
    title: 'Spicy Masala Peanuts — Packaging Design',
    cat: 'Packaging Design · 2026',
    accentColor: '#F63255',
    bg: 'linear-gradient(135deg, #1a0005 0%, #3a0010 100%)',
    desc: [
      'Packaging design presentation for a snack brand targeting young, urban snack buyers. The design brief called for packaging that stands out on shelves, communicates bold flavor, and appeals to an on-the-go snacking audience.',
      'High-contrast colors engineered for visibility and appetite appeal — red, yellow, and deep red dominate. The system is built for future scaling with flavor variants including Mint Peanuts, Cheese Peanuts, and Tandoori Peanuts, plus a premium extension: Munchies Elite Gourmet Spicy Peanuts.',
    ],
    details: {
      'Brand':         'Spicy Food',
      'Color System':  '#F63255 Hot Pink · #FF6A00 Orange · #C1121F Deep Red',
      'Typography':    'Clear hierarchy for fast scanning in retail',
      'Variants':      'Mint Peanuts, Cheese Peanuts, Tandoori Peanuts',
      'Tools':         'Adobe Illustrator · Adobe Photoshop',
      'Year':          '2026',
    },
  },
  porsche: {
    permalink: 'https://www.behance.net/gallery/247238973/GRAPHIC-DESIGN-PORTFOLIO-2026/modules/1442207999',
    title: 'Porsche — Social Media Campaign',
    cat: 'Social Media Design · 2026',
    accentColor: '#C89B00',
    bg: 'linear-gradient(135deg, #0a0800 0%, #1a1200 100%)',
    desc: [
      '"Built on heritage. Driven by passion." A social media carousel campaign for Porsche — a 6-slide Instagram series designed to communicate the brand\'s legendary performance credentials with modern editorial design.',
      'Each slide in the carousel serves a distinct storytelling purpose: hero shot, performance specs, heritage narrative, engineering excellence, lifestyle, and CTA. The gold and charcoal palette references Porsche\'s premium heritage, while Bebas Neue headlines deliver impact at a glance.',
    ],
    details: {
      'Brand':         'Porsche',
      'Format':        '6-Slide Instagram Carousel',
      'Color Palette': '#FFC00 Gold · #C89B00 Tan · #FFFFFF · #1A1A1A · #404040',
      'Typography':    'Bebas Neue Bold (Headlines) · Montserrat Regular (Body)',
      'Tools':         'Adobe Photoshop · Adobe Illustrator',
      'Year':          '2026',
    },
  },
  soundx: {
    permalink: 'https://www.behance.net/gallery/247238973/GRAPHIC-DESIGN-PORTFOLIO-2026/modules/1442207991',
    title: 'SoundX — Wireless Headphones Carousel',
    cat: 'Social Media Design · 2026',
    accentColor: '#FF1E1E',
    bg: 'linear-gradient(135deg, #0d0000 0%, #1a0000 100%)',
    desc: [
      '"Feel the Power" — a 6-slide social media carousel for SoundX wireless headphones priced at $99. The campaign is designed to communicate premium audio quality and technical specifications while driving purchase intent.',
      'The dark, dramatic visual language — deep black with red accents and blue tech highlights — creates an immersive atmosphere that matches the product\'s positioning. Features like Deep Bass, Noise Cancellation, and Fast Charging are spotlighted across dedicated slides with Bebas Neue impact headlines.',
    ],
    details: {
      'Brand':         'SoundX — Feel the Power',
      'Format':        '6-Slide Social Media Carousel',
      'Color Palette': '#FF1E1E Red · #000000 Black · #34B8CF Blue · #1A1A1A',
      'Typography':    'Bebas Neue Bold · Montserrat Regular',
      'Price Point':   'Only $99 · 15% Limited Offer',
      'Tools':         'Adobe Photoshop',
      'Year':          '2026',
    },
  },
  glownest: {
    permalink: 'https://www.behance.net/gallery/247238973/GRAPHIC-DESIGN-PORTFOLIO-2026/modules/1442207979',
    title: 'GlowNest Organics — Vitamin C Serum',
    cat: 'Social Media Design · 2026',
    accentColor: '#D4AF3F',
    bg: 'linear-gradient(135deg, #0d0a04 0%, #1f1608 100%)',
    desc: [
      '"Unveil Your Natural Glow." A premium social media creative campaign for GlowNest Organics\' Vitamin C Serum — a 100% organic, cruelty-free, paraben-free skincare product designed to brighten and revive the skin.',
      'The creative direction leans into luxury skincare aesthetics: warm gold and cream tones, Playfair Display serif typography for authority, and clinically-backed claims presented with editorial restraint. Key stats — 93% noticed brighter skin, 89% reduction in dark spots — are visualised clearly for conversion.',
    ],
    details: {
      'Brand':         'GlowNest Organics',
      'Product':       'Vitamin C Serum · 30ml · 100% Organic',
      'Color Palette': '#D4AF3F Gold · #F5D5E2 Blush · #7B5C2C Brown · #1A1A1A',
      'Typography':    'Playfair Display · Montserrat',
      'Claims':        '93% Brighter Skin · 89% Reduction in Dark Spots · 91%+',
      'Tools':         'Adobe Photoshop · Adobe Illustrator',
      'Year':          '2026',
    },
  },
  munchies: {
    permalink: 'https://www.behance.net/gallery/247238973/GRAPHIC-DESIGN-PORTFOLIO-2026/modules/1442207987',
    title: 'Munch Munchies Elite — Packaging',
    cat: 'Packaging Design · 2026',
    accentColor: '#C9A84C',
    bg: 'linear-gradient(135deg, #050500 0%, #121200 100%)',
    desc: [
      '"Not Just Snacks. An Experience." Munch Munchies Elite is a premium gourmet chip brand crafted for those who appreciate the perfect balance of flavor, crunch, and premium quality. The packaging is designed to command attention on premium retail shelves.',
      'A palette inspired by luxury and taste — Deep Black, Premium Gold, and Cream Highlight — positions the brand above standard snack lines. The bold typography and matte-finish packaging concept with spot UV logo creates a tactile premium experience that justifies the gourmet price point.',
    ],
    details: {
      'Brand':         'Munch Munchies Elite',
      'Flavor':        'Cheese & Black Pepper Gourmet Chips',
      'Color Palette': 'Deep Black #000000 · Premium Gold #C9A84C · Cream #F5CDB',
      'Finish':        'Matte Texture with Spot UV on Logo',
      'Typography':    'Bold serif wordmark · Clean sans-serif body',
      'Tools':         'Adobe Illustrator · Adobe Photoshop',
      'Year':          '2026',
    },
  },
  guitarist: {
    permalink: 'https://www.behance.net/gallery/247238973/GRAPHIC-DESIGN-PORTFOLIO-2026/modules/1442207989',
    title: 'The Guitarist — Character Design',
    cat: 'Illustration & Character Design · 2026',
    accentColor: '#F2601A',
    bg: 'linear-gradient(135deg, #200500 0%, #3d0a00 100%)',
    desc: [
      '"Music in his soul, rhythm in his hands." A full character design series for The Guitarist — a flat-style illustration character designed with a warm terracotta and deep red palette evocative of a classic music venue atmosphere.',
      'The deliverable includes a complete character design system: front/3/4/side/back turnaround views, 6 facial expressions (Neutral, Happy, Focused, Thoughtful, Surprised, Joyful), multiple dynamic poses, detailed accessory sheets (Acoustic Guitar, Pick, Music Note, Guitar Case), and a final scene illustration placing the character on stage in a spotlight.',
    ],
    details: {
      'Character':     'The Guitarist — "Music lives here"',
      'Style':         'Flat Illustration',
      'Color Palette': '#F28A19 Orange · #F2601A Red-Orange · #1A1A1A Black · #FFFFFF',
      'Deliverables':  'Turnarounds, Expressions, Poses, Accessories, Final Scene',
      'Tools':         'Adobe Illustrator',
      'Year':          '2026',
    },
  },
};

/* ── PROJECT MODAL ──────────────────────────────────────────── */
function initProjectModal() {
  const modal    = $('#projectModal');
  const backdrop = $('#modalBackdrop');
  const closeBtn = $('#modalClose');
  const content  = $('#modalContent');
  if (!modal) return;

  function openModal(key) {
    const data = projectData[key];
    if (!data) return;

    const detailsHTML = Object.entries(data.details)
      .map(([label, val]) => `
        <div class="modal__meta-item">
          <label>${label}</label>
          <span>${val}</span>
        </div>`)
      .join('');

    content.innerHTML = `
      <h2 id="modalTitle">${data.title}</h2>
      <span class="modal-cat">${data.cat}</span>
      <div class="modal__visual" style="background:${data.bg};">
        <div style="text-align:center; color:${data.accentColor}; font-family:'Bebas Neue',sans-serif; font-size:2.5rem; letter-spacing:4px; opacity:0.5;">
          ${data.title.split('—')[0].trim()}
        </div>
      </div>
      <div class="modal__body">
        <div class="modal__desc">
          ${data.desc.map((p) => `<p>${p}</p>`).join('')}
        </div>
        <div class="modal__meta">${detailsHTML}</div>
      </div>
      <div class="modal__behance-link">
        <a href="${data.permalink}" target="_blank" rel="noopener noreferrer">
          View full project on Behance ↗
        </a>
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

  $$('.form-input', form).forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields = $$('.form-input[required]', form);
    const valid  = fields.map(validateField).every(Boolean);
    if (!valid) {
      fields.find((f) => f.classList.contains('error'))?.focus();
      return;
    }

    const btnText = submitBtn.querySelector('.btn__text');
    btnText.textContent = 'Sending…';
    submitBtn.classList.add('btn--loading');

    try {
      const data = new FormData(form);
      const res  = await fetch('https://formspree.io/f/xojopoey', {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        btnText.textContent = 'Message Sent ✓';
        submitBtn.style.background = '#2d6a2d';
        form.reset();
        setTimeout(() => {
          btnText.textContent = 'Send Message';
          submitBtn.style.background = '';
          submitBtn.classList.remove('btn--loading');
        }, 4000);
      } else {
        throw new Error('Server error');
      }
    } catch {
      btnText.textContent = 'Failed — Try Again';
      submitBtn.style.background = '#8b2c2c';
      submitBtn.classList.remove('btn--loading');
      setTimeout(() => {
        btnText.textContent = 'Send Message';
        submitBtn.style.background = '';
      }, 4000);
    }
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
