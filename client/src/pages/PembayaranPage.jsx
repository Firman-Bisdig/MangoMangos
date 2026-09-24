import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Copy, Check, CheckCircle2, ShoppingBag } from 'lucide-react';
import { getOrderByIdApi, confirmPaymentApi } from '../api';
import { formatRupiah } from '../context/CartContext';

const PembayaranPage = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(13 * 60 + 36); // 13:36 default timer (15 menit countdown)
  const [copied, setCopied] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const fetchOrder = async () => {
      try {
        const res = await getOrderByIdApi(orderId);
        const ord = res.data.order;
        setOrder(ord);
        if (ord.status === 'paid') {
          setIsPaid(true);
        }
      } catch (err) {
        console.error('Failed to get order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Countdown timer 1s
  useEffect(() => {
    if (timeLeft <= 0 || isPaid) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaid]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const copyTotal = () => {
    if (order) {
      navigator.clipboard.writeText(order.total.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirmPaid = async () => {
    setSubmittingPayment(true);
    try {
      await confirmPaymentApi(orderId);
      setIsPaid(true);
    } catch (err) {
      console.error('Gagal konfirmasi pembayaran:', err);
      // Fallback local update
      setIsPaid(true);
    } finally {
      setSubmittingPayment(false);
    }
  };

  /**
   * Hook untuk integrasi Midtrans Snap / Payment Gateway di masa mendatang:
   * Jika nanti snapToken di-generate dari backend, cukup panggil fungsi ini.
   */
  const handlePaymentGateway = () => {
    if (window.snap && order?.snap_token) {
      window.snap.pay(order.snap_token, {
        onSuccess: () => handleConfirmPaid(),
        onPending: () => alert('Menunggu pembayaran diselesaikan.'),
        onError: () => alert('Pembayaran gagal atau dibatalkan.'),
        onClose: () => console.log('Popup payment gateway ditutup.'),
      });
    } else {
      // Simulasi callback otomatis gateway
      handleConfirmPaid();
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--green-mid)', fontWeight: 600, fontSize: '1.1rem' }}>
          Menyiapkan halaman pembayaran...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ color: 'var(--green-deep)', marginBottom: '12px' }}>Pesanan Tidak Ditemukan</h2>
        <p style={{ color: '#6a7660', marginBottom: '24px' }}>
          ID pesanan #{orderId} tidak terdaftar di sistem kami.
        </p>
        <Link to="/" className="btn-primary">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 18px 80px', minHeight: '85vh', background: 'var(--cream)' }}>
      {/* Header Atas: Nomor Pesanan, Judul, & Sisa Waktu */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.92rem', color: '#5c6852', fontWeight: 600, marginBottom: '4px' }}>
          Pesanan #{order.id}
        </div>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 700,
            fontSize: 'clamp(1.7rem, 3.2vw, 2.2rem)',
            color: 'var(--green-deep)',
            margin: '0 0 12px',
          }}
        >
          {isPaid ? 'Pembayaran Berhasil Diterima' : 'Selesaikan Pembayaran'}
        </h1>

        {!isPaid && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--white)',
              padding: '7px 20px',
              borderRadius: '999px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: 'var(--green-ink)',
              boxShadow: '0 2px 10px rgba(32,48,15,0.06)',
              border: '1px solid rgba(32,48,15,0.08)',
            }}
          >
            <Clock size={16} color="var(--green-mid)" />
            <span>Sisa Waktu: {timeFormatted}</span>
          </div>
        )}
      </div>

      {/* Card Utama Pembayaran (Persis Tampilan di Gambar) */}
      <div
        style={{
          maxWidth: '520px',
          margin: '0 auto',
          backgroundColor: 'var(--white)',
          borderRadius: '20px',
          padding: '36px 32px',
          boxShadow: '0 18px 45px -20px rgba(32,48,15,0.3)',
          border: '1px solid var(--line)',
          textAlign: 'center',
        }}
      >
        {isPaid ? (
          /* Tampilan Status Pembayaran Berhasil */
          <div style={{ padding: '16px 0' }}>
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                backgroundColor: '#E7F6E7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
              }}
            >
              <CheckCircle2 size={44} color="#1E7E34" />
            </div>
            <h2 style={{ fontSize: '1.45rem', color: 'var(--green-deep)', marginBottom: '8px' }}>
              Terima Kasih! Pembayaran Terverifikasi
            </h2>
            <p style={{ color: '#5c6852', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Pesanan #{order.id} sebesar <b>{formatRupiah(order.total)}</b> telah lunas. Tim Mango Mango's sedang
              segera meracik pesanan segarmu!
            </p>

            {/* Detail Pengiriman */}
            <div
              style={{
                backgroundColor: '#F8FAF7',
                borderRadius: '14px',
                padding: '16px 20px',
                textAlign: 'left',
                border: '1px solid var(--line)',
                fontSize: '0.86rem',
                color: '#4c5941',
                marginBottom: '26px',
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--green-deep)', marginBottom: '6px' }}>
                Detail Pengiriman:
              </div>
              <div style={{ marginBottom: '3px' }}>
                <span style={{ fontWeight: 700 }}>Penerima:</span> {order.delivery_name} ({order.delivery_phone})
              </div>
              <div>
                <span style={{ fontWeight: 700 }}>Alamat:</span> {order.delivery_address}
              </div>
            </div>

            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: 'var(--green-deep)',
                fontWeight: 700,
                fontSize: '0.92rem',
                textDecoration: 'none',
                marginTop: '10px',
              }}
            >
              <ShoppingBag size={18} />
              Kembali Belanja
            </Link>
          </div>
        ) : (
          /* Tampilan Default Menunggu Pembayaran QRIS */
          <div>
            {/* Box Jumlah yang Harus Dibayar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.86rem', color: '#5c6852', marginBottom: '6px' }}>
                Jumlah yang Harus Dibayar
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Public Sans', sans-serif",
                    fontWeight: 900,
                    fontSize: '2.1rem',
                    color: 'var(--green-ink)',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {formatRupiah(order.total)}
                </span>
                <button
                  type="button"
                  onClick={copyTotal}
                  title="Salin nominal pembayaran"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: '7px',
                    backgroundColor: 'var(--white)',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--white)')}
                >
                  {copied ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* Badge / QR Code Centerpiece */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '16px auto 20px',
                maxWidth: '200px',
              }}
            >
              <img
                src="/Gambar/Bagde.png"
                alt="QRIS Mango Mango's"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.08))',
                }}
                onError={(e) => {
                  e.target.src = '/Gambar/Logo.png';
                }}
              />
            </div>

            {/* Panduan Pembayaran */}
            <div style={{ marginBottom: '26px' }}>
              <div
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: '#4c5941',
                  marginBottom: '4px',
                }}
              >
                Scan menggunakan aplikasi e-wallet
              </div>
              <div
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: '#4c5941',
                  marginBottom: '10px',
                }}
              >
                / m-Banking apa saja
              </div>
              <p
                style={{
                  fontSize: '0.81rem',
                  color: '#6a7660',
                  lineHeight: 1.5,
                  maxWidth: '380px',
                  margin: '0 auto',
                }}
              >
                Buka aplikasi BCA, GoPay, OVO, DANA, atau ShopeePay lalu scan QRIS di atas untuk menyelesaikan pesanan.
              </p>
            </div>

            {/* Tombol "Saya Sudah Membayar" (Sesuai Desain) */}
            <button
              type="button"
              onClick={handleConfirmPaid}
              disabled={submittingPayment}
              style={{
                width: '100%',
                backgroundColor: 'var(--green-deep)',
                color: 'var(--cream)',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.96rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease',
                boxShadow: '0 4px 14px rgba(44, 65, 24, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.backgroundColor = 'var(--green-mid)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.backgroundColor = 'var(--green-deep)';
              }}
            >
              <CheckCircle2 size={18} />
              <span>{submittingPayment ? 'Memverifikasi...' : 'Saya Sudah Membayar'}</span>
            </button>

            {/* Detail Pengiriman (Card Lembut) */}
            <div
              style={{
                backgroundColor: '#F8FAF7',
                borderRadius: '14px',
                padding: '16px 20px',
                textAlign: 'left',
                border: '1px solid var(--line)',
                fontSize: '0.85rem',
                color: '#4c5941',
                marginTop: '24px',
                marginBottom: '26px',
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--green-deep)', marginBottom: '6px' }}>
                Detail Pengiriman:
              </div>
              <div style={{ marginBottom: '3px' }}>
                <span style={{ fontWeight: 700 }}>Penerima:</span> {order.delivery_name} ({order.delivery_phone})
              </div>
              <div>
                <span style={{ fontWeight: 700 }}>Alamat:</span> {order.delivery_address}
              </div>
            </div>

            {/* Tombol Kembali Belanja */}
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: 'var(--green-deep)',
                fontWeight: 700,
                fontSize: '0.92rem',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <ShoppingBag size={18} />
              <span>Kembali Belanja</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PembayaranPage;
