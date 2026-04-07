import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(msg));
  }
);

export default api;
