(function () {
  'use strict';

  /* ===== Canvas Blob Animation ===== */
  (function initCanvas() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var w, h;
    var blobs = [];
    var mouseX = 0, mouseY = 0;
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var rafId = null;
    var isVisible = true;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function createBlobs() {
      blobs = [];
      var count = Math.min(5, Math.floor(w / 300) + 2);
      var colors = isDark
        ? [
            { r: 6, g: 182, b: 212 },
            { r: 59, g: 130, b: 246 },
            { r: 139, g: 92, b: 246 },
            { r: 6, g: 182, b: 212 },
            { r: 16, g: 185, b: 129 }
          ]
        : [
            { r: 6, g: 182, b: 212 },
            { r: 59, g: 130, b: 246 },
            { r: 139, g: 92, b: 246 },
            { r: 6, g: 182, b: 212 },
            { r: 16, g: 185, b: 129 }
          ];

      for (var i = 0; i < count; i++) {
        var color = colors[i % colors.length];
        blobs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 120 + Math.random() * 180,
          targetRadius: 120 + Math.random() * 180,
          phase: Math.random() * Math.PI * 2,
          color: color,
          alpha: isDark ? 0.08 : 0.06
        });
      }
    }

    function draw() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, w, h);

      var time = Date.now() / 3000;

      for (var i = 0; i < blobs.length; i++) {
        var b = blobs[i];

        b.x += b.vx;
        b.y += b.vy;

        if (b.x < -200) b.x = w + 200;
        if (b.x > w + 200) b.x = -200;
        if (b.y < -200) b.y = h + 200;
        if (b.y > h + 200) b.y = -200;

        var pulse = Math.sin(time + b.phase) * 0.15 + 1;
        var r = b.radius * pulse;

        var dx = mouseX - b.x;
        var dy = mouseY - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 400) {
          var force = (1 - dist / 400) * 20;
          b.x -= dx / dist * force;
          b.y -= dy / dist * force;
        }

        var grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        grad.addColorStop(0, 'rgba(' + b.color.r + ',' + b.color.g + ',' + b.color.b + ',' + b.alpha + ')');
        grad.addColorStop(0.5, 'rgba(' + b.color.r + ',' + b.color.g + ',' + b.color.b + ',' + (b.alpha * 0.6) + ')');
        grad.addColorStop(1, 'rgba(' + b.color.r + ',' + b.color.g + ',' + b.color.b + ',0)');

        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    function init() {
      resize();
      createBlobs();
      if (rafId) cancelAnimationFrame(rafId);
      draw();
    }

    window.addEventListener('resize', function () {
      resize();
      createBlobs();
    });

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    var observer = new IntersectionObserver(function (entries) {
      isVisible = entries[0].isIntersecting;
    });
    observer.observe(canvas);

    init();

    /* Re-init on theme change */
    var themeObserver = new MutationObserver(function () {
      isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      createBlobs();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  })();

  /* ===== Theme ===== */
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

  /* ===== Music ===== */
  var audio = null;
  var isPlaying = false;
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

  /* ===== Mobile Menu ===== */
  var mobileBtn = document.getElementById('mobileMenuBtn');
  var mobileMenu = document.getElementById('mobileMenu');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ===== Legal Modals ===== */
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

  /* ===== Scroll Reveal ===== */
  var revealEls = document.querySelectorAll('.reveal');

  function checkReveal() {
    for (var i = 0; i < revealEls.length; i++) {
      var el = revealEls[i];
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        el.classList.add('visible');
      }
    }
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('resize', checkReveal);
  checkReveal();

})();
