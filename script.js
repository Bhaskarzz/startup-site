document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ====== NAV ======
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.pageYOffset > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ====== THEME ======
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  if (themeToggle) {
    const sunIcon = themeToggle.querySelector('.icon-sun');
    const moonIcon = themeToggle.querySelector('.icon-moon');
    const saved = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', saved);
    updateIcons(saved);

    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateIcons(next);
    });

    function updateIcons(t) {
      if (t === 'dark') { sunIcon.style.display = 'block'; moonIcon.style.display = 'none'; }
      else { sunIcon.style.display = 'none'; moonIcon.style.display = 'block'; }
    }
  }

  // ====== MUSIC ======
  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  if (musicToggle && bgMusic) {
    const musicOn = musicToggle.querySelector('.icon-music-on');
    const musicOff = musicToggle.querySelector('.icon-music-off');
    let playing = false;

    if (localStorage.getItem('musicPlaying') === 'true') {
      bgMusic.play().then(() => { playing = true; updateMusic(true); }).catch(() => {});
    }

    musicToggle.addEventListener('click', () => {
      if (playing) {
        bgMusic.pause(); playing = false; updateMusic(false);
        localStorage.setItem('musicPlaying', 'false');
      } else {
        bgMusic.play().then(() => { playing = true; updateMusic(true); localStorage.setItem('musicPlaying', 'true'); }).catch(() => {});
      }
    });

    function updateMusic(p) {
      if (p) { musicOn.style.display = 'none'; musicOff.style.display = 'block'; musicToggle.classList.add('playing'); }
      else { musicOn.style.display = 'block'; musicOff.style.display = 'none'; musicToggle.classList.remove('playing'); }
    }
  }

  // ====== MOBILE MENU ======
  const mobileBtn = document.getElementById('mobileBtn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  // ====== LEGAL MODALS ======
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

  // ====== STATS ======
  const stats = document.querySelector('.hero-stats');
  if (stats) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; observer.unobserve(e.target); } });
    }, { threshold: 0.5 });
    observer.observe(stats);
  }

  // ====== SCROLL REVEAL ======
  const staggerGrids = document.querySelectorAll(
    '.featured-grid, .templates-grid, .team-grid, .values-grid, .contact-page-grid'
  );
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

  // ====== LIQUID GLASS: specular tracking ======
  if (canHover && !reduceMotion) {
    document.querySelectorAll('.glass').forEach(el => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = ((e.clientX - r.left) / r.width) * 100;
        const my = ((e.clientY - r.top) / r.height) * 100;
        el.style.setProperty('--mx', mx + '%');
        el.style.setProperty('--my', my + '%');
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--mx', '50%');
        el.style.setProperty('--my', '18%');
      });
    });
  }

  // ====== 3D TILT ENGINE ======
  if (canHover && !reduceMotion) {
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
        if (!settled) {
          raf = requestAnimationFrame(loop);
        } else {
          raf = null;
        }
      }

      function ensureLoop() {
        if (!raf) raf = requestAnimationFrame(loop);
      }

      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        targetRY = (px - 0.5) * max * 2;
        targetRX = (py - 0.5) * max * -2;
        targetTZ = 14;
        ensureLoop();
      });

      el.addEventListener('pointerleave', () => {
        targetRX = 0; targetRY = 0; targetTZ = 0;
        ensureLoop();
      });
    });
  }

  // ====== HERO ORB PARALLAX ======
  const heroOrbWrap = document.getElementById('heroOrb');
  const heroSection = document.querySelector('.hero');
  if (heroOrbWrap && heroSection && canHover && !reduceMotion) {
    const orb = heroOrbWrap.querySelector('.hero-orb');
    let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;
    let targetOX = 70, targetOY = 75, curOX = 70, curOY = 75;
    let raf = null;

    function loop() {
      curRX += (targetRX - curRX) * 0.06;
      curRY += (targetRY - curRY) * 0.06;
      curOX += (targetOX - curOX) * 0.08;
      curOY += (targetOY - curOY) * 0.08;
      orb.style.transform = `rotateX(${curRX.toFixed(2)}deg) rotateY(${curRY.toFixed(2)}deg)`;
      orb.style.setProperty('--omx', curOX.toFixed(1) + '%');
      orb.style.setProperty('--omy', curOY.toFixed(1) + '%');
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    heroSection.addEventListener('pointermove', (e) => {
      const r = heroSection.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      targetRY = (px - 0.5) * 14;
      targetRX = (py - 0.5) * -14;
      targetOX = px * 100;
      targetOY = py * 100;
    });

    heroSection.addEventListener('pointerleave', () => {
      targetRX = 0; targetRY = 0; targetOX = 70; targetOY = 75;
    });
  }
});