// routes/orders.js — Buat dan lihat pesanan
const express = require('express');
const db = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// ===== BUAT PESANAN (Checkout) =====
router.post('/', optionalAuth, (req, res) => {
  const {
    items,
    subtotal,
    total,
    delivery_name,
    delivery_phone,
    delivery_address,
    payment_method,
    notes
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Keranjang belanja kosong.' });
  }

  if (!delivery_name || !delivery_phone || !delivery_address) {
    return res.status(400).json({ error: 'Nama, telepon, dan alamat pengiriman wajib diisi.' });
  }

  const userId = req.user ? req.user.id : null;
  const itemsJson = JSON.stringify(items);

  const stmt = db.prepare(`
    INSERT INTO orders (
      user_id, items_json, subtotal, total,
      delivery_name, delivery_phone, delivery_address,
      payment_method, notes, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `);

  const result = stmt.run(
    userId,
    itemsJson,
    subtotal || total,
    total,
    delivery_name,
    delivery_phone,
    delivery_address,
    payment_method || 'qris',
    notes || null
  );

  res.status(201).json({
    message: 'Pesanan berhasil dibuat!',
    orderId: result.lastInsertRowid,
    order: {
      id: result.lastInsertRowid,
      total,
      payment_method: payment_method || 'qris',
      status: 'pending'
    }
  });
});

// ===== DAFTAR PESANAN USER (Harus Login) =====
router.get('/', requireAuth, (req, res) => {
  const orders = db.prepare(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.user.id);

  const parsed = orders.map(o => ({
    ...o,
    items: JSON.parse(o.items_json)
  }));

  res.json({ orders: parsed });
});

// ===== DETAIL PESANAN BY ID =====
router.get('/:id', optionalAuth, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
  }

  // Jika order memiliki user_id, pastikan user yang meminta sesuai
  if (order.user_id && (!req.user || req.user.id !== order.user_id)) {
    return res.status(403).json({ error: 'Akses tidak diizinkan.' });
  }

  res.json({
    order: {
      ...order,
      items: JSON.parse(order.items_json)
    }
  });
});

// ===== KONFIRMASI PEMBAYARAN (Manual / Callback) =====
router.post('/:id/confirm-payment', optionalAuth, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
  }

  db.prepare("UPDATE orders SET status = 'paid' WHERE id = ?").run(req.params.id);

  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  res.json({
    message: 'Pembayaran berhasil dikonfirmasi!',
    order: {
      ...updated,
      items: JSON.parse(updated.items_json)
    }
  });
});

// ===== WEBHOOK PAYMENT GATEWAY (Midtrans / Xendit / Tripay) =====
router.post('/payment-webhook', (req, res) => {
  try {
    const payload = req.body;
    // Midtrans: order_id, transaction_status
    // Xendit: external_id, status
    const orderId = payload.order_id || payload.external_id || payload.id;
    const status = (payload.transaction_status || payload.status || '').toLowerCase();

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID tidak ditemukan dalam payload.' });
    }

    let newStatus = 'pending';
    if (['capture', 'settlement', 'paid', 'completed', 'success'].includes(status)) {
      newStatus = 'paid';
    } else if (['deny', 'cancel', 'expire', 'failed'].includes(status)) {
      newStatus = 'failed';
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(newStatus, orderId);

    console.log(`[PAYMENT GATEWAY WEBHOOK] Order #${orderId} status diupdate ke: ${newStatus}`);
    res.json({ status: 'ok', updatedStatus: newStatus });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Gagal memproses webhook pembayaran.' });
  }
});

module.exports = router;

