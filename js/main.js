// =============================================
// COCINA BRASILEÑA — MAIN JS v1.10
// =============================================
import { db } from './firebase-config.js';
import {
  collection, onSnapshot, doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ─── ESTADO GLOBAL ──────────────────────────────
let cart         = JSON.parse(localStorage.getItem('cocina_cart') || '[]');
let allProducts  = [];
let activeCategory = 'todos';
let currentSlide = 0;
let slides       = [];
let autoSlide;

// ─── LOADING SCREEN ─────────────────────────────
function initLoading() {
  const screen = document.getElementById('loading-screen');
  const bar    = document.querySelector('.loading-bar');
  if (!screen) return;

  const particlesEl = document.getElementById('loading-particles');
  if (particlesEl) {
    const colors = ['#009C3B','#FFDF00','#002776','#00B347','#FFE050'];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'loading-particle';
      const size = 3 + Math.random() * 5;
      p.style.cssText = `width:${size}px;height:${size}px;background:${colors[i%colors.length]};left:${Math.random()*100}%;bottom:${Math.random()*15}%;animation-duration:${4+Math.random()*5}s;animation-delay:${Math.random()*6}s;`;
      particlesEl.appendChild(p);
    }
  }

  let pct = 0;
  const steps = [15, 20, 15, 20, 15, 15];
  let si = 0;
  function tick() {
    if (si >= steps.length) {
      if (bar) bar.style.width = '100%';
      setTimeout(() => {
        screen.classList.add('hidden');
        setTimeout(() => {
          screen.style.display = 'none';
          screen.style.pointerEvents = 'none';
        }, 900);
      }, 300);
      return;
    }
    pct += steps[si++];
    if (bar) bar.style.width = Math.min(pct, 100) + '%';
    setTimeout(tick, 300 + Math.random() * 200);
  }
  setTimeout(tick, 400);

  // Fallback absoluto
  setTimeout(() => {
    screen.style.display = 'none';
    screen.style.pointerEvents = 'none';
  }, 6000);
}

// ─── SLIDER ─────────────────────────────────────
function initSlider(data) {
  const track    = document.querySelector('.slides-track');
  const dotsWrap = document.querySelector('.slider-dots');
  if (!track || !dotsWrap) return;

  slides = data.length ? data : [{
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200'
  }];

  track.innerHTML = '';
  dotsWrap.innerHTML = '';

  slides.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'slide';
    div.innerHTML = '<img src="' + s.imageUrl + '" alt="" loading="lazy">';
    track.appendChild(div);

    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', function() { goToSlide(i); resetAuto(); });
    dotsWrap.appendChild(dot);
  });

  goToSlide(0);
  resetAuto();
}

function goToSlide(n) {
  currentSlide = (n + slides.length) % slides.length;
  const track = document.querySelector('.slides-track');
  if (track) track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
  document.querySelectorAll('.dot').forEach(function(d, i) {
    d.classList.toggle('active', i === currentSlide);
  });
}

function resetAuto() {
  clearInterval(autoSlide);
  autoSlide = setInterval(function() { goToSlide(currentSlide + 1); }, 5000);
}

// ─── CARRINHO ────────────────────────────────────
function saveCart() { localStorage.setItem('cocina_cart', JSON.stringify(cart)); }
function cartTotal() { return cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0); }
function cartCount() { return cart.reduce(function(s, i) { return s + i.qty; }, 0); }

function addToCart(product) {
  const ex = cart.find(function(i) { return i.id === product.id; });
  if (ex) ex.qty++;
  else cart.push({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, qty: 1 });
  saveCart();
  refreshCartUI();
  showToast('🛒 Agregado: ' + product.name);
}

function removeFromCart(id) {
  cart = cart.filter(function(i) { return i.id !== id; });
  saveCart();
  refreshCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(function(i) { return i.id === id; });
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); refreshCartUI(); }
}
window.changeQty      = changeQty;
window.removeFromCart = removeFromCart;

function refreshCartUI() {
  const count = cartCount();
  document.querySelectorAll('.cart-count').forEach(function(el) {
    el.textContent = count;
    el.style.display = count > 0 ? '' : 'none';
  });
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById('cart-items');
  const totalEl   = document.getElementById('cart-total-value');
  if (!container) return;

  if (!cart.length) {
    container.innerHTML = '<div class="cart-empty"><div class="empty-icon">🍽️</div><p>Tu carrito está vacío</p></div>';
    if (totalEl) totalEl.textContent = '$ 0,00';
    return;
  }

  container.innerHTML = cart.map(function(item) {
    return '<div class="cart-item">' +
      '<img class="cart-item-img" src="' + (item.imageUrl || '') + '" alt="' + item.name + '" onerror="this.style.display=\'none\'">' +
      '<div class="cart-item-info">' +
        '<div class="cart-item-name">' + item.name + '</div>' +
        '<div class="cart-item-price">$ ' + (item.price * item.qty).toFixed(2).replace('.', ',') + '</div>' +
        '<div class="cart-item-controls">' +
          '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\', -1)">−</button>' +
          '<span class="qty-val">' + item.qty + '</span>' +
          '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\', +1)">+</button>' +
        '</div>' +
      '</div>' +
      '<button class="cart-item-remove" onclick="removeFromCart(\'' + item.id + '\')">🗑️</button>' +
    '</div>';
  }).join('');

  if (totalEl) totalEl.textContent = '$ ' + cartTotal().toFixed(2).replace('.', ',');
}

