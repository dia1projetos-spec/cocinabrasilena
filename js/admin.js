// =============================================
// COCINA BRASILEÑA — ADMIN JS
// =============================================
import { db, auth, CLOUDINARY_CONFIG } from './firebase-config.js';
import {
  collection, getDocs, addDoc, deleteDoc, doc,
  setDoc, onSnapshot, updateDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ─── AUTH ────────────────────────────────────────
const loginPage = document.getElementById('login-page');
const adminPage = document.getElementById('admin-page');
const loginBtn  = document.querySelector('.btn-login');

onAuthStateChanged(auth, user => {
  if (user) {
    loginPage.style.display = 'none';
    adminPage.style.display = 'flex';
    initAdmin();
  } else {
    loginPage.style.display = 'flex';
    adminPage.style.display = 'none';
  }
});

document.getElementById('login-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const errEl = document.getElementById('login-error');

  errEl.style.display = 'none';
  if (loginBtn) { loginBtn.textContent = 'Entrando...'; loginBtn.disabled = true; }

  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    errEl.style.display = 'block';
    const codes = {
      'auth/invalid-credential':    'E-mail ou senha incorretos.',
      'auth/user-not-found':        'Usuário não encontrado.',
      'auth/wrong-password':        'Senha incorreta.',
      'auth/invalid-email':         'E-mail inválido.',
      'auth/too-many-requests':     'Muitas tentativas. Aguarde alguns minutos.',
      'auth/network-request-failed':'Sem conexão. Verifique sua internet.',
    };
    errEl.textContent = codes[err.code] || `Erro: ${err.code}`;
  } finally {
    if (loginBtn) { loginBtn.textContent = '🔑 Entrar'; loginBtn.disabled = false; }
  }
});

document.getElementById('btn-logout')?.addEventListener('click', () => {
  if (confirm('Deseja sair do painel?')) signOut(auth);
});

// ─── NAVIGATION ─────────────────────────────────
function showPanel(id) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  document.querySelectorAll('.sidebar nav li a').forEach(a => {
    a.classList.toggle('active', a.dataset.panel === id);
  });
}

document.querySelectorAll('.sidebar nav li a[data-panel]').forEach(a => {
  a.addEventListener('click', e => { e.preventDefault(); showPanel(a.dataset.panel); });
});

// ─── TOAST ──────────────────────────────────────
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `${type === 'success' ? '✅' : '❌'} ${msg}`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ─── CLOUDINARY UPLOAD ───────────────────────────
async function uploadToCloudinary(file, onProgress) {
  const { cloudName, uploadPreset } = CLOUDINARY_CONFIG;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.upload.onprogress = e => {
      if (e.lengthComputable && onProgress) onProgress(Math.round(e.loaded / e.total * 100));
    };

    xhr.onload = () => {
      const res = JSON.parse(xhr.responseText);
      if (xhr.status === 200) resolve(res.secure_url);
      else reject(new Error(res.error?.message || 'Upload falhou'));
    };
    xhr.onerror = () => reject(new Error('Erro de rede'));
    xhr.send(formData);
  });
}

function showProgress(wrap, pct) {
  const prog = wrap.querySelector('.upload-progress');
  if (!prog) return;
  prog.style.display = 'block';
  prog.querySelector('.bar-fill').style.width = pct + '%';
  prog.querySelector('p').textContent = pct < 100 ? `Enviando ${pct}%...` : 'Concluído!';
  if (pct === 100) setTimeout(() => prog.style.display = 'none', 1500);
}

// ─── LOGO ────────────────────────────────────────
let logoUrl = '';

async function loadLogo() {
  try {
    const snap = await getDocs(collection(db, 'config'));
    const logoDoc = snap.docs.find(d => d.id === 'logo');
    if (logoDoc) {
      logoUrl = logoDoc.data().url || '';
      renderLogoPreview();
    }
  } catch (e) { console.error(e); }
}

function renderLogoPreview() {
  const wrap = document.getElementById('logo-preview');
  if (!wrap) return;
  wrap.innerHTML = logoUrl
    ? `<img class="logo-preview-img" src="${logoUrl}" alt="Logo">
       <button class="btn-danger" onclick="removeLogo()">🗑️ Remover Logo</button>`
    : `<div class="logo-preview-placeholder">🏪</div>
       <p style="color:#888;font-size:0.85rem">Nenhum logo cadastrado</p>`;
}

window.removeLogo = async function() {
  if (!confirm('Remover logo?')) return;
  try {
    await setDoc(doc(db, 'config', 'logo'), { url: '' });
    logoUrl = '';
    renderLogoPreview();
    showToast('Logo removido!');
  } catch (e) { showToast('Erro ao remover!', 'error'); }
};

