// routes/auth.js — Register, Login, Profile
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mangomangos_secret_2026';
const JWT_EXPIRES = '7d';

// ===== REGISTER =====
router.post('/register', (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Nama, email, dan kata sandi wajib diisi.' });

  if (password.length < 6)
    return res.status(400).json({ error: 'Kata sandi minimal 6 karakter.' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing)
    return res.status(409).json({ error: 'Email sudah terdaftar. Silakan login.' });

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)'
  ).run(name, email, phone || null, hash);

  const token = jwt.sign(
    { id: result.lastInsertRowid, email, name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

  res.status(201).json({
    message: 'Akun berhasil dibuat!',
    token,
    user: { id: result.lastInsertRowid, name, email, phone: phone || null }
  });
});

// ===== LOGIN =====
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email dan kata sandi wajib diisi.' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash))
    return res.status(401).json({ error: 'Email atau kata sandi salah.' });

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

  res.json({
    message: `Selamat datang kembali, ${user.name}!`,
    token,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
  });
});

// ===== GET PROFILE =====
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT id, name, email, phone, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });
  res.json({ user });
});

// ===== UPDATE PROFILE =====
router.put('/me', requireAuth, (req, res) => {
  const { name, phone } = req.body;
  db.prepare('UPDATE users SET name = ?, phone = ? WHERE id = ?').run(
    name || req.user.name,
    phone || null,
    req.user.id
  );
  res.json({ message: 'Profil berhasil diperbarui.' });
});

module.exports = router;
