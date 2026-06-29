document.addEventListener('DOMContentLoaded', () => {

  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  // ====== NAVBAR ======
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.pageYOffset > 20);
  });

  // ====== THEME ======
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const sunIcon = themeToggle.querySelector('.icon-sun');
  const moonIcon = themeToggle.querySelector('.icon-moon');

  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
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

  // ====== MUSIC ======
  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  const musicOnIcon = musicToggle.querySelector('.icon-music-on');
  const musicOffIcon = musicToggle.querySelector('.icon-music-off');

  let isMusicPlaying = false;

  if (localStorage.getItem('musicPlaying') === 'true') {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      updateMusic(true);
    }).catch(() => {});
  }

  musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
      bgMusic.pause();
      isMusicPlaying = false;
      updateMusic(false);
      localStorage.setItem('musicPlaying', 'false');
    } else {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        updateMusic(true);
        localStorage.setItem('musicPlaying', 'true');
      }).catch(() => {
        alert('Add a background music file to assets/audio/lofi.mp3');
      });
    }
  });

  function updateMusic(playing) {
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

  // ====== MOBILE MENU ======
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

  // ====== SMOOTH SCROLL ======
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ====== STAT COUNTER ======
  const numEls = document.querySelectorAll('.num');
  let counted = false;

  function countUp() {
    if (counted) return;
    counted = true;
    numEls.forEach(el => {
      const target = parseInt(el.dataset.target) || 0;
      if (target === 0) return;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 30));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current;
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

  // ====== SIGNUP FORM ======
  const signupForm = document.getElementById('signupForm');
  const signupSuccess = document.getElementById('signupSuccess');

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const interest = document.getElementById('formInterest').value;

      const entries = JSON.parse(localStorage.getItem('waitlist') || '[]');
      entries.push({ name, email, interest, date: new Date().toISOString() });
      localStorage.setItem('waitlist', JSON.stringify(entries));

      signupForm.style.display = 'none';
      signupSuccess.style.display = 'block';
    });
  }

  // ====== LEGAL MODALS ======
  function setupModal(triggerId, modalId, closeId) {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    const close = document.getElementById(closeId);
    if (!trigger || !modal || !close) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  setupModal('showTerms', 'termsModal', 'termsClose');
  setupModal('showPrivacy', 'privacyModal', 'privacyClose');
  setupModal('showRefund', 'refundModal', 'refundClose');
});
