document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.pageYOffset > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const mobileBtn = document.getElementById('mobileBtn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

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

  const staggerGrids = document.querySelectorAll('.reviews-grid, .restaurant-gallery, .menu-grid');
  staggerGrids.forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.setAttribute('data-reveal', '');
      child.style.transitionDelay = reduceMotion ? '0ms' : `${Math.min(i * 120, 360)}ms`;
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

  // Menu category filter
  const tabs = document.querySelectorAll('.menu-tab');
  const items = document.querySelectorAll('.menu-item');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.category;
      items.forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Table number from URL
  const params = new URLSearchParams(window.location.search);
  const tableNo = params.get('table');
  const tableBadge = document.getElementById('tableBadge');
  if (tableBadge && tableNo) {
    tableBadge.textContent = 'Table ' + tableNo;
    tableBadge.style.display = 'inline-block';
  }

  // Cart system
  let cart = JSON.parse(localStorage.getItem('mbdCart') || '[]');
  const cartBtn = document.getElementById('cartBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');
  const placeOrderBtn = document.getElementById('placeOrderBtn');

  function saveCart() { localStorage.setItem('mbdCart', JSON.stringify(cart)); }

  function updateCart() {
    cartCount.textContent = cart.reduce((s, i) => s + i.qty, 0);
    const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
    cartSubtotal.textContent = 'Rs. ' + subtotal;
    cartTotal.textContent = 'Rs. ' + subtotal;
    placeOrderBtn.disabled = cart.length === 0;

    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.<br>Add items from the menu.</p>';
      return;
    }
    cartItems.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">Rs. ${item.price} each</div>
        </div>
        <div class="cart-item-qty">
          <button class="cart-qty-btn" data-index="${i}" data-action="dec">−</button>
          <span class="cart-qty-num">${item.qty}</span>
          <button class="cart-qty-btn" data-index="${i}" data-action="inc">+</button>
        </div>
        <div class="cart-item-total">Rs. ${item.qty * item.price}</div>
      </div>
    `).join('');

    // Update add buttons
    document.querySelectorAll('.add-btn').forEach(btn => {
      const parent = btn.closest('.menu-item');
      const name = parent.dataset.name;
      const inCart = cart.some(i => i.name === name);
      btn.classList.toggle('added', inCart);
      btn.textContent = inCart ? '✓ In Cart' : '+ Add';
    });
  }

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.menu-item');
      const name = parent.dataset.name;
      const price = parseInt(parent.dataset.price);
      const existing = cart.find(i => i.name === name);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ name, price, qty: 1 });
      }
      saveCart();
      updateCart();
    });
  });

  cartItems.addEventListener('click', (e) => {
    const btn = e.target.closest('.cart-qty-btn');
    if (!btn) return;
    const idx = parseInt(btn.dataset.index);
    if (btn.dataset.action === 'inc') {
      cart[idx].qty++;
    } else {
      cart[idx].qty--;
      if (cart[idx].qty <= 0) cart.splice(idx, 1);
    }
    saveCart();
    updateCart();
  });

  cartBtn.addEventListener('click', () => {
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeCart() {
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', (e) => { if (e.target === cartOverlay) closeCart(); });

  placeOrderBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    let msg = 'Hello! I\'d like to order:%0A';
    if (tableNo) msg += '%0ATable: ' + tableNo + '%0A';
    msg += '%0A--- Items ---%0A';
    cart.forEach(i => { msg += `${i.name} x${i.qty} = Rs. ${i.qty * i.price}%0A`; });
    const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
    msg += `%0ATotal: Rs. ${total}%0A`;
    msg += '%0APlease confirm my order. Thank you!';
    window.open('https://wa.me/917088411468?text=' + msg, '_blank');
  });

  updateCart();
});
