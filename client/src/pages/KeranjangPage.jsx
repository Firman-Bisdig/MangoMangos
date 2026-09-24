import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart, formatRupiah } from '../context/CartContext';

const KeranjangPage = () => {
  const { cart, updateQty, removeFromCart, clearCart, subtotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <ShoppingBag size={40} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Keranjang Belanjamu Masih Kosong</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Yuk pilih menu smoothies segar dan promo hemat favoritmu sekarang!
        </p>
        <Link to="/" className="btn btn-primary" style={{ padding: '12px 28px' }}>
          Lihat Menu Segar
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '36px 20px 80px' }}>
      {/* Header title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Keranjang Belanja</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Ada {cartCount} item lezat siap dipesan
          </p>
        </div>
        <button
          onClick={clearCart}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#DC2626',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          <Trash2 size={16} /> Kosongkan Keranjang
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        alignItems: 'flex-start',
      }}>
        {/* Cart Item List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.map((item) => (
            <div
              key={item.cartKey}
              style={{
                backgroundColor: 'white',
                padding: '18px',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--border-color)',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Product Thumbnail */}
              <img
                src={item.img}
                alt={item.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#FAF7F2',
                }}
              />

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{item.name}</h3>
                {item.size && (
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary-dark)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '6px',
                  }}>
                    Ukuran: {item.size}
                  </span>
                )}
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                  {formatRupiah(item.price)}
                </div>
              </div>

              {/* Quantity Adjuster */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #E5E7EB',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => updateQty(item.cartKey, -1)}
                  style={{
                    padding: '6px 10px',
                    background: '#F9FAFB',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ padding: '6px 12px', fontWeight: 700, minWidth: '32px', textAlign: 'center', fontSize: '0.9rem' }}>
                  {item.qty}
                </span>
                <button
                  onClick={() => updateQty(item.cartKey, 1)}
                  style={{
                    padding: '6px 10px',
                    background: '#F9FAFB',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Subtotal & Delete */}
              <div style={{ textAlign: 'right', minWidth: '90px' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                  {formatRupiah(item.price * item.qty)}
                </div>
                <button
                  onClick={() => removeFromCart(item.cartKey)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                    marginTop: '6px',
                    transition: 'color 0.2s',
                  }}
                  title="Hapus"
                  onMouseEnter={(e) => e.currentTarget.style.color = '#DC2626'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginTop: '8px',
            }}
          >
            <ArrowLeft size={16} /> Tambah Menu Lain
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          position: 'sticky',
          top: '100px',
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
            Ringkasan Belanja
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Menu ({cartCount} item)</span>
            <span style={{ fontWeight: 700 }}>{formatRupiah(subtotal)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Biaya Pengemasan</span>
            <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>Gratis</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px dashed var(--border-color)',
            paddingTop: '16px',
            marginBottom: '24px',
          }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Pembayaran</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-dark)' }}>
              {formatRupiah(subtotal)}
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
          >
            Lanjut ke Checkout
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeranjangPage;
