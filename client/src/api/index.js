import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan JWT token jika ada
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const loginApi = (email, password) => API.post('/auth/login', { email, password });
export const registerApi = (data) => API.post('/auth/register', data);
export const getProfileApi = () => API.get('/auth/me');

// Products endpoints
export const getProductsApi = () => API.get('/products');
export const getProductByIdApi = (id) => API.get(`/products/${id}`);

// Orders endpoints
export const createOrderApi = (orderData) => API.post('/orders', orderData);
export const getOrdersApi = () => API.get('/orders');
export const getOrderByIdApi = (id) => API.get(`/orders/${id}`);
export const confirmPaymentApi = (id) => API.post(`/orders/${id}/confirm-payment`);

export default API;

