document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // AOS INIT
  // ============================================================
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });

  // ============================================================
  // NAVBAR SCROLL EFFECT
  // ============================================================
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ============================================================
  // THEME TOGGLE
  // ============================================================
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const sunIcon = themeToggle.querySelector('.icon-sun');
  const moonIcon = themeToggle.querySelector('.icon-moon');

  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcons(next);
  });

  function updateThemeIcons(theme) {
    if (theme === 'dark') {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  }

  // ============================================================
  // MUSIC TOGGLE
  // ============================================================
  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  const musicOnIcon = musicToggle.querySelector('.icon-music-on');
  const musicOffIcon = musicToggle.querySelector('.icon-music-off');

  let isMusicPlaying = false;

  const savedMusicState = localStorage.getItem('musicPlaying');
  if (savedMusicState === 'true') {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      updateMusicIcons(true);
    }).catch(() => {});
  }

  musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
      bgMusic.pause();
      isMusicPlaying = false;
      updateMusicIcons(false);
      localStorage.setItem('musicPlaying', 'false');
    } else {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        updateMusicIcons(true);
        localStorage.setItem('musicPlaying', 'true');
      }).catch(() => {
        alert('Audio file not found. Add a .mp3 file to assets/audio/lofi.mp3');
      });
    }
  });

  function updateMusicIcons(playing) {
    if (playing) {
      musicOnIcon.style.display = 'none';
      musicOffIcon.style.display = 'block';
      musicToggle.classList.add('playing');
    } else {
      musicOnIcon.style.display = 'block';
      musicOffIcon.style.display = 'none';
      musicToggle.classList.remove('playing');
    }
  }

  // ============================================================
  // MOBILE MENU
  // ============================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // PASSWORD GATE
  // ============================================================
  const CORRECT_PASSWORD = 'admin01022011';
  const lockOverlay = document.getElementById('lockOverlay');
  const passwordInput = document.getElementById('passwordInput');
  const unlockBtn = document.getElementById('unlockBtn');
  const lockError = document.getElementById('lockError');
  const protectedArea = document.getElementById('protectedArea');

  const isUnlocked = sessionStorage.getItem('dashboardUnlocked');

  if (isUnlocked === 'true') {
    lockOverlay.classList.add('unlocked');
  }

  function unlockDashboard() {
    lockOverlay.classList.add('unlocked');
    sessionStorage.setItem('dashboardUnlocked', 'true');
    lockError.textContent = '';
    passwordInput.value = '';

    if (window.AOS) {
      AOS.refresh();
    }
  }

  unlockBtn.addEventListener('click', () => {
    const entered = passwordInput.value.trim();
    if (entered === CORRECT_PASSWORD) {
      unlockDashboard();
    } else {
      lockError.textContent = 'Incorrect password. Try again.';
      passwordInput.value = '';
      passwordInput.focus();
    }
  });

  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      unlockBtn.click();
    }
  });

  // ============================================================
  // 3D TILT EFFECT
  // ============================================================
  const tiltCards = document.querySelectorAll('.tilt-card, .tilt-card-sm');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;

      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });

  // ============================================================
  // PARALLAX SCROLL
  // ============================================================
  const layers = document.querySelectorAll('.parallax-layer');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    layers.forEach((layer, i) => {
      const speed = 0.05 * (i + 1);
      const yPos = scrollY * speed;
      layer.style.transform = `translateY(${yPos}px)`;
    });
  });

  // ============================================================
  // STAT COUNTER
  // ============================================================
  const statNumbers = document.querySelectorAll('.stat-num');
  let counted = false;

  function countUp() {
    if (counted) return;
    counted = true;

    statNumbers.forEach(stat => {
      const target = parseInt(stat.dataset.target) || 0;
      const suffix = stat.textContent.replace(/[\d]/g, '');
      let current = 0;
      const increment = Math.max(1, Math.ceil(target / 30));
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = suffix ? `Rs.${current}` : current;
      }, 50);
    });
  }

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(heroStats);
  }
});