// ─── PRODUTOS ────────────────────────────────────
function renderProducts(list) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:48px;color:#888">No hay productos disponibles.</p>';
    return;
  }

  grid.innerHTML = list.map(function(p) {
    var id    = p.id || '';
    var name  = (p.name || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    var price = parseFloat(p.price) || 0;
    var img   = p.imageUrl || '';
    var desc  = p.description || '';
    var badge = p.badge || '';
    return '<div class="product-card">' +
      '<div class="product-img-wrap">' +
        '<img src="' + img + '" alt="' + name + '" loading="lazy" onerror="this.src=\'https://via.placeholder.com/400x300\'">' +
        (badge ? '<span class="product-badge">' + badge + '</span>' : '') +
      '</div>' +
      '<div class="product-info">' +
        '<div class="product-name">' + name + '</div>' +
        '<div class="product-desc">' + desc + '</div>' +
        '<div class="product-footer">' +
          '<div class="product-price"><span>$ </span>' + price.toFixed(2).replace('.', ',') + '</div>' +
          '<button class="btn-add" data-id="' + id + '" data-name="' + name + '" data-price="' + price + '" data-img="' + img + '">+ Agregar</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  // Listener DIRETO em cada botão — sem delegation, sem falhas
  grid.querySelectorAll('.btn-add').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      addToCart({
        id:       btn.dataset.id,
        name:     btn.dataset.name,
        price:    parseFloat(btn.dataset.price),
        imageUrl: btn.dataset.img
      });
    });
  });

  grid.querySelectorAll('.product-img-wrap').forEach(function(wrap) {
    wrap.addEventListener('click', function() {
      var src = wrap.querySelector('img') && wrap.querySelector('img').src;
      if (src) openLightbox(src);
    });
  });
}

function buildCategoryBar(products) {
  const bar = document.querySelector('.categories-bar');
  if (!bar) return;
  const cats = ['todos'];
  products.forEach(function(p) {
    if (p.category && cats.indexOf(p.category) === -1) cats.push(p.category);
  });
  bar.innerHTML = cats.map(function(c) {
    return '<button class="cat-btn' + (c === 'todos' ? ' active' : '') + '" data-cat="' + c + '">' +
      (c === 'todos' ? 'Todos' : c.charAt(0).toUpperCase() + c.slice(1)) +
    '</button>';
  }).join('');
  bar.querySelectorAll('.cat-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { filterProducts(btn.dataset.cat); });
  });
}

function filterProducts(category) {
  activeCategory = category;
  document.querySelectorAll('.cat-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.cat === category);
  });
  var list = category === 'todos'
    ? allProducts
    : allProducts.filter(function(p) { return p.category === category; });
  renderProducts(list);
}

// ─── LIGHTBOX ────────────────────────────────────
function openLightbox(src) {
  var lb  = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  if (lb && img) { img.src = src; lb.classList.add('active'); }
}
function closeLightbox() {
  var lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('active');
}

// ─── CART DRAWER ─────────────────────────────────
function openCart() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

// ─── STATUS BANNER ───────────────────────────────
function updateStatusBanner(status, msg) {
  var banner = document.getElementById('status-banner');
  if (!banner) return;
  banner.textContent = msg ||
    (status === 'aberto'
      ? '🟢 ¡Estamos ABIERTOS — Hacé tu pedido ahora!'
      : '🔴 Estamos CERRADOS por el momento');
  banner.className = status;
}

// ─── TOAST ───────────────────────────────────────
function showToast(msg) {
  var c = document.getElementById('toast-container');
  if (!c) return;
  var t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, 3200);
}

