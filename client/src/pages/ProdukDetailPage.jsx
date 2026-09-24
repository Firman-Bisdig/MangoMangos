import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { getProductByIdApi, getProductsApi } from '../api';
import { useCart, formatRupiah } from '../context/CartContext';

const DEFAULT_GALLERY_MAP = {
  'paket-A': [
    '/Gambar/Bundle-1.jpeg',
    '/Gambar/Avocado.jpeg',
    '/Gambar/Mangga.jpeg',
    '/Gambar/Salad.jpeg',
  ],
  'paket-B': [
    '/Gambar/Bundle-2.jpeg',
    '/Gambar/Salad.jpeg',
    '/Gambar/Mangga.jpeg',
    '/Gambar/Avocado.jpeg',
  ],
  'paket-C': [
    '/Gambar/Bundle-3.jpeg',
    '/Gambar/Salad.jpeg',
    '/Gambar/Avocado.jpeg',
    '/Gambar/Mangga.jpeg',
  ],
  mangga: [
    '/Gambar/Mangga.jpeg',
    '/Gambar/Avocado.jpeg',
    '/Gambar/Salad.jpeg',
    '/Gambar/Taiwan.jpeg',
  ],
  avocado: [
    '/Gambar/Avocado.jpeg',
    '/Gambar/Mangga.jpeg',
    '/Gambar/Salad.jpeg',
    '/Gambar/Taiwan.jpeg',
  ],
  salad: [
    '/Gambar/Salad.jpeg',
    '/Gambar/Mangga.jpeg',
    '/Gambar/Avocado.jpeg',
    '/Gambar/Taiwan.jpeg',
  ],
  taiwan: [
    '/Gambar/Taiwan.jpeg',
    '/Gambar/Mangga.jpeg',
    '/Gambar/Salad.jpeg',
    '/Gambar/Avocado.jpeg',
  ],
};

const getBundleImg = (item) => {
  if (item && item.img) return item.img;
  const name = (item?.name || item?.item_name || '').toLowerCase();
  if (name.includes('avocado') || name.includes('alpukat')) return '/Gambar/Avocado.jpeg';
  if (name.includes('mango') || name.includes('mangga')) return '/Gambar/Mangga.jpeg';
  if (name.includes('salad')) return '/Gambar/Salad.jpeg';
  if (name.includes('taiwan')) return '/Gambar/Taiwan.jpeg';
  return '/Gambar/Mangga.jpeg';
};

const ProdukDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImg, setSelectedImg] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  // Scroll to top and fetch product
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setQuantity(1);

    const fetchData = async () => {
      try {
        const [prodRes, allRes] = await Promise.all([
          getProductByIdApi(id),
          getProductsApi().catch(() => ({ data: { products: [] } })),
        ]);

        const prod = prodRes.data?.product;
        if (prod) {
          setProduct(prod);
          setSelectedImg(prod.img || '/Gambar/Mangga.jpeg');

          if (prod.type === 'sized' && prod.sizes?.length > 0) {
            setSelectedSize(prod.sizes[0]);
          } else {
            setSelectedSize(null);
          }
        }

        if (allRes.data?.products) {
          setAllProducts(allRes.data.products);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  if (loading) {
    return (
      <div className="wrap" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--green-mid)', fontWeight: 600 }}>
          Memuat menu segar Mango Mango's...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="wrap" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--green-deep)', marginBottom: '12px' }}>Produk tidak ditemukan</h2>
        <p style={{ color: '#6a7660', marginBottom: '24px' }}>Silakan kembali ke katalog untuk melihat menu lainnya.</p>
        <Link to="/#katalog" className="btn-primary">
          Lihat Katalog Menu
        </Link>
      </div>
    );
  }

  // Gallery items
  const gallery =
    DEFAULT_GALLERY_MAP[product.id] ||
    [product.img, '/Gambar/Mangga.jpeg', '/Gambar/Avocado.jpeg', '/Gambar/Salad.jpeg'].filter(
      (v, i, a) => a.indexOf(v) === i
    );

  // Price calculations
  const hasSizes = product.type === 'sized' && Array.isArray(product.sizes) && product.sizes.length > 0;
  const currentPrice = hasSizes ? (selectedSize ? selectedSize.price : product.sizes[0].price) : product.price;
  const oldPrice = product.old_price || product.oldPrice || null;
  const saveAmount = oldPrice ? oldPrice - currentPrice : 0;

  // Handlers
  const handleSizeSelect = (s) => {
    setSelectedSize(s);
  };

  const handleQtyChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      alert('Pilih ukuran dulu ya!');
      return;
    }
    addToCart(product, selectedSize, quantity);
    showToast(`✅ ${quantity}x ${product.name} ${selectedSize ? `(${selectedSize.label})` : ''} masuk ke keranjang!`);
  };

  const handleBuyNow = () => {
    if (hasSizes && !selectedSize) {
      alert('Pilih ukuran dulu ya!');
      return;
    }
    addToCart(product, selectedSize, quantity);
    navigate('/keranjang');
  };

  // Related products
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="wrap">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
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
          }}
        >
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

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Beranda</Link>
        <span className="sep">›</span>
        <a href="/#katalog">Katalog</a>
        <span className="sep">›</span>
        <span className="current">{product.name}</span>
      </div>

      {/* Product Detail Layout */}
      <div className="product-wrap">
        {/* Kolom Kiri: Galeri Foto */}
        <div>
          <div className="gallery-main">
            <img
              src={selectedImg || product.img}
              alt={product.name}
              onError={(e) => {
                e.target.src = '/Gambar/Mangga.jpeg';
              }}
            />
          </div>
          <div className="thumb-row">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className={`thumb ${selectedImg === img ? 'active' : ''}`}
                onClick={() => setSelectedImg(img)}
                title={`Lihat gambar ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`${product.name} view ${idx + 1}`}
                  onError={(e) => {
                    e.target.src = '/Gambar/Mangga.jpeg';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Info & Aksi */}
        <div>
          {product.tag && <span className="promo-badge">{product.tag}</span>}
          <h1 className="product-title">{product.name}</h1>
          <p className="product-desc">{product.description}</p>

          {/* Harga & Diskon */}
          <div className="price-row">
            <span className="price-now">{formatRupiah(currentPrice)}</span>
            {oldPrice && <span className="price-old">{formatRupiah(oldPrice)}</span>}
          </div>
          {saveAmount > 0 && <span className="save-pill">Hemat {formatRupiah(saveAmount)}</span>}

          {/* Pilihan Ukuran (Jika ada varian) */}
          {hasSizes && (
            <div className="size-section">
              <span className="size-label">Pilih Ukuran:</span>
              <div className="size-options">
                {product.sizes.map((s) => {
                  const isActive = selectedSize?.label === s.label;
                  return (
                    <button
                      key={s.label}
                      type="button"
                      className={`size-option ${isActive ? 'active' : ''}`}
                      onClick={() => handleSizeSelect(s)}
                    >
                      <span className="size-name">Cup {s.label}</span>
                      <span className="size-price">{formatRupiah(s.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Isi Bundling (Jika Produk Paket) */}
          {product.bundle && product.bundle.length > 0 && (
            <div className="contents-box" style={{ marginBottom: '24px', marginTop: 0 }}>
              <h3>Isi dalam Paket</h3>
              <div className="contents-row">
                {product.bundle.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <div className="content-plus">+</div>}
                    <div className="content-item">
                      <div className="content-thumb">
                        <img
                          src={getBundleImg(item)}
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = '/Gambar/Mangga.jpeg';
                          }}
                        />
                      </div>
                      <span>
                        {item.qty} Cup {item.name}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Jumlah Porsi */}
          <div className="qty-row">
            <span className="qty-label">Jumlah</span>
            <div className="qty-control">
              <button type="button" onClick={() => handleQtyChange(-1)} aria-label="Kurangi jumlah">
                −
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => handleQtyChange(1)} aria-label="Tambah jumlah">
                +
              </button>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="action-row">
            <button type="button" className="btn-cart" onClick={handleAddToCart}>
              <ShoppingBag size={18} />
              Tambah ke Keranjang
            </button>
            <button type="button" className="btn-buynow" onClick={handleBuyNow}>
              Beli Sekarang
            </button>
          </div>

          {/* Nilai Tambah / Trust badges */}
          <div className="trust-row">
            <div className="trust-item">
              <span className="trust-icon">🍃</span> Buah Segar Pilihan
            </div>
            <div className="trust-item">
              <span className="trust-icon">✅</span> Tanpa Pengawet
            </div>
            <div className="trust-item">
              <span className="trust-icon">🚴</span> Pengiriman Cepat
            </div>
          </div>
        </div>
      </div>

      {/* Menu Terkait / Menu Lainnya */}
      {relatedProducts.length > 0 && (
        <section className="related-section">
          <h2>Menu Lainnya</h2>
          <div className="related-grid">
            {relatedProducts.map((p) => {
              const pHasSizes = p.type === 'sized' && p.sizes?.length > 0;
              const displayPrice = pHasSizes ? p.sizes[0].price : p.price;

              return (
                <div key={p.id} className="related-card">
                  <div className="related-thumb">
                    <img
                      src={p.img}
                      alt={p.name}
                      onError={(e) => {
                        e.target.src = '/Gambar/Mangga.jpeg';
                      }}
                    />
                  </div>
                  <h3>{p.name}</h3>
                  <p className="desc">{p.description}</p>
                  <div className="related-row">
                    <span className="price">{formatRupiah(displayPrice)}</span>
                  </div>
                  <Link to={`/produk/${p.id}`} className="btn-related">
                    Lihat Detail
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProdukDetailPage;
