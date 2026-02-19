/* ============================================================
   MAIN.JS — Navigation, Starfield, Scroll Reveal
   ============================================================ */

(function () {
  'use strict';

  /* ── STARFIELD CANVAS ── */
  function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, stars = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function makeStars(count) {
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.2 + 0.2,
          a: Math.random(),
          speed: Math.random() * 0.4 + 0.1,
          color: Math.random() > 0.9 ? '#00d4ff' : '#ffffff'
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.a += s.speed * 0.008;
        const alpha = (Math.sin(s.a) + 1) / 2 * 0.7 + 0.1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        if (s.color === '#ffffff') {
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
        } else {
          ctx.fillStyle = `rgba(0,212,255,${alpha * 0.6})`;
        }
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    makeStars(200);
    draw();
    window.addEventListener('resize', () => { resize(); makeStars(200); });
  }

  /* ── NAV ── */
  function initNav() {
    const nav     = document.querySelector('.nav');
    const burger  = document.querySelector('.nav__hamburger');
    const mobile  = document.querySelector('.nav__mobile');
    const links   = document.querySelectorAll('.nav__links a, .nav__mobile a');

    // Scroll state
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        nav && nav.classList.add('nav--scrolled');
      } else {
        nav && nav.classList.remove('nav--scrolled');
      }
    });

    // Active page highlight
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
      const href = link.getAttribute('href') || '';
      const page = href.split('/').pop();
      if (page === currentPage || (currentPage === '' && page === 'index.html')) {
        link.classList.add('active');
      }
    });

    // Mobile toggle
    if (burger && mobile) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        mobile.classList.toggle('open');
      });

      // Close on link click
      mobile.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          burger.classList.remove('open');
          mobile.classList.remove('open');
        });
      });
    }
  }

  /* ── SCROLL REVEAL ── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings by checking index in parent
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          const delay = (idx % 4) * 80;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => obs.observe(el));
  }

  /* ── TYPED CURSOR (hero only) ── */
  function initTyped() {
    const target = document.getElementById('typed-text');
    if (!target) return;

    const phrases = [
      'Generative AI Researcher',
      'Deep Learning Engineer',
      'GAN Specialist',
      'MSc Candidate'
    ];

    let pi = 0, ci = 0, deleting = false, waiting = false;

    function type() {
      if (waiting) return;
      const phrase = phrases[pi];

      if (!deleting) {
        target.textContent = phrase.substring(0, ci + 1);
        ci++;
        if (ci === phrase.length) {
          waiting = true;
          setTimeout(() => { deleting = true; waiting = false; }, 2200);
        }
      } else {
        target.textContent = phrase.substring(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? 45 : 75);
    }
    setTimeout(type, 1800);
  }

  /* ── SMOOTH ANCHOR ── */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    initNav();
    initReveal();
    initTyped();
    initAnchors();
  });
})();
