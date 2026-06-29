document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.pageYOffset > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const mobileBtn = document.getElementById('mobileBtn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  document.querySelectorAll('.legal-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.getElementById('modal-' + link.dataset.modal);
      if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
    });
  });
  document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('modal-close-btn')) {
        const modal = el.closest('.modal-overlay');
        if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
      }
    });
  });

  const staggerGrids = document.querySelectorAll('.about-features, .programs-grid, .admissions-grid, .campus-grid, .facilities-grid, .gallery-grid');
  staggerGrids.forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.setAttribute('data-reveal', '');
      child.style.transitionDelay = reduceMotion ? '0ms' : `${Math.min(i * 90, 360)}ms`;
    });
  });

  const revealTargets = document.querySelectorAll('[data-reveal]');
  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  }

  if (canHover && !reduceMotion) {
    document.querySelectorAll('.glass').forEach(el => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--mx', '50%');
        el.style.setProperty('--my', '18%');
      });
    });

    document.querySelectorAll('[data-tilt]').forEach(el => {
      const max = parseFloat(el.dataset.tiltMax || '8');
      let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0, curTZ = 0, targetTZ = 0;
      let raf = null;
      function loop() {
        curRX += (targetRX - curRX) * 0.14;
        curRY += (targetRY - curRY) * 0.14;
        curTZ += (targetTZ - curTZ) * 0.14;
        el.style.transform = `perspective(1100px) rotateX(${curRX.toFixed(2)}deg) rotateY(${curRY.toFixed(2)}deg) translateZ(${curTZ.toFixed(1)}px)`;
        const settled = Math.abs(targetRX - curRX) < 0.01 && Math.abs(targetRY - curRY) < 0.01 && Math.abs(targetTZ - curTZ) < 0.05;
        if (!settled) raf = requestAnimationFrame(loop); else raf = null;
      }
      function ensureLoop() { if (!raf) raf = requestAnimationFrame(loop); }
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        targetRY = (px - 0.5) * max * 2; targetRX = (py - 0.5) * max * -2; targetTZ = 14;
        ensureLoop();
      });
      el.addEventListener('pointerleave', () => { targetRX = 0; targetRY = 0; targetTZ = 0; ensureLoop(); });
    });
  }
});
