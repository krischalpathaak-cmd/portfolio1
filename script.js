'use strict';

(function () {

  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => [...(p || document).querySelectorAll(s)];

  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');


  /* ─── MOBILE SIDEBAR ─── */
  const sidebar = $('.sidebar');
  const toggle = document.createElement('button');
  toggle.className = 'sidebar-toggle';
  toggle.setAttribute('aria-label', 'Toggle navigation');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  document.body.prepend(toggle);

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    sidebar.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      sidebar.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  });

  /* ─── LOADER ─── */
  const loader = document.createElement('div');
  Object.assign(loader.style, {
    position: 'fixed', inset: '0', background: '#121212',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: '99999', transition: 'opacity 0.5s, visibility 0.5s'
  });
  const sp = document.createElement('div');
  Object.assign(sp.style, {
    width: '24px', height: '24px',
    border: '2px solid rgba(255,255,255,0.06)',
    borderTopColor: '#FF4C4C', borderRadius: '50%',
    animation: 'loaderSpin 0.6s linear infinite'
  });
  loader.appendChild(sp);
  document.body.prepend(loader);

  const ls = document.createElement('style');
  ls.textContent = '@keyframes loaderSpin { to { transform: rotate(360deg); } }';
  document.head.appendChild(ls);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      setTimeout(() => loader.remove(), 500);
    }, 300);
  });

  /* ─── CLOCK ─── */
  function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const m = String(now.getMinutes()).padStart(2, '0');
    const display = $('#clockDisplay');
    const suffix = $('.clock-suffix');
    if (display) display.textContent = `${h}:${m}`;
    if (suffix) suffix.textContent = ampm;
  }
  updateClock();
  setInterval(updateClock, 10000);

  /* ─── DRAGGABLE STATUS CARD ─── */
  const statusCard = $('.status-card');
  if (statusCard) {
    let isDragging = false;
    let startX, startY, origLeft, origTop;

    function getCardRect() { return statusCard.getBoundingClientRect(); }

    function onStart(e) {
      const touch = e.touches ? e.touches[0] : e;
      isDragging = true;
      const rect = getCardRect();
      startX = touch.clientX;
      startY = touch.clientY;
      origLeft = rect.left;
      origTop = rect.top;
      statusCard.style.right = 'auto';
      statusCard.style.left = origLeft + 'px';
      statusCard.style.top = origTop + 'px';
      statusCard.style.bottom = 'auto';
      statusCard.style.transition = 'none';
    }

    function onMove(e) {
      if (!isDragging) return;
      const touch = e.touches ? e.touches[0] : e;
      e.preventDefault();
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      statusCard.style.left = (origLeft + dx) + 'px';
      statusCard.style.top = (origTop + dy) + 'px';
    }

    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      statusCard.style.transition = '';
    }

    statusCard.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    statusCard.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  }

  /* ─── SCROLL — ACTIVE NAV ─── */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        let current = '';
        sections.forEach(sec => {
          if (y >= sec.offsetTop - 150) current = sec.id;
        });
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === current);
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ─── SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ─── TYPING ANIMATION ─── */
  function initTyping() {
    const el = $('#homeAnimated');
    if (!el) return;
    const words = ['Web Developer', 'UI Designer', 'Problem Solver'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = words[wordIndex];
      if (!isDeleting) {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          setTimeout(() => { isDeleting = true; type(); }, 2000);
          return;
        }
        setTimeout(type, 80);
      } else {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 40);
      }
    }

    setTimeout(type, 800);
  }

  /* ─── SKILL BAR ANIMATION ─── */
  function initSkillBars() {
    const boxes = $$('.skill-box');
    if (!boxes.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const box = entry.target;
        box.style.setProperty('--percent', box.dataset.percent + '%');
        box.classList.add('animated');
        obs.unobserve(box);
      });
    }, { threshold: 0.3 });
    boxes.forEach(b => obs.observe(b));
  }

  /* ─── COUNTER ANIMATION ─── */
  function initCounters() {
    const counters = $$('.about-stat-num');
    if (!counters.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const start = performance.now();
        const dur = 2000;
        function tick(now) {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.floor(eased * target) + '+';
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = target + '+';
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => obs.observe(c));
  }

  /* ─── SCROLL REVEAL ─── */
  function initReveal() {
    const els = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
  }

  function applyReveal() {
    /* Home */
    $('.home-greeting')?.classList.add('reveal');
    $('.home-name')?.classList.add('reveal');
    $('.home-animated-wrap')?.classList.add('reveal');
    $('.home-bio')?.classList.add('reveal');
    $('.home-visual')?.classList.add('reveal-scale');

    /* About */
    $('.about-text')?.classList.add('reveal-left');
    $('.about-stats')?.classList.add('reveal-right');

    /* Skills */
    $$('.skill-group').forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = `${i * 0.1}s`; });

    /* Education */
    $$('.edu-item').forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = `${i * 0.15}s`; });

    /* Experience */
    $('.experience-card')?.classList.add('reveal');

    /* Projects */
    $('.project-card')?.classList.add('reveal');

    /* Services */
    $$('.service-card').forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = `${i * 0.1}s`; });

    /* Footer */
    $('.footer-inner')?.classList.add('reveal');
  }

  applyReveal();
  initReveal();

  initTyping();
  initSkillBars();
  initCounters();
})();
