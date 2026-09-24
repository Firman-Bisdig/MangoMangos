import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getProfileApi } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mm_token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await getProfileApi();
          setUser(res.data.user);
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('mm_token', newToken);
    setToken(newToken);
    setUser(userData);
    setIsAuthModalOpen(false);
    return res.data;
  };

  const register = async (data) => {
    const res = await registerApi(data);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('mm_token', newToken);
    setToken(newToken);
    setUser(userData);
    setIsAuthModalOpen(false);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('mm_token');
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
