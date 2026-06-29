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
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // ============================================================
  // THEME TOGGLE (Dark / Light)
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
  // SMOOTH SCROLL FOR NAV LINKS
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
  // STAT COUNTER (Animate on scroll)
  // ============================================================
  const statNumbers = document.querySelectorAll('.stat-num');
  let counted = false;

  function countUp() {
    if (counted) return;
    counted = true;
    statNumbers.forEach(stat => {
      const text = stat.textContent;
      if (text === '₹999') return;
      const target = parseInt(text) || 0;
      let current = 0;
      const increment = Math.ceil(target / 30);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = current;
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
