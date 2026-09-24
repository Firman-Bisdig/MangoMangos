// db.js — Inisialisasi SQLite database
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'mango.db');
const db = new Database(DB_PATH);

// Aktifkan foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ===== BUAT TABEL =====
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    phone       TEXT,
    password_hash TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT,
    tag         TEXT,
    img         TEXT,
    price       INTEGER,
    old_price   INTEGER,
    type        TEXT NOT NULL DEFAULT 'single',
    active      INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS product_sizes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    label       TEXT NOT NULL,
    price       INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS product_bundle_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    item_name   TEXT NOT NULL,
    qty         INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS orders (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER REFERENCES users(id),
    items_json      TEXT NOT NULL,
    subtotal        INTEGER NOT NULL DEFAULT 0,
    total           INTEGER NOT NULL,
    delivery_name   TEXT,
    delivery_phone  TEXT,
    delivery_address TEXT,
    payment_method  TEXT DEFAULT 'qris',
    status          TEXT NOT NULL DEFAULT 'pending',
    notes           TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;
