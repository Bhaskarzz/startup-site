document.addEventListener('DOMContentLoaded', () => {

  AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });

  // ====== NAV ======
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.pageYOffset > 20);
  });

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
});