const logoZone = document.getElementById('logo-upload-zone');
logoZone?.addEventListener('click', () => document.getElementById('logo-file')?.click());
logoZone?.addEventListener('dragover', e => { e.preventDefault(); logoZone.classList.add('dragover'); });
logoZone?.addEventListener('dragleave', () => logoZone.classList.remove('dragover'));
logoZone?.addEventListener('drop', e => {
  e.preventDefault(); logoZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handleLogoFile(file);
});

document.getElementById('logo-file')?.addEventListener('change', e => {
  if (e.target.files[0]) handleLogoFile(e.target.files[0]);
});

async function handleLogoFile(file) {
  const wrap = logoZone.closest('.card');
  try {
    const url = await uploadToCloudinary(file, pct => showProgress(wrap, pct));
    await setDoc(doc(db, 'config', 'logo'), { url, updatedAt: serverTimestamp() });
    logoUrl = url;
    renderLogoPreview();
    showToast('Logo atualizado!');
  } catch (e) { showToast('Erro no upload: ' + e.message, 'error'); }
}

// ─── STATUS ──────────────────────────────────────
async function loadStatus() {
  try {
    const snap = await getDocs(collection(db, 'config'));
    const statusDoc = snap.docs.find(d => d.id === 'status');
    if (statusDoc) {
      const { status, message } = statusDoc.data();
      document.getElementById('status-message').value = message || '';
      document.querySelector(`.btn-${status}`)?.classList.add('active');
    }
  } catch (e) { console.error(e); }
}

document.querySelector('.btn-aberto')?.addEventListener('click', async () => {
  await setStatus('aberto');
});
document.querySelector('.btn-cerrado')?.addEventListener('click', async () => {
  await setStatus('cerrado');
});

async function setStatus(status) {
  const msg = document.getElementById('status-message')?.value.trim();
  try {
    await setDoc(doc(db, 'config', 'status'), { status, message: msg, updatedAt: serverTimestamp() });
    document.querySelectorAll('.btn-aberto, .btn-cerrado').forEach(b => b.classList.remove('active'));
    document.querySelector(`.btn-${status}`)?.classList.add('active');
    showToast(`Status atualizado: ${status.toUpperCase()}!`);
  } catch (e) { showToast('Erro ao salvar status!', 'error'); }
}

// ─── PRODUCTS ────────────────────────────────────
let products = [];

function listenProducts() {
  onSnapshot(collection(db, 'products'), snap => {
    products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderProductsTable();
    // Atualiza contador do dashboard
    const el = document.getElementById('dash-prod-count');
    if (el) el.textContent = products.length;
  });
}

