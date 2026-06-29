(function () {
  'use strict';

  var audio = null;
  var isPlaying = false;

  /* ------- Theme ------- */
  var themeToggle = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');
  var html = document.documentElement;

  function getPreferredTheme() {
    var stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.innerHTML = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>';
      } else {
        themeIcon.innerHTML = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>';
      }
    }
  }

  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  /* ------- Music ------- */
  var musicToggle = document.getElementById('musicToggle');
  var musicDot = document.getElementById('musicDot');
  var musicLabel = document.getElementById('musicLabel');

  function toggleMusic() {
    if (!audio) {
      audio = new Audio('assets/audio/lofi.mp3');
      audio.loop = true;
      audio.volume = 0.3;
    }
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      if (musicDot) musicDot.classList.add('paused');
      if (musicLabel) musicLabel.textContent = 'Music';
    } else {
      audio.play().catch(function () {});
      isPlaying = true;
      if (musicDot) musicDot.classList.remove('paused');
      if (musicLabel) musicLabel.textContent = 'Playing';
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', toggleMusic);
  }

  /* ------- Mobile Menu ------- */
  var mobileBtn = document.getElementById('mobileMenuBtn');
  var mobileMenu = document.getElementById('mobileMenu');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ------- Legal Modals ------- */
  var modalTriggers = document.querySelectorAll('[data-modal]');
  var modalCloseBtns = document.querySelectorAll('[data-modal-close]');

  modalTriggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-modal');
      var overlay = document.getElementById(id);
      if (overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloseBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-modal-close');
      var overlay = document.getElementById(id);
      if (overlay) {
        overlay.classList.remove('open');
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

})();
