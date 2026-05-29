// Shopping Cart & Checkout Logic

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);

  if (page === 'cart.html') {
    renderCart();
    setupCheckoutForm();
  }
});

// Kode Promo Default
const COUPONS = {
  'SOLESPHERE10': 0.10, // 10% diskon
  'DISKON20': 0.20,      // 20% diskon
  'HEMAT15': 0.15       // 15% diskon
};

let activeDiscountRate = 0;
let activeCouponCode = "";

// Ambil riwayat pesanan (orders)
function getOrders() {
  return JSON.parse(localStorage.getItem('shoes_orders')) || [];
}

// Simpan riwayat pesanan
function saveOrders(orders) {
  localStorage.setItem('shoes_orders', JSON.stringify(orders));
}

// Render isi keranjang belanja
function renderCart() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById('cart-items');
  const cartSummaryContainer = document.getElementById('cart-summary');
  
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-24 h-24 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-6">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-2">Keranjang Belanja Kosong</h3>
        <p class="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">Anda belum menambahkan sepatu apapun ke keranjang belanja Anda. Cari sepatu terbaik Anda sekarang!</p>
        <a href="products.html" class="px-6 py-3 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-lg shadow-emerald-100 hover:scale-105 transform">Mulai Berbelanja</a>
      </div>
    `;
    
    // Sembunyikan summary dan form checkout jika keranjang kosong
    if (cartSummaryContainer) cartSummaryContainer.classList.add('hidden');
    const checkoutCard = document.getElementById('checkout-card');
    if (checkoutCard) checkoutCard.classList.add('hidden');
    return;
  }

  // Tampilkan summary & form checkout
  if (cartSummaryContainer) cartSummaryContainer.classList.remove('hidden');
  const checkoutCard = document.getElementById('checkout-card');
  if (checkoutCard) checkoutCard.classList.remove('hidden');

  let htmlContent = '';
  cart.forEach((item, index) => {
    htmlContent += `
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 md:p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4 w-full sm:w-auto">
          <img src="${item.image}" alt="${item.name}" class="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shrink-0 bg-slate-50">
          <div class="min-w-0">
            <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">${item.brand}</span>
            <h4 class="font-bold text-slate-800 dark:text-white text-base md:text-lg truncate hover:text-indigo-600 transition-colors">
              <a href="detail.html?id=${item.id}">${item.name}</a>
            </h4>
            <div class="flex items-center gap-4 mt-1">
              <span class="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Ukuran: ${item.size}</span>
              <span class="text-sm font-bold text-emerald-600">${formatRupiah(item.price)}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
          <!-- Quantity Control -->
          <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950">
            <button onclick="changeQty(${index}, -1)" class="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
            </button>
            <span class="px-3 font-semibold text-slate-800 dark:text-white text-sm w-8 text-center">${item.quantity}</span>
            <button onclick="changeQty(${index}, 1)" class="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </button>
          </div>

          <!-- Total price per item -->
          <div class="text-right">
            <span class="block text-sm font-bold text-slate-800 dark:text-white">${formatRupiah(item.price * item.quantity)}</span>
            <button onclick="removeItemFromCart(${index})" class="text-xs text-rose-500 hover:text-rose-600 hover:underline mt-1 font-semibold transition-all">Hapus</button>
          </div>
        </div>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = htmlContent;
  calculateSummary();
}

// Mengubah kuantitas item di keranjang
window.changeQty = function(index, delta) {
  let cart = getCart();
  const products = getProducts();
  const item = cart[index];
  const product = products.find(p => p.id === item.id);

  if (!product) return;

  const newQty = item.quantity + delta;

  if (newQty <= 0) {
    removeItemFromCart(index);
    return;
  }

  if (newQty > product.stock) {
    showToast(`Stok tidak mencukupi! Hanya tersedia ${product.stock} pasang.`, 'error');
    return;
  }

  cart[index].quantity = newQty;
  saveCart(cart);
  renderCart();
};

