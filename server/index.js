// server/index.js — Server Entry Point
const express = require('express');
const cors = require('cors');
const path = require('path');
const seed = require('./seed');

const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sajikan folder Gambar sebagai file statis
const gambarPath = path.join(__dirname, '..', 'Gambar');
app.use('/Gambar', express.static(gambarPath));

// Jalankan seed otomatis jika tabel produk masih kosong
seed();

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mango Mangos API is running' });
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server Mango Mangos berjalan di http://localhost:${PORT}`);
});
