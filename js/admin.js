// Admin Dashboard Management Logic

document.addEventListener('DOMContentLoaded', () => {
  // Proteksi halaman Admin: hanya admin@solesphere.com yang boleh masuk
  if (!isAdminLoggedIn()) {
    showToast('Akses ditolak! Khusus administrator.', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return;
  }

  // Load dashboard data
  renderDashboardStats();
  renderAdminProducts();
  renderAdminOrders();
  setupProductFormHandler();
});

// Render Statistik Dashboard
function renderDashboardStats() {
  const products = getProducts();
  const orders = getOrders();

  // Hitung Pendapatan (Hanya pesanan berstatus Selesai atau Proses)
  const revenue = orders.reduce((sum, order) => {
    if (order.status !== 'Dibatalkan') {
      return sum + order.total;
    }
    return sum;
  }, 0);

  // Update DOM Statistik
  const statRevenue = document.getElementById('stat-revenue');
  const statOrders = document.getElementById('stat-orders');
  const statProducts = document.getElementById('stat-products');

  if (statRevenue) statRevenue.textContent = formatRupiah(revenue);
  if (statOrders) statOrders.textContent = orders.length;
  if (statProducts) statProducts.textContent = products.length;
}

// Render Tabel CRUD Produk
function renderAdminProducts() {
  const products = getProducts();
  const tableBody = document.getElementById('admin-products-table');
  
  if (!tableBody) return;

  if (products.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
          Belum ada produk sepatu. Klik tombol tambah untuk menambahkan produk baru.
        </td>
      </tr>
    `;
    return;
  }

  let htmlContent = '';
  products.forEach(product => {
    htmlContent += `
      <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <img src="${product.image}" alt="${product.name}" class="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0">
            <div class="min-w-0">
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider">${product.brand}</span>
              <p class="font-bold text-slate-800 text-sm truncate mt-0.5 max-w-[150px] md:max-w-[200px]">${product.name}</p>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">${product.category}</td>
        <td class="px-6 py-4 text-sm text-slate-800 dark:text-white font-bold">${formatRupiah(product.price)}</td>
        <td class="px-6 py-4 text-sm text-center">
          <span class="inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${product.stock > 5 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : (product.stock > 0 ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400')}">
            ${product.stock}
          </span>
        </td>
        <td class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 max-w-[120px] truncate">${product.sizes.join(', ')}</td>
        <td class="px-6 py-4 text-right">
          <div class="flex items-center justify-end gap-2">
            <button onclick="openEditModal('${product.id}')" class="p-1.5 hover:bg-emerald-50 text-emerald-650 rounded-lg transition-colors" title="Edit Produk">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </button>
            <button onclick="deleteProduct('${product.id}')" class="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 dark:text-rose-400 rounded-lg transition-colors" title="Hapus Produk">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = htmlContent;
}

// Render Tabel Riwayat Transaksi (Orders)
function renderAdminOrders() {
  const orders = getOrders();
  const tableBody = document.getElementById('admin-orders-table');

  if (!tableBody) return;

  if (orders.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
          Belum ada riwayat pesanan/transaksi masuk.
        </td>
      </tr>
    `;
    return;
  }

  let htmlContent = '';
  orders.forEach(order => {
    // Tentukan badge status
    let statusClass = 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
    if (order.status === 'Proses') {
      statusClass = 'bg-emerald-50 text-emerald-650';
    } else if (order.status === 'Selesai') {
      statusClass = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400';
    } else if (order.status === 'Dibatalkan') {
      statusClass = 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400';
    }

    // Detail item belanja singkat
    const itemsSummary = order.items.map(item => `${item.name} (Uk: ${item.size}) x${item.quantity}`).join(', ');

    htmlContent += `
      <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
        <td class="px-6 py-4 text-sm font-bold text-slate-800 dark:text-white">${order.orderId}</td>
        <td class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">${order.date}</td>
        <td class="px-6 py-4">
          <div class="text-sm font-semibold text-slate-800 dark:text-white">${order.customer.name}</div>
          <div class="text-xs text-slate-400">${order.customer.phone}</div>
        </td>
        <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title="${itemsSummary}">${itemsSummary}</td>
        <td class="px-6 py-4 text-sm font-extrabold text-slate-800 dark:text-white">${formatRupiah(order.total)}</td>
        <td class="px-6 py-4 text-center">
          <select onchange="updateOrderStatus('${order.orderId}', this.value)" class="text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 ${statusClass} focus:outline-none cursor-pointer">
            <option value="Proses" ${order.status === 'Proses' ? 'selected' : ''}>Proses</option>
            <option value="Selesai" ${order.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
            <option value="Dibatalkan" ${order.status === 'Dibatalkan' ? 'selected' : ''}>Dibatalkan</option>
          </select>
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = htmlContent;
}

// Update status pesanan di dashboard admin
window.updateOrderStatus = function(orderId, newStatus) {
  let orders = getOrders();
  const index = orders.findIndex(o => o.orderId === orderId);
  
  if (index > -1) {
    orders[index].status = newStatus;
    saveOrders(orders);
    renderDashboardStats();
    renderAdminOrders();
    showToast(`Status pesanan ${orderId} berhasil diubah ke: ${newStatus}`, 'success');
  }
};

// Hapus Produk
window.deleteProduct = function(productId) {
  if (confirm('Apakah Anda yakin ingin menghapus produk sepatu ini?')) {
    let products = getProducts();
    const index = products.findIndex(p => p.id === productId);

    if (index > -1) {
      const deletedName = products[index].name;
      products.splice(index, 1);
      saveProducts(products);
      
      // Update UI
      renderAdminProducts();
      renderDashboardStats();
      showToast(`${deletedName} berhasil dihapus!`, 'success');
    }
  }
};

// Pengelolaan Modal Tambah/Edit Produk
let isEditing = false;
let currentEditingId = null;

window.openAddModal = function() {
  isEditing = false;
  currentEditingId = null;
  
  // Reset fields
  document.getElementById('modal-title').textContent = 'Tambah Produk Sepatu';
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';
  
  // Tampilkan modal
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.openEditModal = function(productId) {
  isEditing = true;
  currentEditingId = productId;

  const products = getProducts();
  const product = products.find(p => p.id === productId);

  if (!product) {
    showToast('Data produk tidak ditemukan!', 'error');
    return;
  }

  // Isi form dengan data produk yang diedit
  document.getElementById('modal-title').textContent = 'Edit Produk Sepatu';
  document.getElementById('product-id').value = product.id;
  document.getElementById('prod-name').value = product.name;
  document.getElementById('prod-brand').value = product.brand;
  document.getElementById('prod-price').value = product.price;
  document.getElementById('prod-category').value = product.category;
  document.getElementById('prod-stock').value = product.stock;
  document.getElementById('prod-sizes').value = product.sizes.join(', ');
  document.getElementById('prod-image').value = product.image;
  document.getElementById('prod-description').value = product.description;

  // Tampilkan modal
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeProductModal = function() {
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

// Handler Form Submit CRUD Produk
function setupProductFormHandler() {
  const form = document.getElementById('product-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('product-id').value;
    const name = document.getElementById('prod-name').value.trim();
    const brand = document.getElementById('prod-brand').value.trim();
    const price = parseInt(document.getElementById('prod-price').value);
    const category = document.getElementById('prod-category').value;
    const stock = parseInt(document.getElementById('prod-stock').value);
    
    // Parse ukuran (koma ke array angka)
    const sizesInput = document.getElementById('prod-sizes').value;
    const sizes = sizesInput.split(',')
                            .map(s => parseInt(s.trim()))
                            .filter(s => !isNaN(s));

    const image = document.getElementById('prod-image').value.trim() || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600';
    const description = document.getElementById('prod-description').value.trim();

    if (!name || !brand || isNaN(price) || isNaN(stock) || sizes.length === 0 || !description) {
      showToast('Harap lengkapi formulir produk dengan benar!', 'error');
      return;
    }

    let products = getProducts();

    if (isEditing && id) {
      // Logika Edit
      const index = products.findIndex(p => p.id === id);
      if (index > -1) {
        products[index] = {
          ...products[index],
          name,
          brand,
          price,
          category,
          stock,
          sizes,
          image,
          description
        };
        showToast('Produk berhasil diperbarui!', 'success');
      }
    } else {
      // Logika Tambah Baru
      const newProduct = {
        id: `p-${Date.now()}`,
        name,
        brand,
        price,
        category,
        sizes,
        stock,
        image,
        description
      };
      products.push(newProduct);
      showToast('Produk baru berhasil ditambahkan!', 'success');
    }

    saveProducts(products);
    closeProductModal();
    
    // Update UI
    renderAdminProducts();
    renderDashboardStats();
  });
}
