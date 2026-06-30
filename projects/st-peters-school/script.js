document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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

  const form = document.getElementById('admissionForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const msg = `Hello, I'd like to apply for admission at St. Peter's.%0A%0AStudent: ${d.get('studentName')}%0ADOB: ${d.get('dob')}%0AClass: ${d.get('classApplying')}%0AParent: ${d.get('parentName')}%0APhone: ${d.get('phone')}%0AEmail: ${d.get('email')}%0AAddress: ${d.get('address')}`;
      window.open(`https://wa.me/917088411468?text=${msg}`, '_blank');
    });
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

  /* Results Auth */
  const resultsForm = document.getElementById('resultsAuthForm')
  if (resultsForm) {
    resultsForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const admno = document.getElementById('admNo').value.trim()
      const errorEl = document.getElementById('resultsError')

      if (!admno || admno.length < 4) {
        errorEl.textContent = 'Please enter a valid Admission Number (min 4 characters).'
        errorEl.style.display = 'block'
        return
      }

      localStorage.setItem('spis_student', admno)
      window.location.href = 'results/dashboard.html'
    })
  }

  /* Results Dashboard */
  if (window.location.pathname.includes('/results/dashboard.html')) {
    const studentId = localStorage.getItem('spis_student')
    if (!studentId) {
      window.location.href = '../results.html'
      return
    }

    const studentNameEl = document.getElementById('studentName')
    const studentIdEl = document.getElementById('studentId')
    if (studentNameEl) studentNameEl.textContent = 'Student Name'
    if (studentIdEl) studentIdEl.textContent = studentId

    const logout = (e) => {
      e.preventDefault()
      localStorage.removeItem('spis_student')
      window.location.href = '../results.html'
    }
    document.getElementById('resultsLogout')?.addEventListener('click', logout)
    document.getElementById('resultsLogout2')?.addEventListener('click', logout)

    const resultsData = [
      { subject: 'Mathematics', max: 100, marks: 92, grade: 'A' },
      { subject: 'Science', max: 100, marks: 88, grade: 'A' },
      { subject: 'English', max: 100, marks: 85, grade: 'A' },
      { subject: 'Hindi', max: 100, marks: 78, grade: 'B' },
      { subject: 'Social Studies', max: 100, marks: 90, grade: 'A' },
      { subject: 'Computer Science', max: 100, marks: 95, grade: 'A' }
    ]

    const tbody = document.querySelector('.results-table tbody')
    if (tbody) {
      tbody.innerHTML = resultsData.map(r => `
        <tr>
          <td>${r.subject}</td>
          <td>${r.max}</td>
          <td class="marks">${r.marks}</td>
          <td><span class="results-grade ${r.grade.toLowerCase()}">${r.grade}</span></td>
        </tr>
      `).join('')
    }

    const totalEl = document.querySelector('.results-total span:last-child')
    if (totalEl) {
      const total = resultsData.reduce((s, r) => s + r.marks, 0)
      const totalMax = resultsData.reduce((s, r) => s + r.max, 0)
      totalEl.textContent = `${total} / ${totalMax}`
    }
  }

  /* Exam Tabs */
  document.querySelectorAll('.exams-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.exams-tab').forEach(t => t.classList.remove('active'))
      document.querySelectorAll('.exams-panel').forEach(p => p.classList.remove('active'))
      tab.classList.add('active')
      document.getElementById(tab.dataset.exam)?.classList.add('active')
    })
  })
});
