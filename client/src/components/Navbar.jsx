import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Package, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { cartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const handleAccountClick = () => {
    if (user) {
      setDropdownOpen(!dropdownOpen);
    } else {
      openAuthModal('login');
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--green-deep)',
      padding: '14px 20px',
      boxShadow: '0 4px 20px rgba(32,48,15,0.15)'
    }}>
      <nav className="wrap" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img
            src="/Gambar/Logo.png"
            alt="Mango Mango's"
            style={{ width: '42px', height: '42px', objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 700,
            fontSize: '1.28rem',
            fontStyle: 'italic',
            color: 'var(--cream)',
          }}>
            Mango Mango's
          </span>
        </Link>

        {/* Navlinks */}
        <div style={{
          display: 'flex',
          gap: '6px',
          fontWeight: 600,
          fontSize: '0.9rem',
          background: 'rgba(255,250,234,0.08)',
          border: '1px solid rgba(255,250,234,0.16)',
          padding: '6px',
          borderRadius: '999px',
        }} className="navlinks">
          <Link
            to="/"
            style={{
              padding: '9px 20px',
              borderRadius: '999px',
              background: location.pathname === '/' ? 'var(--yellow)' : 'transparent',
              color: location.pathname === '/' ? 'var(--green-ink)' : '#cddabf',
              transition: 'background .2s, color .2s',
              fontWeight: 700,
            }}
          >
            Beranda
          </Link>
          <a
            href="/#katalog"
            style={{
              padding: '9px 20px',
              borderRadius: '999px',
              color: '#cddabf',
              transition: 'color .2s',
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--cream)'}
            onMouseLeave={(e) => e.target.style.color = '#cddabf'}
          >
            Katalog
          </a>
          <a
            href="/#kontak"
            style={{
              padding: '9px 20px',
              borderRadius: '999px',
              color: '#cddabf',
              transition: 'color .2s',
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--cream)'}
            onMouseLeave={(e) => e.target.style.color = '#cddabf'}
          >
            Kontak
          </a>
        </div>

        {/* Action Buttons: Cart & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
          {/* Cart Button */}
          <Link
            to="/keranjang"
            id="btn-cart"
            title="Keranjang Belanja"
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,250,234,0.1)',
              border: '1px solid rgba(255,250,234,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'background .2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,250,234,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,250,234,0.1)'}
          >
            <ShoppingBag size={18} color="var(--cream)" />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--yellow)',
                color: 'var(--green-ink)',
                fontSize: '11px',
                fontWeight: 800,
                width: '19px',
                height: '19px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--green-deep)',
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile / Account Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleAccountClick}
              id="btn-user-account"
              title={user ? `Akun: ${user.name}` : 'Login / Daftar Akun'}
              style={{
                width: user ? 'auto' : '40px',
                height: '40px',
                padding: user ? '0 14px' : '0',
                borderRadius: user ? '999px' : '50%',
                background: user ? 'var(--yellow)' : 'rgba(255,250,234,0.1)',
                border: '1px solid rgba(255,250,234,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: user ? 'var(--green-ink)' : 'var(--cream)',
                cursor: 'pointer',
                transition: 'background .2s, transform .2s',
                fontWeight: 700,
                fontSize: '0.88rem',
              }}
              onMouseEnter={(e) => {
                if (!user) {
                  e.currentTarget.style.background = 'var(--yellow)';
                  e.currentTarget.style.color = 'var(--green-ink)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!user) {
                  e.currentTarget.style.background = 'rgba(255,250,234,0.1)';
                  e.currentTarget.style.color = 'var(--cream)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <User size={18} />
              {user && (
                <>
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </>
              )}
            </button>

            {/* Dropdown Menu Saat Login */}
            {user && dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '210px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                border: '1px solid rgba(0,0,0,0.08)',
                padding: '8px',
                zIndex: 110,
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--green-deep)' }}>{user.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6A7660' }}>{user.email}</p>
                </div>
                <Link
                  to="/keranjang"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    color: 'var(--green-deep)',
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--green-soft)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Package size={16} color="var(--green-mid)" />
                  Pesanan & Keranjang
                </Link>
                <button
                  onClick={() => { logout(); setDropdownOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    color: '#DC2626',
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={16} />
                  Keluar Akun
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
