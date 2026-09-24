// middleware/auth.js — JWT verifikasi
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mangomangos_secret_2026';

function requireAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token tidak ditemukan. Silakan login.' });
  }
  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, name }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token tidak valid atau sudah kadaluarsa.' });
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (header && header.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(header.slice(7), JWT_SECRET);
    } catch (_) {}
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
