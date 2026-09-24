import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { isAuthModalOpen, authModalMode, setAuthModalMode, closeAuthModal, login, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, phone, password });
      }
      setSuccessMsg(authModalMode === 'login' ? 'Berhasil masuk!' : 'Akun berhasil dibuat!');
      setTimeout(() => {
        closeAuthModal();
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
      }, 600);
    } catch (err) {
      const msg = err.response?.data?.error || 'Terjadi kesalahan. Silakan coba lagi.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 20, 20, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={closeAuthModal}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '440px',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with brand colors */}
        <div
          style={{
            background: 'var(--green-soft)',
            padding: '24px 28px',
            position: 'relative',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <button
            onClick={closeAuthModal}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'var(--white)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow)',
            }}
          >
            <X size={18} color="var(--green-deep)" />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <img src="/Gambar/Logo.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 700, fontSize: '1.15rem', color: 'var(--green-deep)' }}>
              Mango Mango's
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--green-deep)', marginTop: '4px' }}>
            {authModalMode === 'login' ? 'Selamat Datang Kembali!' : 'Daftar Akun Baru'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#5C6852' }}>
            {authModalMode === 'login'
              ? 'Masuk untuk kelola pesanan dan nikmati promo spesial'
              : 'Gabung sekarang dan nikmati smoothies segar favoritmu'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--line)' }}>
          <button
            onClick={() => { setAuthModalMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: authModalMode === 'login' ? 'var(--green-deep)' : '#7A8768',
              borderBottom: authModalMode === 'login' ? '3px solid var(--yellow-deep)' : '3px solid transparent',
              cursor: 'pointer',
            }}
          >
            Masuk
          </button>
          <button
            onClick={() => { setAuthModalMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: authModalMode === 'register' ? 'var(--green-deep)' : '#7A8768',
              borderBottom: authModalMode === 'register' ? '3px solid var(--yellow-deep)' : '3px solid transparent',
              cursor: 'pointer',
            }}
          >
            Daftar
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '16px',
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '16px',
              }}
            >
              <CheckCircle size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {authModalMode === 'register' && (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Nama Lengkap
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Nomor WhatsApp
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="tel"
                    placeholder="Contoh: 08123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid #E5E7EB',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid #E5E7EB',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Kata Sandi
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid #E5E7EB',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
          >
            {loading
              ? 'Memproses...'
              : authModalMode === 'login'
              ? 'Masuk Sekarang'
              : 'Daftar & Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
