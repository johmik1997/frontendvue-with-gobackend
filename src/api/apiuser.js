import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8082'
});

// Request interceptor to inject token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;