// Menghapus item dari keranjang
window.removeItemFromCart = function(index) {
  let cart = getCart();
  const removedName = cart[index].name;
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
  showToast(`${removedName} dihapus dari keranjang.`, 'info');
};

// Menerapkan Kupon Diskon
window.applyCoupon = function() {
  const couponInput = document.getElementById('coupon-code');
  if (!couponInput) return;

  const code = couponInput.value.trim().toUpperCase();

  if (!code) {
    showToast('Harap masukkan kode kupon!', 'error');
    return;
  }

  if (COUPONS[code] !== undefined) {
    activeDiscountRate = COUPONS[code];
    activeCouponCode = code;
    showToast(`Kupon ${code} berhasil dipasang! Diskon ${(activeDiscountRate * 100)}%`, 'success');
    calculateSummary();
  } else {
    showToast('Kode kupon tidak valid!', 'error');
    activeDiscountRate = 0;
    activeCouponCode = "";
    calculateSummary();
  }
};

// Menghitung ringkasan harga
function calculateSummary() {
  const cart = getCart();
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Ongkir simulasi (Tetap Rp 30.000 jika subtotal > 0, gratis jika > 3 Juta)
  const shippingFee = subtotal > 3000000 ? 0 : (subtotal > 0 ? 30000 : 0);
  const discount = subtotal * activeDiscountRate;
  const grandTotal = subtotal - discount + shippingFee;

  document.getElementById('summary-subtotal').textContent = formatRupiah(subtotal);
  document.getElementById('summary-shipping').textContent = shippingFee === 0 ? "Gratis" : formatRupiah(shippingFee);
  
  const discountElement = document.getElementById('summary-discount');
  const discountRow = document.getElementById('discount-row');
  if (discount > 0) {
    discountElement.textContent = `-${formatRupiah(discount)}`;
    discountRow.classList.remove('hidden');
    document.getElementById('coupon-info').innerHTML = `
      <div class="flex items-center justify-between text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-lg mt-2 font-medium border border-emerald-100 dark:border-emerald-900/30">
        <span>Kupon aktif: <strong class="uppercase">${activeCouponCode}</strong></span>
        <button onclick="removeCoupon()" class="text-rose-500 hover:text-rose-600 hover:underline">Hapus</button>
      </div>
    `;
  } else {
    discountRow.classList.add('hidden');
    document.getElementById('coupon-info').innerHTML = '';
  }

  document.getElementById('summary-total').textContent = formatRupiah(grandTotal);
}

// Menghapus kupon aktif
window.removeCoupon = function() {
  activeDiscountRate = 0;
  activeCouponCode = "";
  const couponInput = document.getElementById('coupon-code');
  if (couponInput) couponInput.value = '';
  showToast('Kupon dihapus.', 'info');
  calculateSummary();
};

