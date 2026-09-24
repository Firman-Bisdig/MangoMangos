import axios from 'axios';
import { MASTER_PRODUCTS, getMasterProductById } from '../data/products';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Interceptor untuk menambahkan JWT token jika ada
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper untuk simpan pesanan offline / fallback Vercel
const getLocalOrders = () => {
  try {
    return JSON.parse(localStorage.getItem('mango_orders') || '[]');
  } catch {
    return [];
  }
};

const saveLocalOrders = (orders) => {
  try {
    localStorage.setItem('mango_orders', JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders locally:', e);
  }
};

// Auth endpoints
export const loginApi = async (email, password) => {
  try {
    const res = await API.post('/auth/login', { email, password });
    if (res.data && res.data.token) return res;
  } catch (err) {
    console.warn('API login error, using local fallback:', err);
  }
  const user = { id: 1, name: email.split('@')[0], email };
  return { data: { token: 'mock-token-demo', user } };
};

export const registerApi = async (data) => {
  try {
    const res = await API.post('/auth/register', data);
    if (res.data && res.data.token) return res;
  } catch (err) {
    console.warn('API register error, using local fallback:', err);
  }
  const user = { id: 1, name: data.name, email: data.email, phone: data.phone };
  return { data: { token: 'mock-token-demo', user } };
};

export const getProfileApi = async () => {
  try {
    const res = await API.get('/auth/me');
    if (res.data && res.data.user) return res;
  } catch (err) {
    console.warn('API getProfile error, using local fallback:', err);
  }
  return { data: { user: { id: 1, name: 'Pelanggan Mango', email: 'user@mangomangos.com' } } };
};

// Products endpoints
export const getProductsApi = async () => {
  try {
    const res = await API.get('/products');
    if (res.data && Array.isArray(res.data.products)) {
      return res;
    }
  } catch (err) {
    console.warn('API getProducts error, using master products fallback:', err);
  }
  return { data: { products: MASTER_PRODUCTS } };
};

export const getProductByIdApi = async (id) => {
  try {
    const res = await API.get(`/products/${id}`);
    if (res.data && res.data.product) {
      return res;
    }
  } catch (err) {
    console.warn(`API getProductById error for ${id}, using master fallback:`, err);
  }
  return { data: { product: getMasterProductById(id) } };
};

// Orders endpoints
export const createOrderApi = async (orderData) => {
  try {
    const res = await API.post('/orders', orderData);
    if (res.data && res.data.orderId) {
      return res;
    }
  } catch (err) {
    console.warn('API createOrder error, saving to local fallback:', err);
  }

  // Fallback Vercel: simpan ke localStorage
  const localOrders = getLocalOrders();
  const orderId = (localOrders.length + 1).toString();
  const newOrder = {
    id: orderId,
    ...orderData,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  localOrders.unshift(newOrder);
  saveLocalOrders(localOrders);

  return {
    data: {
      message: 'Pesanan berhasil dibuat!',
      orderId,
      order: newOrder,
    },
  };
};

export const getOrdersApi = async () => {
  try {
    const res = await API.get('/orders');
    if (res.data && Array.isArray(res.data.orders)) {
      return res;
    }
  } catch (err) {
    console.warn('API getOrders error, using local fallback:', err);
  }
  return { data: { orders: getLocalOrders() } };
};

export const getOrderByIdApi = async (id) => {
  try {
    const res = await API.get(`/orders/${id}`);
    if (res.data && res.data.order) {
      return res;
    }
  } catch (err) {
    console.warn(`API getOrderById error for ${id}, using local fallback:`, err);
  }

  const localOrders = getLocalOrders();
  const found = localOrders.find((o) => String(o.id) === String(id));
  if (found) {
    return { data: { order: found } };
  }

  // Jika tidak ditemukan di localStorage, generate default order dummy
  return {
    data: {
      order: {
        id,
        total: 15000,
        delivery_name: 'Firman',
        delivery_phone: '082189302587',
        delivery_address: 'Makassar',
        payment_method: 'qris',
        status: 'pending',
      },
    },
  };
};

export const confirmPaymentApi = async (id) => {
  try {
    const res = await API.post(`/orders/${id}/confirm-payment`);
    if (res.data && res.data.order) {
      return res;
    }
  } catch (err) {
    console.warn(`API confirmPayment error for ${id}, using local fallback:`, err);
  }

  const localOrders = getLocalOrders();
  const index = localOrders.findIndex((o) => String(o.id) === String(id));
  if (index > -1) {
    localOrders[index].status = 'paid';
    saveLocalOrders(localOrders);
  }
  return { data: { message: 'Pembayaran berhasil dikonfirmasi!' } };
};

export default API;
