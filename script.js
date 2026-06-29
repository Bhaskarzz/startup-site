(function () {
  'use strict';

  var html = document.documentElement;

  /* Theme */
  var themeToggle = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');

  function getTheme() {
    return localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function setTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    if (themeIcon) {
      themeIcon.innerHTML = t === 'dark'
        ? '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'
        : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>';
    }
  }

  setTheme(getTheme());
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* Music */
  var audio = null;
  var playing = false;
  var musicToggle = document.getElementById('musicToggle');
  var musicDot = document.getElementById('musicDot');
  var musicLabel = document.getElementById('musicLabel');

  if (musicToggle) {
    musicToggle.addEventListener('click', function () {
      if (!audio) {
        audio = new Audio('assets/audio/lofi.mp3');
        audio.loop = true;
        audio.volume = 0.3;
      }
      if (playing) {
        audio.pause();
        playing = false;
        if (musicDot) musicDot.classList.add('paused');
        if (musicLabel) musicLabel.textContent = 'Music';
      } else {
        audio.play().catch(function () {});
        playing = true;
        if (musicDot) musicDot.classList.remove('paused');
        if (musicLabel) musicLabel.textContent = 'Playing';
      }
    });
  }

  /* Mobile menu */
  var mobBtn = document.getElementById('mobBtn');
  var mobMenu = document.getElementById('mobMenu');

  if (mobBtn && mobMenu) {
    mobBtn.addEventListener('click', function () {
      mobMenu.classList.toggle('open');
    });
  }

  /* Modals */
  var triggers = document.querySelectorAll('[data-modal]');
  var closeBtns = document.querySelectorAll('[data-modal-close]');

  triggers.forEach(function (b) {
    b.addEventListener('click', function () {
      var el = document.getElementById(b.getAttribute('data-modal'));
      if (el) {
        el.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var el = document.getElementById(b.getAttribute('data-modal-close'));
      if (el) {
        el.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(function (el) {
        el.classList.remove('open');
      });
      document.body.style.overflow = '';
    }
  });

  /* Scroll reveal */
  var revEls = document.querySelectorAll('.rev');

  function checkRev() {
    for (var i = 0; i < revEls.length; i++) {
      var rect = revEls[i].getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) {
        revEls[i].classList.add('vis');
      }
    }
  }

  window.addEventListener('scroll', checkRev, { passive: true });
  window.addEventListener('resize', checkRev);
  checkRev();
})();