// ─── FIREBASE ────────────────────────────────────
function loadFromFirebase() {
  try {
    onSnapshot(collection(db, 'products'), function(snap) {
      allProducts = snap.docs.map(function(d) { return Object.assign({ id: d.id }, d.data()); })
        .filter(function(p) { return p.active !== false; });
      buildCategoryBar(allProducts);
      filterProducts(activeCategory);
    });

    onSnapshot(collection(db, 'slides'), function(snap) {
      var data = snap.docs.map(function(d) { return Object.assign({ id: d.id }, d.data()); })
        .sort(function(a, b) { return (a.order || 0) - (b.order || 0); });
      initSlider(data);
    });

    onSnapshot(doc(db, 'config', 'status'), function(snap) {
      if (snap.exists()) updateStatusBanner(snap.data().status, snap.data().message);
    });

    onSnapshot(doc(db, 'config', 'logo'), function(snap) {
      if (snap.exists() && snap.data().url) {
        document.querySelectorAll('.logo-img').forEach(function(img) {
          img.src = snap.data().url;
          img.style.display = 'block';
        });
      }
    });

  } catch(e) {
    console.error('Firebase:', e);
    initSlider([]);
    renderProducts([]);
  }
}

// ─── HAMBURGER ───────────────────────────────────
function initHamburger() {
  var btn     = document.getElementById('btn-hamburger');
  var nav     = document.getElementById('main-nav');
  var overlay = document.getElementById('nav-overlay');
  if (!btn || !nav) return;

  function openNav() {
    nav.classList.add('open');
    btn.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    nav.classList.remove('open');
    btn.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function() {
    nav.classList.contains('open') ? closeNav() : openNav();
  });
  if (overlay) overlay.addEventListener('click', closeNav);
  nav.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', closeNav);
  });
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) closeNav();
  });
}

// ─── INIT ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {

  // Carrinho
  document.querySelectorAll('.btn-cart').forEach(function(btn) {
    btn.addEventListener('click', openCart);
  });
  var cartClose = document.querySelector('.cart-close');
  if (cartClose) cartClose.addEventListener('click', closeCart);
  var cartOverlay = document.getElementById('cart-overlay');
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Checkout
  var btnCheckout = document.querySelector('.btn-checkout');
  if (btnCheckout) btnCheckout.addEventListener('click', function() {
    if (!cart.length) { showToast('⚠️ ¡Agregá productos al carrito!'); return; }
    closeCart();
    var modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.add('active');
  });

  var btnCancel = document.querySelector('.btn-cancel');
  if (btnCancel) btnCancel.addEventListener('click', function() {
    var modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.remove('active');
  });

  var btnConfirm = document.querySelector('.btn-confirm');
  if (btnConfirm) btnConfirm.addEventListener('click', function() {
    var nombre = (document.getElementById('cust-name') || {}).value || '';
    var wpp    = (document.getElementById('cust-wpp')  || {}).value || '';
    var calle  = (document.getElementById('cust-rua')  || {}).value || '';
    var numero = (document.getElementById('cust-num')  || {}).value || '';
    var barrio = (document.getElementById('cust-bairro') || {}).value || '';
    nombre = nombre.trim(); wpp = wpp.trim(); calle = calle.trim(); numero = numero.trim(); barrio = barrio.trim();

    if (!nombre || !wpp || !calle || !numero || !barrio) {
      showToast('⚠️ ¡Completá todos los campos!');
      return;
    }
    var total = cartTotal().toFixed(2).replace('.', ',');
    var items = cart.map(function(i) {
      return '• ' + i.name + ' x' + i.qty + ' — $' + (i.price * i.qty).toFixed(2).replace('.', ',');
    }).join('\n');
    var msg = encodeURIComponent(
      '🇧🇷 *Cocina Brasileña — Nuevo Pedido*\n\n' +
      '👤 *Cliente:* ' + nombre + '\n' +
      '📱 *WhatsApp:* ' + wpp + '\n' +
      '📍 *Dirección:* ' + calle + ' ' + numero + ', ' + barrio + '\n\n' +
      '📋 *Productos:*\n' + items + '\n\n' +
      '💰 *Total: $' + total + '*'
    );
    window.open('https://wa.me/5513981763452?text=' + msg, '_blank');
    cart = []; saveCart(); refreshCartUI();
    var modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.remove('active');
    showToast('✅ ¡Pedido enviado por WhatsApp!');
  });

  // Slider
  var btnPrev = document.querySelector('.slider-btn.prev');
  var btnNext = document.querySelector('.slider-btn.next');
  if (btnPrev) btnPrev.addEventListener('click', function() { goToSlide(currentSlide - 1); resetAuto(); });
  if (btnNext) btnNext.addEventListener('click', function() { goToSlide(currentSlide + 1); resetAuto(); });

  // Lightbox
  var lbClose = document.querySelector('.lightbox-close');
  var lb = document.getElementById('lightbox');
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lb) lb.addEventListener('click', function(e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeLightbox(); closeCart(); }
  });

  // Init
  initLoading();
  initHamburger();
  refreshCartUI();
  loadFromFirebase();
});
