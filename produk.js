// produk.js — Master data Mango Mango's
// Produk yang punya varian ukuran pakai array `sizes`.
// Produk tunggal tetap pakai `price` langsung.

const PRODUK = {
  mangga: {
    name: 'Smoothies Mangga Original',
    desc: 'Mangga segar, susu, tanpa pemanis tambahan.',
    tag: 'Best Seller',
    img: 'Gambar/Mangga.jpeg',
    // varian ukuran
    sizes: [
      { label: 'Small', price: 13000 },
      { label: 'Large', price: 25000 }
    ]
  },
  avocado: {
    name: 'Smoothies Alpukat Cokelat',
    desc: 'Alpukat mentega, cokelat, susu kental manis.',
    tag: 'Favorit',
    img: 'Gambar/Avocado.jpeg',
    price: 15000   // harga tunggal
  },
  salad: {
    name: 'Salad Buah Segar',
    desc: 'Campuran buah musiman dengan topping keju & susu kental manis.',
    tag: 'Baru',
    img: 'Gambar/Salad.jpeg',
    price: 15000   // harga tunggal
  },
  taiwan: {
    name: 'Taiwan Mango Dessert',
    desc: 'Lapisan taro & matcha dengan susu kelapa segar.',
    tag: 'Kekinian',
    img: 'Gambar/Taiwan.jpeg',
    price: 22000
  },

  // ---- Paket bundling ----
  'paket-A': {
    name: 'Paket Hemat 3 Cup',
    desc: '2 Avocado Jackfruit + 1 Mango Mangos',
    price: 30000,
    oldPrice: 39000,
    tag: 'Promo Spesial',
    img: 'Gambar/Bundle-1.jpeg',
      gallery: [
    'Gambar/Bundle-1.jpeg',
    'Gambar/Avocado.jpeg',
    'Gambar/Avocado.jpeg',
    'Gambar/Mangga.jpeg'
    ],
    bundle: [
      { name: 'Avocado Jackfruit', qty: 2 },
      { name: 'Mango Mangos', qty: 1 }
    ]
  },
  'paket-B': {
    name: 'Paket Hemat 3 Cup',
    desc: '2 Salad Fruit + 1 Mango Mangos',
    price: 30000,
    oldPrice: 39000,
    tag: 'Promo Spesial',
    img: 'Gambar/Bundle-2.jpeg',
    gallery: [
    'Gambar/Bundle-2.jpeg',
    'Gambar/Salad.jpeg',
    'Gambar/Salad.jpeg',
    'Gambar/Mangga.jpeg'
    ],
    bundle: [
      { name: 'Salad Fruit', qty: 2 },
      { name: 'Mango Mangos', qty: 1 }
    ]
  },
  'paket-C': {
    name: 'Paket Hemat 3 Cup',
    desc: '1 Salad Fruit + 1 Avocado Jackfruit + 1 Mango Mangos',
    price: 30000,
    oldPrice: 39000,
    tag: 'Promo Spesial',
    img: 'Gambar/Bundle-3.jpeg',
    gallery: [
    'Gambar/Bundle-3.jpeg',
    'Gambar/Salad.jpeg',
    'Gambar/Avocado.jpeg',
    'Gambar/Mangga.jpeg'
    ],
    bundle: [
      { name: 'Salad Fruit', qty: 1 },
      { name: 'Avocado Jackfruit', qty: 1 },
      { name: 'Mango Mangos', qty: 1 }
    ]
  }
};

// ---- Helper: cek apakah produk punya varian ukuran ----
function hasSizes(id) {
  const p = PRODUK[id];
  return p && Array.isArray(p.sizes) && p.sizes.length > 0;
}

// ---- Helper: ambil harga produk (baik varian maupun tunggal) ----
function getPrice(id, sizeLabel) {
  const p = PRODUK[id];
  if (!p) return 0;
  if (p.sizes) {
    const s = p.sizes.find(x => x.label === sizeLabel);
    return s ? s.price : 0;
  }
  return p.price;
}

// ---- Helper: harga minimum (untuk tampil "") ----
function getMinPrice(id) {
  const p = PRODUK[id];
  if (!p) return 0;
  if (p.sizes) return Math.min(...p.sizes.map(s => s.price));
  return p.price;
}

// ---- CART STORAGE ----
const CART_KEY = 'mangoCart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch (e) { return []; }
}

function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  catch (e) { alert('Keranjang penuh, hapus beberapa item dulu.'); }
  updateCartBadge();
}

// id + size = kombinasi unik (supaya mangga-small & mangga-large tidak ketimpa)
function addToCart(id, size = null, qty = 1) {
  const p = PRODUK[id];
  if (!p) { console.warn('Produk tidak dikenal:', id); return; }
  const cart = getCart();
  const found = cart.find(i => i.id === id && i.size === size);
  if (found) {
    found.qty += qty;
  } else {
    cart.push({ id, size, qty, checked: true });
  }
  saveCart(cart);
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.style.transition = 'transform .15s ease';
    badge.style.transform = 'scale(1.4)';
    setTimeout(() => (badge.style.transform = 'scale(1)'), 150);
  }
}

function updateCartBadge() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => (el.textContent = total));
}

function formatRp(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

document.addEventListener('DOMContentLoaded', updateCartBadge);