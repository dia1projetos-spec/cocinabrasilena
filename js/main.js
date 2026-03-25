// =============================================
// COCINA BRASILEÑA — MAIN JS
// =============================================
import { db } from './firebase-config.js';
import {
  collection, getDocs, onSnapshot, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ─── BERIMBAU SOUND (Web Audio API) ────────────
function playBerimbau() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    function berimbauNote(freq, startTime, dur) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.value = freq;
      filter.Q.value = 8;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, startTime + dur * 0.3);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, startTime + dur);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + dur);
    }

    // Sequência de notas berimbau
    const notes = [
      { freq: 220, time: 0,    dur: 0.5 },
      { freq: 246, time: 0.5,  dur: 0.3 },
      { freq: 220, time: 0.8,  dur: 0.5 },
      { freq: 196, time: 1.3,  dur: 0.6 },
      { freq: 220, time: 1.9,  dur: 0.4 },
      { freq: 246, time: 2.3,  dur: 0.3 },
      { freq: 220, time: 2.6,  dur: 0.7 },
      { freq: 196, time: 3.3,  dur: 0.5 },
      { freq: 174, time: 3.8,  dur: 0.8 },
      { freq: 196, time: 4.6,  dur: 0.5 },
      { freq: 220, time: 5.1,  dur: 1.0 },
    ];

    const now = ctx.currentTime;
    notes.forEach(n => berimbauNote(n.freq, now + n.time, n.dur));
  } catch (e) {
    console.warn('Audio context não disponível:', e);
  }
}

// ─── LOADING SCREEN ────────────────────────────
function initLoading() {
  const screen = document.getElementById('loading-screen');
  const bar = document.querySelector('.loading-bar');
  let progress = 0;

  // Inicia o som após primeiro click/touch (política do browser)
  const startSound = () => {
    playBerimbau();
    document.removeEventListener('click', startSound);
    document.removeEventListener('touchstart', startSound);
  };
  document.addEventListener('click', startSound);
  document.addEventListener('touchstart', startSound);
  // Tenta tocar automaticamente
  setTimeout(() => { try { playBerimbau(); } catch(e) {} }, 100);

  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    bar.style.width = progress + '%';

    if (progress === 100) {
      setTimeout(() => {
        screen.classList.add('hidden');
      }, 600);
    }
  }, 220);
}

// ─── HERO SLIDER ───────────────────────────────
let currentSlide = 0;
let slides = [];
let autoSlide;

function initSlider(slidesData) {
  const track = document.querySelector('.slides-track');
  const dotsWrap = document.querySelector('.slider-dots');
  if (!track) return;

  track.innerHTML = '';
  dotsWrap.innerHTML = '';
  slides = slidesData;

  if (!slides.length) {
    // Slide padrão se não houver slides cadastrados
    slides = [
      { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200', title: 'Bem-vindo à Cocina Brasileña', subtitle: 'Sabor autêntico do Brasil' },
    ];
  }

  slides.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `
      <img src="${s.imageUrl}" alt="${s.title || ''}" loading="lazy">
      <div class="slide-overlay">
        <div class="slide-caption">
          <h2>${s.title || ''}</h2>
          <p>${s.subtitle || ''}</p>
        </div>
      </div>`;
    track.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dotsWrap.appendChild(dot);
  });

  goToSlide(0);
  startAutoSlide();
}

function goToSlide(n) {
  currentSlide = (n + slides.length) % slides.length;
  const track = document.querySelector('.slides-track');
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function startAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

document.querySelector('.slider-btn.prev')?.addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoSlide(); });
document.querySelector('.slider-btn.next')?.addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoSlide(); });

// ─── CART STATE ─────────────────────────────────
let cart = JSON.parse(localStorage.getItem('cocina_cart') || '[]');

function saveCart() { localStorage.setItem('cocina_cart', JSON.stringify(cart)); }

function getCartCount() { return cart.reduce((s, i) => s + i.qty, 0); }
function getCartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

function updateCartUI() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('hidden', count === 0);
  });
  renderCartItems();
}

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  saveCart();
  updateCartUI();
  showToast(`🛒 ${product.name} adicionado!`);
  // Bump animation
  document.querySelectorAll('.cart-count').forEach(el => {
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  });
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCartUI(); }
}

