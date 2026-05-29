// Authentication Logic

// Inisialisasi daftar user default jika belum ada
function getUsers() {
  return JSON.parse(localStorage.getItem('shoes_users')) || [];
}

function saveUsers(users) {
  localStorage.setItem('shoes_users', JSON.stringify(users));
}

// Redirect jika sudah login
document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);

  if (user && (page === 'login.html' || page === 'register.html')) {
    if (user.email === 'admin@solesphere.com') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'index.html';
    }
  }

  // Setup form handling
  if (page === 'login.html') {
    setupLoginForm();
  } else if (page === 'register.html') {
    setupRegisterForm();
  }
});

// Setup Form Login
function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showToast('Harap isi semua kolom!', 'error');
      return;
    }

    // Cek Akun Admin Bawaan
    if (email === 'admin@solesphere.com' && password === 'admin123') {
      const adminSession = {
        name: 'Administrator',
        email: 'admin@solesphere.com',
        role: 'admin'
      };
      localStorage.setItem('currentUser', JSON.stringify(adminSession));
      showToast('Login Admin Berhasil! Mengalihkan...', 'success');
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 1500);
      return;
    }

    // Cek User Biasa
    const users = getUsers();
    const matchedUser = users.find(u => u.email === email && u.password === password);

    if (matchedUser) {
      const userSession = {
        name: matchedUser.name,
        email: matchedUser.email,
        role: 'user'
      };
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      showToast(`Selamat datang kembali, ${matchedUser.name}!`, 'success');
      setTimeout(() => {
        // Cek apakah ada redirect tujuan di URL (misal: cart.html)
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        if (redirect) {
          window.location.href = redirect;
        } else {
          window.location.href = 'index.html';
        }
      }, 1500);
    } else {
      showToast('Email atau password salah!', 'error');
    }
  });
}

// Setup Form Register
function setupRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validasi Kolom
    if (!name || !email || !password || !confirmPassword) {
      showToast('Harap isi semua kolom!', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password minimal harus 6 karakter!', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Konfirmasi password tidak cocok!', 'error');
      return;
    }

    // Cek apakah email sudah terdaftar (atau email admin)
    if (email === 'admin@solesphere.com') {
      showToast('Email ini tidak dapat digunakan.', 'error');
      return;
    }

    const users = getUsers();
    const emailExists = users.some(u => u.email === email);

    if (emailExists) {
      showToast('Email sudah terdaftar! Silakan login.', 'error');
      return;
    }

    // Daftarkan User Baru
    const newUser = { name, email, password };
    users.push(newUser);
    saveUsers(users);

    showToast('Registrasi berhasil! Silakan masuk.', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  });
}
