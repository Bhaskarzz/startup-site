/**
 * Component Loader - Loads shared HTML components (header, footer) into pages
 * Usage: include <div data-include="header"></div> where you want the component
 * Loads from /components/ directory relative to current page
 */

class ComponentLoader {
  constructor() {
    this.cache = new Map();
    this.basePath = this.getBasePath();
  }

  getBasePath() {
    const path = window.location.pathname;
    const depth = path.split('/').filter(Boolean).length;
    // If we're in a subdirectory (results/, etc.), go up
    if (path.includes('/results/') || path.includes('/components/')) {
      return '../';
    }
    return './';
  }

  async loadComponent(name, targetSelector) {
    const targets = document.querySelectorAll(targetSelector);
    if (!targets.length) return;

    let html = this.cache.get(name);
    if (!html) {
      try {
        const response = await fetch(`${this.basePath}components/${name}.html`);
        if (!response.ok) throw new Error(`Failed to load ${name}`);
        html = await response.text();
        this.cache.set(name, html);
      } catch (e) {
        console.error(`Component ${name} failed to load:`, e);
        return;
      }
    }

    targets.forEach(target => {
      target.innerHTML = html;
      target.removeAttribute('data-include');
    });

    // Initialize component-specific functionality
    this.initComponent(name);
  }

  initComponent(name) {
    switch (name) {
      case 'header':
        this.initHeader();
        break;
      case 'footer':
        this.initFooter();
        break;
    }
  }

