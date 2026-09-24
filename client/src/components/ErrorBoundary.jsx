import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          fontFamily: "'Public Sans', sans-serif",
        }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--green-deep)', marginBottom: '12px' }}>
            Terjadi Kendala Memuat Halaman
          </h2>
          <p style={{ color: '#5C6852', maxWidth: '480px', marginBottom: '24px', lineHeight: 1.6 }}>
            Halaman sedang disesuaikan. Silakan muat ulang atau kembali ke beranda untuk menikmati produk segar Mango Mango's.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="btn-primary"
              style={{ cursor: 'pointer', border: 'none' }}
            >
              Muat Ulang Halaman
            </button>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '12px 24px',
                borderRadius: '50px',
                border: '1.5px solid var(--green-mid)',
                color: 'var(--green-deep)',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Kembali ke Beranda
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
