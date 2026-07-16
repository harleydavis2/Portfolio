/* ======================================================
   ALEX MORGAN PORTFOLIO — MAIN.JS
   Scroll-reveal, smooth scroll, topbar shrink, cursor glow
   ====================================================== */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  function initScrollReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add('is-visible');
          }, i * 70);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Smooth scroll ---------- */
  function initSmoothScroll() {
    var header = document.querySelector('.topbar');
    var headerH = header ? header.offsetHeight : 0;

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
        window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ---------- Topbar active-section highlight ---------- */
  function initNavHighlight() {
    var sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          document.querySelectorAll('.topbar__cta').forEach(function (a) {
            a.dataset.active = entry.target.id;
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Subtle cursor orange glow (desktop only) ---------- */
  function initCursorGlow() {
    if (window.innerWidth < 1024 || prefersReducedMotion) return;

    var glow = document.createElement('div');
    glow.style.cssText = [
      'position:fixed','pointer-events:none','z-index:9999',
      'width:320px','height:320px',
      'border-radius:50%',
      'background:radial-gradient(circle,rgba(232,80,2,0.12) 0%,transparent 70%)',
      'transform:translate(-50%,-50%)',
      'transition:left .12s ease,top .12s ease',
      'top:-200px','left:-200px'
    ].join(';');
    document.body.appendChild(glow);

    document.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  }

  /* ---------- Number counter animation ---------- */
  function initCounters() {
    var nums = document.querySelectorAll('.accent-num');
    if (!nums.length || prefersReducedMotion) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.textContent, 10);
        var start = 0;
        var dur = 1200;
        var t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          el.textContent = Math.floor(p * target) + '+';
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target + '+';
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });

    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Burger nav drawer ---------- */
  function initBurgerNav() {
    var btn     = document.getElementById('burger-btn');
    var drawer  = document.getElementById('nav-drawer');
    var overlay = document.getElementById('nav-overlay');
    var closeBtn = document.getElementById('nav-close');
    if (!btn || !drawer || !overlay) return;

    function openNav() {
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-open');
    }

    function closeNav() {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-open');
    }

    btn.addEventListener('click', function () {
      btn.classList.contains('is-open') ? closeNav() : openNav();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);

    /* Close on nav link click */
    drawer.querySelectorAll('[data-nav-close]').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    /* Close on Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initSmoothScroll();
    initNavHighlight();
    initCursorGlow();
    initCounters();
    initBurgerNav();
  });

})();
