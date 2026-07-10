import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export const register = (userData) => api.post('/register/', userData);
export const login = (userData) => api.post('/login/', userData);
export const setupPlanner = (data) => api.post('/setup/', data);
export const getDashboard = () => api.get('/dashboard/');

export default api;