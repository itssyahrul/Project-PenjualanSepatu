const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: "Nike Air Max 270",
    brand: "Nike",
    price: 2199000,
    category: "Sport",
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 12,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    description: "Nike Air Max 270 menghadirkan kenyamanan luar biasa dengan unit Max Air yang besar di bagian tumit. Desain ramping terinspirasi dari ikon Air Max masa lalu, dipadukan dengan rajutan mesh yang breathable dan fleksibel untuk aktivitas olahraga maupun kasual harian Anda."
  },
  {
    id: "p2",
    name: "Adidas Ultraboost Light",
    brand: "Adidas",
    price: 2499000,
    category: "Sport",
    sizes: [40, 41, 42, 43, 44],
    stock: 8,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
    description: "Rasakan energi luar biasa di setiap langkah dengan Adidas Ultraboost Light. Merupakan seri Ultraboost teringan yang pernah ada berkat bahan Boost generasi baru. Dilengkapi dengan upper Primeknit+ yang memeluk kaki dengan sempurna serta outsole karet Continental untuk cengkeraman maksimal."
  },
  {
    id: "p3",
    name: "Puma Suede Classic",
    brand: "Puma",
    price: 1299000,
    category: "Casual",
    sizes: [39, 40, 41, 42, 43],
    stock: 15,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80",
    description: "Ikon gaya jalanan sejati sejak 1968. Puma Suede Classic menawarkan kenyamanan premium dengan upper suede asli berkualitas tinggi dan sol karet bertekstur. Desain retro yang tak lekang oleh waktu, sangat cocok dipadukan dengan berbagai outfit kasual andalan Anda."
  },
  {
    id: "p4",
    name: "Nike Air Force 1 '07",
    brand: "Nike",
    price: 1549000,
    category: "Casual",
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 20,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
    description: "Keindahan yang abadi. Nike Air Force 1 '07 mempertahankan ciri khas legendarisnya: kulit premium yang halus, konstruksi era 80-an yang kokoh, dan bantalan Nike Air yang ikonik untuk kenyamanan sepanjang hari."
  },
  {
    id: "p5",
    name: "Jordan 1 Retro High OG",
    brand: "Jordan",
    price: 2899000,
    category: "Sport",
    sizes: [40, 41, 42, 43, 44, 45],
    stock: 5,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&auto=format&fit=crop&q=80",
    description: "Sneaker basket paling legendaris sepanjang sejarah. Jordan 1 Retro OG menghadirkan kembali siluet asli tahun 1985 dengan bahan kulit premium, warna retro yang ikonik, serta unit Air-Sole di tumit untuk perlindungan benturan yang optimal."
  },
  {
    id: "p6",
    name: "New Balance 574 Core",
    brand: "New Balance",
    price: 1499000,
    category: "Casual",
    sizes: [39, 40, 41, 42, 43],
    stock: 18,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80",
    description: "Didesain sebagai sepatu serbaguna, New Balance 574 Core menawarkan kombinasi sempurna antara kenyamanan, ketahanan, dan gaya klasik. Dilengkapi teknologi ENCAP pada midsole untuk dukungan ekstra dan peredam kejut maksimal saat berjalan jauh."
  },
  {
    id: "p7",
    name: "Oxford Leather Premium",
    brand: "Gino Mariani",
    price: 1899000,
    category: "Formal",
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 7,
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80",
    description: "Tampilkan profesionalisme dan keanggunan sejati dengan Oxford Leather Premium. Dibuat menggunakan kulit sapi full-grain asli dengan finishing semi-glossy yang mewah serta sol dalam ortopedi yang empuk untuk kenyamanan formal sepanjang hari kerja."
  },
  {
    id: "p8",
    name: "Chelsea Boots Handcrafted",
    brand: "Brogdo",
    price: 1750000,
    category: "Formal",
    sizes: [40, 41, 42, 43, 44],
    stock: 6,
    image: "https://images.unsplash.com/photo-1638971720089-6d33f1ada2f5?w=600&auto=format&fit=crop&q=80",
    description: "Chelsea Boots premium buatan tangan yang memadukan keanggunan klasik dengan kepraktisan modern. Memiliki panel elastis di bagian samping untuk kemudahan pemakaian, kulit berkualitas tinggi, dan sol luar anti-slip yang kokoh."
  }
];

function initializeProducts() {
  if (!localStorage.getItem('shoes_products')) {
    localStorage.setItem('shoes_products', JSON.stringify(DEFAULT_PRODUCTS));
  }
}

// Jalankan inisialisasi produk saat script dimuat
initializeProducts();

function getProducts() {
  return JSON.parse(localStorage.getItem('shoes_products')) || DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem('shoes_products', JSON.stringify(products));
}
