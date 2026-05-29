// Global variables & Helper Functions

// Ambil user yang sedang login
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser')) || null;
}

// Cek apakah user adalah admin
function isAdminLoggedIn() {
  const user = getCurrentUser();
  return user && user.email === 'admin@solesphere.com';
}

// Log out user
function logoutUser() {
  localStorage.removeItem('currentUser');
  showToast('Logout berhasil!', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// Format mata uang Rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(angka);
}

// Ambil data keranjang dari localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('shoes_cart')) || [];
}

// Simpan data keranjang ke localStorage
function saveCart(cart) {
  localStorage.setItem('shoes_cart', JSON.stringify(cart));
  updateCartBadge();
}

// Hitung total item unik atau total kuantitas di keranjang
function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
}

// Menambahkan item ke keranjang
function addToCart(productId, size, quantity = 1) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    showToast('Produk tidak ditemukan!', 'error');
    return false;
  }

  if (product.stock < quantity) {
    showToast(`Stok tidak mencukupi! Hanya tersisa ${product.stock} pasang.`, 'error');
    return false;
  }

  let cart = getCart();
  
  // Cari apakah produk dengan ukuran yang sama sudah ada di keranjang
  const existingItemIndex = cart.findIndex(item => item.id === productId && item.size === size);

  if (existingItemIndex > -1) {
    const newQty = cart[existingItemIndex].quantity + quantity;
    if (newQty > product.stock) {
      showToast(`Total di keranjang melebihi stok yang tersedia (${product.stock} pasang).`, 'error');
      return false;
    }
    cart[existingItemIndex].quantity = newQty;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      size: size,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast('Produk berhasil ditambahkan ke keranjang!', 'success');
  return true;
}

// Toast Notification Premium
function showToast(message, type = 'success') {
  // Hapus toast lama jika ada
  const existingToast = document.getElementById('premium-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toastContainer = document.createElement('div');
  toastContainer.id = 'premium-toast';
  toastContainer.className = `fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-10 opacity-0 text-white font-medium text-sm md:text-base`;
  
  // Set warna berdasarkan tipe
  if (type === 'success') {
    toastContainer.classList.add('bg-emerald-500', 'border-l-4', 'border-emerald-700');
    toastContainer.innerHTML = `
      <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>${message}</span>
    `;
  } else if (type === 'error') {
    toastContainer.classList.add('bg-rose-500', 'border-l-4', 'border-rose-700');
    toastContainer.innerHTML = `
      <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      <span>${message}</span>
    `;
  } else {
    toastContainer.classList.add('bg-emerald-600', 'border-l-4', 'border-emerald-800');
    toastContainer.innerHTML = `
      <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>${message}</span>
    `;
  }

  document.body.appendChild(toastContainer);

  // Animasi masuk
  setTimeout(() => {
    toastContainer.classList.remove('translate-y-10', 'opacity-0');
  }, 50);

  // Animasi keluar setelah 3 detik
  setTimeout(() => {
    toastContainer.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => {
      toastContainer.remove();
    }, 300);
  }, 3000);
}

// Inisialisasi status login di Navbar secara dinamis
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  setupNavbarUserSection();
});

function setupNavbarUserSection() {
  const user = getCurrentUser();
  const userNavContainer = document.getElementById('user-nav-section');
  if (!userNavContainer) return;

  if (user) {
    let dashboardLink = '';
    if (user.email === 'admin@solesphere.com') {
      dashboardLink = `
        <a href="admin.html" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold text-xs md:text-sm transition-colors border border-emerald-200/50">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Admin
        </a>
      `;
    }

    userNavContainer.innerHTML = `
      <div class="flex items-center gap-3">
        ${dashboardLink}
        <div class="hidden sm:flex flex-col text-right">
          <span class="text-xs text-slate-500">Halo,</span>
          <span class="text-sm font-semibold text-slate-800 truncate max-w-[120px]">${user.name}</span>
        </div>
        <button id="btn-logout" class="flex items-center gap-1 px-3 py-2 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs md:text-sm font-semibold transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span class="hidden md:inline">Keluar</span>
        </button>
      </div>
    `;

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', logoutUser);
    }
  } else {
    userNavContainer.innerHTML = `
      <a href="login.html" class="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Masuk</a>
      <a href="register.html" class="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-100 hover:scale-105 transform">Daftar</a>
    `;
  }
}
