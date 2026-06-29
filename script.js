(function () {
  'use strict';

  /* ===== Canvas Blob Background ===== */
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
      var alpha = isDark ? 0.1 : 0.07;
      var colors = [
        { r: 6, g: 182, b: 212 },
        { r: 59, g: 130, b: 246 },
        { r: 139, g: 92, b: 246 },
        { r: 6, g: 182, b: 212 },
        { r: 16, g: 185, b: 129 }
      ];

      for (var i = 0; i < count; i++) {
        var c = colors[i % colors.length];
        blobs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: 140 + Math.random() * 200,
          phase: Math.random() * Math.PI * 2,
          color: c,
          alpha: alpha
        });
      }
    }

    function draw() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, w, h);

      var time = Date.now() / 4000;

      for (var i = 0; i < blobs.length; i++) {
        var b = blobs[i];

        b.x += b.vx;
        b.y += b.vy;

        if (b.x < -200) b.x = w + 200;
        if (b.x > w + 200) b.x = -200;
        if (b.y < -200) b.y = h + 200;
        if (b.y > h + 200) b.y = -200;

        var pulse = Math.sin(time + b.phase) * 0.12 + 1;
        var r = b.radius * pulse;

        var dx = mouseX - b.x;
        var dy = mouseY - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 350) {
          var force = (1 - dist / 350) * 15;
          b.x -= (dx / dist) * force;
          b.y -= (dy / dist) * force;
        }

        var grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        grad.addColorStop(0, 'rgba(' + b.color.r + ',' + b.color.g + ',' + b.color.b + ',' + b.alpha + ')');
        grad.addColorStop(0.4, 'rgba(' + b.color.r + ',' + b.color.g + ',' + b.color.b + ',' + (b.alpha * 0.5) + ')');
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

    var themeObserver = new MutationObserver(function () {
      isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      createBlobs();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  })();

  /* ===== Three.js 3D Scene ===== */
  (function initThree() {
    var container = document.getElementById('threeContainer');
    if (!container || typeof THREE === 'undefined') return;

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var mouseX = 0, mouseY = 0;
    var targetRotX = 0, targetRotY = 0;

    var w = container.clientWidth;
    var h = container.clientHeight;

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 5;

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    /* Torus Knot (glass) */
    var geo = new THREE.TorusKnotGeometry(1.2, 0.4, 180, 24);
    var mat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x22d3ee : 0x06b6d4,
      metalness: 0.05,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.15,
      transparent: true,
      opacity: 0.75,
      envMapIntensity: 1.5,
      side: THREE.DoubleSide,
      wireframe: false
    });
    var mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    /* Wireframe overlay */
    var wireMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x67e8f9 : 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    var wireMesh = new THREE.Mesh(geo.clone(), wireMat);
    wireMesh.scale.set(1.01, 1.01, 1.01);
    scene.add(wireMesh);

    /* Particles */
    var particleCount = 400;
    var positions = new Float32Array(particleCount * 3);
    var sizes = new Float32Array(particleCount);

    for (var i = 0; i < particleCount; i++) {
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      var radius = 3 + Math.random() * 4;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      sizes[i] = 0.02 + Math.random() * 0.04;
    }

    var particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    var particleMat = new THREE.PointsMaterial({
      color: isDark ? 0x67e8f9 : 0x06b6d4,
      size: 0.04,
      transparent: true,
      opacity: isDark ? 0.4 : 0.3,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    var particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* Lights */
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    var light1 = new THREE.DirectionalLight(0x06b6d4, 2);
    light1.position.set(2, 3, 4);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight(0x3b82f6, 1.5);
    light2.position.set(-3, -1, 2);
    scene.add(light2);

    var light3 = new THREE.PointLight(0x8b5cf6, 1);
    light3.position.set(0, -3, 2);
    scene.add(light3);

    /* Animation */
    function animate() {
      requestAnimationFrame(animate);

      var time = Date.now() * 0.0004;

      mesh.rotation.x = time * 0.3 + targetRotX * 0.001;
      mesh.rotation.y = time * 0.5 + targetRotY * 0.001;
      wireMesh.rotation.x = mesh.rotation.x;
      wireMesh.rotation.y = mesh.rotation.y;

      particles.rotation.x = time * 0.05;
      particles.rotation.y = time * 0.08;

      renderer.render(scene, camera);
    }

    animate();

    /* Mouse tracking */
    container.addEventListener('mousemove', function (e) {
      var rect = container.getBoundingClientRect();
      targetRotX = (e.clientY - rect.top - rect.height / 2) * 1.5;
      targetRotY = (e.clientX - rect.left - rect.width / 2) * 1.5;
    });

    container.addEventListener('mouseleave', function () {
      targetRotX = 0;
      targetRotY = 0;
    });

    /* Resize */
    function onResize() {
      var cw = container.clientWidth;
      var ch = container.clientHeight;
      if (cw === 0 || ch === 0) return;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    }

    window.addEventListener('resize', onResize);

    /* Theme change */
    var themeObserver = new MutationObserver(function () {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      mat.color.setHex(dark ? 0x22d3ee : 0x06b6d4);
      wireMat.color.setHex(dark ? 0x67e8f9 : 0x22d3ee);
      particleMat.color.setHex(dark ? 0x67e8f9 : 0x06b6d4);
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

  /* ===== Modals ===== */
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
