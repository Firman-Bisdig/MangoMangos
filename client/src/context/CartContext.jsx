import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('mango_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('mango_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size = null, qty = 1) => {
    setCart((prev) => {
      const itemPrice = size ? size.price : product.price;
      const sizeLabel = size ? size.label : null;
      const cartKey = size ? `${product.id}-${size.label}` : product.id;

      const existingIndex = prev.findIndex((item) => item.cartKey === cartKey);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          qty: next[existingIndex].qty + qty,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            cartKey,
            productId: product.id,
            name: product.name,
            size: sizeLabel,
            price: itemPrice,
            img: product.img,
            qty,
          },
        ];
      }
    });
  };

  const updateQty = (cartKey, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartKey === cartKey) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartKey) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        formatRupiah,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