function renderProductsTable() {
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;

  if (!products.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#888">Nenhum produto cadastrado ainda.</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td><img class="product-thumb" src="${p.imageUrl || 'https://via.placeholder.com/60'}" alt="${p.name}"></td>
      <td><strong>${p.name}</strong></td>
      <td><span class="tag-category">${p.category || '—'}</span></td>
      <td><strong>R$ ${parseFloat(p.price || 0).toFixed(2).replace('.', ',')}</strong></td>
      <td>
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
          <input type="checkbox" ${p.active !== false ? 'checked' : ''} onchange="toggleProductActive('${p.id}', this.checked)">
          <span style="font-size:0.8rem;color:#888">${p.active !== false ? 'Ativo' : 'Inativo'}</span>
        </label>
      </td>
      <td>
        <button class="btn-danger" onclick="deleteProduct('${p.id}')">🗑️ Excluir</button>
      </td>
    </tr>`).join('');
}

window.deleteProduct = async function(id) {
  if (!confirm('Excluir este produto?')) return;
  try {
    await deleteDoc(doc(db, 'products', id));
    showToast('Produto excluído!');
  } catch (e) { showToast('Erro ao excluir!', 'error'); }
};

window.toggleProductActive = async function(id, active) {
  try {
    await updateDoc(doc(db, 'products', id), { active });
    showToast(`Produto ${active ? 'ativado' : 'desativado'}!`);
  } catch (e) { showToast('Erro!', 'error'); }
};

// Product form
let productImgUrl = '';

const prodImgZone = document.getElementById('product-img-zone');
prodImgZone?.addEventListener('click', () => document.getElementById('product-img-file')?.click());
prodImgZone?.addEventListener('dragover', e => { e.preventDefault(); prodImgZone.classList.add('dragover'); });
prodImgZone?.addEventListener('dragleave', () => prodImgZone.classList.remove('dragover'));
prodImgZone?.addEventListener('drop', e => {
  e.preventDefault(); prodImgZone.classList.remove('dragover');
  if (e.dataTransfer.files[0]) handleProductImg(e.dataTransfer.files[0]);
});
document.getElementById('product-img-file')?.addEventListener('change', e => {
  if (e.target.files[0]) handleProductImg(e.target.files[0]);
});

async function handleProductImg(file) {
  const card = prodImgZone.closest('.card');
  try {
    const url = await uploadToCloudinary(file, pct => showProgress(card, pct));
    productImgUrl = url;
    const preview = document.getElementById('product-img-preview');
    if (preview) {
      preview.innerHTML = `<div class="img-preview">
        <img src="${url}" alt="preview">
        <button class="remove-img" onclick="clearProductImg()">✕</button>
      </div>`;
    }
    showToast('Imagem enviada!');
  } catch (e) { showToast('Erro no upload!', 'error'); }
}

window.clearProductImg = function() {
  productImgUrl = '';
  const preview = document.getElementById('product-img-preview');
  if (preview) preview.innerHTML = '';
};

document.getElementById('product-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const name  = document.getElementById('prod-name').value.trim();
  const price = parseFloat(document.getElementById('prod-price').value);
  const desc  = document.getElementById('prod-desc').value.trim();
  const cat   = document.getElementById('prod-cat').value.trim();
  const badge = document.getElementById('prod-badge').value.trim();

  if (!name || isNaN(price)) { showToast('Preencha nome e preço!', 'error'); return; }

  try {
    await addDoc(collection(db, 'products'), {
      name, price, description: desc, category: cat, badge,
      imageUrl: productImgUrl, active: true,
      createdAt: serverTimestamp()
    });
    e.target.reset();
    window.clearProductImg();
    showToast('Produto adicionado!');
  } catch (err) { showToast('Erro ao salvar!', 'error'); console.error(err); }
});

// ─── SLIDES ──────────────────────────────────────
let slides = [];

function listenSlides() {
  onSnapshot(collection(db, 'slides'), snap => {
    slides = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order || 0) - (b.order || 0));
    renderSlidesList();
    // Atualiza contador do dashboard
    const el = document.getElementById('dash-slides-count');
    if (el) el.textContent = slides.length;
  });
}

function renderSlidesList() {
  const list = document.getElementById('slides-list');
  if (!list) return;

  if (!slides.length) {
    list.innerHTML = '<p style="color:#888;font-size:0.875rem">Nenhum slide cadastrado ainda.</p>';
    return;
  }

  list.innerHTML = slides.map(s => `
    <div class="slide-item">
      <img src="${s.imageUrl}" alt="${s.title || ''}">
      <div class="slide-item-body">
        <p style="font-weight:700;font-size:0.85rem;margin-bottom:6px">${s.title || 'Sem título'}</p>
        <p style="font-size:0.78rem;color:#888">${s.subtitle || ''}</p>
        <div class="slide-item-actions" style="margin-top:10px">
          <button class="btn-danger" onclick="deleteSlide('${s.id}')">🗑️ Remover</button>
        </div>
      </div>
    </div>`).join('');
}

window.deleteSlide = async function(id) {
  if (!confirm('Remover este slide?')) return;
  try {
    await deleteDoc(doc(db, 'slides', id));
    showToast('Slide removido!');
  } catch (e) { showToast('Erro!', 'error'); }
};

let slideImgUrl = '';

const slideZone = document.getElementById('slide-img-zone');
slideZone?.addEventListener('click', () => document.getElementById('slide-img-file')?.click());
slideZone?.addEventListener('dragover', e => { e.preventDefault(); slideZone.classList.add('dragover'); });
slideZone?.addEventListener('dragleave', () => slideZone.classList.remove('dragover'));
slideZone?.addEventListener('drop', e => {
  e.preventDefault(); slideZone.classList.remove('dragover');
  if (e.dataTransfer.files[0]) handleSlideImg(e.dataTransfer.files[0]);
});
document.getElementById('slide-img-file')?.addEventListener('change', e => {
  if (e.target.files[0]) handleSlideImg(e.target.files[0]);
});

async function handleSlideImg(file) {
  const card = slideZone.closest('.card');
  try {
    const url = await uploadToCloudinary(file, pct => showProgress(card, pct));
    slideImgUrl = url;
    const prev = document.getElementById('slide-img-preview');
    if (prev) prev.innerHTML = `<img src="${url}" style="max-width:200px;border-radius:8px;margin-top:8px">`;
    showToast('Imagem do slide enviada!');
  } catch (e) { showToast('Erro!', 'error'); }
}

document.getElementById('slide-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  if (!slideImgUrl) { showToast('Envie uma imagem para o slide!', 'error'); return; }
  const title    = document.getElementById('slide-title').value.trim();
  const subtitle = document.getElementById('slide-subtitle').value.trim();

  try {
    await addDoc(collection(db, 'slides'), {
      imageUrl: slideImgUrl, title, subtitle,
      order: slides.length, createdAt: serverTimestamp()
    });
    e.target.reset();
    slideImgUrl = '';
    document.getElementById('slide-img-preview').innerHTML = '';
    showToast('Slide adicionado!');
  } catch (err) { showToast('Erro ao salvar!', 'error'); }
});

// ─── INIT ────────────────────────────────────────
function initAdmin() {
  showPanel('panel-dashboard');
  loadLogo();
  loadStatus();
  listenProducts();
  listenSlides();
}
