import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import HomePage from './pages/HomePage';
import ProdukDetailPage from './pages/ProdukDetailPage';
import KeranjangPage from './pages/KeranjangPage';
import CheckoutPage from './pages/CheckoutPage';
import PembayaranPage from './pages/PembayaranPage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="page-wrapper">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/produk/:id" element={<ProdukDetailPage />} />
                  <Route path="/keranjang" element={<KeranjangPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/pembayaran/:orderId" element={<PembayaranPage />} />
                </Routes>
              </main>
              <Footer />
              <AuthModal />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
