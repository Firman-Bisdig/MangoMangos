// routes/products.js — GET semua produk & detail
const express = require('express');
const db = require('../db');

const router = express.Router();

// Helper: ambil sizes & bundle items
function getProductFull(product) {
  if (product.type === 'sized') {
    product.sizes = db.prepare('SELECT label, price FROM product_sizes WHERE product_id = ? ORDER BY price ASC').all(product.id);
  } else if (product.type === 'bundle') {
    product.bundle = db.prepare('SELECT item_name as name, qty FROM product_bundle_items WHERE product_id = ?').all(product.id);
  }
  return product;
}

// ===== GET ALL =====
router.get('/', (req, res) => {
  const products = db.prepare(
    'SELECT * FROM products WHERE active = 1 ORDER BY rowid ASC'
  ).all();
  const result = products.map(getProductFull);
  res.json({ products: result });
});

// ===== GET SINGLE =====
router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ? AND active = 1').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan.' });
  res.json({ product: getProductFull(product) });
});

module.exports = router;