  initHeader() {
    // Mobile menu
    const mobileBtn = document.getElementById('mobileBtn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
      navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
    }

    // Scroll effect on nav
    const navbar = document.getElementById('navbar');
    if (navbar) {
      const onScroll = () => navbar.classList.toggle('scrolled', window.pageYOffset > 20);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Theme toggle (if present)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const html = document.documentElement;
      const sunIcon = themeToggle.querySelector('.icon-sun');
      const moonIcon = themeToggle.querySelector('.icon-moon');
      const saved = localStorage.getItem('theme') || 'light';
      html.setAttribute('data-theme', saved);
      if (saved === 'dark') { sunIcon.style.display = 'block'; moonIcon.style.display = 'none'; }
      else { sunIcon.style.display = 'none'; moonIcon.style.display = 'block'; }
      themeToggle.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        if (next === 'dark') { sunIcon.style.display = 'block'; moonIcon.style.display = 'none'; }
        else { sunIcon.style.display = 'none'; moonIcon.style.display = 'block'; }
      });
    }

    // Notification bell & center
    this.initNotifications();

    // Active nav highlighting
    this.highlightActiveNav();
  }

  initFooter() {
    // Legal modals
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
  }

  initNotifications() {
    const bell = document.getElementById('notificationBell');
    const center = document.getElementById('notificationCenter');
    const close = document.getElementById('notificationClose');
    const list = document.getElementById('notificationList');
    const empty = document.getElementById('notificationEmpty');
    const badge = document.getElementById('notificationBadge');

    if (!bell || !center) return;

    const STORAGE_KEY = 'spis_notifications';
    const READ_KEY = 'spis_notifications_read';

    function getNotifs() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
    }
    function getRead() {
      try { return JSON.parse(localStorage.getItem(READ_KEY)) || [] } catch { return [] }
    }
    function saveRead(ids) { localStorage.setItem(READ_KEY, JSON.stringify(ids)) }

    function seedDefaults() {
      if (localStorage.getItem(STORAGE_KEY)) return;
      const defaults = [
        { id: 'n1', type: 'info', icon: 'i', title: 'Summer Break Notice', desc: 'School will remain closed from May 15 to June 30 for summer vacation.', time: '2 days ago' },
        { id: 'n2', type: 'success', icon: '\u2713', title: 'Results Announced', desc: 'Annual exam results for Classes 1-10 are now available. Check the Results portal.', time: '1 week ago' },
        { id: 'n3', type: 'warning', icon: '!', title: 'Fee Payment Due', desc: 'Reminder: Term 2 fees are due by March 15. Pay online to avoid late fee.', time: '2 weeks ago' },
        { id: 'n4', type: 'alert', icon: '\u26A0', title: 'PTM Rescheduled', desc: 'Parent-Teacher Meeting for Class 12 rescheduled to March 10 at 10 AM.', time: '3 weeks ago' },
        { id: 'n5', type: 'info', icon: 'i', title: 'Sports Day Postponed', desc: 'Annual Sports Day moved to Feb 28 due to weather conditions.', time: '1 month ago' }
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    }

    function render() {
      const notifications = getNotifs()
      const readIds = getRead()
      const unread = notifications.filter(n => !readIds.includes(n.id)).length

      if (badge) {
        badge.textContent = unread
        badge.style.display = unread > 0 ? 'flex' : 'none'
      }

      if (!list) return
      if (notifications.length === 0) {
        list.innerHTML = ''
        if (empty) empty.style.display = 'block'
        return
      }
      if (empty) empty.style.display = 'none'

      list.innerHTML = notifications.map(n => {
        const isUnread = !readIds.includes(n.id)
        return `
          <li class="notification-item${isUnread ? ' unread' : ''}" data-id="${n.id}" role="button" tabindex="0">
            <div class="notification-item-icon ${n.type}">${n.icon || 'i'}</div>
            <div class="notification-item-body">
              <div class="notification-item-title">${n.title}</div>
              <div class="notification-item-desc">${n.desc || n.message}</div>
              <div class="notification-item-time">${n.time || (n.date ? new Date(n.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '')}</div>
            </div>
          </li>
        `
      }).join('')

      list.querySelectorAll('.notification-item').forEach(el => {
        el.addEventListener('click', () => {
          const id = el.dataset.id
          const readIds = getRead()
          if (!readIds.includes(id)) {
            readIds.push(id)
            saveRead(readIds)
            render()
          }
        })
      })
    }

    seedDefaults()
    render()

    bell.addEventListener('click', (e) => {
      e.stopPropagation()
      const isOpen = center.getAttribute('aria-hidden') === 'false'
      center.setAttribute('aria-hidden', isOpen ? 'true' : 'false')
      bell.setAttribute('aria-expanded', isOpen ? 'false' : 'true')
      if (!isOpen) render()
    })

    if (close) {
      close.addEventListener('click', () => {
        center.setAttribute('aria-hidden', 'true')
        bell.setAttribute('aria-expanded', 'false')
      })
    }

    document.addEventListener('click', (e) => {
      if (!center.contains(e.target) && !bell.contains(e.target)) {
        center.setAttribute('aria-hidden', 'true')
        bell.setAttribute('aria-expanded', 'false')
      }
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && center.getAttribute('aria-hidden') === 'false') {
        center.setAttribute('aria-hidden', 'true')
        bell.setAttribute('aria-expanded', 'false')
        bell.focus()
      }
    })

    window.NotificationCenter = {
      add: (notification) => {
        const notifications = getNotifs()
        const newNotif = { id: Date.now().toString(), time: 'Just now', ...notification }
        notifications.unshift(newNotif)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
        if (center.getAttribute('aria-hidden') === 'false') render()
        else {
          render()
        }
      },
      clear: () => {
        localStorage.setItem(STORAGE_KEY, '[]')
        localStorage.setItem(READ_KEY, '[]')
        render()
      }
    }
  }

  highlightActiveNav() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    const hash = window.location.hash;
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      // Check for exact match or hash match
      if (href === page || (hash && href.includes(hash))) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }
}

// Auto-load components on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  const loader = new ComponentLoader();
  await loader.loadComponent('header', '[data-include="header"]');
  await loader.loadComponent('footer', '[data-include="footer"]');
});

// Make globally available
window.ComponentLoader = ComponentLoader;