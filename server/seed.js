// seed.js — Isi data produk awal dari produk.js lama
const db = require('./db');

function seed() {
  const existing = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
  if (existing.cnt > 0) {
    console.log('✅ Database sudah ada data produk, skip seed.');
    return;
  }

  console.log('🌱 Seeding produk...');

  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (id, name, description, tag, img, price, old_price, type)
    VALUES (@id, @name, @description, @tag, @img, @price, @old_price, @type)
  `);
  const insertSize = db.prepare(`
    INSERT INTO product_sizes (product_id, label, price) VALUES (@product_id, @label, @price)
  `);
  const insertBundle = db.prepare(`
    INSERT INTO product_bundle_items (product_id, item_name, qty) VALUES (@product_id, @item_name, @qty)
  `);

  const seeder = db.transaction(() => {
    // === PRODUK UTAMA ===
    insertProduct.run({ id: 'mangga', name: 'Smoothies Mangga Original', description: 'Mangga segar, susu, tanpa pemanis tambahan.', tag: 'Best Seller', img: '/Gambar/Mangga.jpeg', price: null, old_price: null, type: 'sized' });
    insertSize.run({ product_id: 'mangga', label: 'Small', price: 13000 });
    insertSize.run({ product_id: 'mangga', label: 'Large', price: 25000 });

    insertProduct.run({ id: 'avocado', name: 'Smoothies Alpukat Cokelat', description: 'Alpukat mentega, cokelat, susu kental manis.', tag: 'Favorit', img: '/Gambar/Avocado.jpeg', price: 15000, old_price: null, type: 'single' });

    insertProduct.run({ id: 'salad', name: 'Salad Buah Segar', description: 'Campuran buah musiman dengan topping keju & susu kental manis.', tag: 'Baru', img: '/Gambar/Salad.jpeg', price: 15000, old_price: null, type: 'single' });

    insertProduct.run({ id: 'taiwan', name: 'Taiwan Mango Dessert', description: 'Lapisan taro & matcha dengan susu kelapa segar.', tag: 'Kekinian', img: '/Gambar/Taiwan.jpeg', price: 22000, old_price: null, type: 'single' });

    // === PAKET BUNDLE ===
    insertProduct.run({ id: 'paket-A', name: 'Paket Hemat 3 Cup', description: '2 Avocado Jackfruit + 1 Mango Mangos', tag: 'Promo Spesial', img: '/Gambar/Bundle-1.jpeg', price: 30000, old_price: 39000, type: 'bundle' });
    insertBundle.run({ product_id: 'paket-A', item_name: 'Avocado Jackfruit', qty: 2 });
    insertBundle.run({ product_id: 'paket-A', item_name: 'Mango Mangos', qty: 1 });

    insertProduct.run({ id: 'paket-B', name: 'Paket Hemat 3 Cup', description: '2 Salad Fruit + 1 Mango Mangos', tag: 'Promo Spesial', img: '/Gambar/Bundle-2.jpeg', price: 30000, old_price: 39000, type: 'bundle' });
    insertBundle.run({ product_id: 'paket-B', item_name: 'Salad Fruit', qty: 2 });
    insertBundle.run({ product_id: 'paket-B', item_name: 'Mango Mangos', qty: 1 });

    insertProduct.run({ id: 'paket-C', name: 'Paket Hemat 3 Cup', description: '1 Salad Fruit + 1 Avocado Jackfruit + 1 Mango Mangos', tag: 'Promo Spesial', img: '/Gambar/Bundle-3.jpeg', price: 30000, old_price: 39000, type: 'bundle' });
    insertBundle.run({ product_id: 'paket-C', item_name: 'Salad Fruit', qty: 1 });
    insertBundle.run({ product_id: 'paket-C', item_name: 'Avocado Jackfruit', qty: 1 });
    insertBundle.run({ product_id: 'paket-C', item_name: 'Mango Mangos', qty: 1 });
  });

  seeder();
  console.log('✅ Seed selesai!');
}

module.exports = seed;
