import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--green-deep)',
      color: '#d6e1c6',
      padding: '64px 0 28px',
      marginTop: 'auto',
      borderTop: '4px solid var(--yellow)',
    }}>
      <div className="wrap">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
          marginBottom: '48px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img
                src="/Gambar/Logo.png"
                alt="Mango Mango's"
                style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 700,
                fontSize: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--cream)',
              }}>
                Mango Mango's
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#a9bb92', maxWidth: '280px', lineHeight: 1.6 }}>
              Bisnis minuman & dessert berbahan buah segar, dirintis sejak 2017 oleh Muhammad Sofian.
            </p>
          </div>

          {/* Kolom Menu */}
          <div>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--yellow)', marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Menu
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#c7d5b3' }}>
              <Link to="/" style={{ transition: 'color .2s' }}>Beranda</Link>
              <a href="/#katalog" style={{ transition: 'color .2s' }}>Katalog</a>
              <a href="/#promo" style={{ transition: 'color .2s' }}>Paket Promo</a>
              <a href="/#kontak" style={{ transition: 'color .2s' }}>Kontak & Cabang</a>
            </div>
          </div>

          {/* Kolom Bantuan */}
          <div>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--yellow)', marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Bantuan
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#c7d5b3' }}>
              <Link to="/keranjang">Keranjang Belanja</Link>
              <a href="/#pesan">Cara Pesan</a>
              <span>QRIS & Bayar di Tempat (COD)</span>
              <span>Buka Setiap Hari 10:00 - 22:00</span>
            </div>
          </div>

          {/* Kolom Terhubung */}
          <div>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--yellow)', marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Terhubung
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#c7d5b3' }}>
              <a href="https://instagram.com/mangomangos_official" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://wa.me/6281310524199" target="_blank" rel="noreferrer">WhatsApp</a>
              <a href="https://www.facebook.com/share/1EhAWi1Vbh/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Facebook</a>
            </div>
          </div>
        </div>

        {/* Foot Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.12)',
          paddingTop: '22px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: '#93a67c',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <span>© 2026 Mango Mango's. Dibuat oleh Group 7 — Universitas Negeri Makassar.</span>
          <span>Makassar, Indonesia</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