// Setup Formulir Checkout & Validasi
function setupCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  // Isi data pembeli otomatis jika user login
  const currentUser = getCurrentUser();
  if (currentUser) {
    document.getElementById('cust-name').value = currentUser.name;
    document.getElementById('cust-email').value = currentUser.email;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cust-name').value.trim();
    const email = document.getElementById('cust-email').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const payment = document.getElementById('cust-payment').value;

    if (!name || !email || !phone || !address || !payment) {
      showToast('Harap lengkapi semua data pengiriman!', 'error');
      return;
    }

    // Harus login terlebih dahulu sebelum checkout
    const user = getCurrentUser();
    if (!user) {
      showToast('Anda harus masuk/login terlebih dahulu untuk melakukan checkout.', 'error');
      setTimeout(() => {
        window.location.href = 'login.html?redirect=cart.html';
      }, 1500);
      return;
    }

    // Lakukan simulasi pembuatan order
    const cart = getCart();
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingFee = subtotal > 3000000 ? 0 : 30000;
    const discount = subtotal * activeDiscountRate;
    const grandTotal = subtotal - discount + shippingFee;

    const orderId = `ORD-${Date.now()}`;
    const newOrder = {
      orderId: orderId,
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      customer: { name, email, phone, address },
      items: cart,
      subtotal: subtotal,
      discount: discount,
      shippingFee: shippingFee,
      total: grandTotal,
      paymentMethod: payment,
      status: 'Proses' // Proses, Selesai, Dibatalkan
    };

    // Update stok produk
    const products = getProducts();
    let stockError = false;

    cart.forEach(item => {
      const prod = products.find(p => p.id === item.id);
      if (prod) {
        if (prod.stock < item.quantity) {
          showToast(`Stok ${prod.name} mendadak tidak cukup!`, 'error');
          stockError = true;
        } else {
          prod.stock -= item.quantity;
        }
      }
    });

    if (stockError) return;

    // Simpan data produk baru yang stoknya terpotong
    saveProducts(products);

    // Simpan pesanan ke riwayat
    const orders = getOrders();
    orders.unshift(newOrder); // Taruh pesanan terbaru di atas
    saveOrders(orders);

    // Tampilkan Invoice Sukses (Modal)
    showSuccessModal(newOrder);

    // Kosongkan keranjang
    saveCart([]);
  });
}

// Menampilkan Modal Sukses Transaksi
function showSuccessModal(order) {
  // Buat modal element
  const modal = document.createElement('div');
  modal.id = 'success-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4';
  
  // Format items HTML
  let itemsHtml = '';
  order.items.forEach(item => {
    itemsHtml += `
      <div class="flex justify-between text-sm py-1.5 border-b border-dashed border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
        <span>${item.name} (Ukuran: ${item.size}) x${item.quantity}</span>
        <span class="font-semibold text-slate-800 dark:text-white">${formatRupiah(item.price * item.quantity)}</span>
      </div>
    `;
  });

  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-fade-in-up border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
      <div class="flex flex-col items-center text-center mb-6">
        <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 class="text-2xl font-extrabold text-slate-800 dark:text-white">Pembelian Sukses!</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Terima kasih atas pesanan Anda. Invoice telah diterbitkan.</p>
      </div>

      <div class="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 mb-6 border border-slate-100 dark:border-slate-900/50">
        <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 font-semibold uppercase tracking-wider">
          <span>Detail Pesanan</span>
          <span>ID: ${order.orderId}</span>
        </div>
        <div class="mb-4">
          ${itemsHtml}
        </div>
        <div class="space-y-1.5 text-sm pt-2">
          <div class="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal</span>
            <span>${formatRupiah(order.subtotal)}</span>
          </div>
          ${order.discount > 0 ? `
          <div class="flex justify-between text-emerald-500 font-medium">
            <span>Diskon Kupon</span>
            <span>-${formatRupiah(order.discount)}</span>
          </div>` : ''}
          <div class="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Ongkos Kirim</span>
            <span>${order.shippingFee === 0 ? 'Gratis' : formatRupiah(order.shippingFee)}</span>
          </div>
          <div class="flex justify-between font-extrabold text-emerald-650 text-base pt-2 border-t border-slate-200">
            <span>Total Bayar</span>
            <span>${formatRupiah(order.total)}</span>
          </div>
        </div>
      </div>

      <div class="text-xs text-slate-500 space-y-1 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <p><strong>Penerima:</strong> ${order.customer.name} (${order.customer.phone})</p>
        <p><strong>Alamat:</strong> ${order.customer.address}</p>
        <p><strong>Metode Pembayaran:</strong> ${order.paymentMethod}</p>
        <p class="text-[10px] text-emerald-600 mt-2 font-medium">ℹ️ Transaksi ini disimulasikan melalui localStorage.</p>
      </div>

      <button id="close-modal-btn" class="w-full py-3.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-lg shadow-emerald-250">
        Kembali Belanja
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('close-modal-btn').addEventListener('click', () => {
    modal.remove();
    window.location.href = 'products.html';
  });
}
