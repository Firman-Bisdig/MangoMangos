import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, X, MapPin } from 'lucide-react';
import { getProductsApi } from '../api';
import { useCart, formatRupiah } from '../context/CartContext';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  // Promo selection state
  const [selectedPromoId, setSelectedPromoId] = useState('paket-A');
  const promoOptions = [
    {
      id: 'paket-A',
      name: 'Paket Hemat A',
      item1: '2 Cup Avocado Jackfruit',
      item2: '1 Cup Mango Mangos',
      img: '/Gambar/Bundle-1.jpeg',
    },
    {
      id: 'paket-B',
      name: 'Paket Hemat B',
      item1: '2 Cup Salad Fruit',
      item2: '1 Cup Mango Mangos',
      img: '/Gambar/Bundle-2.jpeg',
    },
    {
      id: 'paket-C',
      name: 'Paket Hemat C',
      item1: '1 Salad Fruit + 1 Avocado',
      item2: '1 Cup Mango Mangos',
      img: '/Gambar/Bundle-3.jpeg',
    },
  ];

  // Size selection modal state for sized products (like Mangga)
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductsApi();
        if (res.data && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };
    fetchProducts();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handlePlusClick = (prod) => {
    if (prod.type === 'sized' && prod.sizes?.length > 0) {
      setSelectedProductForModal(prod);
    } else {
      addToCart(prod, null, 1);
      showToast(`${prod.name} berhasil ditambahkan ke keranjang!`);
    }
  };

  const handleSelectSizeAndAdd = (size) => {
    if (selectedProductForModal) {
      addToCart(selectedProductForModal, size, 1);
      showToast(`${selectedProductForModal.name} (${size.label}) masuk keranjang!`);
      setSelectedProductForModal(null);
    }
  };

  const catalogProducts = (Array.isArray(products) ? products : []).filter((p) => p && p.type !== 'bundle');

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'var(--green-deep)',
          color: 'var(--cream)',
          padding: '12px 20px',
          borderRadius: '999px',
          boxShadow: 'var(--shadow)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: 700,
          fontSize: '0.9rem',
          border: '1.5px solid var(--yellow)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={18} color="var(--yellow)" />
            <span>{toastMessage}</span>
          </div>
          <Link
            to="/keranjang"
            style={{
              backgroundColor: 'var(--yellow)',
              color: 'var(--green-ink)',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Lihat Keranjang →
          </Link>
        </div>
      )}

      {/* ===== HERO SECTION ===== */}
      <section className="hero" id="beranda" style={{ position: 'relative', overflow: 'hidden', padding: '60px 0 30px', background: 'var(--cream)' }}>
        {/* Dekorasi Daun */}
        <img src="/Gambar/Daun.png" alt="" className="leaf leaf-1" />
        <img src="/Gambar/Daun.png" alt="" className="leaf leaf-2" />
        <img src="/Gambar/Daun.png" alt="" className="leaf leaf-3" />
        <img src="/Gambar/Daun.png" alt="" className="leaf leaf-4" />
        <img src="/Gambar/Daun.png" alt="" className="leaf leaf-5" />

        <div className="wrap" style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* KIRI: Teks */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--white)',
              border: '1px solid var(--line)',
              padding: '7px 16px',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--green-mid)',
              marginBottom: '22px'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--yellow-deep)' }}></span>
              Buah Segar, Hidup Lebih Sehat
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
              lineHeight: 1.1,
              color: 'var(--green-deep)',
              marginBottom: '20px'
            }}>
              Segernya Mangga Asli,<br />
              Siap <em style={{ fontStyle: 'italic', color: 'var(--yellow-deep)' }}>Diantar</em> ke Gelasmu.
            </h1>

            <p style={{
              maxWidth: '460px',
              fontSize: '1.05rem',
              color: '#43503a',
              marginBottom: '28px',
              lineHeight: 1.6
            }}>
              Nikmati minuman mangga, alpukat, salad buah, dan dessert favoritmu.
              Pesan sekarang, lebih mudah dan lebih dekat denganmu.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a className="btn-primary" href="#katalog">
                Lihat Katalog Menu →
              </a>
              <a className="btn-ghost" href="#kontak">
                <MapPin size={16} />
                Cek Lokasi Cabang
              </a>
            </div>
          </div>

          {/* KANAN: Visual Hero */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '380px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
              <img
                src="/Gambar/Hero-Mangga.jpeg"
                alt="Mango Mango's"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '24px',
                  boxShadow: '0 25px 40px -20px rgba(32,48,15,.4)'
                }}
                onError={(e) => { e.target.src = '/Gambar/Paket.jpeg'; }}
              />

              {/* Tulisan Good Fruit Good Mood */}
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '-15px',
                fontFamily: "'Fraunces', serif",
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: '1.45rem',
                lineHeight: 1.1,
                color: 'var(--green-deep)',
                transform: 'rotate(-6deg)',
                textShadow: '0 2px 0 var(--cream)',
                backgroundColor: 'rgba(255,250,234,0.85)',
                padding: '6px 12px',
                borderRadius: '12px'
              }}>
                Good<br />Fruit<br />Good<br />Mood
                <span style={{ display: 'block', fontSize: '1.2rem', color: 'var(--yellow-deep)' }}>♡</span>
              </div>

              {/* Badge 100% Buah Segar */}
              <div style={{
                position: 'absolute',
                top: '-15%',
                right: '-15px',
                background: 'var(--green-deep)',
                color: 'var(--cream)',
                width: '115px',
                height: '115px',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                fontSize: '.75rem',
                lineHeight: 1.2,
                boxShadow: '0 12px 20px -10px rgba(32,48,15,.5)',
                border: '3px solid var(--cream)',
              }}>
                <span style={{ fontSize: '1rem', marginBottom: '2px' }}>🍃</span>
                <strong style={{ fontFamily: "'Fraunces', serif", fontSize: '1.55rem' }}>100%</strong>
                <span>Buah Segar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Bawah Hero */}
        <div className="wrap" style={{ marginTop: '40px' }}>
          <div style={{
            background: 'var(--white)',
            borderRadius: '22px',
            padding: '20px 28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            boxShadow: '0 18px 40px -24px rgba(32,48,15,.35)',
            border: '1px solid var(--line)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                🍃
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '.88rem', color: 'var(--green-deep)' }}>100% Buah Segar</strong>
                <span style={{ display: 'block', fontSize: '.78rem', color: '#6a7660' }}>Pilihan terbaik setiap hari</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                ♡
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '.88rem', color: 'var(--green-deep)' }}>Tanpa Pengawet</strong>
                <span style={{ display: 'block', fontSize: '.78rem', color: '#6a7660' }}>Aman untuk seluruh keluarga</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                🛵
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '.88rem', color: 'var(--green-deep)' }}>Pesan Lebih Mudah</strong>
                <span style={{ display: 'block', fontSize: '.78rem', color: '#6a7660' }}>Siap antar ke lokasi Anda</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                📍
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '.88rem', color: 'var(--green-deep)' }}>3 Cabang di Makassar</strong>
                <span style={{ display: 'block', fontSize: '.78rem', color: '#6a7660' }}>Lebih dekat denganmu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KATALOG MENU ===== */}
      <section id="katalog">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">Halaman Katalog</span>
            <h2>Menu favorit, siap dipesan</h2>
            <p>Klik "+" untuk pilih ukuran dan tambah ke keranjang belanja.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '22px'
          }}>
            {catalogProducts.map((p) => (
              <div
                key={p.id}
                style={{
                  background: 'var(--white)',
                  borderRadius: '22px',
                  padding: '18px',
                  border: '1px solid var(--line)',
                  transition: 'box-shadow .2s, transform .2s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  aspectRatio: '1/0.92',
                  borderRadius: '16px',
                  marginBottom: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--green-soft)'
                }}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {p.tag && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'var(--yellow-deep)',
                      color: 'var(--green-ink)',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      zIndex: 1
                    }}>
                      {p.tag}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.05rem', color: 'var(--green-deep)', marginBottom: '4px' }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#6a7660', marginBottom: '14px', flex: 1 }}>
                  {p.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#7a8768', fontWeight: 600, display: 'block' }}>
                      {p.type === 'sized' ? 'Mulai dari' : 'Harga'}
                    </span>
                    <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.15rem', color: 'var(--green-ink)' }}>
                      {p.type === 'sized'
                        ? formatRupiah(p.sizes?.[0]?.price || 13000)
                        : formatRupiah(p.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => handlePlusClick(p)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: 'none',
                      cursor: 'pointer',
                      background: 'var(--green-soft)',
                      color: 'var(--green-deep)',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background .2s, color .2s'
                    }}
                    title="Tambah ke Keranjang"
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--green-deep)'; e.currentTarget.style.color = 'var(--cream)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--green-soft)'; e.currentTarget.style.color = 'var(--green-deep)'; }}
                  >
                    +
                  </button>
                </div>

                <Link
                  to={`/produk/${p.id}`}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    marginTop: '10px',
                    padding: '10px 0',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: '1.5px solid var(--green-deep)',
                    color: 'var(--green-deep)',
                    background: 'transparent',
                    transition: 'background .18s, color .18s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--green-deep)'; e.currentTarget.style.color = 'var(--cream)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--green-deep)'; }}
                >
                  Pesan Sekarang
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROMO PAKET HEMAT ===== */}
      <section id="promo">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">Promo Spesial</span>
            <h2>Paket 3 cup small, lebih hemat</h2>
            <p>Campur sesuka hati dari tiga menu andalan — cocok buat berbagi bareng teman.</p>
          </div>

          <div style={{
            background: 'var(--green-soft)',
            borderRadius: '28px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'stretch',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{ position: 'relative', minHeight: '340px', background: 'var(--white)' }}>
              <img
                src={promoOptions.find((p) => p.id === selectedPromoId)?.img || '/Gambar/Paket.jpeg'}
                alt="Promo Paket Mango Mango's"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = '/Gambar/Bundle-1.jpeg'; }}
              />
              <span style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'var(--yellow)',
                color: 'var(--green-ink)',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: '999px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                Promo Spesial
              </span>
            </div>

            <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--green-mid)',
                background: 'var(--white)',
                padding: '5px 12px',
                borderRadius: '999px',
                marginBottom: '14px',
                width: 'fit-content'
              }}>
                3 Cup Small • Paket Hemat
              </span>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', margin: '8px 0 20px' }}>
                <span style={{ fontSize: '1.1rem', color: '#8a9678', textDecoration: 'line-through' }}>Rp39.000</span>
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '2.4rem', color: 'var(--green-deep)' }}>
                  Rp30.000
                </span>
                <span style={{
                  background: 'var(--yellow)',
                  color: 'var(--green-ink)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '999px',
                }}>
                  Hemat Rp9.000
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--green-deep)', fontWeight: 700, marginBottom: '10px' }}>
                Pilih variasi paket promo:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {promoOptions.map((opt) => {
                  const isSelected = selectedPromoId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedPromoId(opt.id)}
                      style={{
                        textAlign: 'left',
                        fontSize: '0.9rem',
                        color: '#3c4a2c',
                        background: isSelected ? 'var(--white)' : 'rgba(255,255,255,0.6)',
                        borderRadius: '14px',
                        padding: '12px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: isSelected ? '2px solid var(--yellow-deep)' : '1px solid var(--line)',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 4px 14px rgba(240, 166, 58, 0.2)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          border: isSelected ? '4px solid var(--yellow-deep)' : '2px solid #a9b899',
                          background: isSelected ? 'var(--white)' : 'transparent',
                        }} />
                        <span style={{ fontWeight: isSelected ? 700 : 500 }}>{opt.item1}</span>
                      </div>
                      <b style={{ color: 'var(--green-deep)' }}>{opt.item2}</b>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link
                  to={`/produk/${selectedPromoId}`}
                  className="btn-primary"
                  style={{
                    padding: '14px 28px',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    boxShadow: 'var(--shadow)',
                  }}
                >
                  Pesan Sekarang →
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const paket = products.find((p) => p.id === selectedPromoId) || {
                      id: selectedPromoId,
                      name: promoOptions.find((p) => p.id === selectedPromoId)?.name || 'Paket Hemat 3 Cup',
                      price: 30000,
                      img: promoOptions.find((p) => p.id === selectedPromoId)?.img || '/Gambar/Bundle-1.jpeg',
                    };
                    addToCart(paket, null, 1);
                    showToast(`✅ ${paket.name} masuk ke keranjang!`);
                  }}
                  className="btn-ghost"
                  style={{
                    backgroundColor: 'var(--white)',
                    padding: '14px 22px',
                  }}
                >
                  + Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ISI SETIAP MENU ===== */}
      <section style={{ background: 'var(--green-deep)' }} id="isi-menu">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker" style={{ color: 'var(--yellow)' }}>Isi Setiap Menu</span>
            <h2 style={{ color: 'var(--cream)' }}>Penasaran isinya apa aja?</h2>
            <p style={{ color: '#cddabf' }}>
              Tiap cup dibuat dari bahan-bahan ini, supaya kamu tahu persis apa yang kamu minum dan makan.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ background: 'rgba(255,250,234,0.06)', border: '1px solid rgba(255,250,234,0.16)', borderRadius: '20px', padding: '24px', color: 'var(--cream)' }}>
              <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
                <img src="/Gambar/Mangga.jpeg" alt="Smoothies Mangga" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '1.08rem', marginBottom: '6px', color: 'var(--cream)' }}>Smoothies Mangga</h3>
              <p style={{ fontSize: '0.86rem', color: '#c6d3b6', margin: 0 }}>Signature drink, kental dan segar.</p>
              <span style={{ display: 'inline-block', marginTop: '14px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--yellow)' }}>
                🥭 Mangga super + susu + es
              </span>
            </div>

            <div style={{ background: 'rgba(255,250,234,0.06)', border: '1px solid rgba(255,250,234,0.16)', borderRadius: '20px', padding: '24px', color: 'var(--cream)' }}>
              <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
                <img src="/Gambar/Avocado.jpeg" alt="Smoothies Alpukat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '1.08rem', marginBottom: '6px', color: 'var(--cream)' }}>Smoothies Alpukat</h3>
              <p style={{ fontSize: '0.86rem', color: '#c6d3b6', margin: 0 }}>Creamy dengan cokelat & susu.</p>
              <span style={{ display: 'inline-block', marginTop: '14px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--yellow)' }}>
                🥑 Alpukat + cokelat + susu
              </span>
            </div>

            <div style={{ background: 'rgba(255,250,234,0.06)', border: '1px solid rgba(255,250,234,0.16)', borderRadius: '20px', padding: '24px', color: 'var(--cream)' }}>
              <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
                <img src="/Gambar/Salad.jpeg" alt="Salad Buah" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '1.08rem', marginBottom: '6px', color: 'var(--cream)' }}>Salad Buah</h3>
              <p style={{ fontSize: '0.86rem', color: '#c6d3b6', margin: 0 }}>Campuran buah pilihan tiap hari.</p>
              <span style={{ display: 'inline-block', marginTop: '14px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--yellow)' }}>
                🍉 Buah musiman + keju + skm
              </span>
            </div>

            <div style={{ background: 'rgba(255,250,234,0.06)', border: '1px solid rgba(255,250,234,0.16)', borderRadius: '20px', padding: '24px', color: 'var(--cream)' }}>
              <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
                <img src="/Gambar/Taiwan.jpeg" alt="Taiwan Dessert" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '1.08rem', marginBottom: '6px', color: 'var(--cream)' }}>Taiwan Dessert</h3>
              <p style={{ fontSize: '0.86rem', color: '#c6d3b6', margin: 0 }}>Dessert kekinian ala Taiwan.</p>
              <span style={{ display: 'inline-block', marginTop: '14px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--yellow)' }}>
                🍡 Taro + matcha + susu kelapa
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PESAN DALAM 4 LANGKAH (FLOW BARU REACT + DB) ===== */}
      <section style={{ background: 'var(--white)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="sec-head center">
            <span className="kicker">Alur Pemesanan Online</span>
            <h2>Pesan dalam 4 langkah gampang</h2>
            <p style={{ margin: '8px auto 0' }}>
              Kini terintegrasi langsung dengan database, keranjang belanja otomatis, dan konfirmasi instan.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '30px',
            position: 'relative'
          }}>
            <div style={{ padding: '0 10px', position: 'relative' }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: '2.6rem', color: 'var(--yellow-deep)', display: 'block', marginBottom: '10px' }}>
                01
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--green-deep)', marginBottom: '8px' }}>Pilih Menu & Ukuran</h3>
              <p style={{ fontSize: '0.88rem', color: '#57644a', margin: 0, lineHeight: 1.6 }}>
                Pilih smoothies segar, dessert, atau paket hemat. Kamu bisa memilih variasi ukuran Small atau Large.
              </p>
            </div>

            <div style={{ padding: '0 10px', position: 'relative' }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: '2.6rem', color: 'var(--yellow-deep)', display: 'block', marginBottom: '10px' }}>
                02
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--green-deep)', marginBottom: '8px' }}>Keranjang & Akun</h3>
              <p style={{ fontSize: '0.88rem', color: '#57644a', margin: 0, lineHeight: 1.6 }}>
                Atur jumlah porsi di keranjang belanja. Masuk atau daftar akun lewat tombol akun agar pesananmu tersimpan.
              </p>
            </div>

            <div style={{ padding: '0 10px', position: 'relative' }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: '2.6rem', color: 'var(--yellow-deep)', display: 'block', marginBottom: '10px' }}>
                03
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--green-deep)', marginBottom: '8px' }}>Checkout & Alamat</h3>
              <p style={{ fontSize: '0.88rem', color: '#57644a', margin: 0, lineHeight: 1.6 }}>
                Isi alamat pengantaran lengkap, catatan pesanan, dan pilih metode bayar: QRIS otomatis atau Bayar di Tempat (COD).
              </p>
            </div>

            <div style={{ padding: '0 10px', position: 'relative' }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: '2.6rem', color: 'var(--yellow-deep)', display: 'block', marginBottom: '10px' }}>
                04
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--green-deep)', marginBottom: '8px' }}>Diracik & Diantar</h3>
              <p style={{ fontSize: '0.88rem', color: '#57644a', margin: 0, lineHeight: 1.6 }}>
                Selesaikan pembayaran via scan QRIS atau bayar tunai saat kurir sampai. Minuman segar siap kamu nikmati!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONI / KOMENTAR PELANGGAN ===== */}
      <section style={{ background: 'var(--cream)', padding: '76px 0' }}>
        <div className="wrap">
          <div className="sec-head center">
            <span className="kicker">Kata Mereka</span>
            <h2>Komentar Pelanggan Setia</h2>
            <p style={{ margin: '8px auto 0' }}>
              Ribuan pecinta buah segar sudah membuktikannya. Ini kata mereka tentang Mango Mango's!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '36px'
          }}>
            {/* Review 1 */}
            <div style={{
              background: 'var(--white)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F6C933" color="#F6C933" />
                  ))}
                </div>
                <p style={{ fontSize: '0.92rem', color: '#3C4A2C', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '20px' }}>
                  "Smoothies mangganya bener-bener kental dan nggak pelit buah! Manisnya pas banget alami dari buah asli, bukan pemanis buatan. Tiap weekend selalu pesan paket 3 cup bareng keluarga."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--green-deep)' }}>
                  A
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', color: 'var(--green-deep)', margin: 0 }}>Andi Nurul</h4>
                  <span style={{ fontSize: '0.78rem', color: '#7A8768' }}>Pelanggan Cabang Pettarani • Makassar</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div style={{
              background: 'var(--white)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F6C933" color="#F6C933" />
                  ))}
                </div>
                <p style={{ fontSize: '0.92rem', color: '#3C4A2C', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '20px' }}>
                  "Alpukat cokelatnya juara banget rasanya, creamy mentega dan cokelatnya berasa mahal. Fitur pesan online barunya juga gampang banget, tinggal scan QRIS langsung diantar cepat."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--green-deep)' }}>
                  R
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', color: 'var(--green-deep)', margin: 0 }}>Rian Pratama</h4>
                  <span style={{ fontSize: '0.78rem', color: '#7A8768' }}>Pelanggan Cabang Boulevard • Makassar</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div style={{
              background: 'var(--white)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F6C933" color="#F6C933" />
                  ))}
                </div>
                <p style={{ fontSize: '0.92rem', color: '#3C4A2C', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '20px' }}>
                  "Salad buah dan Taiwan dessertnya segar pol! Potongan buahnya renyah, kejunya melimpah. Packaging pengantarannya rapi dan higienis. Recommended buat yang cari dessert sehat!"
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--green-deep)' }}>
                  S
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', color: 'var(--green-deep)', margin: 0 }}>Siti Rahma</h4>
                  <span style={{ fontSize: '0.78rem', color: '#7A8768' }}>Pelanggan Cabang Hertasning • Makassar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KONTAK & CABANG ===== */}
      <section id="kontak">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">Kontak & Cabang</span>
            <h2>Hubungi kami atau mampir langsung</h2>
            <p>Chat cepat lewat WhatsApp atau media sosial, atau kunjungi cabang terdekat kami di Makassar.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '36px'
          }}>
            <a href="https://wa.me/6281310524199" target="_blank" rel="noreferrer" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'var(--green-soft)',
              border: '1px solid var(--line)',
              borderRadius: '18px',
              padding: '18px 20px',
              transition: 'transform .18s, background .18s'
            }}>
              <img src="/Gambar/WA.PNG" alt="WhatsApp" style={{ width: '42px', height: '42px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--green-deep)', margin: '0 0 2px' }}>WhatsApp</h4>
                <p style={{ fontSize: '0.82rem', color: '#5c6852', margin: 0 }}>0813-1052-4199</p>
              </div>
            </a>

            <a href="https://instagram.com/mangomangos_official" target="_blank" rel="noreferrer" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'var(--green-soft)',
              border: '1px solid var(--line)',
              borderRadius: '18px',
              padding: '18px 20px',
              transition: 'transform .18s, background .18s'
            }}>
              <img src="/Gambar/IG.PNG" alt="Instagram" style={{ width: '42px', height: '42px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--green-deep)', margin: '0 0 2px' }}>Instagram</h4>
                <p style={{ fontSize: '0.82rem', color: '#5c6852', margin: 0 }}>@mangomangos_official</p>
              </div>
            </a>

            <a href="https://www.facebook.com/share/1EhAWi1Vbh/?mibextid=wwXIfr" target="_blank" rel="noreferrer" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'var(--green-soft)',
              border: '1px solid var(--line)',
              borderRadius: '18px',
              padding: '18px 20px',
              transition: 'transform .18s, background .18s'
            }}>
              <img src="/Gambar/FB.PNG" alt="Facebook" style={{ width: '42px', height: '42px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--green-deep)', margin: '0 0 2px' }}>Facebook</h4>
                <p style={{ fontSize: '0.82rem', color: '#5c6852', margin: 0 }}>Mango Mango's Official</p>
              </div>
            </a>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '22px'
          }}>
            <div style={{ background: 'var(--white)', borderRadius: '22px', padding: '28px', border: '1px solid var(--line)' }}>
              <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--green-mid)', background: 'var(--green-soft)', padding: '4px 10px', borderRadius: '999px', marginBottom: '12px' }}>
                📍 Pettarani
              </span>
              <h3 style={{ fontSize: '1.12rem', color: 'var(--green-deep)', marginBottom: '8px' }}>Depan Baruga Telkomsel</h3>
              <p style={{ fontSize: '0.86rem', color: '#5c6852', margin: '0 0 4px' }}>Buka 10.00 – 22.00 WITA</p>
              <p style={{ fontSize: '0.86rem', color: '#5c6852', margin: 0 }}>Bisa ambil di tempat / diantar</p>
            </div>

            <div style={{ background: 'var(--white)', borderRadius: '22px', padding: '28px', border: '1px solid var(--line)' }}>
              <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--green-mid)', background: 'var(--green-soft)', padding: '4px 10px', borderRadius: '999px', marginBottom: '12px' }}>
                📍 Boulevard
              </span>
              <h3 style={{ fontSize: '1.12rem', color: 'var(--green-deep)', marginBottom: '8px' }}>Depan SISESA</h3>
              <p style={{ fontSize: '0.86rem', color: '#5c6852', margin: '0 0 4px' }}>Buka 10.00 – 22.00 WITA</p>
              <p style={{ fontSize: '0.86rem', color: '#5c6852', margin: 0 }}>Bisa ambil di tempat / diantar</p>
            </div>

            <div style={{ background: 'var(--white)', borderRadius: '22px', padding: '28px', border: '1px solid var(--line)' }}>
              <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--green-mid)', background: 'var(--green-soft)', padding: '4px 10px', borderRadius: '999px', marginBottom: '12px' }}>
                📍 Hertasning
              </span>
              <h3 style={{ fontSize: '1.12rem', color: 'var(--green-deep)', marginBottom: '8px' }}>Samping RS Grestelina</h3>
              <p style={{ fontSize: '0.86rem', color: '#5c6852', margin: '0 0 4px' }}>Buka 10.00 – 22.00 WITA</p>
              <p style={{ fontSize: '0.86rem', color: '#5c6852', margin: 0 }}>Bisa ambil di tempat / diantar</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BAND ===== */}
      <section style={{ padding: '0 0 76px' }}>
        <div className="wrap">
          <div style={{
            background: 'var(--yellow)',
            borderRadius: '32px',
            padding: '56px 60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '40px',
            flexWrap: 'wrap'
          }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--green-deep)', maxWidth: '460px' }}>
              Lagi pengen yang segar-segar? Buka katalog dan pesan sekarang.
            </h2>
            <a className="btn-primary" href="#katalog">
              Mulai Pesan
            </a>
          </div>
        </div>
      </section>

      {/* ===== MODAL PILIH UKURAN CUP (seperti di index.html) ===== */}
      {selectedProductForModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(32,48,15,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}
          onClick={() => setSelectedProductForModal(null)}
        >
          <div
            style={{
              background: 'var(--white)',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: 'var(--shadow)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.3rem', color: 'var(--green-deep)', marginBottom: '6px' }}>
              Pilih Ukuran — {selectedProductForModal.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#7a8768', marginBottom: '20px' }}>
              Tersedia dua ukuran cup untuk menemani harimu:
            </p>

            {selectedProductForModal.sizes?.map((sz) => (
              <button
                key={sz.label}
                onClick={() => handleSelectSizeAndAdd(sz)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '14px 18px',
                  marginBottom: '12px',
                  borderRadius: '14px',
                  border: '1.5px solid var(--line)',
                  background: 'var(--green-soft)',
                  color: 'var(--green-ink)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'background .15s, border-color .15s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--yellow)';
                  e.currentTarget.style.borderColor = 'var(--yellow-deep)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--green-soft)';
                  e.currentTarget.style.borderColor = 'var(--line)';
                }}
              >
                <span>Cup {sz.label}</span>
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, color: 'var(--green-deep)' }}>
                  {formatRupiah(sz.price)}
                </span>
              </button>
            ))}

            <button
              onClick={() => setSelectedProductForModal(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#8a9678',
                fontSize: '0.85rem',
                cursor: 'pointer',
                marginTop: '10px',
                width: '100%',
                textAlign: 'center',
                fontWeight: 600
              }}
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
