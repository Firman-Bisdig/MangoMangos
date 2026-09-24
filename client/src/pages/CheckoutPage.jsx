import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, QrCode, Banknote, ShoppingBag } from 'lucide-react';
import { useCart, formatRupiah } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrderApi } from '../api';

const CheckoutPage = () => {
  const { cart, subtotal, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [orderCompleted, setOrderCompleted] = useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (cart.length === 0 && !orderCompleted) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--cream-mid)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <ShoppingBag size={40} color="var(--green-mid)" />
        </div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--green-deep)', marginBottom: '8px' }}>
          Keranjang Belanja Masih Kosong
        </h2>
        <p style={{ color: '#5C6852', marginBottom: '24px' }}>
          Silakan pilih menu smoothies atau paket hemat favoritmu sebelum melakukan checkout.
        </p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 28px', textDecoration: 'none' }}>
          Lihat Menu Segar
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      setError('Mohon lengkapi nama, nomor telepon, dan alamat pengiriman.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      setOrderCompleted(true);
      const orderPayload = {
        items: cart,
        subtotal,
        total: subtotal,
        delivery_name: name,
        delivery_phone: phone,
        delivery_address: address,
        payment_method: paymentMethod,
        notes,
      };

      const res = await createOrderApi(orderPayload);
      const { orderId } = res.data;
      clearCart();
      navigate(`/pembayaran/${orderId}`, { replace: true });
    } catch (err) {
      setOrderCompleted(false);
      console.error('Checkout error:', err);
      setError(err.response?.data?.error || 'Gagal memproses pesanan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '36px 20px 80px' }}>
      <Link
        to="/keranjang"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '24px',
        }}
      >
        <ArrowLeft size={18} /> Kembali ke Keranjang
      </Link>

      <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>Checkout & Pengiriman</h1>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          fontSize: '0.9rem',
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'flex-start',
        }}>
          {/* Left Column: Delivery details & Payment Method */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Form Alamat */}
            <div style={{
              backgroundColor: 'white',
              padding: '28px',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Data Penerima & Alamat</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Nama Lengkap Penerima *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rina Melati"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid #E5E7EB',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Nomor WhatsApp / HP Aktif *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid #E5E7EB',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Alamat Lengkap Pengiriman *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jalan, nomor rumah/kantor, RT/RW, patokan..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid #E5E7EB',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Catatan Pesanan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kurangi gula, tolong beri sedotan lebih"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid #E5E7EB',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div style={{
              backgroundColor: 'white',
              padding: '28px',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '18px' }}>Metode Pembayaran</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* QRIS */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'qris' ? '2px solid var(--primary)' : '1.5px solid #E5E7EB',
                    backgroundColor: paymentMethod === 'qris' ? 'var(--primary-light)' : 'white',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="qris"
                    checked={paymentMethod === 'qris'}
                    onChange={() => setPaymentMethod('qris')}
                  />
                  <QrCode size={24} color="var(--primary-dark)" />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', display: 'block' }}>
                      QRIS (GoPay, OVO, Dana, ShopeePay, BCA, dll)
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Konfirmasi otomatis & cepat via scan barcode QRIS
                    </span>
                  </div>
                </label>

                {/* COD */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'cod' ? '2px solid var(--primary)' : '1.5px solid #E5E7EB',
                    backgroundColor: paymentMethod === 'cod' ? 'var(--primary-light)' : 'white',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <Banknote size={24} color="#059669" />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', display: 'block' }}>
                      Bayar di Tempat (COD)
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Bayar tunai saat pesanan sampai di alamatmu
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Ringkasan Pesanan */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: '100px',
          }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '18px', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
              Pesanan Kamu ({cartCount} item)
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {cart.map((item) => (
                <div key={item.cartKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img src={item.img} alt="" style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {item.size ? `${item.size} • ` : ''}x{item.qty}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700 }}>{formatRupiah(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ongkos Kirim</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>Gratis Ongkir</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.2rem',
                fontWeight: 900,
                borderTop: '2px dashed var(--border-color)',
                paddingTop: '14px',
              }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary-dark)' }}>{formatRupiah(subtotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 800 }}
            >
              {loading ? 'Membuat Pesanan...' : 'Konfirmasi dan Bayar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