function renderCartItems() {
  const container = document.getElementById('cart-items');
  const total = document.getElementById('cart-total-value');
  if (!container) return;

  if (!cart.length) {
    container.innerHTML = `<div class="cart-empty"><div class="empty-icon">🍽️</div><p>Seu carrinho está vazio</p></div>`;
    if (total) total.textContent = 'R$ 0,00';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img class="cart-item-img" src="${item.imageUrl || 'https://via.placeholder.com/70'}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}', +1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remover">🗑️</button>
    </div>`).join('');

  if (total) total.textContent = 'R$ ' + getCartTotal().toFixed(2).replace('.', ',');
}

// Expõe funções globalmente
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;

// ─── CART DRAWER ────────────────────────────────
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');

function openCart() { cartDrawer?.classList.add('open'); cartOverlay?.classList.add('active'); }
function closeCart() { cartDrawer?.classList.remove('open'); cartOverlay?.classList.remove('active'); }

document.querySelectorAll('.btn-cart').forEach(btn => btn.addEventListener('click', openCart));
document.querySelector('.cart-close')?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);

// ─── CHECKOUT ───────────────────────────────────
const checkoutModal = document.getElementById('checkout-modal');

document.querySelector('.btn-checkout')?.addEventListener('click', () => {
  if (!cart.length) { showToast('⚠️ Adicione itens ao carrinho!'); return; }
  closeCart();
  checkoutModal?.classList.add('active');
});

document.querySelector('.btn-cancel')?.addEventListener('click', () => {
  checkoutModal?.classList.remove('active');
});

document.querySelector('.btn-confirm')?.addEventListener('click', () => {
  const nome = document.getElementById('cust-name')?.value.trim();
  const wpp  = document.getElementById('cust-wpp')?.value.trim();
  const rua  = document.getElementById('cust-rua')?.value.trim();
  const num  = document.getElementById('cust-num')?.value.trim();
  const bairro = document.getElementById('cust-bairro')?.value.trim();

  if (!nome || !wpp || !rua || !num || !bairro) {
    showToast('⚠️ Preencha todos os campos!');
    return;
  }

  const itemsText = cart.map(i =>
    `• ${i.name} x${i.qty} — R$ ${(i.price * i.qty).toFixed(2).replace('.', ',')}`
  ).join('%0A');

  const total = getCartTotal().toFixed(2).replace('.', ',');

  const msg = encodeURIComponent(
`🇧🇷 *Cocina Brasileña — Novo Pedido*

👤 *Cliente:* ${nome}
📱 *WhatsApp:* ${wpp}
📍 *Endereço:* ${rua}, ${num} — ${bairro}

📋 *Itens:*
${cart.map(i => `• ${i.name} x${i.qty} — R$ ${(i.price * i.qty).toFixed(2).replace('.', ',')}`).join('\n')}

💰 *Total: R$ ${total}*`
  );

  window.open(`https://wa.me/5513981763452?text=${msg}`, '_blank');

  cart = [];
  saveCart();
  updateCartUI();
  checkoutModal?.classList.remove('active');
  showToast('✅ Pedido enviado pelo WhatsApp!');
});

// ─── PRODUCTS ──────────────────────────────────
let allProducts = [];
let activeCategory = 'todos';

function renderProducts(list) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = '<p style="text-align:center;color:#888;padding:40px;grid-column:1/-1">Nenhum produto disponível no momento.</p>';
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-img-wrap" onclick="openLightbox('${p.imageUrl}')">
        <img src="${p.imageUrl || 'https://via.placeholder.com/400x300'}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <button class="product-zoom-btn" title="Ver imagem">🔍</button>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description || ''}</div>
        <div class="product-footer">
          <div class="product-price"><span>R$</span>${parseFloat(p.price).toFixed(2).replace('.', ',')}</div>
          <button class="btn-add" onclick='addToCart(${JSON.stringify({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })})'>
            + Adicionar
          </button>
        </div>
      </div>
    </div>`).join('');
}

function filterProducts(category) {
  activeCategory = category;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === category));
  const filtered = category === 'todos' ? allProducts : allProducts.filter(p => p.category === category);
  renderProducts(filtered);
}

window.filterProducts = filterProducts;
window.addToCart = addToCart;

function buildCategoryBar(products) {
  const bar = document.querySelector('.categories-bar');
  if (!bar) return;
  const cats = ['todos', ...new Set(products.map(p => p.category).filter(Boolean))];
  bar.innerHTML = cats.map(c =>
    `<button class="cat-btn${c === 'todos' ? ' active' : ''}" data-cat="${c}" onclick="filterProducts('${c}')">
      ${c.charAt(0).toUpperCase() + c.slice(1)}
    </button>`
  ).join('');
}

// ─── LIGHTBOX ───────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(src) {
  if (!lightboxImg || !lightbox) return;
  lightboxImg.src = src;
  lightbox.classList.add('active');
}
function closeLightbox() { lightbox?.classList.remove('active'); }

window.openLightbox = openLightbox;
document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

// ─── STATUS BANNER ──────────────────────────────
function updateStatusBanner(status, msg) {
  const banner = document.getElementById('status-banner');
  if (!banner) return;
  banner.textContent = msg || (status === 'aberto' ? '🟢 Estamos ABERTOS — Faça seu pedido agora!' : '🔴 Estamos FECHADOS no momento');
  banner.className = '';
  banner.classList.add(status);
}

// ─── TOAST ──────────────────────────────────────
function showToast(msg, type = '') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ─── FIREBASE LISTENERS ─────────────────────────
async function loadFromFirebase() {
  try {
    // Products
    onSnapshot(collection(db, 'products'), snap => {
      allProducts = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => p.active !== false);
      buildCategoryBar(allProducts);
      filterProducts(activeCategory);
    });

    // Slides
    onSnapshot(collection(db, 'slides'), snap => {
      const slidesData = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      initSlider(slidesData);
    });

    // Status
    onSnapshot(doc(db, 'config', 'status'), snap => {
      if (snap.exists()) {
        const data = snap.data();
        updateStatusBanner(data.status, data.message);
      }
    });

    // Logo
    onSnapshot(doc(db, 'config', 'logo'), snap => {
      if (snap.exists()) {
        const { url } = snap.data();
        const imgs = document.querySelectorAll('.logo-img');
        imgs.forEach(img => { img.src = url; img.style.display = url ? 'block' : 'none'; });
      }
    });

  } catch (e) {
    console.error('Firebase error:', e);
    // Modo demo sem Firebase
    initSlider([]);
    renderProducts([]);
  }
}

// ─── INIT ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  updateCartUI();
  loadFromFirebase();
});
